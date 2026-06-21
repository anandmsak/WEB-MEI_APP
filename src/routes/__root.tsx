import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import logo from "@/assets/mei-logo.png";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Mahendra.info" },
      { name: "description", content: "Exact Match Dashboard replicates specified details with dynamic date updates." },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "Mahendra.info" },
      { property: "og:description", content: "Exact Match Dashboard replicates specified details with dynamic date updates." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "Mahendra.info" },
      { name: "twitter:description", content: "Exact Match Dashboard replicates specified details with dynamic date updates." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/2e6feffe-90a3-47b3-8590-b6d6bc6c33bf/id-preview-037bbc0f--a721678a-4211-411c-93a1-4e759184e1d1.lovable.app-1781263815505.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/2e6feffe-90a3-47b3-8590-b6d6bc6c33bf/id-preview-037bbc0f--a721678a-4211-411c-93a1-4e759184e1d1.lovable.app-1781263815505.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

// ✅ UPDATE ONLY THIS WRAPPER COMPONENT INSIDE YOUR src/routes/__root.tsx
function SplashIntroWrapper({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Increased to 2200ms so both text lines reveal fully and hold exactly like the video sequence
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  if (!showSplash) return <>{children}</>;

  return (
    <div className="fixed inset-0 bg-[#FFFFFF] flex flex-col items-center justify-center z-[9999] pointer-events-none select-none">
      <style>{`
        /* Logo initial expansion and upper-third translation */
        @keyframes logoFluidMotion {
          0% { transform: scale(0.7) translateY(20px); opacity: 0; }
          30% { transform: scale(1.0) translateY(20px); opacity: 1; }
          100% { transform: scale(1.05) translateY(-15px); opacity: 1; }
        }
        
        /* Text 1: Micro drop-down entry (-10px to 0px) */
        @keyframes mahendraDescend {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0px); }
        }
        
        /* Text 2: Micro slide-up entry (15px to 0px) */
        @keyframes subtitleAscend {
          0% { opacity: 0; transform: translateY(15px); }
          100% { opacity: 1; transform: translateY(0px); }
        }

        .animate-logo-fluid {
          animation: logoFluidMotion 700ms cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        
        /* Triggered exactly as logo finishes scaling */
        .animate-text-mahendra {
          opacity: 0;
          animation: mahendraDescend 400ms cubic-bezier(0.16, 1, 0.3, 1) 550ms forwards;
        }
        
        /* Rises up smoothly to create perfect visual convergence */
        .animate-text-sub {
          opacity: 0;
          animation: subtitleAscend 450ms cubic-bezier(0.16, 1, 0.3, 1) 750ms forwards;
        }
      `}</style>

      {/* Strictly locked to the horizontal center axis */}
      <div className="flex flex-col items-center justify-center text-center">
        
        {/* Globe/M Logo Frame */}
        <div className="w-[160px] h-[160px] flex items-center justify-center animate-logo-fluid mb-2">
          <img src={logo} alt="" className="w-full h-full object-contain" />
        </div>

        {/* Text 1: MAHENDRA - Settles downward */}
        <h2 
          className="text-[#1565c0] text-[23px] font-bold tracking-[0.55em] uppercase pl-[0.55em] mt-3 animate-text-mahendra"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          MAHENDRA
        </h2>

        {/* Text 2: Subtitle - Slides upward */}
        <p 
          className="text-[#4b5563] text-[14.5px] font-normal tracking-normal mt-[24px] animate-text-sub"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Hostel Management System(MHMS)
        </p>
      </div>
    </div>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <SplashIntroWrapper>
        <Outlet />
      </SplashIntroWrapper>
    </QueryClientProvider>
  );
}