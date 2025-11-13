import { GoogleLoginButton } from '@/content-scripts/overlay/GoogleLoginButton';

/**
 * Login Prompt (Molecule)
 * - 로그인 전 표시되는 프롬프트
 * - Shadcn UI + Tailwind CSS 기반
 */
export function LoginPrompt() {
  return (
    <div className="w-[280px] rounded-xl border border-border bg-card p-6 shadow-lg">
      <h3 className="mb-2 text-center text-lg font-semibold text-card-foreground">
        SecondBrain Extension
      </h3>
      <p className="mb-6 text-center text-sm text-muted-foreground">로그인이 필요합니다</p>

      <p className="mb-6 text-center text-sm leading-relaxed text-card-foreground">
        웹페이지를 저장하고 노트를 생성하려면
        <br />
        먼저 로그인해주세요.
      </p>

      <div className="flex justify-center">
        <GoogleLoginButton text="signin" />
      </div>
    </div>
  );
}
