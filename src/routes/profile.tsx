import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Phone, User as UserIcon } from "lucide-react";
import { useProfile } from "@/lib/profile";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile - MEI Hostel" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const navigate = useNavigate();
  const p = useProfile();
  
  return (
    <div className="min-h-screen bg-[#1f1a8a] relative font-sans antialiased">
      <button
        onClick={() => navigate({ to: "/" })}
        aria-label="Back"
        className="absolute top-5 left-4 z-10 text-white text-xl font-bold"
      >
        ←
      </button>

      <div className="pt-16 flex justify-center">
        <div className="w-36 h-36 rounded-full bg-white flex items-center justify-center shadow-xl">
          <UserIcon className="w-24 h-24 text-gray-300" strokeWidth={1.25} />
        </div>
      </div>

      <div className="mt-8 mx-4 bg-white rounded-2xl shadow-xl p-6 pb-10">
        <h2 className="text-center text-xl font-semibold tracking-wide text-gray-900">{p.name}</h2>
        <p className="text-center text-gray-400 mt-1.5 text-sm tracking-wider">{p.rollNo}</p>
        
        <div className="border-t border-gray-100 my-5" />
        
        <div className="space-y-4 text-center text-gray-800 text-[15px] font-normal">
          <p className="bg-gray-50/60 py-2 rounded-lg">{p.hostel}</p>
          <p className="bg-gray-50/60 py-2 rounded-lg">{p.course}</p>
          <p className="bg-gray-50/60 py-2 rounded-lg">Room: {p.room}</p>
          <p className="flex items-center justify-center gap-2 bg-gray-50/60 py-2 rounded-lg">
            <Phone className="h-4 w-4 text-blue-600 fill-blue-600" />
            <span>{p.phone}</span>
          </p>
        </div>
        
        <div className="flex justify-center mt-8">
          <button
            onClick={() => navigate({ to: "/" })}
            className="bg-[#1f1a8a] text-white text-sm font-medium px-10 py-2.5 rounded-full shadow-md hover:bg-[#1a1575] transition-colors"
          >
            BACK TO HOME
          </button>
        </div>
      </div>
    </div>
  );
}