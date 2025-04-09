import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { ClerkProvider, SignedIn, SignedOut, useUser, SignInButton, SignUpButton } from '@clerk/nextjs';
import { supabase } from '../lib/supabase';
import '../styles/globals.css';
import Layout from '../components/Misc/Layout';
import Header from '../components/Headers/Header';
import Footer from '../components/Footers/Footer';
import PageViewTracker from '../components/Misc/PageViewTracker';

function SaveUserToDatabase() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const saveUserToDatabase = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('users')
            .upsert(
              {
                clerk_id: user.id,
                email: user.primaryEmailAddress?.emailAddress,
                full_name: user.fullName,
                is_subscribed: false, // Add a field to track subscription status
              },
              { onConflict: 'clerk_id' }
            );

          if (error) {
            console.error('Error saving user to database:', error);
          } else {
            console.log('User saved to database:', data);

            // Redirect to pricing page if the user is not subscribed
            if (!data[0]?.is_subscribed) {
              router.push('/pricing');
            }
          }
        } catch (err) {
          console.error('Unexpected error saving user:', err);
        }
      }
    };

    saveUserToDatabase();
  }, [user, router]);

  return null;
}

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const publicRoutes = ['/', '/tools','/pricing']; // Allow home and all blog pages

  const isPublicRoute = publicRoutes.some((route) =>
    router.pathname === route || router.pathname.startsWith(`${route}/`)
  );

  useEffect(() => {
    // Load Paddle script
    const script = document.createElement('script');
    script.src = 'https://cdn.paddle.com/paddle/paddle.js';
    script.async = true;
    script.onload = () => {
      window.Paddle.Setup({ vendor: 223616 });
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

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
          <SaveUserToDatabase />
          <Header />
          <Layout className="container mx-auto px-4 py-8">
            <Component {...pageProps} />
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