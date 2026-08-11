import { type ReactNode } from 'react';

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="bg-clear-day text-charcoal font-display min-h-screen flex flex-col antialiased">
      {/* Main content */}
      <div className="grow flex flex-col w-full">{children}</div>

      
    </div>
  );
}
