
// /pages/tools/home-energy-savings-calculator.tsx

import React, { useState } from 'react';
import Head from 'next/head';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';
import { saveAs } from 'file-saver';
import { NextPage } from 'next';
import { FAQ, Tips } from '../../components';

interface UserInput {
  category: string;
  currentUsage: number;
  targetUsage: number;
}

const defaultCategories: UserInput[] = [
  { category: 'Heating', currentUsage: 100, targetUsage: 80 },
  { category: 'Cooling', currentUsage: 100, targetUsage: 70 },
  { category: 'Lighting', currentUsage: 50, targetUsage: 30 },
];

const HomeEnergySavingsCalculator: NextPage = () => {
  const [inputs, setInputs] = useState<UserInput[]>(defaultCategories);
  const [results, setResults] = useState<number[]>([]);

  const handleInputChange = (index: number, field: keyof UserInput, value: number) => {
    const newInputs = [...inputs];
    newInputs[index][field] = value;
    setInputs(newInputs);
  };

  const calculateSavings = () => {
    const savings = inputs.map(input => input.currentUsage - input.targetUsage);
    setResults(savings);
  };

  const exportCSV = () => {
    const csvContent = `data:text/csv;charset=utf-8,Category,Current Usage,Target Usage,Savings\n` +
      inputs.map((input, index) => `${input.category},${input.currentUsage},${input.targetUsage},${results[index]}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    saveAs(encodedUri, 'home-energy-savings.csv');
  };

  const chartData = inputs.map((input, index) => ({
    category: input.category,
    current: input.currentUsage,
    target: input.targetUsage,
    savings: results[index] || 0,
  }));

  return (
    <div className="max-w-screen-md mx-auto px-4 py-8">
      <Head>
        <title>Home Energy Savings Calculator</title>
        <meta name="description" content="Calculate your potential home energy savings with our free tool." />
        <meta name="keywords" content="energy savings, home energy, calculator, personal finance" />
        <link rel="canonical" href="https://www.expensegoose.com/tools/home-energy-savings-calculator" />
      </Head>
      <h1 className="text-3xl font-bold text-center mb-6">Home Energy Savings Calculator</h1>
      <p className="text-base text-gray-700 mb-4">
        Welcome to the Home Energy Savings Calculator. This tool helps you estimate potential savings by reducing energy usage in various categories. Simply input your current and target usage to see how much you can save.
      </p>
      <div>
        {inputs.map((input, index) => (
          <div key={index} className="mb-4">
            <h2 className="text-2xl font-semibold mb-4">{input.category}</h2>
            <label className="block mb-2">
              Current Usage:
              <input
                type="number"
                value={input.currentUsage}
                onChange={(e) => handleInputChange(index, 'currentUsage', Number(e.target.value))}
                className="block w-full mt-1 p-2 border border-gray-300 rounded"
              />
            </label>
            <label className="block mb-2">
              Target Usage:
              <input
                type="number"
                value={input.targetUsage}
                onChange={(e) => handleInputChange(index, 'targetUsage', Number(e.target.value))}
                className="block w-full mt-1 p-2 border border-gray-300 rounded"
              />
            </label>
          </div>
        ))}
        <button
          onClick={calculateSavings}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
        >
          Calculate Savings
        </button>
      </div>
      {results.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Results</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="current" fill="#8884d8" />
              <Bar dataKey="target" fill="#82ca9d" />
              <Bar dataKey="savings" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
          <button
            onClick={exportCSV}
            className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
          >
            <Download className="inline-block mr-2" /> Export as CSV
          </button>
        </div>
      )}
      <Tips />
      <FAQ />
    </div>
  );
};

export default HomeEnergySavingsCalculator;

// components/FAQ.tsx
export const FAQ: React.FC = () => (
  <div className="mt-8">
    <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
    <ul className="list-disc list-inside mb-4 text-base">
      <li>How accurate are the savings estimates?</li>
      <li>Can I add more categories?</li>
      <li>How do I export my results?</li>
    </ul>
  </div>
);

// components/Tips.tsx
export const Tips: React.FC = () => (
  <div className="mt-8">
    <h2 className="text-2xl font-semibold mb-4">Energy Saving Tips</h2>
    <ul className="list-disc list-inside mb-4 text-base">
      <li>Consider using energy-efficient appliances.</li>
      <li>Regularly maintain your HVAC system.</li>
      <li>Use LED lighting to reduce energy consumption.</li>
    </ul>
  </div>
);


This code provides a structured and modular approach to building the "Home Energy Savings Calculator" page using Next.js and TypeScript. It includes separate components for FAQs and tips, uses Tailwind CSS for styling, and ensures accessibility and responsiveness.