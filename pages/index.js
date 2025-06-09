import Head from "next/head";
import Link from "next/link";
import { CheckCircle, ShieldCheck, TrendingUp, Users, Zap } from "lucide-react";
import Faq from '../components/Faqs/Faq';

export default function ExpenseTrackerLanding() {
  return (
    <>
      <Head>
        <title>
          Best Expense Tracking Software & Petty Cash Spending Tools | Expense Goose
        </title>
        <meta
          name="description"
          content="Expense Goose is the #1 expense tracking software and petty cash spending tool. Track expenses, manage petty cash, and control your business or personal finances with ease. Try our free demo or unlock premium for a one-time fee."
        />
        <meta
          name="keywords"
          content="expense tracking software, petty cash spending tools, expense tracker, budget app, business expense management, free expense tracker, online expense tracker"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://expensegoose.com/" />
        {/* Open Graph */}
        <meta property="og:title" content="Best Expense Tracking Software & Petty Cash Spending Tools | Expense Goose" />
        <meta property="og:description" content="Track expenses, manage petty cash, and control your business or personal finances with ease. Try our free demo or unlock premium for a one-time fee." />
        <meta property="og:url" content="https://expensegoose.com/" />
        <meta property="og:image" content="https://expensegoose.com/images/expense-tracker-og.jpg" />
        {/* JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Expense Goose - Expense Tracking Software",
              "url": "https://expensegoose.com/",
              "applicationCategory": "FinanceApplication",
              "operatingSystem": "All",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "reviewCount": "12000"
              },
              "offers": {
                "@type": "Offer",
                "price": "15",
                "priceCurrency": "USD"
              }
            }),
          }}
        />
      </Head>
      <main className="bg-white min-h-screen">
        {/* Hero Section */}
        <section className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
            The <span className="text-blue-600">#1 Expense Tracking Software</span> & Petty Cash Spending Tool
          </h1>
          <p className="text-base sm:text-xl text-gray-700 mb-8">
            Effortlessly track expenses, manage petty cash, and control your business or personal finances. Trusted by over <span className="font-bold text-green-600">2 million</span> users worldwide.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
            <Link href="/expense-tracker" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg text-lg shadow transition">
              Get Started Free
            </Link>
            <Link href="/demo" className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold px-8 py-4 rounded-lg text-lg transition">
              Try Demo
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="flex items-center gap-2 text-base text-gray-600">
              <Users className="w-5 h-5 text-green-500" />
              2.1M+ Monthly Visits
            </div>

            <div className="flex items-center gap-2 text-base text-gray-600">
              <ShieldCheck className="w-5 h-5 text-blue-500" />
              Secure & Private
            </div>
          </div>
        </section>

      

        {/* Features Section */}
        <section className="max-w-5xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl font-bold mb-4">Expense Tracking Software Features</h2>
            <ul className="space-y-4 text-base text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-1" />
                <span>Track expenses, income, and petty cash in one place</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-1" />
                <span>Custom categories, budgets, and spending insights</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-1" />
                <span>Export data to CSV, PDF, or Excel anytime</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-1" />
                <span>Mobile-friendly, cloud-based, and always secure</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-1" />
                <span>Multi-user access for teams and organizations</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-1" />
                <span>Real-time petty cash balance and alerts</span>
              </li>
            </ul>
            <Link href="/signup" className="mt-8 inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg text-lg shadow transition">
              Start Tracking Free
            </Link>
          </div>
          <div>
            <img
              src="/cta-gif.gif"
              alt="Expense Tracking Software Screenshot"
              className="rounded-lg shadow-lg border"
              loading="lazy"
            />
          </div>
        </section>

        {/* Benefits Section */}
        <section className="max-w-5xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-8">
          <div className="bg-gray-50 rounded-lg p-6 flex flex-col items-center text-center shadow-sm">
            <Zap className="w-10 h-10 text-blue-600 mb-3" />
            <h2 className="font-bold text-lg mb-2">Instant Expense Logging</h2>
            <p className="text-base text-gray-600">Add expenses in seconds from any device. No learning curve, no clutter.</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 flex flex-col items-center text-center shadow-sm">
            <TrendingUp className="w-10 h-10 text-green-600 mb-3" />
            <h2 className="font-bold text-lg mb-2">Visualize & Analyze</h2>
            <p className="text-base text-gray-600">Beautiful charts and insights help you spot trends and stay on budget.</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 flex flex-col items-center text-center shadow-sm">
            <CheckCircle className="w-10 h-10 text-yellow-500 mb-3" />
            <h2 className="font-bold text-lg mb-2">One-Time Payment</h2>
            <p className="text-base text-gray-600">No subscriptions, no recurring fees. Pay once, use forever.</p>
          </div>
        </section>

        {/* Pricing & Payment */}
        <section className="w-full  mx-auto px-4 py-12 text-center bg-yellow-50 rounded-lg shadow mb-12 border border-yellow-100">
          <h2 className="text-2xl font-bold mb-2 text-gray-900">Unlock Premium for a One-Time Fee</h2>
          <p className="text-lg text-gray-700 mb-4">
             No subscriptions, no hidden fees.
          </p>


           <Link href="/checkout"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-lg text-lg shadow transition mt-4"
     
     >
            Pay $15 &amp; Unlock Premium
            </Link>
          <p className="mt-3 text-sm text-gray-500">
            Secure payment via Paypal. 
          </p>
        </section>

        {/* FAQ Section */}
        <Faq />

  

     
      </main>
    </>
  );
}