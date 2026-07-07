import { Header, MobileNav, Footer } from "@/components/layout";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <Footer />
      <MobileNav />
    </>
  );
}
