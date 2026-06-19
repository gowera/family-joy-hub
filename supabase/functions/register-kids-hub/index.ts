// Edge function: register-kids-hub
// Validates input and inserts parent/child/enrollment with service-role privileges,
// so anonymous users do not need direct table-write access.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const isStr = (v: unknown, min = 1, max = 500) =>
  typeof v === "string" && v.trim().length >= min && v.trim().length <= max;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let body: any;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const {
    childName,
    childAge,
    sessionTime,
    daysAttending,
    parentName,
    contactNumber,
    email,
    hasAllergies,
    allergiesDetails,
    hasMedication,
    medicationDetails,
    photoConsent,
  } = body ?? {};

  // Validation
  if (!isStr(childName, 2, 100)) return json({ error: "Invalid child name" }, 400);
  if (!isStr(parentName, 2, 100)) return json({ error: "Invalid parent name" }, 400);
  if (!isStr(email, 5, 255) || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
    return json({ error: "Invalid email" }, 400);
  if (!isStr(contactNumber, 6, 30)) return json({ error: "Invalid phone" }, 400);
  if (!Array.isArray(daysAttending) || daysAttending.some((d) => !isStr(d, 1, 30)))
    return json({ error: "Invalid days" }, 400);
  const ageNum = parseInt(String(childAge ?? ""), 10);
  if (!Number.isFinite(ageNum) || ageNum < 1 || ageNum > 18)
    return json({ error: "Invalid child age" }, 400);
  if (sessionTime && !isStr(sessionTime, 1, 100))
    return json({ error: "Invalid session" }, 400);
  if (hasAllergies && !isStr(allergiesDetails, 1, 1000))
    return json({ error: "Invalid allergies details" }, 400);
  if (hasMedication && !isStr(medicationDetails, 1, 1000))
    return json({ error: "Invalid medication details" }, 400);

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });

  try {
    // 1. Find or create parent (by email)
    let parentId: string;
    const { data: existing } = await supabase
      .from("parents")
      .select("id")
      .eq("email", email.trim())
      .maybeSingle();

    if (existing) {
      parentId = existing.id;
    } else {
      const { data: newParent, error: pErr } = await supabase
        .from("parents")
        .insert({
          full_name: parentName.trim(),
          email: email.trim(),
          phone: contactNumber.trim(),
        })
        .select("id")
        .single();
      if (pErr) throw pErr;
      parentId = newParent.id;
    }

    // 2. Child DOB from age
    const dob = `${new Date().getFullYear() - ageNum}-01-01`;
    const { data: newChild, error: cErr } = await supabase
      .from("children")
      .insert({
        full_name: childName.trim(),
        parent_id: parentId,
        date_of_birth: dob,
        photo_consent: !!photoConsent,
        allergies: hasAllergies ? allergiesDetails.trim() : null,
        medication: hasMedication ? medicationDetails.trim() : null,
      })
      .select("id")
      .single();
    if (cErr) throw cErr;

    // 3. Enrollment in first program (if any)
    const { data: programs } = await supabase
      .from("programs")
      .select("id")
      .limit(1);

    if (programs && programs.length > 0) {
      const { error: eErr } = await supabase.from("enrollments").insert({
        child_id: newChild.id,
        program_id: programs[0].id,
        days_attending: daysAttending,
        status: "active",
        start_date: new Date().toISOString().split("T")[0],
        notes: sessionTime ? `Session: ${sessionTime}` : null,
      });
      if (eErr) throw eErr;
    }

    return json({ ok: true });
  } catch (err) {
    console.error("register-kids-hub error", err);
    return json({ error: "Could not complete registration. Please try again later." }, 500);
  }
});
