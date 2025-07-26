import Head from "next/head";
import Link from "next/link";
import { 
  Check,
  X,
  Zap,
  Clock,
  Shield,
  BarChart2,
  Smartphone,
  DollarSign,
  PieChart,
  ArrowRight,
  ChevronRight,
  AlertTriangle,
  TrendingUp,
  Users,
  Download,
  Bell
} from "lucide-react";
import { useState, useEffect } from "react";

export default function MobileOptimizedLanding() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 30,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const { hours, minutes, seconds } = prev;
        if (seconds > 0) return { ...prev, seconds: seconds - 1 };
        if (minutes > 0) return { ...prev, minutes: minutes - 1, seconds: 59 };
        if (hours > 0) return { hours: hours - 1, minutes: 59, seconds: 59 };
        clearInterval(timer);
        return { hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <Head>
        <title>Expense Goose Lifetime Deal - $15 (Limited Time)</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>

      <main className="bg-white">
        {/* Sticky Mobile CTA Bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-green-600 shadow-lg z-50">
          <Link href="/checkout" className="block py-4 px-6 text-center text-white font-bold text-lg flex items-center justify-between">
            <span>GET LIFETIME ACCESS</span>
            <span className="bg-white text-green-600 px-3 py-1 rounded-md text-sm font-bold">$15</span>
          </Link>
        </div>

        {/* Hero Section with Video Frame */}
        <section className="pt-8 pb-12 px-4 bg-gradient-to-b from-green-50 to-white">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-red-100 text-red-800 text-sm font-bold px-3 py-1 rounded-full inline-flex items-center mb-4">
              <AlertTriangle className="w-4 h-4 mr-1" />
              LIMITED TIME OFFER
            </div>
            
            <h1 className="text-4xl font-extrabold text-gray-900 mb-3 leading-tight">
              Track Every Dollar.
              <br/> Ditch the Fees.
            </h1>

            
            <p className="text-lg text-gray-700 mb-6">
              Get <span className="font-bold">lifetime access</span> to premium expense tracking for less than 2 months of competitor pricing.
            </p>
            
       
            
            <div className="bg-white p-4 rounded-lg  border border-green-200 mb-6">
              <div className="flex justify-center gap-4 mb-2">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">$15</div>
                  <div className="text-xs text-gray-500">ONE-TIME</div>
                </div>
                <div className=" w-px bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500 line-through">$13+/mo</div>
                  <div className="text-xs text-gray-500">COMPETITORS</div>
                </div>
              </div>
              <div className="text-center text-sm text-gray-700">
                You save <span className="font-bold">$81+</span> in the first year alone
              </div>
            </div>
            
            <Link href="/checkout" className="block w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg text-lg shadow-lg transition transform hover:scale-105 mb-4">
              GET LIFETIME DEAL - $15
            </Link>
        
          </div>
        </section>

        {/* Countdown Timer Section */}
        <section className="py-6 bg-yellow-50 border-y border-yellow-200">
          <div className="max-w-md mx-auto px-4 text-center">
            <div className="flex items-center justify-center text-yellow-800 font-bold mb-2">
              <Clock className="w-5 h-5 mr-2" />
              OFFER ENDS SOON:
            </div>
            <div className="flex justify-center gap-3">
              <div className="bg-white rounded-lg p-2 shadow-sm w-16">
                <div className="text-2xl font-bold">{timeLeft.hours.toString().padStart(2, '0')}</div>
                <div className="text-xs text-gray-500">HOURS</div>
              </div>
              <div className="bg-white rounded-lg p-2 shadow-sm w-16">
                <div className="text-2xl font-bold">{timeLeft.minutes.toString().padStart(2, '0')}</div>
                <div className="text-xs text-gray-500">MINUTES</div>
              </div>
              <div className="bg-white rounded-lg p-2 shadow-sm w-16">
                <div className="text-2xl font-bold">{timeLeft.seconds.toString().padStart(2, '0')}</div>
                <div className="text-xs text-gray-500">SECONDS</div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="py-12 px-4 bg-white">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-center mb-6">Trusted by 2.1M+ Users</h2>
            
            <div className="space-y-4 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-bold">Saved Our Startup $1,200+</div>
                    <div className="text-sm text-gray-600">"We were using a $25/month tool before finding Expense Goose. The lifetime deal is unbelievable for the features you get."</div>
                    <div className="mt-2 flex items-center">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 ml-1">- Mark T., Startup Founder</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-bold">Perfect for Freelancers</div>
                    <div className="text-sm text-gray-600">"I was hesitant about yet another finance app, but the one-time payment sold me. It's paid for itself 10x over in tax deductions I would have missed."</div>
                    <div className="mt-2 flex items-center">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 ml-1">- Sarah L., Freelance Designer</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Link href="/reviews" className="text-green-600 font-semibold text-sm flex items-center">
                See more user reviews <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Comparison - Mobile Optimized */}
        <section className="py-12 px-4 bg-gray-50">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Why Expense Goose Beats Subscriptions</h2>
            
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-lg mr-4">
                    <Zap className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">One-Time Payment</h3>
                    <p className="text-gray-700 text-sm">Pay $15 once and never worry about monthly fees again. Competitors charge $8-$30/month forever.</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-lg mr-4">
                    <BarChart2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">All Features Included</h3>
                    <p className="text-gray-700 text-sm">No "premium plan" upsells. Get advanced reporting, multi-user access, and all features upfront.</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-lg mr-4">
                    <Smartphone className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Mobile-First Design</h3>
                    <p className="text-gray-700 text-sm">Log expenses in seconds from your phone. Other tools feel clunky on mobile.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

   

        {/* FAQ Section */}
        <section className="py-12 px-4 bg-gray-50">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Common Questions</h2>
            
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="font-bold flex items-center">
                  <ChevronRight className="w-5 h-5 mr-2 text-green-600" />
                  Is this really a one-time payment?
                </h3>
                <p className="mt-2 text-gray-700 pl-7">Yes! Pay $15 once and get lifetime access to all current and future features with no hidden fees.</p>
              </div>
              
              <div className="border-b border-gray-200 pb-4">
                <h3 className="font-bold flex items-center">
                  <ChevronRight className="w-5 h-5 mr-2 text-green-600" />
                  What if I don't like it?
                </h3>
                <p className="mt-2 text-gray-700 pl-7">We offer a 30-day money back guarantee. No questions asked.</p>
              </div>
              
              <div className="border-b border-gray-200 pb-4">
                <h3 className="font-bold flex items-center">
                  <ChevronRight className="w-5 h-5 mr-2 text-green-600" />
                  How does this compare to free apps?
                </h3>
                <p className="mt-2 text-gray-700 pl-7">Free apps lack advanced features, show ads, or sell your data. Expense Goose gives you premium features with complete privacy.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA with Urgency */}
        <section className="py-12 px-4 bg-green-600 text-white">
          <div className="max-w-md mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Don't Miss This Lifetime Deal</h2>
            <p className="mb-6">Join 2.1M+ users who switched to Expense Goose and never looked back.</p>
            
            <div className="bg-green-700 rounded-lg p-4 mb-6">
              <div className="font-bold mb-2">OFFER ENDS IN:</div>
              <div className="flex justify-center gap-3">
                <div className="bg-white text-green-700 rounded-lg p-2 w-16">
                  <div className="text-xl font-bold">{timeLeft.hours.toString().padStart(2, '0')}</div>
                  <div className="text-xs">HOURS</div>
                </div>
                <div className="bg-white text-green-700 rounded-lg p-2 w-16">
                  <div className="text-xl font-bold">{timeLeft.minutes.toString().padStart(2, '0')}</div>
                  <div className="text-xs">MINUTES</div>
                </div>
                <div className="bg-white text-green-700 rounded-lg p-2 w-16">
                  <div className="text-xl font-bold">{timeLeft.seconds.toString().padStart(2, '0')}</div>
                  <div className="text-xs">SECONDS</div>
                </div>
              </div>
            </div>
            
            <Link href="/checkout" className="block w-full bg-white hover:bg-gray-100 text-green-700 font-bold py-4 px-6 rounded-lg text-lg shadow-lg transition transform hover:scale-105 mb-4">
              GET LIFETIME ACCESS NOW - $15
            </Link>
            
            <div className="flex items-center justify-center text-sm text-green-100">
              <Shield className="w-4 h-4 mr-1" />
              30-day money back guarantee • No credit card required
            </div>
          </div>
        </section>
      </main>
    </>
  );
}