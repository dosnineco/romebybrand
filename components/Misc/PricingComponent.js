import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase'; // Ensure you have a Supabase client set up

const PricingComponent = () => {
  const [spotsLeft, setSpotsLeft] = useState(null); // State to store the number of spots left
  const totalSpots = 2000; // Total number of spots available

  useEffect(() => {
    const fetchSubscribedUsersCount = async () => {
      try {
        // Query Supabase to count subscribed users
        const { count, error } = await supabase
          .from('users')
          .select('id', { count: 'exact' }) // Count the rows
          .eq('is_subscribed', true); // Only count subscribed users

        if (error) {
          console.error('Error fetching subscribed users count:', error);
        } else {
          // Calculate spots left
          setSpotsLeft(totalSpots - count);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      }
    };

    fetchSubscribedUsersCount();
  }, []);

  return (
    <div className="w-full py-16">
      {/* Pricing Section */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        {/* Pricing Card */}
        <div className="bg-secondary-color text-white rounded-2xl shadow-xl overflow-hidden max-w-2xl mx-auto">
          <div className="px-8 py-12">
            <div className="text-center">
              <div className="inline-flex items-baseline mb-6">
                <span className="text-5xl font-extrabold text-white">One Time Payment</span>
                <span className="ml-2 text-xl font-medium text-white">/15 USD</span>
              </div>
              {/* Dynamically display spots left */}
              <p className="text-sm text-white mb-8">
                Save $14 off for the first {totalSpots} customers (
                {spotsLeft !== null ? `${spotsLeft} left` : 'Loading...'})
              </p>

              <ul className="space-y-4 mb-12">
                {[
                  'Ai-powered insights',
                  'Real-time expense tracking',
                  'Unlimited expense entries',
                  'Quick expense logging',
                  'Category limit alerts',
                  'Add saving goals',
                  'Best Saving Newsletter',
                  '20+ financial calculators',
                ].map((feature) => {
                  const parts = feature.split(' - save ');
                  return (
                    <li key={feature} className="flex items-center">
                      <svg
                        className="h-6 w-6 text-green-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>{parts[0]}</span>
                      {parts[1] && (
                        <span className="ml-2 text-red-600 line-through">
                          save {parts[1]}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>

              <a
                href="/checkout"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-white hover:bg-gray-300 text-black font-bold py-4 px-8 rounded-xl transition-colors duration-200 text-center block"
              >
                Get Started Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingComponent;