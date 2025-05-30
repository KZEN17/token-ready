'use client';

import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh'
        }}>
            <Header />
            <main style={{ flexGrow: 1 }}>
                {children}
            </main>
            <Footer />
        </div>
    );
}