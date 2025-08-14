
// /pages/tools/small-business-profit-calculator.tsx

import React, { useState } from 'react';
import Head from 'next/head';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Download } from 'lucide-react';
import { saveAs } from 'file-saver';
import { CSVLink } from 'react-csv';
import { NextPage } from 'next';

// Constants
const DEFAULT_CATEGORIES = [
  { name: 'Revenue', value: 0 },
  { name: 'Expenses', value: 0 },
];

// Types
interface Category {
  name: string;
  value: number;
}

interface ChartData {
  name: string;
  value: number;
}

// Main Component
const SmallBusinessProfitCalculator: NextPage = () => {
  // State
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [profit, setProfit] = useState<number>(0);

  // Handlers
  const handleCategoryChange = (index: number, value: number) => {
    const updatedCategories = [...categories];
    updatedCategories[index].value = value;
    setCategories(updatedCategories);
    calculateProfit(updatedCategories);
  };

  const calculateProfit = (categories: Category[]) => {
    const revenue = categories.find(cat => cat.name === 'Revenue')?.value || 0;
    const expenses = categories.find(cat => cat.name === 'Expenses')?.value || 0;
    const calculatedProfit = revenue - expenses;
    setProfit(calculatedProfit);
    prepareChartData(revenue, expenses, calculatedProfit);
  };

  const prepareChartData = (revenue: number, expenses: number, profit: number) => {
    setChartData([
      { name: 'Revenue', value: revenue },
      { name: 'Expenses', value: expenses },
      { name: 'Profit', value: profit },
    ]);
  };

  const exportCSV = () => {
    const csvData = categories.map(cat => ({ Category: cat.name, Value: cat.value }));
    saveAs(new Blob([csvData], { type: 'text/csv;charset=utf-8;' }), 'profit-calculator.csv');
  };

  // UI
  return (
    <div className="max-w-screen-md mx-auto px-4 py-8">
      <Head>
        <title>Small Business Profit Calculator</title>
        <meta name="description" content="Calculate your small business profit easily with our free tool." />
        <meta name="keywords" content="profit calculator, small business, finance tool" />
        <link rel="canonical" href="https://www.expensegoose.com/tools/small-business-profit-calculator" />
      </Head>

      <h1 className="text-3xl font-bold text-center mb-6">Small Business Profit Calculator</h1>
      <p className="text-base text-gray-700 mb-4">
        Welcome to the Small Business Profit Calculator. This tool helps you quickly determine your business's profit by inputting your revenue and expenses. Let's get started!
      </p>

      <div className="mb-8">
        {categories.map((category, index) => (
          <div key={index} className="mb-4">
            <label className="block text-xl font-semibold mb-2">{category.name}</label>
            <input
              type="number"
              value={category.value}
              onChange={(e) => handleCategoryChange(index, parseFloat(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        ))}
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Results</h2>
        <p className="text-base text-gray-700 mb-4">Your calculated profit is: <strong>${profit}</strong></p>
        <BarChart width={500} height={300} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </div>

      <button onClick={exportCSV} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300">
        Export as CSV
      </button>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Tips for Maximizing Profit</h2>
        <ul className="list-disc list-inside mb-4 text-base">
          <li>Regularly review your expenses to identify areas for cost-cutting.</li>
          <li>Explore new revenue streams to diversify your income.</li>
          <li>Invest in marketing strategies that offer high ROI.</li>
        </ul>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
        <ul className="list-disc list-inside mb-4 text-base">
          <li>How do I calculate profit? - Profit is calculated by subtracting total expenses from total revenue.</li>
          <li>Can I add more categories? - Currently, the tool supports basic revenue and expenses categories.</li>
          <li>Is this tool free to use? - Yes, the Small Business Profit Calculator is completely free.</li>
        </ul>
      </div>
    </div>
  );
};

export default SmallBusinessProfitCalculator;


This code provides a structured and modular Next.js page component for a "Small Business Profit Calculator" tool. It includes a form for inputting revenue and expenses, calculates profit, displays results in a bar chart, and offers CSV export functionality. The page is styled using Tailwind CSS and includes SEO tags, a tips section, and an FAQ section for enhanced user engagement.