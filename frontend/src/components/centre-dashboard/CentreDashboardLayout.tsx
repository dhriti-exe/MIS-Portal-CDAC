import { ReactNode } from 'react';

interface CentreDashboardLayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
}

export default function CentreDashboardLayout({ sidebar, children }: CentreDashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="hidden md:block md:w-64">
        {sidebar}
      </div>
      <main className="flex-1 p-6 md:p-10">
        {children}
      </main>
    </div>
  );
}
