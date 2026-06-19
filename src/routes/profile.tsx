import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Phone, User as UserIcon } from "lucide-react";
import { useProfile } from "@/lib/profile";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile - MEI Hostel" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const navigate = useNavigate();
  const p = useProfile();
  return (
    <div className="min-h-screen bg-[#1f1a8a] relative">
      <button
        onClick={() => navigate({ to: "/" })}
        aria-label="Back"
        className="absolute top-5 left-4 z-10"
      >
        <ArrowLeft className="h-7 w-7 text-white" />
      </button>

      <div className="pt-16 flex justify-center">
        <div className="w-44 h-44 rounded-full bg-white flex items-center justify-center shadow-xl">
          <UserIcon className="w-28 h-28 text-gray-400" strokeWidth={1.5} />
        </div>
      </div>

      <div className="mt-8 mx-4 bg-white rounded-2xl shadow-xl p-6 pb-10">
        <h2 className="text-center text-xl font-bold tracking-wide text-black">{p.name}</h2>
        <p className="text-center text-gray-400 mt-2 tracking-widest">{p.rollNo}</p>
        <div className="border-t my-5" />
        <div className="space-y-5 text-center text-black">
          <p>{p.hostel}</p>
          <p>{p.course}</p>
          <p>{p.room}</p>
          <p className="flex items-center justify-center gap-2">
            <Phone className="h-5 w-5 text-blue-600 fill-blue-600" />
            <span>{p.phone}</span>
          </p>
        </div>
        <div className="flex justify-center mt-8">
          <button
            onClick={() => navigate({ to: "/" })}
            className="bg-[#1f1a8a] text-white font-semibold px-8 py-3 rounded-lg shadow"
          >
            LOGOUT
          </button>
        </div>
      </div>
    </div>
  );
}