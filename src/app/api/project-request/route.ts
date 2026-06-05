import { NextRequest, NextResponse } from 'next/server';
import { isRateLimited } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
  try {
    console.log('=== Project Request API Called ===');

    // Get client IP for rate limiting
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';

    // Check rate limit
    if (isRateLimited(ip, 3, 15 * 60 * 1000)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Too many requests. Please wait before submitting another project.',
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    console.log('Project request data:', body);

    // Send to Discord
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error('Discord webhook URL not configured');
      return NextResponse.json(
        { success: false, message: 'Configuration error' },
        { status: 500 }
      );
    }

    // Create detailed embed
    const fields: any[] = [
      { name: '👤 Name', value: body.name, inline: true },
      { name: '📧 Email', value: body.email, inline: true },
      { name: '💼 Service', value: body.serviceTitle || body.service, inline: false },
    ];

    // Add all custom fields
    Object.entries(body).forEach(([key, value]) => {
      if (!['name', 'email', 'service', 'serviceTitle'].includes(key) && value) {
        const fieldName = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
        const fieldValue = Array.isArray(value) ? value.join(', ') : String(value);
        if (fieldValue.trim()) {
          fields.push({
            name: fieldName,
            value: fieldValue.length > 1024 ? fieldValue.substring(0, 1021) + '...' : fieldValue,
            inline: false,
          });
        }
      }
    });

    const embed = {
      title: '🚀 New Project Request',
      description: `A new project request has been submitted for **${body.serviceTitle || body.service}**`,
      color: 0x00d9ff,
      fields,
      footer: { text: 'Medusa Web Services - Project Request' },
      timestamp: new Date().toISOString(),
    };

    const discordResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embeds: [embed],
        username: 'Project Request Bot',
      }),
    });

    if (!discordResponse.ok) {
      console.error('Discord webhook failed:', discordResponse.status);
      return NextResponse.json(
        { success: false, message: 'Failed to send request' },
        { status: 500 }
      );
    }

    console.log('✅ Project request sent to Discord');

    return NextResponse.json({
      success: true,
      message: 'Project request submitted successfully!',
    });
  } catch (error) {
    console.error('Project request error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred' },
      { status: 500 }
    );
  }
}
