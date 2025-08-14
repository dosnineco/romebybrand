
// /pages/tools/marketing-budget-allocator.tsx

import React, { useState } from 'react';
import Head from 'next/head';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';
import { saveAs } from 'file-saver';

// Constants
const DEFAULT_CATEGORIES = [
  { name: 'Social Media', percentage: 20 },
  { name: 'Content Marketing', percentage: 25 },
  { name: 'Email Marketing', percentage: 15 },
  { name: 'SEO', percentage: 20 },
  { name: 'PPC', percentage: 20 },
];

// Types
interface Category {
  name: string;
  percentage: number;
}

interface UserInput {
  budget: number;
  categories: Category[];
}

// Main Component
const MarketingBudgetAllocator: React.FC = () => {
  // State
  const [userInput, setUserInput] = useState<UserInput>({
    budget: 1000,
    categories: DEFAULT_CATEGORIES,
  });
  const [results, setResults] = useState<Category[]>([]);

  // Handlers
  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput({ ...userInput, budget: Number(e.target.value) });
  };

  const handleCategoryChange = (index: number, percentage: number) => {
    const updatedCategories = [...userInput.categories];
    updatedCategories[index].percentage = percentage;
    setUserInput({ ...userInput, categories: updatedCategories });
  };

  const calculateResults = () => {
    const calculatedResults = userInput.categories.map((category) => ({
      ...category,
      amount: (userInput.budget * category.percentage) / 100,
    }));
    setResults(calculatedResults);
  };

  const exportCSV = () => {
    const csvContent = `data:text/csv;charset=utf-8,Category,Percentage,Amount\n${results
      .map((r) => `${r.name},${r.percentage},${r.amount}`)
      .join('\n')}`;
    const encodedUri = encodeURI(csvContent);
    saveAs(encodedUri, 'marketing-budget.csv');
  };

  // UI
  return (
    <div className="max-w-screen-md mx-auto px-4 py-8">
      <Head>
        <title>Marketing Budget Allocator</title>
        <meta name="description" content="Allocate your marketing budget effectively with our free tool." />
        <meta name="keywords" content="marketing, budget, allocator, finance tool" />
        <link rel="canonical" href="https://www.expensegoose.com/tools/marketing-budget-allocator" />
      </Head>

      <h1 className="text-3xl font-bold text-center mb-6">Marketing Budget Allocator</h1>
      <p className="text-base text-gray-700 mb-4">
        Welcome to the Marketing Budget Allocator. This tool helps you allocate your marketing budget across different channels effectively.
      </p>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Budget Input</h2>
        <div className="mb-4">
          <label className="block text-base mb-2" htmlFor="budget">
            Total Budget ($)
          </label>
          <input
            type="number"
            id="budget"
            value={userInput.budget}
            onChange={handleBudgetChange}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <h3 className="text-xl font-semibold mb-4">Categories</h3>
        {userInput.categories.map((category, index) => (
          <div key={index} className="mb-4">
            <label className="block text-base mb-2" htmlFor={`category-${index}`}>
              {category.name} (%)
            </label>
            <input
              type="number"
              id={`category-${index}`}
              value={category.percentage}
              onChange={(e) => handleCategoryChange(index, Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        ))}

        <button
          onClick={calculateResults}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
        >
          Calculate
        </button>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Results</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={results}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>

        <button
          onClick={exportCSV}
          className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
        >
          <Download className="inline-block mr-2" /> Export CSV
        </button>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Tips</h2>
        <ul className="list-disc list-inside mb-4 text-base">
          <li>Regularly review your budget allocations to ensure they align with your marketing goals.</li>
          <li>Consider seasonal trends and adjust your budget accordingly.</li>
          <li>Use data analytics to measure the effectiveness of each channel.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">FAQs</h2>
        <ul className="list-disc list-inside mb-4 text-base">
          <li>How often should I update my marketing budget? - It's recommended to review it quarterly.</li>
          <li>Can I add more categories? - Yes, you can customize the categories as needed.</li>
          <li>Is this tool free to use? - Absolutely, it's completely free.</li>
        </ul>
      </section>
    </div>
  );
};

export default MarketingBudgetAllocator;


This refactored code provides a clean, modular, and scalable structure for the Marketing Budget Allocator tool. It uses Tailwind CSS for styling, React hooks for state management, and includes a bar chart for visualizing results. The code is organized into logical sections, making it easy to maintain and extend.