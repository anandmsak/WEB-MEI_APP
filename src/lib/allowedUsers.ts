// Hardcoded list of users allowed to apply passes / edit profile.
// Names are matched case-insensitively. Roll numbers matched exactly (upper-cased).

export interface AllowedUser {
  name: string;
  rollNo: string;
}

export const ALLOWED_USERS: AllowedUser[] = [
  { name: "ANANDHA KRISHNAN P", rollNo: "124UEC007" },
  { name: "ARJUN R",            rollNo: "124UEC012" },
  { name: "HARISH S",           rollNo: "124UEC025" },
  { name: "KARTHIK M",          rollNo: "124UEC031" },
  { name: "NAVEEN K",           rollNo: "124UEC044" },
  { name: "SANJAY P",           rollNo: "124UEC058" },
  { name: "VIGNESH R",          rollNo: "124UEC071" },
];

export function isAllowed(name?: string, rollNo?: string): boolean {
  if (!name && !rollNo) return false;
  const n = (name ?? "").trim().toLowerCase();
  const r = (rollNo ?? "").trim().toUpperCase();
  return ALLOWED_USERS.some(
    (u) => u.name.toLowerCase() === n || u.rollNo.toUpperCase() === r,
  );
}