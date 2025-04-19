import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { supabase } from '../../lib/supabase';

const RequireSubscription = ({ children }) => {
  const { user, isLoaded } = useUser();
  const [isSubscribed, setIsSubscribed] = useState(null); // Track subscription status
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    const checkSubscription = async () => {
      if (!isLoaded || !user) return;

      try {
        const { data, error } = await supabase
          .from('users')
          .select('is_subscribed')
          .eq('clerk_id', user.id)
          .single();

        if (error) {
          console.error('Error checking subscription status:', error);
          setIsSubscribed(false);
        } else {
          setIsSubscribed(data?.is_subscribed || false);
        }
      } catch (err) {
        console.error('Unexpected error checking subscription status:', err);
        setIsSubscribed(false);
      } finally {
        setLoading(false);
      }
    };

    checkSubscription();
  }, [isLoaded, user]);

  if (loading) {
    return <div className="p-8 text-gray-500 text-center">Checking subscription status...</div>;
  }

  if (!isSubscribed) {
    return (
      <div className="p-8   text-center">
        <p className="text-lg text-red-600 p-4 mb-4">You must be subscribed to access this content.</p>
        <a
          href="/checkout"
          className="px-6 font-bold py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Premium Subscription
        </a>
      </div>
    );
  }

  return <>{children}</>;
};

export default RequireSubscription;