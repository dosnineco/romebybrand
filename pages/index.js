import Head from "next/head";
import Link from "next/link";
import Faq from '../components/Faqs/Faq';
import { 
  Users, 
  Shield, 
  Star, 
  Zap, 
  TrendingUp, 
  ShieldCheck, 
  Download, 
  Bell,
  Check,
  ChartArea,
  Wallet,
  Tags,
  Ungroup,
  Smartphone,
  Plus,
  Lock,
  Menu,
  Play,
  Monitor,
  Twitter,
  Facebook,
  Linkedin
} from "lucide-react";

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
        {/* Hero Section */}
        <section className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
            The <span className="text-green-600">#1 Expense Tracking Software</span> & Petty Cash Spending Tool
          </h1>
          <p className="text-base sm:text-xl text-gray-700 mb-8">
            Effortlessly track expenses, manage petty cash, and control your business or personal finances. Trusted by over <span className="font-bold text-green-600">2 million</span> users worldwide.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
            <Link href="/expense-tracker" className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-lg text-lg shadow transition">
              Get Started Free
            </Link>

          </div>
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="flex items-center gap-2 text-base text-gray-600">
              <Users className="w-5 h-5 text-green-500" />
              2.1M+ Monthly Visits
            </div>

            <div className="flex items-center gap-2 text-base text-gray-600">
              <ShieldCheck className="w-5 h-5 text-green-500" />
              Secure & Private
            </div>
          </div>
        </section>


      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Complete Financial Control
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage expenses, track spending, and maintain financial health in one comprehensive platform.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="feature-card border border-gray-200 rounded-lg">
              <div className="p-8">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Instant Expense Logging</h3>
                <p className="text-gray-600 mb-4">Add expenses in seconds from any device. No learning curve, no clutter - just simple, fast expense tracking.</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Quick entry forms</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Auto-categorization</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Mobile optimized</li>
                </ul>
              </div>
            </div>
            
            <div className="feature-card border border-gray-200 rounded-lg">
              <div className="p-8">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Visual Analytics</h3>
                <p className="text-gray-600 mb-4">Beautiful charts and insights help you spot trends, identify spending patterns, and stay on budget.</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Interactive charts</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Trend analysis</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Custom reports</li>
                </ul>
              </div>
            </div>
            
            <div className="feature-card border border-gray-200 rounded-lg">
              <div className="p-8">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                  <ShieldCheck className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Bank-Grade Security</h3>
                <p className="text-gray-600 mb-4">Your financial data is protected with enterprise-level security and encryption standards.</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />256-bit encryption</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Secure cloud storage</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Privacy compliant</li>
                </ul>
              </div>
            </div>
            
            <div className="feature-card border border-gray-200 rounded-lg">
              <div className="p-8">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Team Collaboration</h3>
                <p className="text-gray-600 mb-4">Multi-user access for teams and organizations with role-based permissions and approval workflows.</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Approval workflows</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Shared access</li>               


                </ul>
              </div>
            </div>
            
            <div className="feature-card border border-gray-200 rounded-lg">
              <div className="p-8">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                  <Download className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Export & Reporting</h3>
                <p className="text-gray-600 mb-4">Export your data to CSV, PDF, or Excel anytime. Generate professional reports for accounting and tax purposes.</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Multiple formats</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Custom reports</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Automated exports</li>
                </ul>
              </div>
            </div>
            
            <div className="feature-card border border-gray-200 rounded-lg">
              <div className="p-8">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                  <Bell className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Smart Alerts</h3>
                <p className="text-gray-600 mb-4">Real-time petty cash balance tracking and budget alerts keep you informed and in control.</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Budget alerts</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Low balance warnings</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Email notifications</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Demo Section */}
      <section id="demo" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              See Expense Goose in Action
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our intuitive interface and powerful features through actual product screenshots and demos.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">Dashboard Overview</h3>
              <p className="text-gray-600">
                Get a complete view of your finances with our comprehensive dashboard. Track spending over time, monitor budget categories, and see your financial health at a glance.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <ChartArea className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">Interactive spending charts and trends</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Wallet className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">Real-time budget tracking with alerts</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Tags className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">Category-based expense breakdown</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-2 shadow-lg border rounded-lg">
              <div className="p-4">
                <div className="bg-gray-100 rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Spending Over Time</span>
                    <span className="text-xs text-gray-500">Monthly View</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded-lg">
                      <div className="text-xs text-gray-500">Monthly Spending</div>
                      <div className="text-lg font-bold text-gray-900">$60,700.00</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <div className="text-xs text-gray-500">Remaining Budget</div>
                      <div className="text-lg font-bold text-green-600">$39,300.00</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center ">
            <div className="bg-white p-4 shadow-lg lg:order-2 rounded-lg">
              <div className="p-6">
                <div className="bg-gray-100 rounded-lg p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Quick Expenses Preset</span>
                    <button className="text-xs text-green-600 hover:text-green-700">How to Use</button>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-white p-3 rounded-lg flex items-center justify-between">
                      <span className="text-sm text-gray-700">Gas - $5000</span>
                      <span className="text-xs text-gray-500">(transport)</span>
                    </div>
                    <div className="bg-white p-3 rounded-lg flex items-center justify-between">
                      <span className="text-sm text-gray-700">Wendy - $1700</span>
                      <span className="text-xs text-gray-500">(food)</span>
                    </div>
                    <div className="bg-white p-3 rounded-lg flex items-center justify-between">
                      <span className="text-sm text-gray-700">Donation - $100000</span>
                      <span className="text-xs text-gray-500">(other)</span>
                    </div>
                  </div>
                  <button className="w-full bg-green-600 text-white hover:bg-green-700 font-semibold px-4 py-2 rounded-lg flex items-center justify-center transition">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Expense
                  </button>
                </div>
              </div>
            </div>
            <div className="space-y-6 lg:order-1">
              <h3 className="text-2xl font-bold text-gray-900">Quick Expense Entry</h3>
              <p className="text-gray-600">
                Speed up your expense tracking with preset categories and quick-entry templates. Log common expenses with just one click.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Zap className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">One-click expense logging</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Ungroup className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">Customizable expense presets</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Smartphone className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">Mobile-optimized interface</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Millions Worldwide
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join the growing community of businesses and individuals who have transformed their financial management with Expense Goose.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="stats-counter text-4xl font-bold text-green-600 mb-2">2.1M+</div>
              <div className="text-gray-600">Monthly Active Users</div>
            </div>
            <div className="text-center">
              <div className="stats-counter text-4xl font-bold text-green-600 mb-2">$2.8B+</div>
              <div className="text-gray-600">Expenses Tracked</div>
            </div>
            <div className="text-center">
              <div className="stats-counter text-4xl font-bold text-green-600 mb-2">95%</div>
              <div className="text-gray-600">Customer Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="stats-counter text-4xl font-bold text-green-600 mb-2">12k+</div>
              <div className="text-gray-600">Five-Star Reviews</div>
            </div>
          </div>
        </div>
      </section>
        
        {/* Pricing & Payment */}
        <section className="w-full  mx-auto px-4 py-12 text-center bg-blue-50  mb-12 border border-blue-100">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Unlock Premium Features for Just $15 One-Time
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            Upgrade to our premium plan and gain access to advanced features, priority support, and exclusive updates.
          </p>
          <Link href="/pricing" className="inline-block bg-gray-600 text-white hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold transition">
            Upgrade Now
          </Link>

        </section>

        {/* FAQ Section */}
        <Faq />
      </main>
    </>
  );
}