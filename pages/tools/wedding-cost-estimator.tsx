
// /pages/tools/wedding-cost-estimator.tsx

import React, { useState } from 'react';
import Head from 'next/head';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';
import { saveAs } from 'file-saver';
import { NextPage } from 'next';
import { FAQSection, TipsSection } from '../../components';

interface Category {
  name: string;
  cost: number;
}

interface UserInput {
  categories: Category[];
}

const defaultCategories: Category[] = [
  { name: 'Venue', cost: 5000 },
  { name: 'Catering', cost: 3000 },
  { name: 'Photography', cost: 2000 },
  { name: 'Music', cost: 1000 },
];

const WeddingCostEstimator: NextPage = () => {
  const [userInput, setUserInput] = useState<UserInput>({ categories: defaultCategories });
  const [results, setResults] = useState<number>(0);

  const handleInputChange = (index: number, cost: number) => {
    const updatedCategories = [...userInput.categories];
    updatedCategories[index].cost = cost;
    setUserInput({ categories: updatedCategories });
  };

  const calculateTotalCost = () => {
    const total = userInput.categories.reduce((acc, category) => acc + category.cost, 0);
    setResults(total);
  };

  const exportToCSV = () => {
    const csvContent = `data:text/csv;charset=utf-8,Category,Cost\n${userInput.categories
      .map((cat) => `${cat.name},${cat.cost}`)
      .join('\n')}`;
    const encodedUri = encodeURI(csvContent);
    saveAs(encodedUri, 'wedding-cost-estimator.csv');
  };

  const chartData = userInput.categories.map((category) => ({
    name: category.name,
    cost: category.cost,
  }));

  return (
    <div className="max-w-screen-md mx-auto px-4 py-8">
      <Head>
        <title>Wedding Cost Estimator</title>
        <meta name="description" content="Estimate your wedding costs with our free tool." />
        <meta name="keywords" content="wedding, cost, estimator, finance, tool" />
        <link rel="canonical" href="https://www.expensegoose.com/tools/wedding-cost-estimator" />
      </Head>
      <h1 className="text-3xl font-bold text-center mb-6">Wedding Cost Estimator</h1>
      <p className="text-base text-gray-700 mb-4">
        Planning a wedding can be overwhelming, especially when it comes to budgeting. Use our Wedding Cost Estimator to get a clearer picture of your expenses.
      </p>
      <div>
        {userInput.categories.map((category, index) => (
          <div key={index} className="mb-4">
            <label className="block text-base font-semibold mb-2">{category.name}</label>
            <input
              type="number"
              value={category.cost}
              onChange={(e) => handleInputChange(index, parseFloat(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded"
              aria-label={`Cost for ${category.name}`}
            />
          </div>
        ))}
        <button
          onClick={calculateTotalCost}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
        >
          Calculate Total Cost
        </button>
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">Results</h2>
          <p className="text-base text-gray-700 mb-4">Total Estimated Cost: ${results}</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="cost" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
          <button
            onClick={exportToCSV}
            className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 flex items-center"
          >
            <Download className="mr-2" /> Export as CSV
          </button>
        </div>
      </div>
      <TipsSection />
      <FAQSection />
    </div>
  );
};

export default WeddingCostEstimator;

// components/FAQSection.tsx
export const FAQSection: React.FC = () => (
  <div className="mt-8">
    <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
    <ul className="list-disc list-inside mb-4 text-base">
      <li>How accurate is the Wedding Cost Estimator?</li>
      <li>Can I add more categories?</li>
      <li>How do I export my results?</li>
    </ul>
  </div>
);

// components/TipsSection.tsx
export const TipsSection: React.FC = () => (
  <div className="mt-8">
    <h2 className="text-2xl font-semibold mb-4">Tips for Planning Your Wedding</h2>
    <ul className="list-disc list-inside mb-4 text-base">
      <li>Start planning early to avoid last-minute stress.</li>
      <li>Set a realistic budget and stick to it.</li>
      <li>Consider hiring a wedding planner for expert advice.</li>
    </ul>
  </div>
);


This code provides a structured and modular approach to building the Wedding Cost Estimator tool using Next.js and React. It includes separate components for FAQs and tips, uses TailwindCSS for styling, and ensures accessibility and responsiveness.