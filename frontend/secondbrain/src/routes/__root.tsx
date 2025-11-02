import { createRootRoute, Outlet } from '@tanstack/react-router';

import { useSessionRestore } from '@/features/auth/hooks/useSessionRestore';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';

/**
 * 루트 레이아웃
 * - 세션 복원 처리
 * - 모든 자식 라우트의 공통 레이아웃
 */
export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const { isLoading } = useSessionRestore();

  if (isLoading) {
    return <LoadingSpinner message="세션 복원 중..." />;
  }

  return <Outlet />;
}
