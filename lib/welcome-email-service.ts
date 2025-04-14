import Plunk from '@plunk/node';
import { render } from '@react-email/render';
import * as React from 'react';
import { WelcomeEmail } from './welcome-email';
import config from '@/config';

const plunk = new Plunk(process.env.PLUNK_API_KEY || '');

interface SendWelcomeEmailParams {
  to: string;
  firstName?: string;
}

export async function sendWelcomeEmail({ to, firstName }: SendWelcomeEmailParams) {
  try {
    // Skip sending if PLUNK_API_KEY is not configured
    if (!process.env.PLUNK_API_KEY) {
      console.log('[EMAIL] Skipping welcome email - email service is not configured');
      return { success: false, error: 'Email service not configured' };
    }

    const url = process.env.FRONTEND_URL || 'http://localhost:3000/dashboard';
    const emailComponent = React.createElement(WelcomeEmail, { url, firstName });
    const htmlBody = await render(emailComponent);

    console.log(`[EMAIL] Sending welcome email to ${to}`);
    
    const result = await plunk.emails.send({
      to,
      subject: 'Welcome to our platform!',
      body: htmlBody,
    });

    console.log(`[EMAIL] Welcome email sent successfully to ${to}`);
    return { success: true, data: result };
  } catch (error) {
    console.error('[EMAIL] Failed to send welcome email:', error);
    return { success: false, error };
  }
} 