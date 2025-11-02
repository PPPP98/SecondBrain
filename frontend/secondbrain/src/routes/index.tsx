import { createFileRoute } from '@tanstack/react-router';

import { LandingPage } from '@/features/auth/pages/LandingPage';

/**
 * 랜딩 페이지 라우트 (/)
 */
export const Route = createFileRoute('/')({
  component: LandingPage,
});
