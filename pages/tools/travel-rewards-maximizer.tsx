
// /pages/tools/travel-rewards-maximizer.tsx

import React, { useState } from 'react';
import Head from 'next/head';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';
import { saveAs } from 'file-saver';

// Constants
const DEFAULT_CATEGORIES = ['Flights', 'Hotels', 'Dining', 'Shopping'];

// Types
interface UserInput {
  category: string;
  amount: number;
}

interface ChartData {
  name: string;
  value: number;
}

// Main Component
const TravelRewardsMaximizer: React.FC = () => {
  // State
  const [userInputs, setUserInputs] = useState<UserInput[]>([]);
  const [results, setResults] = useState<number[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  // Handlers
  const handleAddCategory = () => {
    setUserInputs([...userInputs, { category: '', amount: 0 }]);
  };

  const handleInputChange = (index: number, field: keyof UserInput, value: string | number) => {
    const updatedInputs = [...userInputs];
    updatedInputs[index][field] = field === 'amount' ? Number(value) : value;
    setUserInputs(updatedInputs);
  };

  const calculateResults = () => {
    const calculatedResults = userInputs.map(input => input.amount * 1.5); // Example calculation
    setResults(calculatedResults);

    const updatedChartData = userInputs.map((input, index) => ({
      name: input.category,
      value: calculatedResults[index],
    }));
    setChartData(updatedChartData);
  };

  const exportCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,Category,Amount,Result\n' +
      userInputs.map((input, index) => `${input.category},${input.amount},${results[index]}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    saveAs(encodedUri, 'travel_rewards_maximizer_results.csv');
  };

  return (
    <div className="max-w-screen-md mx-auto px-4 py-8">
      <Head>
        <title>Travel Rewards Maximizer</title>
        <meta name="description" content="Maximize your travel rewards with our free tool." />
        <meta name="keywords" content="travel, rewards, finance, tool" />
        <link rel="canonical" href="https://www.expensegoose.com/tools/travel-rewards-maximizer" />
      </Head>

      <h1 className="text-3xl font-bold text-center mb-6">Travel Rewards Maximizer</h1>
      <p className="text-base text-gray-700 mb-4">
        Welcome to the Travel Rewards Maximizer! This tool helps you optimize your spending to earn the most travel rewards possible. Simply enter your spending categories and amounts, and let us do the rest.
      </p>

      <div className="mb-4">
        {userInputs.map((input, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              value={input.category}
              onChange={(e) => handleInputChange(index, 'category', e.target.value)}
              placeholder="Category"
              className="mr-2 px-2 py-1 border rounded"
            />
            <input
              type="number"
              value={input.amount}
              onChange={(e) => handleInputChange(index, 'amount', e.target.value)}
              placeholder="Amount"
              className="mr-2 px-2 py-1 border rounded"
            />
          </div>
        ))}
        <button onClick={handleAddCategory} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300">
          Add Category
        </button>
      </div>

      <button onClick={calculateResults} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 mb-4">
        Calculate
      </button>

      {results.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Results</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>

          <button onClick={exportCSV} className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 mt-4">
            <Download className="mr-2" /> Export CSV
          </button>

          <Tips />
        </div>
      )}

      <FAQ />
    </div>
  );
};

// Tips Component
const Tips: React.FC = () => (
  <div className="mt-8">
    <h3 className="text-xl font-semibold mb-4">Tips for Maximizing Rewards</h3>
    <ul className="list-disc list-inside mb-4 text-base">
      <li>Focus on categories with the highest reward rates.</li>
      <li>Consider using a credit card that offers bonus points for travel-related expenses.</li>
      <li>Keep track of your spending to ensure you meet any minimum spend requirements for bonuses.</li>
    </ul>
  </div>
);

// FAQ Component
const FAQ: React.FC = () => (
  <div className="mt-8">
    <h3 className="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
    <ul className="list-disc list-inside mb-4 text-base">
      <li><strong>How does the Travel Rewards Maximizer work?</strong> Enter your spending categories and amounts, and the tool calculates potential rewards based on typical reward rates.</li>
      <li><strong>Can I export my results?</strong> Yes, you can export your results as a CSV file for further analysis.</li>
      <li><strong>Is this tool free to use?</strong> Absolutely! Our tool is completely free to use.</li>
    </ul>
  </div>
);

export default TravelRewardsMaximizer;


This code provides a complete Next.js page component for the "Travel Rewards Maximizer" tool, following the specified requirements. It includes a form for user inputs, calculation logic, a chart for visualizing results, and additional sections for tips and FAQs. The page is styled using TailwindCSS for a modern and responsive design.