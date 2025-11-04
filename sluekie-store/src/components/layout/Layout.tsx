import type { ReactNode } from 'react';
import Navigation from './Navigation';
import Footer from './Footer';
import SkyBackground from '../ui/SkyBackground';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SkyBackground />
      <Navigation />
      <main style={{ flex: 1, marginTop: '80px' }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
