// User storage stub — to be wired to Firestore `users` collection later.
import type { Profile } from "@/lib/profile";

export async function updateUser(uid: string, patch: Partial<Profile>): Promise<void> {
  console.log("[users] updateUser", uid, patch);
  // TODO: await updateDoc(doc(db, "users", uid), patch)
}

export async function getUser(uid: string): Promise<Profile | null> {
  console.log("[users] getUser", uid);
  // TODO: const snap = await getDoc(doc(db, "users", uid)); return snap.data() as Profile
  return null;
}