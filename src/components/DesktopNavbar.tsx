import { BellIcon, HomeIcon, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { ModeToggle } from "./ModeToggle";
import { currentUser } from "@clerk/nextjs/server";

async function DesktopNavbar() {
  const user = await currentUser();

  return (
    <div className="hidden md:flex items-center gap-1">
      <ModeToggle />

      <Button variant="ghost" size="sm" className="flex items-center gap-2 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors" asChild>
        <Link href="/">
          <HomeIcon className="w-4 h-4" />
          <span className="hidden lg:inline font-medium">Home</span>
        </Link>
      </Button>

      {user ? (
        <>
          <Button variant="ghost" size="sm" className="flex items-center gap-2 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors" asChild>
            <Link href="/notifications">
              <BellIcon className="w-4 h-4" />
              <span className="hidden lg:inline font-medium">Notifications</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-2 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors" asChild>
            <Link href={`/profile/${user.username ?? user.emailAddresses[0].emailAddress.split("@")[0]}`}>
              <UserIcon className="w-4 h-4" />
              <span className="hidden lg:inline font-medium">Profile</span>
            </Link>
          </Button>
          <div className="ml-1">
            <UserButton appearance={{ elements: { avatarBox: "w-8 h-8 ring-2 ring-primary/20 rounded-full" } }} />
          </div>
        </>
      ) : (
        <SignInButton mode="modal">
          <Button size="sm" className="rounded-xl font-semibold ml-1 bg-primary hover:bg-primary/90">
            Sign In
          </Button>
        </SignInButton>
      )}
    </div>
  );
}

export default DesktopNavbar;