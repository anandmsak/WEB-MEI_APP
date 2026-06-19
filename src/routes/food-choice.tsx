import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/food-choice")({
  head: () => ({ meta: [{ title: "Food Choice - MEI Hostel" }] }),
  component: FoodChoice,
});

function FoodChoice() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="bg-gradient-to-r from-[#1e6bb8] to-[#3a1a8a] px-4 py-4 flex items-center gap-4">
        <button onClick={() => navigate({ to: "/" })} aria-label="Back">
          <ArrowLeft className="h-6 w-6 text-white" />
        </button>
        <h1 className="text-white text-2xl font-bold">Food Choice</h1>
      </header>
      <div className="pt-10 text-center text-7xl">🍽️</div>
      <div className="flex-1" />
      <p className="text-center text-gray-400 text-lg pb-24">No Special Foods Ordered!</p>
    </div>
  );
}