interface GlassButtonProps {
  size: 'sm' | 'md';
  emoji: string;
  onClick: () => void;
  className?: string;
}

const GlassButton = ({ size, emoji, onClick, className = '' }: GlassButtonProps) => {
  const baseStyles =
    'flex items-center justify-center cursor-pointer transition-colors duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed';

  const glassStyles =
    'bg-[rgba(136,136,136,0.15)] backdrop-blur-[2.5px] border border-[rgba(255,255,255,0.18)] hover:bg-[rgba(136,136,136,0.3)]';

  const sizeStyles = {
    sm: 'w-[60px] h-[60px] rounded-full text-3xl',
    md: 'h-[60px] rounded-xl px-6 text-2xl',
  };

  const combinedClasses = `
    ${baseStyles}
    ${glassStyles}
    ${sizeStyles[size]}
    ${className} 
  `;

  return (
    <button type="button" onClick={onClick} className={combinedClasses.trim().replace(/\s+/g, ' ')}>
      <span role="img" aria-label="button-icon">
        {emoji}
      </span>
    </button>
  );
};

export default GlassButton;
