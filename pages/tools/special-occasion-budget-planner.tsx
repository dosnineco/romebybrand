
// /pages/tools/special-occasion-budget-planner.tsx

import React, { useState } from 'react';
import Head from 'next/head';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';
import { saveAs } from 'file-saver';

// Constants
const DEFAULT_CATEGORIES = [
  { name: 'Venue', budget: 0 },
  { name: 'Catering', budget: 0 },
  { name: 'Decorations', budget: 0 },
  { name: 'Entertainment', budget: 0 },
];

// Types
interface Category {
  name: string;
  budget: number;
}

interface ChartData {
  name: string;
  Budget: number;
}

// Main Component
const SpecialOccasionBudgetPlanner: React.FC = () => {
  // State
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [totalBudget, setTotalBudget] = useState<number>(0);

  // Handlers
  const handleBudgetChange = (index: number, value: number) => {
    const updatedCategories = [...categories];
    updatedCategories[index].budget = value;
    setCategories(updatedCategories);
    calculateTotalBudget(updatedCategories);
  };

  const calculateTotalBudget = (categories: Category[]) => {
    const total = categories.reduce((sum, category) => sum + category.budget, 0);
    setTotalBudget(total);
  };

  const exportCSV = () => {
    const csvContent = `data:text/csv;charset=utf-8,Category,Budget\n${categories
      .map((cat) => `${cat.name},${cat.budget}`)
      .join('\n')}`;
    const encodedUri = encodeURI(csvContent);
    saveAs(encodedUri, 'budget.csv');
  };

  // Chart Data
  const chartData: ChartData[] = categories.map((category) => ({
    name: category.name,
    Budget: category.budget,
  }));

  // UI
  return (
    <>
      <Head>
        <title>Special Occasion Budget Planner</title>
        <meta name="description" content="Plan your special occasion budget with ease." />
        <meta name="keywords" content="budget, planner, finance, special occasion" />
        <link rel="canonical" href="https://www.expensegoose.com/tools/special-occasion-budget-planner" />
      </Head>
      <div className="max-w-screen-md mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-6">Special Occasion Budget Planner</h1>
        <p className="text-base text-gray-700 mb-4">
          Planning a special occasion can be both exciting and overwhelming. With the Special Occasion Budget Planner, you can easily manage your expenses and ensure that your event stays within budget.
        </p>
        <div>
          {categories.map((category, index) => (
            <div key={index} className="mb-4">
              <label className="block text-xl font-semibold mb-2">{category.name}</label>
              <input
                type="number"
                value={category.budget}
                onChange={(e) => handleBudgetChange(index, parseFloat(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg"
                aria-label={`Budget for ${category.name}`}
              />
            </div>
          ))}
        </div>
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">Total Budget: ${totalBudget}</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Budget" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <button
          onClick={exportCSV}
          className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
        >
          <Download className="inline-block mr-2" />
          Export as CSV
        </button>
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Tips for Budgeting</h2>
          <ul className="list-disc list-inside mb-4 text-base">
            <li>Start with a clear vision of your event.</li>
            <li>Prioritize essential expenses over optional ones.</li>
            <li>Keep track of all expenses to avoid surprises.</li>
            <li>Consider negotiating with vendors for better rates.</li>
          </ul>
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
          <ul className="list-disc list-inside mb-4 text-base">
            <li>How do I add more categories?</li>
            <li>Can I share my budget with others?</li>
            <li>Is there a mobile app available?</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default SpecialOccasionBudgetPlanner;


This code provides a structured and modular approach to building the "Special Occasion Budget Planner" tool using Next.js and TailwindCSS. It includes a responsive design, accessible forms, and a bar chart for visualizing budget data. The code is organized into logical sections, making it easy to maintain and extend.