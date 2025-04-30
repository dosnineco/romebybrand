import { useRouter } from 'next/router';
import { ClerkProvider, SignedIn, SignedOut, SignInButton, SignUpButton, useUser } from '@clerk/nextjs';
import '../styles/globals.css';
import Layout from '../components/Misc/Layout';
import Header from '../components/Headers/Header';
import Footer from '../components/Footers/Footer';
import PageViewTracker from '../components/Misc/PageViewTracker';
import BreadcrumbsMinimal from '../components/BreadCrumbs/BreadcrumbsWithIcons';
import { useEffect } from 'react';
import { supabase } from '../lib/supabase'; // Ensure this is correctly configured

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const publicRoutes = ['/', '/tools/','/tools/*', '/refund-policy', '/privacy-policy', '/about', '/terms-of-service', '/checkout']; // Define public routes
  const isPublicRoute = publicRoutes.some((route) =>
    router.pathname === route || router.pathname.startsWith(`${route}/`)
  );

  const isHomePage = router.pathname === '/';

  return (
    <ClerkProvider {...pageProps}>
      <PageViewTracker />
      <AppContent
        Component={Component}
        pageProps={pageProps}
        isPublicRoute={isPublicRoute}
        isHomePage={isHomePage}
      />
    </ClerkProvider>
  );
}

function AppContent({ Component, pageProps, isPublicRoute, isHomePage }) {
  const { isSignedIn, user } = useUser(); // Now inside the ClerkProvider context

  useEffect(() => {
    const addUserToDatabase = async () => {
      if (isSignedIn && user) {
        const { id: clerkId, emailAddresses, fullName } = user;
        const email = emailAddresses[0]?.emailAddress;

        try {
          // Check if the user already exists in the database
          const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('clerk_id', clerkId)
            .single();

          if (fetchError && fetchError.code !== 'PGRST116') {
            console.error('Error fetching user:', fetchError.message);
            return;
          }

          // If the user does not exist, insert them into the database
          if (!existingUser) {
            const { error: insertError } = await supabase.from('users').insert([
              {
                clerk_id: clerkId,
                email,
                full_name: fullName,
              },
            ]);

            if (insertError) {
              console.error('Error inserting user:', insertError.message);
            } else {
              console.log('User added to the database successfully.');
            }
          }
        } catch (err) {
          console.error('Error adding user to the database:', err.message);
        }
      }
    };

    addUserToDatabase();
  }, [isSignedIn, user]);

  return (
    <>
      {isPublicRoute ? (
        <>
          <Header />
          <Layout className="container mx-auto px-4 py-8">
            {!isHomePage && <BreadcrumbsMinimal />}
            <Component {...pageProps} />
          </Layout>
          <Footer />
        </>
      ) : (
        <SignedIn>
          <Header />
          <Layout className="container mx-auto px-4 py-8">
            {!isHomePage && <BreadcrumbsMinimal />}
            <Component {...pageProps} />
          </Layout>
          <Footer />
        </SignedIn>
      )}
      {!isPublicRoute && (
        <SignedOut>
          <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Expense Goose</h1>
              <p className="text-xl text-gray-700 text-inherit mb-6">Please sign in to continue.</p>
              <div className="flex space-x-4 justify-center">
                <SignInButton>
                  <button className="px-6 py-3 font-bold text-white bg-gray-900 rounded-lg ">Sign In</button>
                </SignInButton>
                <SignUpButton>
                  <button className="px-6 py-3 font-bold text-white bg-gray-900 rounded-lg ">Sign Up</button>
                </SignUpButton>
              </div>
            </div>
          </div>
        </SignedOut>
      )}
    </>
  );
}

export default MyApp;