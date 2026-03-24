import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { surveyType, answers } = await req.json();
    console.log("Received survey data:", surveyType, answers);

    let subject = "";
    let htmlBody = "";

    if (surveyType === "children") {
      subject = `Digital Safety Survey - Children (${new Date().toLocaleDateString("en-GB")})`;
      htmlBody = buildChildrenSurveyHtml(answers);
    } else if (surveyType === "parent") {
      subject = `Parent Questionnaire - Digital Wise Futures (${new Date().toLocaleDateString("en-GB")})`;
      htmlBody = buildParentSurveyHtml(answers);
    } else if (surveyType === "community") {
      subject = `Community Survey - Voices of Happiness (${new Date().toLocaleDateString("en-GB")})`;
      htmlBody = buildCommunitySurveyHtml(answers);
    } else {
      throw new Error("Unknown survey type");
    }

    const recipients = [
      "contactsandrapink@gmail.com",
      "happynesscome01@gmail.com",
    ];

    const emailResponse = await resend.emails.send({
      from: "Happiness Comes First <noreply@happynesscomefirst.com>",
      to: recipients,
      subject,
      html: htmlBody,
    });

    console.log("Survey email sent:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-survey:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatAnswer(val: any): string {
  if (Array.isArray(val)) return val.map(escapeHtml).join(", ");
  if (typeof val === "string") return escapeHtml(val);
  if (typeof val === "boolean") return val ? "Yes" : "No";
  return String(val);
}

function buildChildrenSurveyHtml(a: Record<string, any>): string {
  return `
    <!DOCTYPE html><html><head><style>
      body{font-family:Arial,sans-serif;color:#333;line-height:1.6}
      .container{max-width:600px;margin:0 auto;padding:20px}
      h1{color:#FF1493;border-bottom:2px solid #FF1493;padding-bottom:10px}
      .field{margin:8px 0;padding:10px;background:#f9f9f9;border-radius:5px}
      .label{font-weight:bold;color:#666}.value{color:#333}
      .footer{margin-top:30px;padding-top:20px;border-top:1px solid #ddd;color:#666;font-size:12px}
    </style></head><body><div class="container">
      <h1>🛡️ Digital Safety Survey – Children & Young People</h1>
      <p>A new survey response has been submitted.</p>
      <div class="field"><span class="label">Age:</span> <span class="value">${formatAnswer(a.age)}</span></div>
      <div class="field"><span class="label">Gender:</span> <span class="value">${formatAnswer(a.gender)}</span></div>
      <div class="field"><span class="label">Social media platforms used:</span> <span class="value">${formatAnswer(a.platforms)}</span></div>
      <div class="field"><span class="label">Hours per day on social media:</span> <span class="value">${formatAnswer(a.hoursPerDay)}</span></div>
      <div class="field"><span class="label">When they use social media most:</span> <span class="value">${formatAnswer(a.peakUsage)}</span></div>
      <div class="field"><span class="label">Experienced negative behaviour online:</span> <span class="value">${formatAnswer(a.negativeExperience)}</span></div>
      ${a.negativeTypes?.length ? `<div class="field"><span class="label">Types of negative behaviour:</span> <span class="value">${formatAnswer(a.negativeTypes)}</span></div>` : ""}
      <div class="field"><span class="label">Feels safe online:</span> <span class="value">${formatAnswer(a.feelsSafe)}</span></div>
      <div class="field"><span class="label">Knows who to talk to if something bad happens:</span> <span class="value">${formatAnswer(a.knowsWhoToTalkTo)}</span></div>
      <div class="field"><span class="label">Would like to learn more about staying safe online:</span> <span class="value">${formatAnswer(a.wantsToLearn)}</span></div>
      ${a.additionalComments ? `<div class="field"><span class="label">Additional comments:</span> <span class="value">${formatAnswer(a.additionalComments)}</span></div>` : ""}
      <div class="footer">
        <p>Submitted on: ${new Date().toLocaleString("en-GB", { timeZone: "Europe/London" })}</p>
        <p>Happiness Comes First – Digital Safety Survey</p>
      </div>
    </div></body></html>`;
}

function buildParentSurveyHtml(a: Record<string, any>): string {
  return `
    <!DOCTYPE html><html><head><style>
      body{font-family:Arial,sans-serif;color:#333;line-height:1.6}
      .container{max-width:600px;margin:0 auto;padding:20px}
      h1{color:#FF1493;border-bottom:2px solid #FF1493;padding-bottom:10px}
      h2{color:#DB2777;margin-top:20px}
      .field{margin:8px 0;padding:10px;background:#f9f9f9;border-radius:5px}
      .label{font-weight:bold;color:#666}.value{color:#333}
      .footer{margin-top:30px;padding-top:20px;border-top:1px solid #ddd;color:#666;font-size:12px}
    </style></head><body><div class="container">
      <h1>👨‍👩‍👧 Parent Questionnaire – Digital Wise Futures</h1>
      <p>A new parent questionnaire has been submitted.</p>

      <h2>Section 1: About the Child</h2>
      <div class="field"><span class="label">Child's age:</span> <span class="value">${formatAnswer(a.childAge)}</span></div>
      <div class="field"><span class="label">Completing as:</span> <span class="value">${formatAnswer(a.completingAs)}${a.completingAsOther ? " – " + formatAnswer(a.completingAsOther) : ""}</span></div>
      <div class="field"><span class="label">Child's gender:</span> <span class="value">${formatAnswer(a.childGender)}${a.childGenderOther ? " – " + formatAnswer(a.childGenderOther) : ""}</span></div>

      <h2>Section 2: Social Media Use</h2>
      <div class="field"><span class="label">Platforms used:</span> <span class="value">${formatAnswer(a.platforms)}${a.platformsOther ? " + " + formatAnswer(a.platformsOther) : ""}</span></div>
      <div class="field"><span class="label">Hours per day:</span> <span class="value">${formatAnswer(a.hoursPerDay)}</span></div>
      <div class="field"><span class="label">Peak usage time:</span> <span class="value">${formatAnswer(a.peakUsage)}</span></div>

      <h2>Section 3: Online Experiences</h2>
      <div class="field"><span class="label">Experienced negative behaviour:</span> <span class="value">${formatAnswer(a.negativeExperience)}</span></div>
      ${a.negativeTypes?.length ? `<div class="field"><span class="label">Types:</span> <span class="value">${formatAnswer(a.negativeTypes)}</span></div>` : ""}

      <h2>Section 4: Impact on Wellbeing</h2>
      <div class="field"><span class="label">Social media affects wellbeing:</span> <span class="value">${formatAnswer(a.wellbeingImpact)}</span></div>
      ${a.wellbeingSigns?.length ? `<div class="field"><span class="label">Signs noticed:</span> <span class="value">${formatAnswer(a.wellbeingSigns)}</span></div>` : ""}

      <h2>Section 5: Parental Confidence</h2>
      <div class="field"><span class="label">Confidence level:</span> <span class="value">${formatAnswer(a.confidenceLevel)}</span></div>
      ${a.toolsUsed?.length ? `<div class="field"><span class="label">Tools currently used:</span> <span class="value">${formatAnswer(a.toolsUsed)}</span></div>` : ""}

      <h2>Section 6: Education & Support Needs</h2>
      ${a.supportNeeds?.length ? `<div class="field"><span class="label">Wants support on:</span> <span class="value">${formatAnswer(a.supportNeeds)}</span></div>` : ""}

      <h2>Section 7: Community Programmes</h2>
      <div class="field"><span class="label">Interested in workshops:</span> <span class="value">${formatAnswer(a.interestedInWorkshops)}</span></div>
      ${a.beneficiaries?.length ? `<div class="field"><span class="label">Who would benefit most:</span> <span class="value">${formatAnswer(a.beneficiaries)}</span></div>` : ""}

      ${a.contactName || a.contactInfo ? `
      <h2>Contact (Optional)</h2>
      ${a.contactName ? `<div class="field"><span class="label">Name:</span> <span class="value">${formatAnswer(a.contactName)}</span></div>` : ""}
      ${a.contactInfo ? `<div class="field"><span class="label">Email / Phone:</span> <span class="value">${formatAnswer(a.contactInfo)}</span></div>` : ""}
      ` : ""}

      <div class="footer">
        <p>Submitted on: ${new Date().toLocaleString("en-GB", { timeZone: "Europe/London" })}</p>
        <p>Happiness Comes First – Digital Wise Futures</p>
      </div>
    </div></body></html>`;
}

function buildCommunitySurveyHtml(a: Record<string, any>): string {
  return `
    <!DOCTYPE html><html><head><style>
      body{font-family:Arial,sans-serif;color:#333;line-height:1.6}
      .container{max-width:600px;margin:0 auto;padding:20px}
      h1{color:#FF1493;border-bottom:2px solid #FF1493;padding-bottom:10px}
      h2{color:#DB2777;margin-top:20px}
      .field{margin:8px 0;padding:10px;background:#f9f9f9;border-radius:5px}
      .label{font-weight:bold;color:#666}.value{color:#333}
      .footer{margin-top:30px;padding-top:20px;border-top:1px solid #ddd;color:#666;font-size:12px}
    </style></head><body><div class="container">
      <h1>💪 Community Survey – Voices of Happiness</h1>
      <p>A new community survey response has been submitted.</p>

      <h2>Section 1: About You</h2>
      <div class="field"><span class="label">Age group:</span> <span class="value">${formatAnswer(a.ageGroup)}</span></div>
      <div class="field"><span class="label">Describes as:</span> <span class="value">${formatAnswer(a.describes)}${a.describesOther ? " – " + formatAnswer(a.describesOther) : ""}</span></div>
      <div class="field"><span class="label">Current fitness level:</span> <span class="value">${formatAnswer(a.fitnessLevel)}</span></div>

      <h2>Section 2: Barriers to Fitness</h2>
      ${a.barriers?.length ? `<div class="field"><span class="label">Barriers:</span> <span class="value">${formatAnswer(a.barriers)}</span></div>` : ""}
      ${a.comfortFactors?.length ? `<div class="field"><span class="label">Comfort factors:</span> <span class="value">${formatAnswer(a.comfortFactors)}</span></div>` : ""}

      <h2>Section 3: Mental Wellbeing</h2>
      <div class="field"><span class="label">Fitness improves wellbeing:</span> <span class="value">${formatAnswer(a.fitnessImprovesWellbeing)}</span></div>
      ${a.challenges?.length ? `<div class="field"><span class="label">Challenges experienced:</span> <span class="value">${formatAnswer(a.challenges)}</span></div>` : ""}

      <h2>Section 4: What Women Want</h2>
      ${a.desiredActivities?.length ? `<div class="field"><span class="label">Desired activities:</span> <span class="value">${formatAnswer(a.desiredActivities)}</span></div>` : ""}
      ${a.preferredTime?.length ? `<div class="field"><span class="label">Preferred time:</span> <span class="value">${formatAnswer(a.preferredTime)}</span></div>` : ""}
      ${a.preferredLocation?.length ? `<div class="field"><span class="label">Preferred location:</span> <span class="value">${formatAnswer(a.preferredLocation)}</span></div>` : ""}

      <h2>Section 5: Voices of Happiness Programme</h2>
      <div class="field"><span class="label">Interested in programme:</span> <span class="value">${formatAnswer(a.interestedInProgramme)}</span></div>
      ${a.attendanceFactors?.length ? `<div class="field"><span class="label">Attendance factors:</span> <span class="value">${formatAnswer(a.attendanceFactors)}</span></div>` : ""}
      <div class="field"><span class="label">Enough opportunities in community:</span> <span class="value">${formatAnswer(a.enoughOpportunities)}</span></div>
      ${a.communityBenefit ? `<div class="field"><span class="label">How programmes could benefit women:</span> <span class="value">${formatAnswer(a.communityBenefit)}</span></div>` : ""}

      ${a.contactName || a.contactInfo ? `
      <h2>Contact (Optional)</h2>
      ${a.contactName ? `<div class="field"><span class="label">Name:</span> <span class="value">${formatAnswer(a.contactName)}</span></div>` : ""}
      ${a.contactInfo ? `<div class="field"><span class="label">Email / Phone:</span> <span class="value">${formatAnswer(a.contactInfo)}</span></div>` : ""}
      ` : ""}

      <div class="footer">
        <p>Submitted on: ${new Date().toLocaleString("en-GB", { timeZone: "Europe/London" })}</p>
        <p>Happiness Comes First – Voices of Happiness</p>
      </div>
    </div></body></html>`;
}

serve(handler);
