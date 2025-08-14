
// /pages/tools/subscription-business-revenue-forecaster.tsx

import React, { useState } from 'react';
import Head from 'next/head';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';
import { saveAs } from 'file-saver';

// Constants
const DEFAULT_CATEGORIES = ['Basic', 'Standard', 'Premium'];

// Types
interface SubscriptionData {
  category: string;
  price: number;
  subscribers: number;
}

interface ChartData {
  name: string;
  revenue: number;
}

// Main Component
const SubscriptionBusinessRevenueForecaster: React.FC = () => {
  // State
  const [subscriptions, setSubscriptions] = useState<SubscriptionData[]>(DEFAULT_CATEGORIES.map(category => ({
    category,
    price: 0,
    subscribers: 0,
  })));
  const [chartData, setChartData] = useState<ChartData[]>([]);

  // Handlers
  const handleInputChange = (index: number, field: keyof SubscriptionData, value: number) => {
    const updatedSubscriptions = [...subscriptions];
    updatedSubscriptions[index][field] = value;
    setSubscriptions(updatedSubscriptions);
    calculateResults(updatedSubscriptions);
  };

  const calculateResults = (data: SubscriptionData[]) => {
    const results = data.map(item => ({
      name: item.category,
      revenue: item.price * item.subscribers,
    }));
    setChartData(results);
  };

  const exportCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,' + chartData.map(e => `${e.name},${e.revenue}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    saveAs(encodedUri, 'subscription_revenue.csv');
  };

  // UI
  return (
    <div className="max-w-screen-md mx-auto px-4 py-8">
      <Head>
        <title>Subscription Business Revenue Forecaster</title>
        <meta name="description" content="Forecast your subscription business revenue with our free tool." />
        <meta name="keywords" content="subscription, revenue, forecast, business, tool" />
        <link rel="canonical" href="https://www.expensegoose.com/tools/subscription-business-revenue-forecaster" />
      </Head>

      <h1 className="text-3xl font-bold text-center mb-6">Subscription Business Revenue Forecaster</h1>
      <p className="text-base text-gray-700 mb-4">
        Welcome to the Subscription Business Revenue Forecaster. This tool helps you estimate the revenue potential of your subscription-based business. Simply enter your subscription categories, prices, and subscriber counts to get started.
      </p>

      <div className="mb-8">
        {subscriptions.map((subscription, index) => (
          <div key={index} className="mb-4">
            <h2 className="text-xl font-semibold mb-2">{subscription.category} Plan</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-gray-700 mb-1">Price ($)</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={subscription.price}
                  onChange={(e) => handleInputChange(index, 'price', parseFloat(e.target.value))}
                />
              </div>
              <div className="flex-1">
                <label className="block text-gray-700 mb-1">Subscribers</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={subscription.subscribers}
                  onChange={(e) => handleInputChange(index, 'subscribers', parseFloat(e.target.value))}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Revenue Chart</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#3182ce" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <button
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
        onClick={exportCSV}
      >
        <Download className="inline-block mr-2" /> Export as CSV
      </button>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Tips for Maximizing Revenue</h2>
        <ul className="list-disc list-inside mb-4 text-base">
          <li>Consider offering discounts for annual subscriptions to increase upfront revenue.</li>
          <li>Regularly review and adjust pricing based on market trends and customer feedback.</li>
          <li>Focus on customer retention strategies to maintain and grow your subscriber base.</li>
        </ul>
      </div>

      <FAQSection />
    </div>
  );
};

// FAQ Component
const FAQSection: React.FC = () => (
  <div className="mt-8">
    <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
    <div className="mb-4">
      <h3 className="text-xl font-semibold mb-2">How accurate is the revenue forecast?</h3>
      <p className="text-base text-gray-700 mb-4">
        The forecast is based on the data you provide. For the most accurate results, ensure your input data is as precise as possible.
      </p>
    </div>
    <div className="mb-4">
      <h3 className="text-xl font-semibold mb-2">Can I add more subscription categories?</h3>
      <p className="text-base text-gray-700 mb-4">
        Currently, the tool supports three default categories. Future updates may include the ability to add more categories.
      </p>
    </div>
  </div>
);

export default SubscriptionBusinessRevenueForecaster;


This code provides a structured and modular Next.js page component for the "Subscription Business Revenue Forecaster" tool. It includes a main component with state management, handlers for input changes, a chart for visualizing data, and an export function for CSV. The FAQ section is modularized for better maintainability. TailwindCSS is used for styling, ensuring a modern and responsive design.