import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useUser } from '@clerk/nextjs';
import { supabase } from '../lib/supabase';

export default function Payment() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [hasPaid, setHasPaid] = useState(false); // Track if the user has already paid
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    if (!isLoaded) return; // Wait until the user data is loaded

    if (!user) {
      // Redirect to login if the user is not authenticated
      router.push('/dashboard');
      return;
    }

    const checkSubscriptionStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('is_subscribed')
          .eq('clerk_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching subscription status:', error);
        } else if (data?.is_subscribed) {
          setHasPaid(true); // User has already paid
        }
      } catch (err) {
        console.error('Unexpected error checking subscription status:', err);
      } finally {
        setLoading(false); // Stop loading once the check is complete
      }
    };

    checkSubscriptionStatus();
  }, [isLoaded, user, router]);

  const handlePaymentSuccess = async () => {
    if (user) {
      try {
        const { data, error } = await supabase
          .from('users')
          .upsert(
            {
              clerk_id: user.id,
              email: user.primaryEmailAddress?.emailAddress,
              full_name: user.fullName,
              is_subscribed: true,
              subscription_date: new Date().toISOString(),
            },
            { onConflict: 'clerk_id' }
          );

        if (error) {
          console.error('Error saving subscription:', error);
          alert('There was an issue updating your subscription. Please contact support.');
        } else {
          console.log('Subscription saved:', data);
          setHasPaid(true); // Mark the user as having paid
          router.push('/dashboard'); // Redirect to the dashboard
        }
      } catch (err) {
        console.error('Unexpected error saving subscription:', err);
        alert('An unexpected error occurred. Please try again later.');
      }
    } else {
      console.error('User is not authenticated.');
      alert('You must be signed in to complete the payment.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-700">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        <p className="text-lg ml-4">Loading...</p>
    
      </div>
    );
  }

  if (hasPaid) {
    return (
      <div className="flex items-center justify-center mt-20 p-3 text-black">
        <div className="max-w-3xl text-center p-8 bg-gray-100 rounded-lg text-gray-900">
          <h1 className="text-4xl font-extrabold mb-4 text-gray-700">Thank You!</h1>
          <p className="text-lg mb-6">
            You have already made the one-time payment. Enjoy all the premium features!
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 text-bold text-white bg-gray-700 rounded-lg shadow-lg "
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className=" flex flex-col items-center justify-center  text-black">
      <div className="max-w-3xl text-center p-8  text-gray-900">
        <h1 className="text-4xl font-extrabold mb-4 text-gray-700">Upgrade to Premium</h1>
        <p className="text-lg text-left  mb-6">
        Enjoy exclusive tools, priority support, and much more for just <span className="font-bold">$14.99 One time Payment</span>.
        </p>
        <ul className="text-left mb-6 space-y-2">
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✔</span> Access to all premium tools
          </li>
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✔</span> Ai-powered insights

          </li>
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✔</span> Real-time expense tracking

          </li>
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✔</span> Unlimited expense entries
      
          </li>
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✔</span> Exclusive updates and features
          </li>
        </ul>
        <PayPalScriptProvider options={{ "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID }}>
          <PayPalButtons
            style={{ layout: 'vertical', color: 'blue', shape: 'pill', label: 'subscribe' }}
            createOrder={(data, actions) => {
              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      value: '14.99', 
                    },
                  },
                ],
              });
            }}
            onApprove={(data, actions) => {
              return actions.order.capture().then(() => {
                handlePaymentSuccess(); // Mark payment as complete and save subscription
              });
            }}
            onError={(err) => {
              console.error('PayPal Checkout Error:', err);
              alert('There was an issue processing your payment. Please try again.');
            }}
          />
        </PayPalScriptProvider>
      </div>
    </div>
  );
}