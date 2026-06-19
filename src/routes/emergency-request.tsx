import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Plus } from "lucide-react";

export const Route = createFileRoute("/emergency-request")({
  head: () => ({ meta: [{ title: "Emergency Request - MEI Hostel" }] }),
  component: EmergencyRequest,
});

function EmergencyRequest() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#f3eff5] flex flex-col">
      <header className="bg-gradient-to-r from-[#1e6bb8] to-[#3a1a8a] px-4 py-4 flex items-center gap-4">
        <button onClick={() => navigate({ to: "/" })} aria-label="Back">
          <ArrowLeft className="h-6 w-6 text-white" />
        </button>
        <h1 className="text-white text-2xl font-bold">Emergency Request</h1>
      </header>
      <div className="flex-1" />
      <button
        aria-label="Add"
        className="fixed bottom-8 right-6 w-14 h-14 rounded-full bg-[#3a1a8a] text-white shadow-lg flex items-center justify-center"
      >
        <Plus className="h-7 w-7" />
      </button>
      <div className="h-6 bg-gradient-to-r from-[#1e6bb8] to-[#3a1a8a]" />
    </div>
  );
}