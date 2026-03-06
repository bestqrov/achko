import type { Metadata } from 'next';
import '../styles/globals.css';
import Providers from '@/lib/providers';

export const metadata: Metadata = {
  title: 'ArwaPark - Fleet Management SaaS',
  description: 'Production-ready fleet and transport management platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
