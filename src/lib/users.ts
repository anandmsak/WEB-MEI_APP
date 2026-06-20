import { db } from "./firebaseConfig";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

export interface UserProfile {
  name: string;
  rollNo: string;
  phone: string;
  room?: string;
  hostel?: string;
  course?: string;
}

export async function getFirestoreUsers(): Promise<UserProfile[]> {
  try {
    const snap = await getDocs(collection(db, "users"));
    return snap.docs.map((d) => {
      const data = d.data();
      
      // Ensures number fields get cleanly converted to string formats
      const databasePhone = data.phone !== undefined && data.phone !== null ? data.phone : "";
      const safePhoneString = String(databasePhone).trim();

      return {
        rollNo: d.id, 
        name: data.name || d.id,
        phone: safePhoneString,
        room: data.room || "",
        hostel: data.hostel || "MEC",
        course: data.course || "BE (ECE)"
      };
    });
  } catch (err) {
    console.error("Error reading users from cloud database:", err);
    return [];
  }
}

export async function updateUser(rollNo: string, data: Partial<UserProfile>): Promise<void> {
  try {
    const userRef = doc(db, "users", rollNo);
    await updateDoc(userRef, data);
  } catch (err) {
    console.error("Failed to sync profile update upstream:", err);
  }
}