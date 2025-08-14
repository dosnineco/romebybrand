
// /pages/tools/personal-budget-health-score.tsx

import React, { useState } from 'react';
import Head from 'next/head';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';
import { saveAs } from 'file-saver';
import { NextPage } from 'next';

// Constants
const DEFAULT_CATEGORIES = ['Housing', 'Food', 'Transportation', 'Entertainment', 'Savings'];

// Types
interface UserInput {
  category: string;
  amount: number;
}

interface ChartData {
  name: string;
  value: number;
}

// Main Component
const PersonalBudgetHealthScore: NextPage = () => {
  // State
  const [userInputs, setUserInputs] = useState<UserInput[]>([]);
  const [results, setResults] = useState<number>(0);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  // Handlers
  const handleInputChange = (index: number, field: keyof UserInput, value: string) => {
    const updatedInputs = [...userInputs];
    updatedInputs[index] = { ...updatedInputs[index], [field]: field === 'amount' ? parseFloat(value) : value };
    setUserInputs(updatedInputs);
  };

  const addCategory = () => {
    setUserInputs([...userInputs, { category: '', amount: 0 }]);
  };

  const removeCategory = (index: number) => {
    const updatedInputs = userInputs.filter((_, i) => i !== index);
    setUserInputs(updatedInputs);
  };

  const calculateResults = () => {
    const total = userInputs.reduce((acc, input) => acc + input.amount, 0);
    setResults(total);
    prepareChartData();
  };

  const prepareChartData = () => {
    const data = userInputs.map(input => ({ name: input.category, value: input.amount }));
    setChartData(data);
  };

  const exportCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,' + userInputs.map(input => `${input.category},${input.amount}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    saveAs(encodedUri, 'budget-health-score.csv');
  };

  // UI
  return (
    <div className="max-w-screen-md mx-auto px-4 py-8">
      <Head>
        <title>Personal Budget Health Score</title>
        <meta name="description" content="Calculate your personal budget health score with our free tool." />
        <meta name="keywords" content="personal finance, budget, health score, finance tool" />
        <link rel="canonical" href="https://www.expensegoose.com/tools/personal-budget-health-score" />
      </Head>

      <h1 className="text-3xl font-bold text-center mb-6">Personal Budget Health Score</h1>
      <p className="text-base text-gray-700 mb-4">
        Welcome to the Personal Budget Health Score tool. Here, you can evaluate your financial health by entering your monthly expenses across various categories.
      </p>

      <div className="mb-6">
        {userInputs.map((input, index) => (
          <div key={index} className="flex items-center mb-4">
            <input
              type="text"
              value={input.category}
              onChange={(e) => handleInputChange(index, 'category', e.target.value)}
              placeholder="Category"
              className="mr-2 px-3 py-2 border rounded-lg w-1/3"
            />
            <input
              type="number"
              value={input.amount}
              onChange={(e) => handleInputChange(index, 'amount', e.target.value)}
              placeholder="Amount"
              className="mr-2 px-3 py-2 border rounded-lg w-1/3"
            />
            <button onClick={() => removeCategory(index)} className="text-red-500 hover:text-red-700">
              Remove
            </button>
          </div>
        ))}
        <button onClick={addCategory} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Add Category
        </button>
      </div>

      <button onClick={calculateResults} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mb-6">
        Calculate
      </button>

      <h2 className="text-2xl font-semibold mb-4">Results</h2>
      <p className="text-base text-gray-700 mb-4">Your total monthly expenses are: ${results}</p>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>

      <button onClick={exportCSV} className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mt-6">
        <Download className="mr-2" /> Export as CSV
      </button>

      <h2 className="text-2xl font-semibold mb-4 mt-8">Tips for Improving Your Budget</h2>
      <ul className="list-disc list-inside mb-4 text-base">
        <li>Track your expenses regularly to identify areas for improvement.</li>
        <li>Set realistic financial goals and stick to them.</li>
        <li>Consider using budgeting apps to automate tracking.</li>
        <li>Review your subscriptions and cancel those you don't use.</li>
      </ul>

      <h2 className="text-2xl font-semibold mb-4 mt-8">Frequently Asked Questions</h2>
      <FAQ />

      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'Personal Budget Health Score',
          description: 'A tool to calculate your personal budget health score.',
          applicationCategory: 'FinanceApplication',
          operatingSystem: 'All',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
        })}
      </script>
    </div>
  );
};

// FAQ Component
const FAQ: React.FC = () => (
  <div>
    <h3 className="text-xl font-semibold mb-4">What is the Personal Budget Health Score?</h3>
    <p className="text-base text-gray-700 mb-4">
      The Personal Budget Health Score is a tool designed to help you evaluate your financial health by analyzing your monthly expenses.
    </p>
    <h3 className="text-xl font-semibold mb-4">How do I use this tool?</h3>
    <p className="text-base text-gray-700 mb-4">
      Simply enter your monthly expenses in the provided categories, or add your own. Click "Calculate" to see your total expenses and a visual breakdown.
    </p>
    <h3 className="text-xl font-semibold mb-4">Can I export my results?</h3>
    <p className="text-base text-gray-700 mb-4">
      Yes, you can export your results as a CSV file by clicking the "Export as CSV" button.
    </p>
  </div>
);

export default PersonalBudgetHealthScore;


This code provides a complete Next.js page component for the "Personal Budget Health Score" tool, following the specified requirements and structure. It includes a form for user inputs, a results section with a bar chart, tips, and an FAQ section. The page is styled using TailwindCSS and includes SEO tags and JSON-LD schema for better search engine visibility.