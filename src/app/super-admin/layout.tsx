import Footer from "@/components/footer";
import { TopBar } from "@/components/top-bar";

const SuperAdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col">
      <TopBar className="border-b" />
      <div className="min-h-[60vh] bg-neutral-50">{children}</div>
      <Footer />
    </div>
  );
};

export default SuperAdminLayout;
