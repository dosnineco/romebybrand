import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, phone } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Get additional metadata
    const userAgent = req.headers['user-agent'] || null;
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;
    const referrer = req.headers['referer'] || req.headers['referrer'] || null;

    // Insert into database
    const { data, error } = await supabase
      .from('visitor_emails')
      .insert([
        {
          email: email.trim(),
          phone: phone?.trim() || null,
          user_agent: userAgent,
          ip_address: ipAddress,
          referrer: referrer,
        },
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to save email' });
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
