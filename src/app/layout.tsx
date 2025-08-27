import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Navbar } from '@/components/layout/navbar';
import prisma from '@/lib/prisma';

// Ensure the config entry exists
const getProjectConfig = async () => {
  try {
    const config = await prisma.projectConfig.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        title: 'CourtVision Live',
        slogan: 'Live basketball game tracking and commentary.',
        metaDescription: 'Live basketball game tracking and commentary.',
      },
    });
    return config;
  } catch (error) {
    console.error("Failed to fetch project config, returning defaults:", error);
    return {
      title: 'CourtVision Live (Default)',
      metaDescription: 'Live basketball game tracking and commentary.',
      logoUrl: null,
    };
  }
};

export async function generateMetadata(): Promise<Metadata> {
  const config = await getProjectConfig();
  return {
    title: config.title,
    description: config.metaDescription,
  };
}

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = await getProjectConfig();
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.variable)}>
        <Navbar title={config.title} logoUrl={config.logoUrl} />
        <main className="pt-16">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
