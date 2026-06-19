import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck, Lock, Trash2, Calendar, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { loadProfile, saveProfile, type Profile } from "@/lib/profile";
import { isAllowed, ALLOWED_USERS } from "@/lib/allowedUsers";
import { getPasses, deletePass, type Pass } from "@/lib/passes";
import { updateUser } from "@/lib/users";

export const Route = createFileRoute("/manage")({
  head: () => ({ meta: [{ title: "Manage - MEI Hostel" }] }),
  component: ManagePage,
});

function ManagePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<Profile>(() => loadProfile());
  const [savedMsg, setSavedMsg] = useState("");
  const [myPasses, setMyPasses] = useState<Pass[]>([]);
  const allowed = isAllowed(form.name, form.rollNo);

  // Sync engine to get and filter user passes directly from Firestore
  const fetchUserPasses = async () => {
    try {
      const allPasses = await getPasses();
      const filtered = allPasses.filter(
        (p) =>
          (p.owner ?? "").trim().toLowerCase() === form.name.trim().toLowerCase() ||
          (p.ownerRoll ?? "").trim().toUpperCase() === form.rollNo.trim().toUpperCase()
      );
      setMyPasses(filtered);
    } catch (err) {
      console.error("Failed to load user passes from Firestore:", err);
    }
  };

  useEffect(() => {
    if (allowed) {
      fetchUserPasses();
    }
  }, [form.name, form.rollNo, allowed]);

  const save = async () => {
    saveProfile(form);
    await updateUser(form.rollNo, { phone: form.phone, room: form.room });
    setSavedMsg("Profile updated successfully.");
    setTimeout(() => setSavedMsg(""), 2500);
  };

  const upd = (k: keyof Profile) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const onDelete = async (id: string, owner?: string, ownerRoll?: string) => {
    // Identity guard: only the logged-in user can delete their own pass.
    const sameName = (owner ?? "").trim().toLowerCase() === form.name.trim().toLowerCase();
    const sameRoll = (ownerRoll ?? "").trim().toUpperCase() === form.rollNo.trim().toUpperCase();
    if (!sameName && !sameRoll) return;

    try {
      await deletePass(id);
      // Instantly update the local UI view state without forcing a manual page refresh
      await fetchUserPasses();
    } catch (err) {
      console.error("Failed to delete pass from Firestore:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3eff5]">
      <header className="bg-gradient-to-r from-[#1e6bb8] to-[#3a1a8a] px-4 py-4 flex items-center gap-4">
        <button onClick={() => navigate({ to: "/" })} aria-label="Back">
          <ArrowLeft className="h-6 w-6 text-white" />
        </button>
        <h1 className="text-white text-2xl font-bold">Manage</h1>
      </header>

      <div className="p-4">
        {!allowed ? (
          <div className="bg-white rounded-2xl shadow p-6 mt-6">
            <div className="flex justify-center mb-3">
              <div className="w-14 h-14 rounded-full bg-[#e8eefc] flex items-center justify-center">
                <Lock className="h-7 w-7 text-[#1e6bb8]" />
              </div>
            </div>
            <h2 className="text-center text-lg font-bold text-[#1a1a6e]">Editing Locked</h2>
            <p className="text-center text-gray-600 text-sm mt-2">
              Only approved users can edit profile details. Your current profile is not in the allowed list.
            </p>
            <div className="mt-4 text-xs text-gray-500">
              <p className="font-medium text-gray-700 mb-1">Approved users:</p>
              <ul className="list-disc list-inside space-y-0.5">
                {ALLOWED_USERS.map((u) => (
                  <li key={u.rollNo}>{u.name} ({u.rollNo})</li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-2xl shadow p-5 mt-4 space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-green-600" />
                <h2 className="text-lg font-bold text-[#1a1a6e]">Edit Profile</h2>
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
                  <label className="block text-sm text-gray-600 mb-1 flex items-center gap-1">
                    {f.label} {f.locked && <Lock className="h-3 w-3 text-gray-400" />}
                  </label>
                  <input
                    value={form[f.k as keyof Profile] ?? ""}
                    onChange={upd(f.k as keyof Profile)}
                    readOnly={f.locked}
                    className={`w-full border rounded-lg px-3 py-2 ${f.locked ? "bg-gray-100 text-gray-500" : ""}`}
                  />
                </div>
              ))}
              {savedMsg && <p className="text-sm text-green-600">{savedMsg}</p>}
              <button
                onClick={save}
                className="w-full bg-gradient-to-r from-[#1e6bb8] to-[#3a1a8a] text-white font-semibold py-3 rounded-lg shadow"
              >
                Save Changes
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow p-5 mt-4 space-y-3">
              <h2 className="text-lg font-bold text-[#1a1a6e]">My Passes</h2>
              <p className="text-xs text-gray-500">
                {form.name} · {form.rollNo} · Room {form.room}
              </p>
              {myPasses.length === 0 && (
                <p className="text-sm text-gray-500 py-4 text-center">No passes applied yet.</p>
              )}
              {myPasses.map((p) => (
                <div key={p.id} className="relative border rounded-xl p-3 overflow-hidden">
                  <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[#b8f5d8] rounded-l-[100%]" aria-hidden />
                  <div className="relative">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-600" />
                          <span>{p.fromDate}</span>
                          <Clock className="h-4 w-4 text-gray-600 ml-1" />
                          <span>{p.fromTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-600" />
                          <span>{p.toDate}</span>
                          <Clock className="h-4 w-4 text-gray-600 ml-1" />
                          <span>{p.toTime}</span>
                        </div>
                        <div className="text-xs text-gray-600">{p.type} · {p.status}</div>
                      </div>
                      <button
                        onClick={() => onDelete(p.id, p.owner, p.ownerRoll)}
                        className="p-2 rounded-full bg-white hover:bg-red-50 shadow-sm z-10"
                        aria-label="Delete pass"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}