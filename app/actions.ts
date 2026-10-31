"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { checkCredentials, endSession, requireAdmin, startSession } from "@/lib/auth";
import { getDb, seed } from "@/lib/db";
import { createEnquiry, STATUSES, updateEnquiry } from "@/lib/enquiries";

export interface FormState {
  ok?: boolean;
  error?: string;
  fields?: Record<string, string>;
}

const today = () => new Date().toISOString().slice(0, 10);

const enquirySchema = z.object({
  propertyId: z.coerce.number().int().positive().nullable(),
  name: z.string().trim().min(2, "Please enter your name").max(80),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9 ()-]{7,20}$/, "Please enter a valid phone number"),
  email: z.union([z.literal(""), z.email("Please enter a valid email")]),
  message: z.string().trim().max(1000, "Message is too long"),
  preferredDate: z.union([
    z.literal(""),
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((d) => d >= today(), "Choose today or a later date"),
  ]),
});

/** Public enquiry form: property page and the general contact form. */
export async function submitEnquiry(_prev: FormState, form: FormData): Promise<FormState> {
  // Honeypot: real visitors never fill this hidden field.
  if (form.get("company")) return { ok: true };

  const raw = {
    propertyId: form.get("propertyId") || null,
    name: String(form.get("name") ?? ""),
    phone: String(form.get("phone") ?? ""),
    email: String(form.get("email") ?? ""),
    message: String(form.get("message") ?? ""),
    preferredDate: String(form.get("preferredDate") ?? ""),
  };
  const parsed = enquirySchema.safeParse(raw);
  if (!parsed.success) {
    const fields = Object.fromEntries(parsed.error.issues.map((i) => [String(i.path[0]), i.message]));
    return { error: "Please check the highlighted fields.", fields };
  }
  const d = parsed.data;
  await createEnquiry({
    propertyId: d.propertyId,
    name: d.name,
    phone: d.phone,
    email: d.email || null,
    message: d.message,
    preferredDate: d.preferredDate || null,
  });
  revalidatePath("/admin");
  return { ok: true };
}

export async function login(_prev: FormState, form: FormData): Promise<FormState> {
  if (!checkCredentials(String(form.get("email") ?? ""), String(form.get("password") ?? ""))) {
    return { error: "Wrong email or password." };
  }
  await startSession();
  redirect("/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}

export async function saveEnquiry(form: FormData) {
  await requireAdmin();
  const id = Number(form.get("id"));
  const status = String(form.get("status"));
  const note = String(form.get("note") ?? "").trim().slice(0, 500);
  if (!Number.isInteger(id) || !(STATUSES as readonly string[]).includes(status)) return;
  await updateEnquiry(id, status as (typeof STATUSES)[number], note);
  revalidatePath("/admin");
  revalidatePath(`/admin/enquiries/${id}`);
}

/** Puts the demo leads back to their original state, so every visitor sees a clean demo. */
export async function resetDemo() {
  await requireAdmin();
  const db = await getDb();
  await db.query("DELETE FROM enquiries");
  await seed(db, { enquiriesOnly: true });
  revalidatePath("/admin");
  redirect("/admin");
}
