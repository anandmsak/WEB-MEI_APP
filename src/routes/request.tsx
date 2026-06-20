import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Search, Calendar, Clock, User, MessageSquare, Plus, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { addPass, getPasses, type Pass } from "@/lib/passes";

export const Route = createFileRoute("/request")({
  head: () => ({
    meta: [{ title: "Request - MEI Hostel" }],
  }),
  component: RequestPage,
});

type Item = Pass;

const TYPES = ["Outing", "Holiday", "Leave", "Semester Holiday", "Interview", "Symposium", "NPTL/Gate"] as const;
const THREE_STAGE = new Set(["Leave", "Semester Holiday", "Interview", "Symposium", "NPTL/Gate", "NPTEL"]);

function StatusTrack({ item }: { item: Item }) {
  const three = THREE_STAGE.has(item.type);
  const status = item.status;
  
  let filled = 0;
  if (three) {
    if (status === "Pending") filled = 1;
    else if (status === "Verified") filled = 2;
    else if (status === "Approved") filled = 3;
  } else {
    filled = status === "Approved" ? 1 : 0;
  }
  
  const count = three ? 3 : 1;
  const dots = Array.from({ length: count });
  
  return (
    <div className="flex items-center gap-0 mt-2">
      {dots.map((_, i) => (
        <div key={i} className="flex items-center flex-1 last:flex-none">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center ${i < filled ? "bg-[#0e6b3a]" : "bg-gray-300"}`}>
            <Check className="h-4 w-4 text-white" strokeWidth={3} />
          </div>
          {i < count - 1 && <div className="flex-1 h-[2px] bg-gray-300" />}
        </div>
      ))}
    </div>
  );
}

function RequestCard({ item }: { item: Item }) {
  // If a pass entry doesn't have valid date records, skip rendering to prevent blank cards
  if (!item.fromDate && !item.toDate) return null;

  return (
    <div className="relative bg-white rounded-2xl shadow-sm overflow-hidden mx-4 mb-4">
      <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[#b8f5d8] rounded-l-[100%]" aria-hidden />
      <div className="relative p-4 space-y-2">
        <div className="flex items-center gap-2 text-[15px] text-black">
          <span className="w-12">From :</span>
          <Calendar className="h-5 w-5 text-gray-700" />
          <span>{item.fromDate}</span>
          <span className="text-gray-300 mx-1">|</span>
          <Clock className="h-5 w-5 text-gray-700" />
          <span>{item.fromTime}</span>
        </div>
        <div className="flex items-center gap-2 text-[15px] text-black">
          <span className="w-12">To :</span>
          <Calendar className="h-5 w-5 text-gray-700" />
          <span>{item.toDate}</span>
          <span className="text-gray-300 mx-1">|</span>
          <Clock className="h-5 w-5 text-gray-700" />
          <span>{item.toTime}</span>
        </div>
        {item.stamp && (
          <div className="flex items-center gap-2 text-[15px] text-black">
            <Clock className="h-5 w-5 text-gray-700" />
            <span>{item.stamp}</span>
          </div>
        )}
        {item.type && (
          <div className="flex items-center gap-2 text-[15px] text-black">
            <User className="h-5 w-5 text-gray-700" />
            <span>{item.type}</span>
          </div>
        )}
        {item.reason && (
          <div className="flex items-center gap-2 text-[15px] text-black">
            <MessageSquare className="h-5 w-5 text-gray-700" />
            <span>{item.reason}</span>
          </div>
        )}
        {item.status && (
          <div className="flex items-center gap-2 text-[15px] text-black">
            <MessageSquare className="h-5 w-5 text-gray-700" />
            <span>{item.status}</span>
          </div>
        )}
        {item.status && <StatusTrack item={item} />}
      </div>
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

      // SORTING LOGIC: Newest timestamp stamp string values sit at the absolute top
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
    <div className="min-h-screen bg-[#f3eff5] pb-24">
      <header className="bg-gradient-to-r from-[#1e6bb8] to-[#3a1a8a] px-4 py-4 flex items-center gap-4">
        <button onClick={() => navigate({ to: "/" })} aria-label="Back">
          <ArrowLeft className="h-6 w-6 text-white" />
        </button>
        <div className="flex-1">
          <h1 className="text-white text-xl font-bold">Request</h1>
          <p className="text-indigo-200 text-xs truncate">Active: {userProfile.name}</p>
        </div>
        <Search className="h-6 w-6 text-white" />
      </header>
      
      <div className="pt-4">
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
                  <input type="date" value={form.fromDate} onChange={(e) => setForm({ ...form, fromDate: e.target.value })} className="w-full border rounded-md px-2 py-2 text-sm bg-white" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">From Time</label>
                  <input type="time" value={form.fromTime} onChange={(e) => setForm({ ...form, fromTime: e.target.value })} className="w-full border rounded-md px-2 py-2 text-sm bg-white" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">To Date</label>
                  <input type="date" value={form.toDate} onChange={(e) => setForm({ ...form, toDate: e.target.value })} className="w-full border rounded-md px-2 py-2 text-sm bg-white" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">To Time</label>
                  <input type="time" value={form.toTime} onChange={(e) => setForm({ ...form, toTime: e.target.value })} className="w-full border rounded-md px-2 py-2 text-sm bg-white" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Reason</label>
                <input type="text" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="Reason" className="w-full border rounded-md px-3 py-2 text-sm bg-white" />
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