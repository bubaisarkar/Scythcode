import { NextRequest, NextResponse } from 'next/server';
import { validateContactForm, sanitizeString } from '@/lib/validation';
import { sendToDiscord, ContactFormData } from '@/lib/discord';
import { isRateLimited, getRateLimitResetTime } from '@/lib/rateLimit';

/**
 * POST /api/contact
 * Handles contact form submissions
 */
export async function POST(request: NextRequest) {
  try {
    console.log('=== Contact API Called ===');
    
    // Get client IP for rate limiting
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
    console.log('Client IP:', ip);

    // Check rate limit (5 requests per 15 minutes per IP)
    if (isRateLimited(ip, 5, 15 * 60 * 1000)) {
      const resetTime = getRateLimitResetTime(ip);
      const resetMinutes = Math.ceil(resetTime / 60000);
      console.log('Rate limited:', ip);
      
      return NextResponse.json(
        {
          success: false,
          error: 'Too many requests',
          message: `Please wait ${resetMinutes} minute(s) before submitting again.`,
        },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();
    console.log('Received form data:', JSON.stringify(body, null, 2));

    // Validate input
    const validation = validateContactForm(body);
    console.log('Validation result:', validation);
    
    if (!validation.isValid) {
      console.log('Validation failed with errors:', validation.errors);
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          message: 'Please check your form inputs',
          errors: validation.errors,
        },
        { status: 400 }
      );
    }

    console.log('Validation passed, sanitizing data...');

    // Sanitize inputs
    const formData: ContactFormData = {
      firstName: sanitizeString(body.firstName),
      lastName: sanitizeString(body.lastName),
      email: sanitizeString(body.email),
      service: body.service,
      message: sanitizeString(body.message),
    };
    
    console.log('Sanitized form data:', formData);

    // Send to Discord
    console.log('Sending to Discord...');
    const discordSuccess = await sendToDiscord(formData);

    if (!discordSuccess) {
      console.error('Failed to send message to Discord');
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to send message',
          message: 'There was an error processing your request. Please try again later.',
        },
        { status: 500 }
      );
    }

    console.log('✅ Message sent successfully to Discord');
    
    // Success response
    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for your message! We will get back to you soon.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'An unexpected error occurred. Please try again later.',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/contact
 * Returns API information
 */
export async function GET() {
  return NextResponse.json(
    {
      message: 'Contact API endpoint',
      methods: ['POST'],
      version: '1.0.0',
    },
    { status: 200 }
  );
}
