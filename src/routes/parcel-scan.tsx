import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/parcel-scan")({
  component: ParcelScanPage,
});

function ParcelScanPage() {
  const navigate = useNavigate();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    // Simulate a scanner looking for a barcode/QR code frame
    const timer = setTimeout(() => {
      setScanned(true);
      alert("Scanned successfully!");
      // Automatically return back to dashboard after the popup is closed
      navigate({ to: "/" });
    }, 1800);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between font-sans relative overflow-hidden">
      {/* Viewfinder Header */}
      <header className="bg-neutral-900/90 px-4 py-4 flex items-center gap-4 z-10 border-b border-neutral-800">
        <button onClick={() => navigate({ to: "/" })} className="text-white text-xl font-bold">
          ←
        </button>
        <h1 className="text-lg font-medium tracking-wide">Scan Parcel QR Code</h1>
      </header>

      {/* Main Viewfinder Section */}
      <div className="flex-1 flex flex-col items-center justify-center relative bg-neutral-950">
        {/* Decorative corner target bounds */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-400 rounded-tl-md"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-400 rounded-tr-md"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-400 rounded-bl-md"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-400 rounded-br-md"></div>
          
          {/* Animated red laser scanning bar */}
          <div className="w-[90%] h-[2px] bg-red-500 shadow-[0_0_8px_#ef4444] animate-bounce opacity-80" />
        </div>
        
        <p className="text-neutral-400 text-sm mt-8 tracking-wide animate-pulse">
          Align QR code within the framing lines...
        </p>
      </div>

      {/* Bottom Bar Spacer */}
      <div className="bg-neutral-900/90 py-6 px-4 text-center text-xs text-neutral-500 border-t border-neutral-800 z-10">
        Powered by MHMS Camera Core
      </div>
    </div>
  );
}