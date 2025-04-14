import { sendEmail } from '@/lib/email-service';
import { NextResponse } from 'next/server';
import config from '@/config';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Only try to send email if we have the API key configured
    if (process.env.PLUNK_API_KEY) {
      await sendEmail({
        to: email,
        subject: 'Welcome to the Waitlist!',
        url: process.env.FRONTEND_URL || 'http://localhost:3000',
      });
    }

    // Store email in database or temp storage here
    // For now just return success
    return NextResponse.json({ message: 'Successfully joined waitlist' }, { status: 200 });
  } catch (error) {
    console.error('Waitlist API error:', error);
    return NextResponse.json({ error: 'Failed to join waitlist' }, { status: 500 });
  }
}
