import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck, Lock, Trash2, Calendar, Clock, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { saveProfile } from "@/lib/profile";
import { getPasses, deletePass, type Pass } from "@/lib/passes";
import { getFirestoreUsers, updateUser, type UserProfile } from "@/lib/users";

export const Route = createFileRoute("/manage")({
  head: () => ({ meta: [{ title: "Manage - MEI Hostel" }] }),
  component: ManagePage,
});

function ManagePage() {
  const navigate = useNavigate();
  const [friendsList, setFriendsList] = useState<UserProfile[]>([]);
  const [selectedRoll, setSelectedRoll] = useState<string>("");
  const [form, setForm] = useState<UserProfile | null>(null);
  const [myPasses, setMyPasses] = useState<Pass[]>([]);
  const [savedMsg, setSavedMsg] = useState("");
  const [loading, setLoading] = useState(true);

  // 1. Load your 6-7 friends directly from your live Firestore database collection
  useEffect(() => {
    async function loadRoster() {
      try {
        const users = await getFirestoreUsers();
        setFriendsList(users);
        
        if (users.length > 0) {
          const savedSession = localStorage.getItem("mei.profile");
          let targetUser: UserProfile | undefined;

          if (savedSession) {
            const parsedSession = JSON.parse(savedSession);
            targetUser = users.find(u => 
              (u.rollNo || "").trim().toUpperCase() === (parsedSession.rollNo || "").trim().toUpperCase()
            );
          }

          // Fall back to Anandha ONLY if absolutely no valid cache token exists
          if (!targetUser) {
            targetUser = users.find(u => 
              (u.rollNo || "").trim().toUpperCase() === "124UEC007"
            ) || users[0];
          }

          const activeProfile = {
            rollNo: targetUser.rollNo,
            name: targetUser.name,
            hostel: targetUser.hostel || "MEC",
            course: targetUser.course || "BE (ECE)",
            room: targetUser.room || "A108",
            phone: targetUser.phone || ""
          };

          setSelectedRoll(activeProfile.rollNo);
          setForm(activeProfile);

          // FIX: Strictly do NOT overwrite localStorage on load if it already matches!
          if (!savedSession) {
            localStorage.setItem("mei.profile", JSON.stringify(activeProfile));
            window.dispatchEvent(new Event("profile-updated"));
          }
        } else {
          // Absolute fallback if Firestore collection returns empty
          const absoluteFallback = {
            name: "ANANDHA KRISHNAN P",
            rollNo: "124UEC007",
            hostel: "MEC",
            course: "BE (ECE)",
            room: "A108",
            phone: "7540030095",
          };
          
          const savedSession = localStorage.getItem("mei.profile");
          if (!savedSession) {
            setFriendsList([absoluteFallback]);
            setSelectedRoll("124UEC007");
            setForm(absoluteFallback);
            localStorage.setItem("mei.profile", JSON.stringify(absoluteFallback));
            window.dispatchEvent(new Event("profile-updated"));
          } else {
            const parsed = JSON.parse(savedSession);
            setFriendsList([parsed]);
            setSelectedRoll(parsed.rollNo);
            setForm(parsed);
          }
        }
      } catch (err) {
        console.error("Critical roster initialization failure:", err);
      } finally {
        setLoading(false);
      }
    }
    loadRoster();
  }, []);

  // 2. Fetch and synchronize passes dynamically whenever you switch friends in the dropdown box
  const fetchUserPasses = async (currentRoll: string, currentName: string) => {
    try {
      const allPasses = await getPasses();
      const filtered = allPasses.filter((p) => {
        const passRoll = (p.ownerRoll || p.rollNumber || "").trim().toUpperCase();
        const passUser = (p.owner || p.user || "").trim().toLowerCase();
        
        return (
          passRoll === currentRoll.trim().toUpperCase() || 
          passUser === currentName.trim().toLowerCase()
        );
      });

      // SORTING LOGIC: Newest timestamp stamp values sit at the top
      const sortedByNewest = filtered.sort((a, b) => {
        const stampA = a.stamp || "";
        const stampB = b.stamp || "";
        return stampB.localeCompare(stampA);
      });

      setMyPasses(sortedByNewest);
    } catch (err) {
      console.error("Failed to load user records from Firestore:", err);
    }
  };

  useEffect(() => {
    if (form) {
      fetchUserPasses(form.rollNo, form.name);
    }
  }, [form?.rollNo, form?.name]);

  // Handle Switch Selection Changes inside friend drop box
  const handleFriendSwitch = (rollNo: string) => {
    const chosen = friendsList.find((u) => u.rollNo === rollNo);
    if (chosen) {
      const updatedProfile = {
        name: chosen.name,
        rollNo: chosen.rollNo,
        hostel: chosen.hostel || "MEC",
        course: chosen.course || "BE (ECE)",
        room: chosen.room || "",
        phone: chosen.phone || ""
      };
      
      setSelectedRoll(rollNo);
      setForm(updatedProfile);

      // Force instant storage update on dropdown manual select
      localStorage.setItem("mei.profile", JSON.stringify(updatedProfile));
      window.dispatchEvent(new Event("profile-updated"));
    }
  };

  const save = async () => {
    if (!form) return;
    const profileToSave = {
      name: form.name,
      rollNo: form.rollNo,
      hostel: form.hostel || "MEC",
      course: form.course || "BE (ECE)",
      room: form.room || "",
      phone: form.phone || ""
    };
    
    localStorage.setItem("mei.profile", JSON.stringify(profileToSave));
    window.dispatchEvent(new Event("profile-updated"));
    
    await updateUser(form.rollNo, { phone: form.phone, room: form.room });
    setSavedMsg("Profile entries updated successfully.");
    setTimeout(() => setSavedMsg(""), 2500);
  };

  if (loading || !form) {
    return (
      <div className="min-h-screen bg-[#f3eff5] flex items-center justify-center">
        <p className="text-gray-600 font-medium animate-pulse">Synchronizing Cloud Data Records...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3eff5]">
      <header className="bg-gradient-to-r from-[#1e6bb8] to-[#3a1a8a] px-4 py-4 flex items-center gap-4 shadow-md">
        <button onClick={() => navigate({ to: "/" })} aria-label="Back">
          <ArrowLeft className="h-6 w-6 text-white" />
        </button>
        <h1 className="text-white text-2xl font-bold flex-1">Manage</h1>
      </header>

      <div className="p-4 space-y-4">
        {/* Dropdown Selector Box */}
        <div className="bg-white rounded-2xl shadow p-4 flex items-center gap-3 border border-indigo-100">
          <div className="p-2 rounded-xl bg-indigo-50">
            <Users className="h-5 w-5 text-[#3a1a8a]" />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Select User Profile
            </label>
            <select
              value={selectedRoll}
              onChange={(e) => handleFriendSwitch(e.target.value)}
              className="w-full bg-transparent text-gray-800 font-bold text-base focus:outline-none cursor-pointer"
            >
              {friendsList.map((user) => (
                <option key={user.rollNo} value={user.rollNo}>
                  {user.name} ({user.rollNo})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Profile Details Form */}
        <div className="bg-white rounded-2xl shadow p-5 space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-bold text-[#1a1a6e]">Edit Profile Fields</h2>
          </div>
          
          {[
            { k: "name", label: "Full Name", locked: true },
            { k: "rollNo", label: "Roll Number", locked: true },
            { k: "hostel", label: "Hostel", locked: true },
            { k: "course", label: "Course", locked: true },
            { k: "room", label: "Room Number", locked: false },
            { k: "phone", label: "Phone Number", locked: false },
          ].map((f) => (
            <div key={f.k}>
              <label className="block text-sm text-gray-600 mb-1 flex items-center gap-1 font-medium">
                {f.label} {f.locked && <Lock className="h-3 w-3 text-gray-400" />}
              </label>
              <input
                value={(form[f.k as keyof UserProfile] ?? "") as string}
                onChange={(e) => setForm({ ...form, [f.k]: e.target.value })}
                readOnly={f.locked}
                className={`w-full border rounded-lg px-3 py-2 transition-colors ${
                  f.locked ? "bg-gray-100 text-gray-500 font-medium select-none" : "bg-white focus:border-indigo-500"
                }`}
              />
            </div>
          ))}
          
          {savedMsg && <p className="text-sm font-semibold text-green-600 animate-fade-in">{savedMsg}</p>}
          
          <button
            onClick={save}
            className="w-full bg-gradient-to-r from-[#1e6bb8] to-[#3a1a8a] text-white font-semibold py-3 rounded-lg shadow intense-button-effect"
          >
            Save Changes
          </button>
        </div>

        {/* Active Passes view */}
        <div className="bg-white rounded-2xl shadow p-5 space-y-3">
          <h2 className="text-lg font-bold text-[#1a1a6e]">My Passes View</h2>
          <p className="text-xs text-gray-500 font-medium">
            {form.name} · {form.rollNo} · Room {form.room || "Unassigned"}
          </p>
          
          {myPasses.length === 0 && (
            <p className="text-sm text-gray-500 py-6 text-center italic">No passes applied for this user yet.</p>
          )}
          
          {myPasses.map((p) => (
            <div key={p.id} className="relative border rounded-xl p-3 overflow-hidden shadow-sm bg-white">
              <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[#b8f5d8] rounded-l-[100%] opacity-60" aria-hidden />
              <div className="relative">
                <div className="flex items-center justify-between gap-2">
                  <div className="space-y-1 text-sm font-medium">
                    <div className="flex items-center gap-2 text-gray-800">
                      <Calendar className="h-4 w-4 text-gray-600" />
                      <span>{p.fromDate || p.from}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-800">
                      <Clock className="h-4 w-4 text-gray-600" />
                      <span>{p.toDate || p.to}</span>
                    </div>
                    <div className="text-xs font-semibold text-[#1a1a6e] bg-indigo-50 px-2 py-0.5 rounded-full inline-block mt-1">
                      {p.type} · <span className="text-emerald-700">{p.status}</span>
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      await deletePass(p.id);
                      await fetchUserPasses(form.rollNo, form.name);
                    }}
                    className="p-2 rounded-full bg-white hover:bg-red-50 border shadow-sm z-10 text-red-600 transition-colors"
                    aria-label="Delete pass"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}