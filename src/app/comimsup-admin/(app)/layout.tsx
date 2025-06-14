import Footer from "@/components/footer";
import { SiteHeader } from "@/components/site-header";
import { TopBar } from "@/components/top-bar";

export default function ComimsupAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <SiteHeader />
      <div className="min-h-[60vh] bg-neutral-50 ">
        <div className="max-w-7xl mx-auto p-4 md:p-0">{children}</div>
      </div>
      <Footer />
    </div>
  );
}
