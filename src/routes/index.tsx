import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Menu, User, Info, BellPlus, QrCode, UtensilsCrossed, KeyRound, UserCircle, LogOut, Settings } from "lucide-react";
import logo from "@/assets/mei-logo.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard - MEI Hostel" },
      { name: "description", content: "MEI Hostel dashboard" },
    ],
  }),
  component: Dashboard,
});

// Helper function to read storage instantly before the component mounts
const getSavedProfileOrDefault = () => {
  const fallback = {
    name: "ANANDHA KRISHNAN P",
    rollNo: "124UEC007",
    hostel: "MEC",
    course: "BE (ECE)",
    room: "A108",
    phone: "7540030095",
  };
  
  if (typeof window === "undefined") return fallback;
  try {
    const data = localStorage.getItem("mei.profile");
    if (data) {
      return { ...fallback, ...JSON.parse(data) };
    }
  } catch (e) {
    console.error("Dashboard early sync error:", e);
  }
  return fallback;
};

function Dashboard() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  
  // ✅ FIX: Directly initialize with the cached storage data immediately on render
  const [profile, setProfile] = useState(getSavedProfileOrDefault);

  const syncDashboardProfile = () => {
    try {
      const data = localStorage.getItem("mei.profile");
      if (data) {
        setProfile(JSON.parse(data));
      }
    } catch (e) {
      console.error("Dashboard sync error:", e);
    }
  };

  // Keep state matching if changes occur while the page remains active
  useEffect(() => {
    syncDashboardProfile();

    window.addEventListener("profile-updated", syncDashboardProfile);
    window.addEventListener("storage", syncDashboardProfile);
    
    return () => {
      window.removeEventListener("profile-updated", syncDashboardProfile);
      window.removeEventListener("storage", syncDashboardProfile);
    };
  }, []);

  const items = [
    { icon: User, label: "Request List", onClick: () => navigate({ to: "/request" }) },
    { icon: Info, label: "Pass Timing", onClick: () => navigate({ to: "/pass-timing" }) },
    { icon: BellPlus, label: "Emergency Request", onClick: () => navigate({ to: "/emergency-request" }) },
    { icon: QrCode, label: "Parcel Scan" },
    { icon: UtensilsCrossed, label: "Food Choice", onClick: () => navigate({ to: "/food-choice" }) },
    { icon: Settings, label: "Manage", onClick: () => navigate({ to: "/manage" }) },
    { icon: KeyRound, label: "Change Password" },
    { icon: UserCircle, label: "Profile", onClick: () => navigate({ to: "/profile" }) },
    { icon: LogOut, label: "Logout" },
  ];

  return (
    <div className="min-h-screen bg-[#f3eff5] relative overflow-hidden">
      <header className="bg-gradient-to-r from-[#1e6bb8] to-[#3a1a8a] px-4 py-4 flex items-center gap-4">
        <button onClick={() => setOpen(true)} aria-label="Open menu">
          <Menu className="h-6 w-6 text-white" />
        </button>
        <h1 className="text-white text-2xl font-bold">Dashboard</h1>
      </header>
      
      <div className="flex items-start gap-4 px-6 pt-8">
        <img src={logo} alt="MEI Hostel" width={100} height={100} className="w-24 h-24 object-contain" />
        <div className="pt-2">
          <p className="text-black text-lg">Welcome</p>
          <Link to="/request" className="block mt-4 text-[#1a1a6e] text-xl font-medium tracking-wide hover:underline">
            {profile.name}
          </Link>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-[78%] max-w-sm bg-[#3a3a3a] h-full flex flex-col shadow-xl">
            <div className="bg-gradient-to-r from-[#1e6bb8] to-[#3a1a8a] p-4">
              <div className="bg-white w-20 h-20 rounded-md flex items-center justify-center p-2">
                <img src={logo} alt="MEI Hostel" width={80} height={80} className="w-full h-full object-contain" />
              </div>
              <p className="text-white mt-2 text-base">MEI Hostel</p>
            </div>
            <nav className="flex-1 py-4">
              {items.map((it) => (
                <button
                  key={it.label}
                  onClick={() => {
                    setOpen(false);
                    it.onClick?.();
                  }}
                  className="w-full flex items-center gap-6 px-6 py-4 text-white text-lg hover:bg-white/10"
                >
                  <it.icon className="h-6 w-6" />
                  <span>{it.label}</span>
                </button>
              ))}
            </nav>
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}