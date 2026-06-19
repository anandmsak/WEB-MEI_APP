import { useEffect, useState } from "react";
import { db } from "./firebaseConfig";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";

export interface Pass {
  id: string;         // Kept strictly as a string so your React UI 'key={pass.id}' never breaks
  fromDate: string;
  fromTime: string;
  toDate: string;
  toTime: string;
  stamp: string;
  type: string;
  reason: string;
  status: string;     // "Approved" | "Pending" | "Verified"
  owner?: string;     // profile name
  ownerRoll?: string; // roll number
  ownerRoom?: string; // room number
}

// 1. Add a new pass and cleanly return it with its Firestore ID immediately
export async function addPass(pass: Omit<Pass, "id"> & { id?: string }): Promise<Pass> {
  console.log("[passes] addPass", pass);
  
  // Strip out any temporary client-side ID before saving to Firestore
  const { id, ...cleanPass } = pass; 
  const docRef = await addDoc(collection(db, "passes"), cleanPass);
  
  // Return the complete Pass item matching your original function signature
  return {
    id: docRef.id,
    ...cleanPass
  } as Pass;
}

// 2. Get all passes from Firestore
export async function getPasses(): Promise<Pass[]> {
  console.log("[passes] getPasses");
  const snap = await getDocs(collection(db, "passes"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Pass));
}

// 3. Delete a pass by ID
export async function deletePass(id: string): Promise<void> {
  console.log("[passes] deletePass", id);
  await deleteDoc(doc(db, "passes", id));
}

// 4. Upgraded React hook to safely auto-load passes with error handling & unmount protection
export function usePasses(): Pass[] {
  const [list, setList] = useState<Pass[]>([]);
  
  useEffect(() => {
    let active = true;
    
    async function load() {
      try {
        const data = await getPasses();
        if (active) setList(data);
      } catch (err) {
        console.error("Failed to fetch passes from Firestore:", err);
      }
    }
    
    load();
    return () => { active = false; }; // Prevents memory leaks if user leaves the page mid-fetch
  }, []);

  return list;
}