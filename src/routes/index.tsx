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
    { icon: QrCode, label: "Parcel Scan", onClick: () => navigate({ to: "/parcel-scan" }) },
    { icon: UtensilsCrossed, label: "Food Choice", onClick: () => navigate({ to: "/food-choice" }) },
    { icon: Settings, label: "Manage", onClick: () => navigate({ to: "/manage" }) },
    { icon: KeyRound, label: "Change Password" },
    { icon: UserCircle, label: "Profile", onClick: () => navigate({ to: "/profile" }) },
    { icon: LogOut, label: "Logout" },
  ];

  return (
    <div className="min-h-screen bg-[#f5f2f7] relative overflow-hidden font-sans antialiased">
      <header className="bg-gradient-to-r from-[#1e6bb8] to-[#3a1a8a] px-4 py-4 flex items-center gap-4 shadow-sm">
        <button onClick={() => setOpen(true)} aria-label="Open menu">
          <Menu className="h-6 w-6 text-white" />
        </button>
        <h1 className="text-white text-xl font-semibold tracking-wide">Dashboard</h1>
      </header>
      
      <div className="flex items-start gap-4 px-6 pt-8">
        <img src={logo} alt="MEI Hostel" width={100} height={100} className="w-24 h-24 object-contain" />
        <div className="pt-2">
          <p className="text-gray-800 text-base font-normal">Welcome</p>
          <Link to="/request" className="block mt-2 text-[#1a1a6e] text-xl font-semibold tracking-wide hover:underline">
            {profile.name}
          </Link>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-[78%] max-w-sm bg-[#2b2b2b] h-full flex flex-col shadow-2xl transition-transform duration-300">
            <div className="bg-gradient-to-r from-[#1e6bb8] to-[#3a1a8a] p-5 pt-6 pb-6 flex flex-col items-start">
              <div className="bg-white w-20 h-20 rounded-none flex items-center justify-center p-1.5 shadow-md">
                <img src={logo} alt="MEI Hostel" className="w-full h-full object-contain" />
              </div>
              <p className="text-white mt-3 text-base font-semibold tracking-wide">MEI Hostel</p>
            </div>
            
            <nav className="flex-1 py-2 overflow-y-auto">
              {items.map((it) => (
                <button
                  key={it.label}
                  onClick={() => {
                    setOpen(false);
                    it.onClick?.();
                  }}
                  className="w-full flex items-center gap-6 px-6 py-3.5 text-gray-100 text-[16px] font-light tracking-wide hover:bg-white/5 transition-colors text-left"
                >
                  <it.icon className="h-5 w-5 text-gray-300" strokeWidth={1.75} />
                  <span>{it.label}</span>
                </button>
              ))}
            </nav>
          </div>
          <div className="flex-1 bg-black/40 backdrop-blur-xs" onClick={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}