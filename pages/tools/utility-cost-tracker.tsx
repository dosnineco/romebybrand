
// /pages/tools/utility-cost-tracker.tsx

import React, { useState } from 'react';
import Head from 'next/head';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';
import { saveAs } from 'file-saver';
import { NextPage } from 'next';

// Constants
const DEFAULT_CATEGORIES = ['Electricity', 'Water', 'Gas'];

// Types
interface UtilityCost {
  category: string;
  cost: number;
}

// UtilityCostTracker Component
const UtilityCostTracker: NextPage = () => {
  // State
  const [utilityCosts, setUtilityCosts] = useState<UtilityCost[]>([]);
  const [category, setCategory] = useState<string>('');
  const [cost, setCost] = useState<number | ''>('');
  const [chartData, setChartData] = useState<any[]>([]);

  // Handlers
  const handleAddCost = () => {
    if (category && cost !== '') {
      const newCost = { category, cost: Number(cost) };
      setUtilityCosts([...utilityCosts, newCost]);
      setChartData([...chartData, newCost]);
      setCategory('');
      setCost('');
    }
  };

  const handleExportCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,Category,Cost\n' +
      utilityCosts.map(u => `${u.category},${u.cost}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    saveAs(encodedUri, 'utility-costs.csv');
  };

  // UI
  return (
    <div className="max-w-screen-md mx-auto px-4 py-8">
      <Head>
        <title>Utility Cost Tracker</title>
        <meta name="description" content="Track your utility costs with ease using our Utility Cost Tracker tool." />
        <meta name="keywords" content="utility, cost, tracker, finance, personal finance" />
        <link rel="canonical" href="https://www.expensegoose.com/tools/utility-cost-tracker" />
      </Head>

      <h1 className="text-3xl font-bold text-center mb-6">Utility Cost Tracker</h1>
      <p className="text-base text-gray-700 mb-4">
        Welcome to the Utility Cost Tracker! This tool helps you keep track of your monthly utility expenses. Simply add your costs below and visualize your spending.
      </p>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Add Your Utility Costs</h2>
        <div className="flex flex-col space-y-4">
          <div>
            <label className="block text-base font-semibold mb-2">Category</label>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select a category</option>
              {DEFAULT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-base font-semibold mb-2">Cost</label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded"
              value={cost}
              onChange={(e) => setCost(e.target.value ? Number(e.target.value) : '')}
            />
          </div>
          <button
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
            onClick={handleAddCost}
          >
            Add Cost
          </button>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Your Utility Costs</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="cost" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <button
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 mb-8"
        onClick={handleExportCSV}
      >
        <Download className="inline-block mr-2" /> Export as CSV
      </button>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Tips for Managing Utility Costs</h2>
        <ul className="list-disc list-inside mb-4 text-base">
          <li>Regularly review your utility bills to identify any unusual spikes.</li>
          <li>Consider energy-efficient appliances to reduce electricity costs.</li>
          <li>Fix leaks promptly to avoid high water bills.</li>
        </ul>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
        <FAQ />
      </div>
    </div>
  );
};

// FAQ Component
const FAQ: React.FC = () => (
  <div>
    <h3 className="text-xl font-semibold mb-4">FAQs</h3>
    <ul className="list-disc list-inside mb-4 text-base">
      <li>How do I add a new category? - You can add new categories by selecting from the dropdown or entering a new one.</li>
      <li>Can I export my data? - Yes, you can export your data as a CSV file.</li>
      <li>Is my data saved? - Currently, data is not saved permanently. Consider exporting regularly.</li>
    </ul>
  </div>
);

export default UtilityCostTracker;


This code provides a structured and modular approach to building the "Utility Cost Tracker" tool using Next.js and TypeScript. It includes a main component for the tool, a separate FAQ component, and uses Tailwind CSS for styling. The code is organized into logical sections, making it easy to maintain and extend.