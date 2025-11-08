import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { GlassElement } from '@/shared/components/GlassElement/GlassElement';
import { UserAvatar } from '@/features/auth/components/UserAvatar';
import { UserProfileMenu } from '@/features/auth/components/UserProfileMenu';
import UserIcon from '@/shared/components/icon/User.svg?react';

/**
 * 사용자 프로필 버튼 컴포넌트
 * - 사용자 프로필 이미지 또는 기본 아이콘 표시
 * - 클릭 시 프로필 메뉴 토글
 * - Dropdown 컴포넌트로 모달 로직 위임
 * - 접근성 속성 포함
 */

export function UserProfileButton() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuthStore();

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="relative">
      <GlassElement
        as="button"
        icon={
          <UserAvatar
            src={user?.picture}
            alt={user?.name || '사용자'}
            size="md"
            fallbackIcon={<UserIcon className="size-6" />}
          />
        }
        onClick={toggleMenu}
        aria-label="사용자 프로필 메뉴"
        aria-expanded={isMenuOpen}
        aria-haspopup="true"
      />

      <UserProfileMenu isOpen={isMenuOpen} onClose={closeMenu} />
    </div>
  );
}
