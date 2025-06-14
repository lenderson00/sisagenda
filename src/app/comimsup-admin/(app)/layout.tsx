import Footer from "@/components/footer";
import { SiteHeader } from "@/components/site-header";

export default function ComimsupAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <SiteHeader />
      <div className="min-h-[60vh]  ">
        <div className="max-w-7xl mx-auto p-4 md:p-0">{children}</div>
      </div>
      <Footer />
    </div>
  );
}
