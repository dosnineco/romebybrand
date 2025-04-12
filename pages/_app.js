import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ClerkProvider, SignedIn, SignedOut, useUser, SignInButton, SignUpButton } from '@clerk/nextjs';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { supabase } from '../lib/supabase';
import '../styles/globals.css';
import Layout from '../components/Misc/Layout';
import Header from '../components/Headers/Header';
import Footer from '../components/Footers/Footer';
import PageViewTracker from '../components/Misc/PageViewTracker';

function Paywall({ isSubscribed, setIsSubscribed }) {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSubscription = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('users')
            .select('is_subscribed')
            .eq('clerk_id', user.id)
            .single();

          if (error) {
            console.error('Error fetching subscription status:', error);
          } else if (data?.is_subscribed) {
            setIsSubscribed(true); // User is subscribed
          }
        } catch (err) {
          console.error('Unexpected error checking subscription:', err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    checkSubscription();
  }, [user]);

  // const handlePaymentSuccess = async (paymentId) => {
  //   if (user) {
  //     try {
  //       const { data, error } = await supabase
  //         .from('users')
  //         .upsert(
  //           {
  //             clerk_id: user.id,
  //             email: user.primaryEmailAddress?.emailAddress,
  //             full_name: user.fullName,
  //             is_subscribed: true,
  //             subscription_date: new Date().toISOString(),
  //             payment_id: paymentId, // Save the PayPal payment ID
  //             payment_status: 'completed', // Mark the payment as completed
  //           },
  //           { onConflict: 'clerk_id' }
  //         );

  //       if (error) {
  //         console.error('Error saving subscription:', error);
  //       } else {
  //         console.log('Subscription saved:', data);
  //         setIsSubscribed(true); // Update the state to reflect the subscription
  //         router.push('/dashboard'); // Redirect to the dashboard after payment
  //       }
  //     } catch (err) {
  //       console.error('Unexpected error saving subscription:', err);
  //     }
  //   }
  // };
  const handlePaymentSuccess = async (paymentId) => {
    console.log('Payment successful, paymentId:', paymentId);
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
              payment_id: paymentId,
              payment_status: 'completed',
            },
            { onConflict: 'clerk_id' }
          );
  
        if (error) {
          console.error('Error saving subscription:', error);
        } else {
          console.log('Subscription saved:', data);
          setIsSubscribed(true);
          router.push('/dashboard');
        }
      } catch (err) {
        console.error('Unexpected error saving subscription:', err);
      }
    }
  };
  
  useEffect(() => {
    console.log('Checking subscription status...');
    const checkSubscription = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('users')
            .select('is_subscribed')
            .eq('clerk_id', user.id)
            .single();
  
          if (error) {
            console.error('Error fetching subscription status:', error);
          } else {
            console.log('Subscription status:', data?.is_subscribed);
            setIsSubscribed(data?.is_subscribed || false);
          }
        } catch (err) {
          console.error('Unexpected error checking subscription:', err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
  
    checkSubscription();
  }, [user]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isSubscribed) {
    return (
      <div className="flex flex-col w-full items-center justify-center min-h-screen bg-gray-50">
        <h1 className="text-2xl font-bold mb-4">Complete Your Subscription</h1>
        <PayPalScriptProvider options={{ "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID }}>
          <PayPalButtons
            style={{ layout: 'vertical' }}
            createOrder={(data, actions) => {
              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      value: '0.99', // Subscription amount
                    },
                  },
                ],
              });
            }}
            onApprove={(data, actions) => {
              return actions.order.capture().then((details) => {
                const paymentId = details.id; // Get the PayPal payment ID
                handlePaymentSuccess(paymentId); // Save the payment details
              });
            }}
            onError={(err) => {
              console.error('PayPal Checkout Error:', err);
            }}
          />
        </PayPalScriptProvider>
      </div>
    );
  }

  return null; // If subscribed, render nothing here
}

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const publicRoutes = ['/', '/tools', '/pricing']; // Define public routes
  const isPublicRoute = publicRoutes.some((route) =>
    router.pathname === route || router.pathname.startsWith(`${route}/`)
  );

  const [isSubscribed, setIsSubscribed] = useState(false);

  return (
    <ClerkProvider {...pageProps}>
      <PageViewTracker />
      {isPublicRoute ? (
        <>
          <Header />
          <Layout className="container mx-auto px-4 py-8">
            <Component {...pageProps} />
          </Layout>
          <Footer />
        </>
      ) : (
        <SignedIn>
          <Header />
          <Layout className="container mx-auto px-4 py-8">
            {!isSubscribed ? (
              <Paywall isSubscribed={isSubscribed} setIsSubscribed={setIsSubscribed} />
            ) : (
              <Component {...pageProps} />
            )}
          </Layout>
          <Footer />
        </SignedIn>
      )}
      {!isPublicRoute && (
        <SignedOut>
          <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center">
              <p className="text-xl text-inherit mb-6">Please sign in to continue.</p>
              <div className="flex space-x-4 justify-center">
              <SignInButton>
                  <button className="px-6 py-3 text-gray-900 bg-primary-color rounded-lg ">Sign In</button>
                </SignInButton>
                <SignUpButton>
                  <button className="px-6 py-3 text-white bg-gray-900 rounded-lg ">Sign Up</button>
                </SignUpButton>
              </div>
            </div>
          </div>
        </SignedOut>
      )}
    </ClerkProvider>
  );
}

export default MyApp;