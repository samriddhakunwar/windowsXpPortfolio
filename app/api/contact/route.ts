import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    // Validation
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Please provide a valid name (at least 2 characters)." },
        { status: 400 }
      );
    }
    if (!email || !validateEmail(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }
    if (!message || typeof message !== "string" || message.trim().length < 10) {
      return NextResponse.json(
        { error: "Message must be at least 10 characters." },
        { status: 400 }
      );
    }

    // Send email
    const { error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: ["samriddhakunwar@gmail.com"],
      replyTo: email.trim(),
      subject: `Portfolio Contact: ${name.trim()}`,
      html: `
        <div style="font-family: Tahoma, Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(180deg, #0997FF 0%, #0048CE 100%); padding: 16px; color: white; border-radius: 4px 4px 0 0;">
            <h2 style="margin: 0; font-size: 16px;">📬 New Portfolio Contact Message</h2>
          </div>
          <div style="background: #ECE9D8; padding: 20px; border: 2px solid #ACA899; border-top: none;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; font-weight: bold; width: 80px;">From:</td>
                <td style="padding: 6px 0;">${name.trim()}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold;">Email:</td>
                <td style="padding: 6px 0;"><a href="mailto:${email.trim()}">${email.trim()}</a></td>
              </tr>
            </table>
            <hr style="margin: 12px 0; border-color: #ACA899;" />
            <div style="white-space: pre-wrap; line-height: 1.6;">${message.trim()}</div>
          </div>
          <div style="background: #DDD; padding: 8px 16px; font-size: 11px; color: #666; border-radius: 0 0 4px 4px;">
            Sent via Windows XP Portfolio Contact Form
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send message. Please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
