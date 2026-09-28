import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { AppShell } from "@/components/app-shell";
import { TodoProvider } from "@/components/todo-store";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const themeBootScript = `(function(){try{var t=localStorage.getItem("todo-list.theme");var dark=t==="dark"||(t!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",dark);}catch(e){}})();`;

export const metadata: Metadata = {
  title: "Today",
  description: "A list with notes, categories, and light or dark mode.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full">
        <Script id="theme-boot" strategy="beforeInteractive">
          {themeBootScript}
        </Script>
        <TodoProvider>
          <AppShell>{children}</AppShell>
        </TodoProvider>
      </body>
    </html>
  );
}
