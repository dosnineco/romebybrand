import { useRouter } from 'next/router';
import { ClerkProvider, SignedIn, SignedOut, SignInButton, SignUpButton } from '@clerk/nextjs';
import '../styles/globals.css';
import Layout from '../components/Misc/Layout';
import Header from '../components/Headers/Header';
import Footer from '../components/Footers/Footer';
import PageViewTracker from '../components/Misc/PageViewTracker';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const publicRoutes = ['/', '/tools', '/pricing']; // Define public routes
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