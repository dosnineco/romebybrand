Certainly! Below is a refactored Next.js page component for the "Side Hustle Profit Estimator" tool. This code is structured to be maintainable, scalable, and optimized for usability. It includes Tailwind CSS for styling, React hooks for state management, and modular components for repeated UI elements.


// /pages/tools/side-hustle-profit-estimator.tsx

import React, { useState } from 'react';
import Head from 'next/head';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';

interface Category {
  name: string;
  income: number;
  expenses: number;
}

const defaultCategories: Category[] = [
  { name: 'Freelancing', income: 0, expenses: 0 },
  { name: 'Online Store', income: 0, expenses: 0 },
];

const SideHustleProfitEstimator: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [results, setResults] = useState<number[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  const handleInputChange = (index: number, field: keyof Category, value: number) => {
    const updatedCategories = [...categories];
    updatedCategories[index][field] = value;
    setCategories(updatedCategories);
  };

  const calculateResults = () => {
    const calculatedResults = categories.map(category => category.income - category.expenses);
    setResults(calculatedResults);
    prepareChartData(calculatedResults);
  };

  const prepareChartData = (calculatedResults: number[]) => {
    const data = categories.map((category, index) => ({
      name: category.name,
      Profit: calculatedResults[index],
    }));
    setChartData(data);
  };

  const exportCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,'
      + categories.map(category => `${category.name},${category.income},${category.expenses}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'side_hustle_profit_estimator.csv');
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="max-w-screen-md mx-auto px-4 py-8">
      <Head>
        <title>Side Hustle Profit Estimator</title>
        <meta name="description" content="Estimate your side hustle profits with our easy-to-use tool." />
        <meta name="keywords" content="side hustle, profit estimator, finance tool" />
        <link rel="canonical" href="https://www.expensegoose.com/tools/side-hustle-profit-estimator" />
      </Head>

      <h1 className="text-3xl font-bold text-center mb-6">Side Hustle Profit Estimator</h1>
      <p className="text-base text-gray-700 mb-4">
        Welcome to the Side Hustle Profit Estimator! This tool helps you calculate the potential profits from your side hustles. Simply enter your income and expenses for each category, and we'll do the rest.
      </p>

      <div>
        {categories.map((category, index) => (
          <div key={index} className="mb-4">
            <h2 className="text-2xl font-semibold mb-4">{category.name}</h2>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-base text-gray-700 mb-2">Income</label>
                <input
                  type="number"
                  value={category.income}
                  onChange={(e) => handleInputChange(index, 'income', parseFloat(e.target.value))}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div className="flex-1">
                <label className="block text-base text-gray-700 mb-2">Expenses</label>
                <input
                  type="number"
                  value={category.expenses}
                  onChange={(e) => handleInputChange(index, 'expenses', parseFloat(e.target.value))}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={calculateResults}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 mb-6"
      >
        Calculate Profit
      </button>

      {results.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Results</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Profit" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>

          <button
            onClick={exportCSV}
            className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 flex items-center"
          >
            <Download className="mr-2" /> Export as CSV
          </button>
        </div>
      )}

      <TipsSection />

      <FAQSection />
    </div>
  );
};

const TipsSection: React.FC = () => (
  <div className="mt-8">
    <h2 className="text-2xl font-semibold mb-4">Tips for Maximizing Your Side Hustle Profits</h2>
    <ul className="list-disc list-inside mb-4 text-base">
      <li>Track all your expenses meticulously to avoid surprises.</li>
      <li>Consider reinvesting a portion of your profits to grow your side hustle.</li>
      <li>Stay updated with market trends to keep your offerings relevant.</li>
    </ul>
  </div>
);

const FAQSection: React.FC = () => (
  <div className="mt-8">
    <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
    <div className="mb-4">
      <h3 className="text-xl font-semibold mb-2">How accurate is the profit estimation?</h3>
      <p className="text-base text-gray-700 mb-4">
        The estimation is as accurate as the data you provide. Ensure that your income and expenses are up-to-date for the best results.
      </p>
    </div>
    <div className="mb-4">
      <h3 className="text-xl font-semibold mb-2">Can I add more categories?</h3>
      <p className="text-base text-gray-700 mb-4">
        Currently, the tool supports a fixed number of categories. We are working on adding more flexibility in future updates.
      </p>
    </div>
  </div>
);

export default SideHustleProfitEstimator;


This code is structured to be easily extendable and maintainable. The use of Tailwind CSS ensures a modern and responsive design, while the modular components make it easy to add new features or categories in the future.