// This layout overrides the root layout for /login, rendering the page without
// the main Navbar and Sidebar so the auth page can be fully full-screen.
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
