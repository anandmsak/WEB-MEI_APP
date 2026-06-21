import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Plus, Calendar as CalendarIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { addPass, getPasses, type Pass } from "@/lib/passes";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Import your exact custom assets verbatim
import calendarIcon from "@/assets/icons/1000162640.ico";
import clockIcon from "@/assets/icons/1000162640 (1).ico";
import userBubbleIcon from "@/assets/icons/1000162640 (2).ico";
import rightBubbleIcon from "@/assets/icons/1000162640 (3).ico";
import leftBubbleIcon from "@/assets/icons/1000162640 (4).ico";
import trackerLineAsset from "@/assets/icons/copilot_image_1781932883693.jpeg";

export const Route = createFileRoute("/request")({
  head: () => ({
    meta: [{ title: "Request - MEI Hostel" }],
  }),
  component: RequestPage,
});

type Item = Pass;

const TYPES = ["Outing", "Holiday", "Leave", "Semester Holiday", "Interview", "Symposium", "NPTL/Gate"] as const;
const THREE_STAGE = new Set(["Leave", "Semester Holiday", "Interview", "Symposium", "NPTL/Gate", "NPTEL"]);

function RequestCard({ item }: { item: Item }) {
  if (!item.fromDate && !item.toDate) return null;

  const isThreeStage = THREE_STAGE.has(item.type);
  const status = item.status;
  
  let filledStages = 0;
  if (isThreeStage) {
    if (status === "Pending") filledStages = 1;
    else if (status === "Verified") filledStages = 2;
    else if (status === "Approved") filledStages = 3;
  }

  return (
    <div className="relative bg-white rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.05)] overflow-hidden mx-3 p-3 flex flex-col justify-between border border-gray-100 font-sans">
      
      {/* ✅ EXACT MATCH: Muted, soft minimal pastel green background block with custom side curvature positioning */}
      <div 
        className="absolute right-0 top-0 bottom-0 w-[43%] bg-[#a7f3d0] opacity-50 pointer-events-none" 
        style={{ borderRadius: "140px 0 0 140px / 50% 0 0 50%" }}
      />

      {/* Rows Container */}
      <div className="relative z-10 space-y-2 text-[14.5px] text-[#2d2d2d] font-normal">
        
        {/* From Row */}
        <div className="flex items-center gap-2">
          <span className="w-14 text-gray-700">From :</span>
          <img src={calendarIcon} alt="" className="w-4 h-4 object-contain" />
          <span className="text-[#2d2d2d] font-normal">{item.fromDate}</span>
          <span className="text-gray-300 mx-1">|</span>
          <img src={clockIcon} alt="" className="w-4 h-4 object-contain" />
          <span className="text-[#2d2d2d] font-normal">{item.fromTime}</span>
        </div>

        {/* To Row */}
        <div className="flex items-center gap-2">
          <span className="w-14 text-gray-700">To :</span>
          <img src={calendarIcon} alt="" className="w-4 h-4 object-contain" />
          <span className="text-[#2d2d2d] font-normal">{item.toDate}</span>
          <span className="text-gray-300 mx-1">|</span>
          <img src={clockIcon} alt="" className="w-4 h-4 object-contain" />
          <span className="text-[#2d2d2d] font-normal">{item.toTime}</span>
        </div>

        {/* Timestamp Row */}
        {item.stamp && (
          <div className="flex items-center gap-3.5 pl-0.5 text-gray-800">
            <img src={clockIcon} alt="" className="w-4 h-4 object-contain" />
            <span>{item.stamp}</span>
          </div>
        )}

        {/* Type Row */}
        {item.type && (
          <div className="flex items-center gap-3.5 pl-0.5 text-gray-800">
            <img src={userBubbleIcon} alt="" className="w-4 h-4 object-contain" />
            <span>{item.type}</span>
          </div>
        )}
        
        {/* Reason Row */}
        {item.reason && (
          <div className="flex items-center gap-3.5 pl-0.5 text-gray-800">
            <img src={leftBubbleIcon} alt="" className="w-4 h-4 object-contain" />
            <span>{item.reason}</span>
          </div>
        )}

        {/* Status Text Row */}
        {item.status && (
          <div className="flex items-center gap-3.5 pl-0.5 text-gray-800">
            <img src={rightBubbleIcon} alt="" className="w-4 h-4 object-contain" />
            <span>{item.status}</span>
          </div>
        )}

      </div>

      {/* ✅ EXACT MATCH REMOVAL: Only render the progress timeline if it is a multi-stage request (isThreeStage) */}
      {isThreeStage && item.status && (
        <div className="relative z-10 mt-4 mb-1.5 w-full flex justify-start pl-1">
          <div className="flex items-center w-[88%] relative">
            
            {/* Soft thin slate line running beneath the bubbles */}
            <div className="absolute left-2 right-2 top-1/2 -translate-y-1/2 h-[1px] bg-gray-300 z-0" />

            {/* Checkmark Bullets Container */}
            <div className="flex justify-between w-full relative z-10">
              {Array.from({ length: 3 }).map((_, i) => {
                const isActivated = i < filledStages;
                return (
                  <div 
                    key={i} 
                    className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                      isActivated 
                        ? "bg-[#0e3e20]" // Deep, clean minimal muted dark green
                        : "bg-[#cbd5e1]" // Light slate-ash gray background color
                    }`}
                  >
                    <svg 
                      className={`w-3 h-3 ${isActivated ? "text-white" : "text-gray-400"}`} 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2.5" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

function RequestPage() {
  const navigate = useNavigate();
  
  const [userProfile, setUserProfile] = useState({
    name: "ANANDHA KRISHNAN P",
    rollNo: "124UEC007",
    hostel: "MEC",
    course: "BE (ECE)",
    room: "A108",
    phone: "7540030095",
  });
  
  const [items, setItems] = useState<Pass[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    fromDate: "",
    fromTime: "",
    toDate: "",
    toTime: "",
    type: "Outing",
    reason: "",
    approved: true,
  });

  const syncActiveProfile = () => {
    try {
      const data = localStorage.getItem("mei.profile");
      if (data) {
        setUserProfile(JSON.parse(data));
      }
    } catch (e) {
      console.error("Local Storage sync error:", e);
    }
  };

  const fetchAllPasses = async (currentRoll: string, currentName: string) => {
    try {
      const data = await getPasses();
      const filtered = data.filter((p) => {
        const passRoll = (p.ownerRoll || p.rollNumber || "").trim().toUpperCase();
        const passUser = (p.owner || p.user || "").trim().toLowerCase();
        return (
          passRoll === currentRoll.trim().toUpperCase() ||
          passUser === currentName.trim().toLowerCase()
        );
      });

      const sorted = filtered.sort((a, b) => {
        const stampA = a.stamp || "";
        const stampB = b.stamp || "";
        return stampB.localeCompare(stampA);
      });

      setItems(sorted);
    } catch (err) {
      console.error("Error updating real-time records:", err);
    }
  };

  useEffect(() => {
    syncActiveProfile();
    window.addEventListener("profile-updated", syncActiveProfile);
    window.addEventListener("storage", syncActiveProfile);
    
    return () => {
      window.removeEventListener("profile-updated", syncActiveProfile);
      window.removeEventListener("storage", syncActiveProfile);
    };
  }, []);

  useEffect(() => {
    fetchAllPasses(userProfile.rollNo, userProfile.name);
  }, [userProfile.rollNo, userProfile.name]);

  const formatStamp = () => {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const hr = d.getHours();
    const ampm = hr >= 12 ? "PM" : "AM";
    const h12 = hr % 12 === 0 ? 12 : hr % 12;
    return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()} ${pad(h12)}:${pad(d.getMinutes())}:${pad(d.getSeconds())} ${ampm}`;
  };

  const toAmPm = (t: string) => {
    if (!t) return "";
    const [hStr, m] = t.split(":");
    const h = parseInt(hStr, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${String(h12).padStart(2, "0")}:${m} ${ampm}`;
  };

  const toDmy = (d: string) => {
    if (!d) return "";
    const [y, m, day] = d.split("-");
    return `${day}-${m}-${y}`;
  };

  const handleSubmit = async () => {
    if (!form.fromDate || !form.fromTime || !form.toDate || !form.toTime) return;
    
    const isThree = THREE_STAGE.has(form.type);
    const status = form.approved ? "Approved" : isThree ? "Pending" : "Approved";
    
    const newPassData = {
      fromDate: toDmy(form.fromDate),
      fromTime: toAmPm(form.fromTime),
      toDate: toDmy(form.toDate),
      toTime: toAmPm(form.toTime),
      stamp: formatStamp(),
      type: form.type,
      reason: form.reason || "-",
      status,
      owner: userProfile.name,
      ownerRoll: userProfile.rollNo,
      ownerRoom: userProfile.room,
    };

    await addPass(newPassData);
    await fetchAllPasses(userProfile.rollNo, userProfile.name);
    
    setShowForm(false);
    setForm({ fromDate: "", fromTime: "", toDate: "", toTime: "", type: "Outing", reason: "", approved: true });
  };

  return (
    <div className="min-h-screen bg-[#f5f2f7] pb-24 font-sans antialiased">
      <header className="bg-gradient-to-r from-[#1e6bb8] to-[#3a1a8a] px-4 py-3.5 flex flex-col shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate({ to: "/" })} className="text-white text-xl font-bold" aria-label="Go back">←</button>
          <h1 className="text-white text-xl font-semibold tracking-wide">Request</h1>
        </div>
        <p className="text-white/70 text-xs mt-1 pl-8 font-normal">Active: {userProfile.name}</p>
      </header>
      
      <div className="mt-4 space-y-4">
        {items.length === 0 ? (
          <p className="text-sm text-gray-500 py-12 text-center italic">No passes submitted yet for this profile.</p>
        ) : (
          items.map((it, i) => (
            <RequestCard key={it.id ?? i} item={it} />
          ))
        )}
      </div>
      
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#3a1a8a] text-white shadow-lg flex items-center justify-center z-40"
        aria-label="Add Pass"
      >
        <Plus className="h-7 w-7" />
      </button>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-[#1e6bb8] to-[#3a1a8a] px-4 py-3">
              <h2 className="text-white text-lg font-bold">New Pass</h2>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full border rounded-md px-3 py-2 text-sm bg-white outline-none"
                >
                  {TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">From Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="w-full border rounded-md px-2 py-2 text-sm bg-white text-left flex items-center justify-between outline-none">
                        <span className={cn(!form.fromDate && "text-gray-400")}>
                          {form.fromDate ? format(new Date(form.fromDate), "dd-MM-yyyy") : "Select Date"}
                        </span>
                        <CalendarIcon className="h-4 w-4 text-gray-400" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={form.fromDate ? new Date(form.fromDate) : undefined}
                        onSelect={(date) => setForm({ ...form, fromDate: date ? format(date, "yyyy-MM-dd") : "" })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">From Time</label>
                  <input type="time" value={form.fromTime} onChange={(e) => setForm({ ...form, fromTime: e.target.value })} className="w-full border rounded-md px-2 py-2 text-sm bg-white outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">To Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="w-full border rounded-md px-2 py-2 text-sm bg-white text-left flex items-center justify-between outline-none">
                        <span className={cn(!form.toDate && "text-gray-400")}>
                          {form.toDate ? format(new Date(form.toDate), "dd-MM-yyyy") : "Select Date"}
                        </span>
                        <CalendarIcon className="h-4 w-4 text-gray-400" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={form.toDate ? new Date(form.toDate) : undefined}
                        onSelect={(date) => setForm({ ...form, toDate: date ? format(date, "yyyy-MM-dd") : "" })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">To Time</label>
                  <input type="time" value={form.toTime} onChange={(e) => setForm({ ...form, toTime: e.target.value })} className="w-full border rounded-md px-2 py-2 text-sm bg-white outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Reason</label>
                <input type="text" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="Reason" className="w-full border rounded-md px-3 py-2 text-sm bg-white outline-none" />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer py-1 select-none">
                <input
                  type="checkbox"
                  checked={form.approved}
                  onChange={(e) => setForm({ ...form, approved: e.target.checked })}
                />
                Mark as Approved
              </label>
              <div className="flex gap-2 pt-2">
                <button onClick={() => setShowForm(false)} className="flex-1 py-2 rounded-md border text-gray-700">Cancel</button>
                <button onClick={handleSubmit} className="flex-1 py-2 rounded-md bg-[#3a1a8a] text-white font-medium">OK</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}