import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ConsentFormRequest {
  childName: string;
  childAge: string;
  sessionTime: string;
  daysAttending: string[];
  parentName: string;
  contactNumber: string;
  email: string;
  hasAllergies: boolean;
  allergiesDetails: string;
  hasMedication: boolean;
  medicationDetails: string;
  photoConsent: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData: ConsentFormRequest = await req.json();
    console.log("Received consent form data:", formData);

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          h1 { color: #FF1493; border-bottom: 2px solid #FF1493; padding-bottom: 10px; }
          h2 { color: #00CED1; margin-top: 25px; }
          .field { margin: 10px 0; padding: 10px; background: #f9f9f9; border-radius: 5px; }
          .label { font-weight: bold; color: #666; }
          .value { color: #333; }
          .consent-yes { color: #22c55e; font-weight: bold; }
          .consent-no { color: #ef4444; font-weight: bold; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🎪 New Parental Consent Form Submission</h1>
          <p>A new parental consent form has been submitted for the Kids Summer Holiday Activity.</p>
          
          <h2>👶 Child's Information</h2>
          <div class="field">
            <span class="label">Full Name:</span> <span class="value">${formData.childName}</span>
          </div>
          <div class="field">
            <span class="label">Age:</span> <span class="value">${formData.childAge}</span>
          </div>
          <div class="field">
            <span class="label">Session Time:</span> <span class="value">${formData.sessionTime}</span>
          </div>
          <div class="field">
            <span class="label">Days Attending:</span> <span class="value">${formData.daysAttending.join(", ") || "Not specified"}</span>
          </div>
          
          <h2>👨‍👩‍👧 Parent/Guardian Information</h2>
          <div class="field">
            <span class="label">Full Name:</span> <span class="value">${formData.parentName}</span>
          </div>
          <div class="field">
            <span class="label">Contact Number:</span> <span class="value">${formData.contactNumber}</span>
          </div>
          <div class="field">
            <span class="label">Email Address:</span> <span class="value">${formData.email}</span>
          </div>
          
          <h2>🏥 Medical Information</h2>
          <div class="field">
            <span class="label">Allergies/Medical Conditions:</span> 
            <span class="${formData.hasAllergies ? 'consent-no' : 'consent-yes'}">
              ${formData.hasAllergies ? `Yes - ${formData.allergiesDetails}` : "No"}
            </span>
          </div>
          <div class="field">
            <span class="label">Currently Taking Medication:</span> 
            <span class="${formData.hasMedication ? 'consent-no' : 'consent-yes'}">
              ${formData.hasMedication ? `Yes - ${formData.medicationDetails}` : "No"}
            </span>
          </div>
          
          <h2>📸 Photo/Video Consent</h2>
          <div class="field">
            <span class="label">Permission for Photography:</span> 
            <span class="${formData.photoConsent ? 'consent-yes' : 'consent-no'}">
              ${formData.photoConsent ? "✅ YES - Consent Given" : "❌ NO - Consent NOT Given"}
            </span>
          </div>
          
          <div class="footer">
            <p>This form was submitted via the Happiness Comes First website.</p>
            <p>Submitted on: ${new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send confirmation email to parent (in test mode, can only send to submitter's email)
    const confirmationHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          h1 { color: #FF1493; }
          .info-box { background: #f0f9ff; border-left: 4px solid #00CED1; padding: 15px; margin: 20px 0; }
          .payment-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Inscription confirmée - ${formData.childName}</h1>
          <p>Cher(e) ${formData.parentName},</p>
          <p>Nous avons bien reçu le formulaire de consentement pour <strong>${formData.childName}</strong> aux activités Kids Summer Holiday.</p>
          
          <div class="info-box">
            <h3>Récapitulatif de l'inscription</h3>
            <ul>
              <li><strong>Enfant :</strong> ${formData.childName} (${formData.childAge} ans)</li>
              <li><strong>Session :</strong> ${formData.sessionTime}</li>
              <li><strong>Jours :</strong> ${formData.daysAttending.join(", ")}</li>
            </ul>
          </div>
          
          <div class="payment-box">
            <h3>Informations de paiement</h3>
            <p><strong>Banque :</strong> Bank of Scotland</p>
            <p><strong>Nom du compte :</strong> Happiness Comes First (SCIO)</p>
            <p><strong>Sort Code :</strong> 80-22-60</p>
            <p><strong>Numéro de compte :</strong> 27522367</p>
            <p>Les paiements par carte sont également acceptés.</p>
          </div>
          
          <p>Si vous avez des questions, n'hésitez pas à nous contacter à happynesscome01@gmail.com</p>
          
          <div class="footer">
            <p>Happiness Comes First (SCIO)</p>
            <p>Email: happynesscome01@gmail.com</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "Happiness Comes First <noreply@happynesscomefirst.com>",
      to: [formData.email],
      subject: `Inscription confirmée - ${formData.childName}`,
      html: confirmationHtml,
    });

    // Send notification to admin
    await resend.emails.send({
      from: "Happiness Comes First <noreply@happynesscomefirst.com>",
      to: ["happynesscome01@gmail.com"],
      subject: `Nouvelle inscription - ${formData.childName}`,
      html: emailHtml,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-consent-form function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
