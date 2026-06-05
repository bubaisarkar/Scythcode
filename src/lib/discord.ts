/**
 * Discord Webhook Utility
 * Handles sending formatted embeds to Discord
 */

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  service: string;
  message: string;
}

export interface DiscordEmbed {
  title: string;
  description?: string;
  color: number;
  fields: Array<{
    name: string;
    value: string;
    inline?: boolean;
  }>;
  footer?: {
    text: string;
  };
  timestamp?: string;
}

/**
 * Sends a contact form submission to Discord as an embed
 */
export async function sendToDiscord(data: ContactFormData): Promise<boolean> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    console.error('Discord webhook URL is not configured');
    return false;
  }

  // Map service codes to readable names
  const serviceNames: Record<string, string> = {
    starter: 'Starter Package ($11)',
    professional: 'Professional Package ($22)',
    business: 'Business Package ($33)',
    enterprise: 'Enterprise Package ($88)',
    custom: 'Custom Solution',
  };

  // Create embed with contact information
  const embed: DiscordEmbed = {
    title: '📬 New Contact Form Submission',
    description: 'A new client inquiry has been received!',
    color: 0x00d9ff, // Cyan color
    fields: [
      {
        name: '👤 Name',
        value: `${data.firstName} ${data.lastName}`,
        inline: true,
      },
      {
        name: '📧 Email',
        value: data.email,
        inline: true,
      },
      {
        name: '💼 Service',
        value: serviceNames[data.service] || data.service,
        inline: false,
      },
      {
        name: '📝 Message',
        value: data.message.length > 1024 ? data.message.substring(0, 1021) + '...' : data.message,
        inline: false,
      },
    ],
    footer: {
      text: 'WebDev Services Contact Form',
    },
    timestamp: new Date().toISOString(),
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        embeds: [embed],
        username: 'Contact Form Bot',
        avatar_url: 'https://cdn.discordapp.com/embed/avatars/0.png',
      }),
    });

    if (!response.ok) {
      console.error('Discord webhook failed:', response.status, response.statusText);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error sending to Discord:', error);
    return false;
  }
}
