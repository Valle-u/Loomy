import Navbar from "@/components/store/Navbar";
import Footer from "@/components/store/Footer";
import KommoChat from "@/components/store/KommoChat";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <KommoChat />
    </>
  );
}
