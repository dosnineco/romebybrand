
// /pages/tools/work-from-home-savings-estimator.tsx

import React, { useState } from 'react';
import Head from 'next/head';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Download } from 'lucide-react';
import { saveAs } from 'file-saver';

// Constants
const DEFAULT_CATEGORIES = [
  { name: 'Commute', cost: 300 },
  { name: 'Lunch', cost: 150 },
  { name: 'Clothing', cost: 100 },
];

// Types
interface Category {
  name: string;
  cost: number;
}

interface UserInput {
  categories: Category[];
}

// Main Component
const WorkFromHomeSavingsEstimator: React.FC = () => {
  // State
  const [userInput, setUserInput] = useState<UserInput>({ categories: DEFAULT_CATEGORIES });
  const [results, setResults] = useState<number>(0);

  // Handlers
  const handleCategoryChange = (index: number, field: keyof Category, value: string) => {
    const updatedCategories = [...userInput.categories];
    updatedCategories[index][field] = field === 'cost' ? parseFloat(value) : value;
    setUserInput({ categories: updatedCategories });
  };

  const addCategory = () => {
    setUserInput({ categories: [...userInput.categories, { name: '', cost: 0 }] });
  };

  const removeCategory = (index: number) => {
    const updatedCategories = userInput.categories.filter((_, i) => i !== index);
    setUserInput({ categories: updatedCategories });
  };

  const calculateSavings = () => {
    const totalSavings = userInput.categories.reduce((acc, category) => acc + category.cost, 0);
    setResults(totalSavings);
  };

  const exportCSV = () => {
    const csvContent = `data:text/csv;charset=utf-8,Category,Cost\n${userInput.categories
      .map((c) => `${c.name},${c.cost}`)
      .join('\n')}`;
    const encodedUri = encodeURI(csvContent);
    saveAs(encodedUri, 'savings.csv');
  };

  // Chart Data
  const chartData = userInput.categories.map((category) => ({
    name: category.name,
    Cost: category.cost,
  }));

  // UI
  return (
    <div className="max-w-screen-md mx-auto px-4 py-8">
      <Head>
        <title>Work From Home Savings Estimator</title>
        <meta name="description" content="Estimate your savings by working from home." />
        <meta name="keywords" content="savings, work from home, finance tool" />
        <link rel="canonical" href="https://www.expensegoose.com/tools/work-from-home-savings-estimator" />
      </Head>

      <h1 className="text-3xl font-bold text-center mb-6">Work From Home Savings Estimator</h1>
      <p className="text-base text-gray-700 mb-4">
        Discover how much you can save by working from home. Adjust the categories below to match your expenses.
      </p>

      <div className="mb-6">
        {userInput.categories.map((category, index) => (
          <div key={index} className="flex items-center mb-4">
            <input
              type="text"
              value={category.name}
              onChange={(e) => handleCategoryChange(index, 'name', e.target.value)}
              placeholder="Category"
              className="mr-2 px-2 py-1 border rounded"
            />
            <input
              type="number"
              value={category.cost}
              onChange={(e) => handleCategoryChange(index, 'cost', e.target.value)}
              placeholder="Cost"
              className="mr-2 px-2 py-1 border rounded"
            />
            <button
              onClick={() => removeCategory(index)}
              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        ))}
        <button onClick={addCategory} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Add Category
        </button>
      </div>

      <button onClick={calculateSavings} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mb-6">
        Calculate Savings
      </button>

      <h2 className="text-2xl font-semibold mb-4">Results</h2>
      <p className="text-base text-gray-700 mb-4">Your estimated savings: ${results}</p>

      <BarChart width={500} height={300} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Cost" fill="#8884d8" />
      </BarChart>

      <button onClick={exportCSV} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mt-6">
        Export as CSV
      </button>

      <h2 className="text-2xl font-semibold mb-4 mt-8">Tips</h2>
      <ul className="list-disc list-inside mb-4 text-base">
        <li>Review your monthly expenses to find additional savings.</li>
        <li>Consider the environmental benefits of reduced commuting.</li>
        <li>Use the extra time saved from commuting for personal development.</li>
      </ul>

      <h2 className="text-2xl font-semibold mb-4 mt-8">FAQs</h2>
      <ul className="list-disc list-inside mb-4 text-base">
        <li>How accurate is this estimator? - The tool provides an estimate based on your inputs.</li>
        <li>Can I add more categories? - Yes, use the "Add Category" button to include more expenses.</li>
        <li>How can I export my results? - Click the "Export as CSV" button to download your data.</li>
      </ul>
    </div>
  );
};

export default WorkFromHomeSavingsEstimator;


