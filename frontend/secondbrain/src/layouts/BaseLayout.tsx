import type { ReactNode } from 'react';

interface BaseLayoutProps {
  children: ReactNode;
}

const BaseLayout = ({ children }: BaseLayoutProps) => {
  return <div className="bg-[#192030] p-10">{children}</div>;
};

export default BaseLayout;
