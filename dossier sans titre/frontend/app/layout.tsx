import type { Metadata } from 'next';
import '../styles/globals.css';
import Providers from '@/lib/providers';

export const metadata: Metadata = {
  title: 'ArwaPark',
  description: 'Plateforme de gestion de flotte et transport',
  icons: {
    icon: '/car.svg',
    shortcut: '/car.svg',
    apple: '/car.svg',
  },
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
