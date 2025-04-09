import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { is_subscribed } = req.body;

    try {
      // Update the user's subscription status and subscription date
      const { error } = await supabase
        .from('users')
        .update({
          is_subscribed,
          subscription_date: is_subscribed ? new Date().toISOString() : null, // Set subscription_date if subscribed
        })
        .eq('clerk_id', req.user.id); // Ensure you pass the user's ID

      if (error) {
        return res.status(500).json({ error: 'Failed to update subscription status' });
      }

      res.status(200).json({ message: 'Subscription status updated successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Unexpected error occurred' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}