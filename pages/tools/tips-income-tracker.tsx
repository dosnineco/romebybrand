
// /pages/tools/tips-income-tracker.tsx

import React, { useState } from 'react';
import Head from 'next/head';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';
import { saveAs } from 'file-saver';
import { NextPage } from 'next';
import { FAQSection, TipsSection } from '../../components';

interface TipCategory {
  name: string;
  amount: number;
}

const defaultCategories: TipCategory[] = [
  { name: 'Food Service', amount: 0 },
  { name: 'Delivery', amount: 0 },
  { name: 'Other', amount: 0 },
];

const TipsIncomeTracker: NextPage = () => {
  const [categories, setCategories] = useState<TipCategory[]>(defaultCategories);
  const [totalTips, setTotalTips] = useState<number>(0);

  const handleAmountChange = (index: number, amount: number) => {
    const updatedCategories = [...categories];
    updatedCategories[index].amount = amount;
    setCategories(updatedCategories);
    calculateTotalTips(updatedCategories);
  };

  const calculateTotalTips = (categories: TipCategory[]) => {
    const total = categories.reduce((acc, category) => acc + category.amount, 0);
    setTotalTips(total);
  };

  const exportToCSV = () => {
    const csvContent = `data:text/csv;charset=utf-8,Category,Amount\n${categories
      .map((cat) => `${cat.name},${cat.amount}`)
      .join('\n')}`;
    const encodedUri = encodeURI(csvContent);
    saveAs(encodedUri, 'tips-income.csv');
  };

  const chartData = categories.map((category) => ({
    name: category.name,
    amount: category.amount,
  }));

  return (
    <div className="max-w-screen-md mx-auto px-4 py-8">
      <Head>
        <title>Tips Income Tracker</title>
        <meta name="description" content="Track your tips income with ease using our free tool." />
        <meta name="keywords" content="tips, income, tracker, finance, personal finance" />
        <link rel="canonical" href="https://www.expensegoose.com/tools/tips-income-tracker" />
      </Head>

      <h1 className="text-3xl font-bold text-center mb-6">Tips Income Tracker</h1>
      <p className="text-base text-gray-700 mb-4">
        Welcome to the Tips Income Tracker! This tool helps you keep track of your tips from various categories. Simply enter your tips for each category, and we'll calculate the total for you.
      </p>

      <div className="mb-8">
        {categories.map((category, index) => (
          <div key={index} className="mb-4">
            <label className="block text-xl font-semibold mb-2" htmlFor={`category-${index}`}>
              {category.name}
            </label>
            <input
              type="number"
              id={`category-${index}`}
              value={category.amount}
              onChange={(e) => handleAmountChange(index, parseFloat(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        ))}
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Total Tips: ${totalTips.toFixed(2)}</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#3182ce" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <button
        onClick={exportToCSV}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <Download className="inline-block mr-2" /> Export as CSV
      </button>

      <TipsSection />

      <FAQSection />
    </div>
  );
};

export default TipsIncomeTracker;

// components/FAQSection.tsx
export const FAQSection: React.FC = () => (
  <div className="mt-8">
    <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
    <ul className="list-disc list-inside mb-4 text-base">
      <li>How do I use the Tips Income Tracker?</li>
      <li>Can I add more categories?</li>
      <li>How is the total calculated?</li>
    </ul>
  </div>
);

// components/TipsSection.tsx
export const TipsSection: React.FC = () => (
  <div className="mt-8">
    <h2 className="text-2xl font-semibold mb-4">Tips for Maximizing Your Income</h2>
    <ul className="list-disc list-inside mb-4 text-base">
      <li>Be polite and courteous to customers.</li>
      <li>Offer excellent service to encourage higher tips.</li>
      <li>Keep track of your tips regularly to identify trends.</li>
    </ul>
  </div>
);


This code provides a complete Next.js page component for the "Tips Income Tracker" tool, including the main page and two separate components for FAQs and tips. The page is styled using TailwindCSS and includes a bar chart using `recharts`. The code is organized into logical sections and is designed to be easily extendable.