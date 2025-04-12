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



function MyApp({ Component, pageProps }) {
  const [isSubscribed, setIsSubscribed] = useState(false);


  function Paywall(is_subscribed,setIsSubscribed) {
    const { user } = useUser();
    const router = useRouter();
    // const [isSubscribed, setIsSubscribed] = useState(false);
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
        }
      };
  
      checkSubscription();
    }, [user]);
  
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
          } else {
            console.log('Subscription saved:', data);
            setIsSubscribed(true);
            router.push('/dashboard'); // Redirect to dashboard after payment
          }
        } catch (err) {
          console.error('Unexpected error saving subscription:', err);
        }
      }
    };
  
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
                        value: '0.1', // Subscription amount
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
              }}
            />
          </PayPalScriptProvider>
        </div>
      );
    }
  
    return null; // If subscribed, render nothing here
  }


  const router = useRouter();
  const publicRoutes = ['/', '/tools', '/pricing']; // Allow home and all blog pages

  const isPublicRoute = publicRoutes.some((route) =>
    router.pathname === route || router.pathname.startsWith(`${route}/`)
  );

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
            {/* <Component {...pageProps} /> */}
            {!isSubscribed ? <Paywall /> : <Component {...pageProps} />}

          </Layout>
          <Footer />
        </SignedIn>
      )}
      {!isPublicRoute && (
        <SignedOut>
          <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-primary-color mb-4">Welcome to Expense Goose</h1>
              <p className="text-xl text-inherit mb-6">Please sign in to continue.</p>
              <div className="flex space-x-4 justify-center">
                <SignInButton>
                  <button className="px-6 py-3 text-white bg-primary-color rounded-lg shadow-lg">Sign In</button>
                </SignInButton>
                <SignUpButton>
                  <button className="px-6 py-3 text-white bg-primary-color rounded-lg shadow-lg">Sign Up</button>
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