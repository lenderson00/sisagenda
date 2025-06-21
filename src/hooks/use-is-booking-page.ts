import { usePathname } from "next/navigation";

export default function useIsBookingPage(): boolean {
  const pathname = usePathname();

  const isBookingPage = ["/agendar"].some((route) =>
    pathname?.startsWith(route),
  );

  return isBookingPage;
}
