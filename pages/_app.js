import { useEffect } from 'react';
import { ClerkProvider, SignedIn, SignedOut, useUser, SignInButton, SignUpButton } from '@clerk/nextjs'; // Added SignInButton and SignUpButton
import { supabase } from '../lib/supabase'; // Ensure you have a Supabase client configured here
import '../styles/globals.css';
import Layout from '../components/Misc/Layout';
import Header from '../components/Headers/Header';
import Footer from '../components/Footers/Footer';
import PageViewTracker from '../components/Misc/PageViewTracker';

function SaveUserToDatabase() {
  const { user } = useUser();

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
              },
              { onConflict: 'clerk_id' } // Avoid inserting duplicate users
            );

          if (error) {
            console.error('Error saving user to database:', error);
          } else {
            console.log('User saved to database:', data);
          }
        } catch (err) {
          console.error('Unexpected error saving user:', err);
        }
      }
    };

    saveUserToDatabase();
  }, [user]);

  return null; // This component doesn't render anything
}

function MyApp({ Component, pageProps }) {
  return (
    <ClerkProvider {...pageProps}>
      <PageViewTracker />
      <SignedIn>
        <SaveUserToDatabase /> {/* Ensure user data is saved to the database */}
        <Header />
        <Layout className="container mx-auto px-4 py-8">
          <Component {...pageProps} />
        </Layout>
        <Footer />
      </SignedIn>
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
    </ClerkProvider>
  );
}

export default MyApp;