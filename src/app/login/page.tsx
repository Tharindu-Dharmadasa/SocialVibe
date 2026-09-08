import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-auth-gradient bg-mesh flex-col items-center justify-center p-12">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

        <div className="relative z-10 max-w-md text-center">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-violet-400 flex items-center justify-center shadow-lg shadow-primary/30">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-2xl font-bold text-white">SocialVibe</span>
          </div>

          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            Connect. Share.<br />
            <span className="text-primary/80">Inspire.</span>
          </h1>
          <p className="text-white/60 text-lg leading-relaxed mb-10">
            Join thousands of people sharing moments, ideas, and experiences every day.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-3">
            {["📸 Share Photos", "💬 Real-time Chat", "❤️ Connect with Friends", "🔔 Stay Updated"].map((feat) => (
              <span key={feat} className="px-4 py-1.5 rounded-full bg-white/10 text-white/80 text-sm font-medium border border-white/10 backdrop-blur-sm">
                {feat}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom testimonial */}
        <div className="relative z-10 mt-16 max-w-sm">
          <div className="rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm p-5">
            <p className="text-white/80 text-sm leading-relaxed italic">
              "SocialVibe changed the way I connect with my community. It's fast, beautiful, and feels personal."
            </p>
            <div className="flex items-center gap-3 mt-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-primary" />
              <div>
                <p className="text-white text-sm font-semibold">Alex Johnson</p>
                <p className="text-white/50 text-xs">@alexj · Early adopter</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel — Clerk Sign In */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 bg-background">
        {/* Mobile logo */}
        <div className="flex items-center gap-2 mb-8 lg:hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center shadow-sm">
            <span className="text-white font-bold">S</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
            SocialVibe
          </span>
        </div>

        <SignIn
          appearance={{
            elements: {
              rootBox: "w-full max-w-md",
              card: "shadow-none border border-border rounded-2xl bg-card p-6",
              headerTitle: "text-foreground font-bold text-2xl",
              headerSubtitle: "text-muted-foreground",
              formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold shadow-sm transition-all",
              formFieldInput: "rounded-xl border-input bg-background text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all",
              formFieldLabel: "text-foreground font-medium text-sm",
              dividerLine: "bg-border",
              dividerText: "text-muted-foreground text-xs",
              socialButtonsBlockButton: "border-border rounded-xl hover:bg-muted/50 transition-colors",
              socialButtonsBlockButtonText: "text-foreground font-medium",
              footerActionLink: "text-primary hover:text-primary/80 font-medium",
              identityPreviewText: "text-foreground",
              identityPreviewEditButton: "text-primary",
            },
          }}
        />
      </div>
    </div>
  );
}
