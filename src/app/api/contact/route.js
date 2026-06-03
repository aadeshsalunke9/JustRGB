import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validate required fields
    if (!name || !email || !message) {
      return Response.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: 'JUST RGB Contact <onboarding@resend.dev>',
      to: ['aadeshsalunke9@gmail.com'],
      replyTo: email,
      subject: subject ? `[JUST RGB] ${subject}` : `[JUST RGB] New message from ${name}`,
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #f0f0f0; padding: 40px; border-radius: 8px;">
          
          <div style="border-bottom: 1px solid #222; padding-bottom: 24px; margin-bottom: 32px;">
            <h1 style="font-size: 28px; font-weight: 700; letter-spacing: 0.15em; color: #fff; margin: 0;">
              JUST <span style="color: #e53e3e;">R</span><span style="color: #38a169;">G</span><span style="color: #3182ce;">B</span>
            </h1>
            <p style="color: #666; font-size: 13px; margin: 6px 0 0; letter-spacing: 0.08em; text-transform: uppercase;">New Contact Form Submission</p>
          </div>

          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; color: #888; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; width: 100px;">From</td>
              <td style="padding: 10px 0; color: #f0f0f0; font-size: 15px;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #888; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase;">Email</td>
              <td style="padding: 10px 0; color: #f0f0f0; font-size: 15px;">
                <a href="mailto:${email}" style="color: #a78bfa; text-decoration: none;">${email}</a>
              </td>
            </tr>
            ${subject ? `
            <tr>
              <td style="padding: 10px 0; color: #888; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase;">Subject</td>
              <td style="padding: 10px 0; color: #f0f0f0; font-size: 15px;">${subject}</td>
            </tr>` : ''}
          </table>

          <div style="margin-top: 28px; background: #111; border-radius: 6px; padding: 24px; border-left: 3px solid #a78bfa;">
            <p style="color: #888; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; margin: 0 0 12px;">Message</p>
            <p style="color: #e0e0e0; font-size: 15px; line-height: 1.7; margin: 0; white-space: pre-wrap;">${message}</p>
          </div>

          <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #222; text-align: center;">
            <p style="color: #444; font-size: 11px; margin: 0; letter-spacing: 0.06em;">
              Sent via justrgb.com contact form · Reply directly to respond to ${name}
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return Response.json({ error: 'Failed to send email. Please try again.' }, { status: 500 });
    }

    return Response.json({ success: true, id: data.id });

  } catch (err) {
    console.error('Contact API error:', err);
    return Response.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
