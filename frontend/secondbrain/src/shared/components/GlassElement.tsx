import React, { useEffect, useRef } from 'react';
import type { ElementType, ComponentPropsWithoutRef } from 'react';
import '@/shared/styles/glass-base.css';

type PolymorphicProps<El extends ElementType> = {
  as?: 'button' | 'input' | 'div';
  icon?: React.ReactNode;
  children?: React.ReactNode;
  scale?: 'sm' | 'md';
} & ComponentPropsWithoutRef<El>;

type GlassElementProps<El extends ElementType = 'div'> = PolymorphicProps<El>;

const GlassElement = <El extends ElementType = 'div'>({
  as,
  icon,
  children,
  scale,
  className = '',
  ...rest
}: GlassElementProps<El>) => {
  const Component = as || ('div' as ElementType);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const border1Ref = useRef<HTMLSpanElement>(null);
  const border2Ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const wrapper = wrapperRef.current;
      const border1 = border1Ref.current;
      const border2 = border2Ref.current;

      if (!wrapper || !border1 || !border2) return;

      const rect = wrapper.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      let mouseX = ((e.clientX - centerX) / rect.width) * 100;
      let mouseY = ((e.clientY - centerY) / rect.height) * 100;

      mouseX = Math.max(-100, Math.min(100, mouseX));
      mouseY = Math.max(-100, Math.min(100, mouseY));

      const absMouseX = Math.abs(mouseX);

      // Border 1 (screen blend mode)
      const border1Angle = 135 + mouseX * 1.2;
      const border1OpacityStart = 0.12 + absMouseX * 0.008;
      const border1StopStart = Math.max(10, 33 + mouseY * 0.3);
      const border1OpacityEnd = 0.4 + absMouseX * 0.012;
      const border1StopEnd = Math.min(90, 66 + mouseY * 0.4);

      // Border 2 (overlay blend mode)
      const border2Angle = 135 + mouseX * 1.2;
      const border2OpacityStart = 0.32 + absMouseX * 0.008;
      const border2StopStart = Math.max(10, 33 + mouseY * 0.3);
      const border2OpacityEnd = 0.6 + absMouseX * 0.012;
      const border2StopEnd = Math.min(90, 66 + mouseY * 0.4);

      border1.style.background = `linear-gradient(${border1Angle}deg,
        rgba(255, 255, 255, 0.0) 0%,
        rgba(255, 255, 255, ${border1OpacityStart}) ${border1StopStart}%,
        rgba(255, 255, 255, ${border1OpacityEnd}) ${border1StopEnd}%,
        rgba(255, 255, 255, 0.0) 100%)`;

      border2.style.background = `linear-gradient(${border2Angle}deg,
        rgba(255, 255, 255, 0.0) 0%,
        rgba(255, 255, 255, ${border2OpacityStart}) ${border2StopStart}%,
        rgba(255, 255, 255, ${border2OpacityEnd}) ${border2StopEnd}%,
        rgba(255, 255, 255, 0.0) 100%)`;
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const isInput = as === 'input';
  const isButton = as === 'button';

  const elementScaleClasses = isButton
    ? 'h-14 w-14 rounded-full'
    : isInput && scale
      ? scale === 'sm'
        ? 'h-14 w-14 rounded-full'
        : 'h-14 w-[22rem]'
      : 'w-[27rem]';

  const inputFocusClasses = isInput ? 'outline-none focus:outline-none focus:ring-0' : '';

  const wrapperScaleClasses = isButton
    ? 'h-14 w-14'
    : isInput && scale
      ? scale === 'sm'
        ? 'h-14 w-14'
        : 'h-14 w-[22rem]'
      : 'w-[27rem]';

  const borderShapeClasses = isButton || (isInput && scale === 'sm') ? 'rounded-full' : '';

  return (
    <div ref={wrapperRef} className={`glass-wrapper ${wrapperScaleClasses}`}>
      {isInput ? (
        <Component
          className={`glass-element ${elementScaleClasses} ${inputFocusClasses} ${className}`}
          type={scale === 'sm' ? 'checkbox' : scale === 'md' ? 'text' : undefined}
          {...rest}
        />
      ) : (
        <Component className={`glass-element ${elementScaleClasses} ${className}`} {...rest}>
          {icon && <span className="glass-icon">{icon}</span>}
          {children}
        </Component>
      )}
      <span ref={border1Ref} className={`glass-border border-1 ${borderShapeClasses}`} />
      <span ref={border2Ref} className={`glass-border border-2 ${borderShapeClasses}`} />
    </div>
  );
};

export default GlassElement;
