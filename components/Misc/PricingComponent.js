import React from 'react';

const PricingComponent = () => {
  const totalSpots = 2000; // Total number of spots available

  return (
    <div className="w-full py-16">
      {/* Pricing Section */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        {/* Pricing Card */}
        <div className="bg-secondary-color text-white rounded-2xl shadow-xl overflow-hidden max-w-2xl mx-auto">
          <div className="px-8 py-12">
            <div className="text-center">
              <div className="inline-flex items-baseline mb-6">
                <span className="text-5xl font-extrabold text-white">One Time Payment</span>
                <span className="ml-2 text-xl font-medium text-white">/15 USD</span>
              </div>
              {/* Dynamically display spots left */}
              <p className="text-sm text-white mb-8">
              Explore our collection of financial tools              </p>
              <ul className="space-y-4 mb-12">
                {[
                  'Ai-powered insights',
                  'Real-time expense tracking',
                  'Unlimited expense entries',
                  'Quick expense logging',
                  'Category limit alerts',
                  'Add saving goals',
                  'Best Saving Newsletter',
                  '20+ financial calculators',
                ].map((feature) => {
                  const parts = feature.split(' - save ');
                  return (
                    <li key={feature} className="flex items-center">
                      <svg
                        className="h-6 w-6 text-green-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>{parts[0]}</span>
                      {parts[1] && (
                        <span className="ml-2 text-red-600 line-through">
                          save {parts[1]}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>

              <a
                href="/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-white hover:bg-gray-300 text-black font-bold py-4 px-8 rounded-xl transition-colors duration-200 text-center block"
              >
                Get Started Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingComponent;