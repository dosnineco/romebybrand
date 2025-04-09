import React from 'react';

const Pricing = () => {
  const handleSubscribe = () => {
    if (typeof window !== 'undefined' && window.Paddle) {
      window.Paddle.Checkout.open({
        product: 'pri_01jrc6e2bkwvtfbdfyq7j87fqh', // Replace with your Paddle product ID
        email: '', // Optionally pre-fill the user's email
        successCallback: (data) => {
          console.log('Subscription successful:', data);

          // Update subscription status in the database
          fetch('/api/update-subscription', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ is_subscribed: true }),
          });
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">Subscribe Now</h1>
          <p className="text-center text-gray-600 mb-6">
            Unlock all features for just <span className="font-semibold">$4.99/month</span>.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">$4.99/month</h2>
            <p className="text-center text-gray-600">
              Access premium tools and features to manage your expenses effectively.
            </p>
          </div>
          <button
            onClick={handleSubscribe}
            className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition duration-200"
          >
            Subscribe Now
          </button>
        </div>
        <div className="bg-gray-100 p-4 text-center">
          <p className="text-sm text-gray-500">
            Cancel anytime. 7-day free trial included.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;