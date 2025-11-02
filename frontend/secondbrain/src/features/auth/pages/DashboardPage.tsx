import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';

import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { UserProfile } from '@/features/auth/components/UserProfile';
import { LogoutButton } from '@/features/auth/components/LogoutButton';
import { useAuthStore } from '@/stores/authStore';

/**
 * 대시보드 페이지
 * - 사용자 프로필 정보 표시
 * - 로그아웃 버튼 제공
 * - 로딩 및 에러 상태 처리
 * - 미인증 시 랜딩페이지로 리다이렉트
 */
export function DashboardPage() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const { data: user, isLoading, isError } = useCurrentUser();

  // 인증되지 않은 경우 랜딩페이지로 리다이렉트
  useEffect(() => {
    if (!isAuthenticated) {
      void navigate({ to: '/' });
    }
  }, [isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <p>로딩 중...</p>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <p>사용자 정보를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <UserProfile user={user} />
        <LogoutButton variant="secondary" size="md" />
      </div>
    </div>
  );
}
