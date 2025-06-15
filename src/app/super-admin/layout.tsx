import Footer from "@/components/footer";
import { SiteHeader } from "@/components/site-header";

const SuperAdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col">
      <SiteHeader />
      <div className="min-h-[60vh] bg-neutral-50 dark:bg-neutral-900">
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default SuperAdminLayout;
