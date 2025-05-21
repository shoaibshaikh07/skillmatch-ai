import TanstackQueryProvider from "@/components/provider/tanstack-query";
import Navigation from "./_components/navigation";
import AuthorizationWrapper from "./auth-wrapper";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <TanstackQueryProvider>
      <AuthorizationWrapper>
        {children}
        <Navigation />
      </AuthorizationWrapper>
    </TanstackQueryProvider>
  );
}
