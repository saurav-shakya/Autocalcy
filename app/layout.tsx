import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { CalculatorProvider } from './context/CalculatorContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Autocalcy - AI-Powered Calculator',
  description: 'A calculator that understands natural language and animates calculations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CalculatorProvider>
          {children}
        </CalculatorProvider>
      </body>
    </html>
  );
}

