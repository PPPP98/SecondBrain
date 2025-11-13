import { GoogleLoginButton } from '@/content-scripts/overlay/GoogleLoginButton';
import { LogoSpinnerIframe } from '@/content-scripts/overlay/components/LogoSpinnerIframe';

/**
 * Login Prompt (Molecule)
 * - 로그인 전 표시되는 프롬프트
 * - iframe 기반 진짜 3D WebGL 렌더링
 * - SVG ExtrudeGeometry 입체 조형물
 * - Shadcn UI + Tailwind CSS 기반
 */
export function LoginPrompt() {
  return (
    <div className="w-[320px] rounded-xl border border-border bg-card p-6 shadow-lg">
      {/* iframe 기반 진짜 3D 입체 조형물 */}
      <div className="mb-6 flex justify-center">
        <LogoSpinnerIframe size={120} />
      </div>

      <h3 className="mb-2 text-center text-lg font-semibold text-card-foreground">Second Brain</h3>

      <div className="flex justify-center">
        <GoogleLoginButton text="signin" />
      </div>
    </div>
  );
}
