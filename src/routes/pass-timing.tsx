import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Info } from "lucide-react";

export const Route = createFileRoute("/pass-timing")({
  head: () => ({ meta: [{ title: "Pass Timing - MEI Hostel" }] }),
  component: PassTiming,
});

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="bg-gradient-to-r from-[#1e6bb8] to-[#3a1a8a] rounded-t-xl px-4 py-3 flex items-center gap-3">
      <div className="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center">
        <Info className="h-4 w-4 text-[#3a1a8a]" />
      </div>
      <h3 className="text-white font-medium">{title}</h3>
    </div>
  );
}

function PassTiming() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#f5f2f7] font-sans antialiased">
      <header className="bg-gradient-to-r from-[#1e6bb8] to-[#3a1a8a] px-4 py-[14px] flex items-center gap-4">
        <button onClick={() => navigate({ to: "/" })} className="text-white text-xl font-bold" aria-label="Back">
          ←
        </button>
        <h1 className="text-white text-xl font-semibold tracking-wide">Pass Timing</h1>
      </header>

      <div className="bg-white py-4 text-center border-b border-gray-100">
        <h2 className="text-[#1e6bb8] text-xl font-bold">Hostel Request Settings</h2>
      </div>

      <div className="p-4 space-y-4">
        <div className="bg-white rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden">
          <SectionHeader title="Request Apply Restriction Time" />
          <p className="px-4 py-4 text-gray-700">—</p>
        </div>

        <div className="bg-white rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden">
          <SectionHeader title="Request Apply Allow Time" />
          <p className="px-4 py-4 text-gray-700 leading-relaxed text-[14.5px]">
            • Students should request permission between 05:59 AM to 05:59 PM
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden">
          <SectionHeader title="Outing Request" />
          <div className="overflow-x-auto">
            <table className="w-full text-[13.5px]">
              <thead className="bg-[#e8eefc] text-[#1e6bb8]">
                <tr>
                  <th className="py-2.5 px-2 text-left font-semibold">Days</th>
                  <th className="py-2.5 px-2 text-left font-semibold">Out Time</th>
                  <th className="py-2.5 px-2 text-left font-semibold">In Time</th>
                  <th className="py-2.5 px-2 text-left font-semibold">Apply Time</th>
                </tr>
              </thead>
              <tbody className="text-gray-800">
                <tr className="border-t border-gray-100">
                  <td className="py-3 px-2">Saturday, Sunday</td>
                  <td className="py-3 px-2">09:00</td>
                  <td className="py-3 px-2">17:00</td>
                  <td className="py-3 px-2">09:00 - 10:00</td>
                </tr>
                <tr className="border-t border-gray-100">
                  <td className="py-3 px-2">Saturday, Sunday</td>
                  <td className="py-3 px-2">16:00</td>
                  <td className="py-3 px-2">19:00</td>
                  <td className="py-3 px-2">16:00 - 17:00</td>
                </tr>
                <tr className="border-t border-gray-100">
                  <td className="py-3 px-2 text-xs">Mon, Tue, Wed, Thu, Fri</td>
                  <td className="py-3 px-2">16:30</td>
                  <td className="py-3 px-2">19:00</td>
                  <td className="py-3 px-2">16:30 - 17:15</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden">
          <SectionHeader title="Emergency Request" />
          <div className="px-4 py-4 text-gray-700 space-y-2 leading-relaxed text-[14.5px]">
            <p>• First approval by Hostel Manager / Dean</p>
            <p>• All request types follow a defined approval workflow</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden">
          <SectionHeader title="Special Conditions" />
          <p className="px-4 py-4 text-gray-700 leading-relaxed text-[14.5px]">
            • One request approval may allow additional permission based on admin settings.
          </p>
        </div>
      </div>
    </div>
  );
}