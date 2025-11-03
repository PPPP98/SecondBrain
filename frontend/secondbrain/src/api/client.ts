import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

import type { BaseResponse } from '@/shared/types/api';
import { useAuthStore } from '@/stores/authStore';

/**
 * Axios 인스턴스 생성
 * - baseURL: 환경 변수에서 가져옴
 * - withCredentials: true (쿠키 전송 허용)
 * - timeout: 10초
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL as string,
  withCredentials: true,
  timeout: 10000,
});

/**
 * Request Interceptor
 * - Access Token을 자동으로 헤더에 추가
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

/**
 * Refresh Token Promise 캐싱
 * - 동시 다발적 401 발생 시 refresh API 중복 호출 방지
 * - 첫 번째 refresh 요청만 실행하고 나머지는 Promise를 재사용
 */
let refreshTokenPromise: Promise<string> | null = null;

/**
 * Response Interceptor
 * - BaseResponse 구조 처리
 * - 401 에러 시 Token Refresh 시도 (Promise 캐싱으로 중복 호출 방지)
 */
apiClient.interceptors.response.use(
  (response) => {
    // Axios 인터셉터는 response 객체를 반환해야 함
    // response.data를 변환하여 다시 response에 할당
    if (
      response.data &&
      typeof response.data === 'object' &&
      'success' in response.data &&
      'data' in response.data
    ) {
      // BaseResponse 구조인 경우 그대로 유지
      return response;
    }

    // GET /api/users/me는 BaseResponse 없이 직접 반환
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // /api/auth/refresh 자체의 401은 무시 (무한 루프 방지)
    if (originalRequest.url?.includes('/api/auth/refresh')) {
      return Promise.reject(error);
    }

    // 401 에러 시 Token Refresh 시도
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 이미 진행 중인 refresh 요청이 있으면 재사용 (중복 호출 방지)
        if (!refreshTokenPromise) {
          refreshTokenPromise = apiClient
            .post<BaseResponse<{ accessToken: string; tokenType: string; expiresIn: number }>>(
              '/api/auth/refresh',
            )
            .then((response) => {
              const baseResponse = response.data;
              if (baseResponse.success && baseResponse.data) {
                const { accessToken } = baseResponse.data;
                useAuthStore.getState().setAccessToken(accessToken);
                return accessToken;
              }
              throw new Error('Invalid refresh response');
            })
            .finally(() => {
              // 완료 후 Promise 캐시 초기화
              refreshTokenPromise = null;
            });
        }

        // refresh 완료 대기
        const accessToken = await refreshTokenPromise;

        // 원래 요청에 새 토큰 설정
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        // 원래 요청 재시도
        return apiClient.request(originalRequest);
      } catch {
        // Refresh 실패 시 로그아웃 처리
        useAuthStore.getState().clearAuth();
        window.location.href = '/';
        return Promise.reject(new Error('Token refresh failed'));
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
