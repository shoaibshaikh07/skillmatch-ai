import TanstackQueryProvider from "@/components/provider/tanstack-query";
import Navigation from "./_components/navigation";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <TanstackQueryProvider>
      <main>
        {children}
        <Navigation />
      </main>
    </TanstackQueryProvider>
  );
}
