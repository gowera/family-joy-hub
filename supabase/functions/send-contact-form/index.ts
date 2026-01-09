import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactFormRequest {
  name: string;
  email: string;
  phone: string;
  childName: string;
  childAge: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData: ContactFormRequest = await req.json();
    console.log("Received contact form data:", formData);

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          h1 { color: #FF1493; border-bottom: 2px solid #FF1493; padding-bottom: 10px; }
          .field { margin: 10px 0; padding: 10px; background: #f9f9f9; border-radius: 5px; }
          .label { font-weight: bold; color: #666; }
          .value { color: #333; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>New Contact Message</h1>
          <p>A new message has been received from the website contact form.</p>
          
          <h2>Contact Information</h2>
          <div class="field">
            <span class="label">Name:</span> <span class="value">${formData.name}</span>
          </div>
          <div class="field">
            <span class="label">Email:</span> <span class="value">${formData.email}</span>
          </div>
          <div class="field">
            <span class="label">Phone:</span> <span class="value">${formData.phone || "Not provided"}</span>
          </div>
          
          ${formData.childName || formData.childAge ? `
          <h2>Child Information</h2>
          <div class="field">
            <span class="label">Child's Name:</span> <span class="value">${formData.childName || "Not provided"}</span>
          </div>
          <div class="field">
            <span class="label">Child's Age:</span> <span class="value">${formData.childAge || "Not provided"}</span>
          </div>
          ` : ''}
          
          <h2>Message</h2>
          <div class="field">
            <p class="value">${formData.message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <div class="footer">
            <p>This message was sent via the Happiness Comes First website contact form.</p>
            <p>Received on: ${new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>",
      to: ["happynesscome01@gmail.com"],
      subject: `New Contact Message from ${formData.name}`,
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
    console.error("Error in send-contact-form function:", error);
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
