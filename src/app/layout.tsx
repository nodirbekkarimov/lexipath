import type { Metadata } from "next";
import "./globals.css";
import { LearnerNav } from "@/components/LearnerNav";
import { LexiPathProvider } from "@/lib/data-store";

export const metadata: Metadata = {
  title: "LexiPath — Premium IELTS & CEFR Vocabulary Platform",
  description: "Academic English vocabulary acquisition platform anchored in authentic context with Uzbek translations and SM-2 Spaced Repetition.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-ivory-100 text-ink-950 flex flex-col font-sans">
        <LexiPathProvider>
          <LearnerNav />
          <main className="flex-1">
            {children}
          </main>
        </LexiPathProvider>
      </body>
    </html>
  );
}
