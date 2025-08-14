
// /pages/tools/event-profit-calculator.tsx

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
  revenue: number;
}

const defaultCategories: Category[] = [
  { name: 'Venue', cost: 0, revenue: 0 },
  { name: 'Catering', cost: 0, revenue: 0 },
  { name: 'Marketing', cost: 0, revenue: 0 },
];

const EventProfitCalculator: NextPage = () => {
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [totalProfit, setTotalProfit] = useState<number>(0);

  const handleCategoryChange = (index: number, field: keyof Category, value: number) => {
    const updatedCategories = [...categories];
    updatedCategories[index][field] = value;
    setCategories(updatedCategories);
    calculateProfit(updatedCategories);
  };

  const calculateProfit = (categories: Category[]) => {
    const totalCost = categories.reduce((acc, category) => acc + category.cost, 0);
    const totalRevenue = categories.reduce((acc, category) => acc + category.revenue, 0);
    setTotalProfit(totalRevenue - totalCost);
  };

  const exportCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,Category,Cost,Revenue\n' +
      categories.map(c => `${c.name},${c.cost},${c.revenue}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    saveAs(encodedUri, 'event-profit-calculator.csv');
  };

  const chartData = categories.map(category => ({
    name: category.name,
    Cost: category.cost,
    Revenue: category.revenue,
  }));

  return (
    <div className="max-w-screen-md mx-auto px-4 py-8">
      <Head>
        <title>Event Profit Calculator</title>
        <meta name="description" content="Calculate your event's profit with our free tool." />
        <meta name="keywords" content="event, profit, calculator, finance" />
        <link rel="canonical" href="https://www.expensegoose.com/tools/event-profit-calculator" />
      </Head>
      <h1 className="text-3xl font-bold text-center mb-6">Event Profit Calculator</h1>
      <p className="text-base text-gray-700 mb-4">
        Welcome to the Event Profit Calculator! This tool helps you estimate the profit from your event by comparing costs and revenues across different categories.
      </p>
      <div>
        {categories.map((category, index) => (
          <div key={index} className="mb-4">
            <h2 className="text-2xl font-semibold mb-4">{category.name}</h2>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-base text-gray-700 mb-2">Cost</label>
                <input
                  type="number"
                  value={category.cost}
                  onChange={(e) => handleCategoryChange(index, 'cost', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="flex-1">
                <label className="block text-base text-gray-700 mb-2">Revenue</label>
                <input
                  type="number"
                  value={category.revenue}
                  onChange={(e) => handleCategoryChange(index, 'revenue', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="my-8">
        <h2 className="text-2xl font-semibold mb-4">Results</h2>
        <p className="text-base text-gray-700 mb-4">Total Profit: ${totalProfit.toFixed(2)}</p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="Cost" fill="#8884d8" />
            <Bar dataKey="Revenue" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <button
        onClick={exportCSV}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
      >
        <Download className="inline-block mr-2" /> Export as CSV
      </button>
      <TipsSection />
      <FAQSection />
    </div>
  );
};

export default EventProfitCalculator;

// components/FAQSection.tsx
export const FAQSection: React.FC = () => (
  <div className="mt-8">
    <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
    <ul className="list-disc list-inside mb-4 text-base">
      <li>How do I use the Event Profit Calculator?</li>
      <li>What categories should I include?</li>
      <li>Can I export my results?</li>
    </ul>
  </div>
);

// components/TipsSection.tsx
export const TipsSection: React.FC = () => (
  <div className="mt-8">
    <h2 className="text-2xl font-semibold mb-4">Tips for Maximizing Profit</h2>
    <ul className="list-disc list-inside mb-4 text-base">
      <li>Negotiate better rates with vendors.</li>
      <li>Increase ticket prices strategically.</li>
      <li>Optimize marketing spend for better ROI.</li>
    </ul>
  </div>
);


This code provides a structured and modular approach to building the Event Profit Calculator page using Next.js and TypeScript. It includes separate components for FAQs and tips, uses Tailwind CSS for styling, and ensures accessibility and responsiveness.