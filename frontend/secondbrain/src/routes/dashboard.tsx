import { createFileRoute } from '@tanstack/react-router';

import { DashboardPage } from '@/features/auth/pages/DashboardPage';

/**
 * 대시보드 라우트 (/dashboard)
 * - 보호된 라우트 (인증 필요)
 * - DashboardPage 컴포넌트에서 인증 체크
 */
export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
});
