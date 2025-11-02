import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';

import { GoogleLoginButton } from '@/features/auth/components/GoogleLoginButton';
import { useAuthStore } from '@/stores/authStore';

/**
 * 랜딩 페이지
 * - Google 로그인 버튼 표시
 * - 이미 로그인된 경우 대시보드로 리다이렉트
 */
export function LandingPage() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  // 세션 복원 후 인증 상태 변경 감지하여 리다이렉트
  useEffect(() => {
    if (isAuthenticated) {
      void navigate({ to: '/dashboard' });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex min-h-dvh items-center justify-center">
      <div className="text-center">
        <h1 className="mb-8 text-4xl font-bold">Welcome to Second Brain</h1>
        <GoogleLoginButton text="signin" />
      </div>
    </div>
  );
}
