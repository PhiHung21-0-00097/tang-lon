import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Chúc Mừng 20/10 Bé Lon Iu Dấu ❤️',
  description: 'Trang web chúc mừng ngày 20/10 siêu lộng lẫy dành riêng cho Bé Lon!',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#11052C',
};

export default function RootLayout({
  children,
}: {
  children: any;
}) {
  return (
    <html lang="vi">
      <body className="bg-[#11052C] text-white antialiased">
        {children}
      </body>
    </html>
  );
}