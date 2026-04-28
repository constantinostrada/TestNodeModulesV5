import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TestNodeModulesV5',
  description:
    'A production-ready Next.js + TypeScript application scaffolded with Clean Architecture.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
