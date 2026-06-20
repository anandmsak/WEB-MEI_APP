import { useEffect, useState } from "react";

export interface Profile {
  name: string;
  rollNo: string;
  hostel: string;
  course: string;
  room: string;
  phone: string;
}

export const DEFAULT_PROFILE: Profile = {
  name: "ANANDHA KRISHNAN P",
  rollNo: "124UEC007",
  hostel: "MEC",
  course: "BE (ECE)",
  room: "A108",
  phone: "7540030095",
};

const KEY = "mei.profile";

export function loadProfile(): Profile {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT_PROFILE;
}

export function saveProfile(p: Profile) {
  localStorage.setItem(KEY, JSON.stringify(p));
  window.dispatchEvent(new Event("profile-updated"));
}

export function useProfile(): Profile {
  const [p, setP] = useState<Profile>(DEFAULT_PROFILE);

  useEffect(() => {
    setP(loadProfile());
    
    const handleUpdate = () => {
      setP(loadProfile());
    };

    window.addEventListener("profile-updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    
    return () => {
      window.removeEventListener("profile-updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return p;
}