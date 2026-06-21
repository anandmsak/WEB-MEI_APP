import { createFileRoute, useNavigate } from "@tanstack/react-router";
import plateImg from "@/assets/plate.jpeg";

export const Route = createFileRoute("/food-choice")({
  head: () => ({ meta: [{ title: "Food Choice - MEI Hostel" }] }),
  component: FoodChoice,
});

function FoodChoice() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans antialiased">
      {/* CSS Keyframes for the continuous gentle fade in and out pulsing effect */}
      <style>{`
        @keyframes gentlePulse {
          0%, 100% { opacity: 0.20; }
          50% { opacity: 0.75; }
        }
        .animate-pulse-slow {
          animation: gentlePulse 3.5s ease-in-out infinite;
        }
      `}</style>

      {/* Replicated page header structure */}
      <header className="bg-gradient-to-r from-[#1e6bb8] to-[#3a1a8a] px-4 py-[14px] flex items-center gap-4">
        <button 
          onClick={() => navigate({ to: "/" })} 
          className="text-white text-xl font-bold" 
          aria-label="Back"
        >
          ←
        </button>
        <h1 className="text-white text-xl font-semibold tracking-wide">Food Choice</h1>
      </header>

      {/* Main Layout Container */}
      <div className="flex-1 flex flex-col items-center justify-between pt-10 pb-28">
        
        {/* Top: Shifted higher up with reduced padding margins, strictly isolated pulse behavior */}
        <div className="w-24 h-24 flex items-center justify-center animate-pulse-slow mt-2">
          <img 
            src={plateImg} 
            alt="No food ordered status" 
            className="w-full h-full object-contain mix-blend-multiply" 
          />
        </div>

        {/* Bottom: Completely steady/solid flat text weight and distribution mapping */}
        <p className="text-center text-[#9ca3af] text-[15.5px] font-normal tracking-wide px-4">
          No Special Foods Ordered!
        </p>

      </div>
    </div>
  );
}