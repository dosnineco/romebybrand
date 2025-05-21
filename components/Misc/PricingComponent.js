import React from "react";

const PricingComponent = () => {
  return (

    <>
    
          {/* <h2 className="text-4xl pt-6 font-bold capitalize text-inherit text-center mb-4">Become the best version of yourself!</h2> */}

  
        <div className="  w-full max-w-screen-md mx-auto px-4 py-8 text-white grid grid-cols-1 md:grid-cols-2 gap-3 justify-center  items-center">

          {/* Features Section */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      

            <ul className="space-y-4">
              {[
                "Unlimited access to all features",
                "No hidden fees or charges",
                "Early access to new features",
                "anonymous data collection",
              ].map((feature, index) => (
                <li key={index} className="flex items-center">
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
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

     

          {/* Lifetime Deal Card */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center relative border-2 border-yellow-500">
            <div className="absolute top-0 right-0 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-bl-lg">
              POPULAR
            </div>
            <h3 className="text-xl font-semibold mb-4">Lifetime Deal</h3>
            <div className="text-4xl font-bold mb-2">
              $15 <span className="text-lg font-medium line-through text-gray-400">$45</span>
            </div>
            <p className="text-sm text-gray-400 mb-6">One-time payment. No subscription</p>
            <a
              href="/checkout"
              className="px-6 py-3 bg-pink-500 text-white font-bold rounded-lg hover:bg-pink-600 transition"
            >
              Get Access Now
            </a>
          </div>
        </div>
            </>

     
  );
};

export default PricingComponent;