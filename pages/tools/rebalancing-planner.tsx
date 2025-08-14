
// /pages/tools/rebalancing-planner.tsx

import React, { useState } from 'react';
import Head from 'next/head';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';
import { saveAs } from 'file-saver';
import { FAQ, Tips } from '../../components';
import { Category, UserInput } from '../../types';

const defaultCategories: Category[] = [
  { name: 'Stocks', targetPercentage: 60 },
  { name: 'Bonds', targetPercentage: 30 },
  { name: 'Cash', targetPercentage: 10 },
];

const RebalancingPlanner: React.FC = () => {
  const [userInputs, setUserInputs] = useState<UserInput[]>(defaultCategories.map(category => ({
    category: category.name,
    currentAmount: 0,
  })));
  const [results, setResults] = useState<UserInput[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  const handleInputChange = (index: number, value: number) => {
    const newInputs = [...userInputs];
    newInputs[index].currentAmount = value;
    setUserInputs(newInputs);
  };

  const calculateRebalancing = () => {
    const total = userInputs.reduce((sum, input) => sum + input.currentAmount, 0);
    const newResults = userInputs.map((input, index) => {
      const targetAmount = (defaultCategories[index].targetPercentage / 100) * total;
      return { ...input, targetAmount };
    });
    setResults(newResults);
    setChartData(newResults.map(result => ({
      category: result.category,
      Current: result.currentAmount,
      Target: result.targetAmount,
    })));
  };

  const exportCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,'
      + ['Category,Current Amount,Target Amount']
        .concat(results.map(result => `${result.category},${result.currentAmount},${result.targetAmount}`))
        .join('\n');
    saveAs(new Blob([csvContent], { type: 'text/csv;charset=utf-8;' }), 'rebalancing_results.csv');
  };

  return (
    <div className="max-w-screen-md mx-auto px-4 py-8">
      <Head>
        <title>Rebalancing Planner</title>
        <meta name="description" content="A free personal finance tool to help you plan your investment rebalancing." />
        <meta name="keywords" content="finance, rebalancing, investment, planner" />
        <link rel="canonical" href="https://www.expensegoose.com/tools/rebalancing-planner" />
      </Head>
      <h1 className="text-3xl font-bold text-center mb-6">Rebalancing Planner</h1>
      <p className="text-base text-gray-700 mb-4">
        Welcome to the Rebalancing Planner! This tool helps you align your investment portfolio with your target asset allocation. Simply enter your current amounts, and we'll calculate the adjustments needed.
      </p>
      <div>
        {userInputs.map((input, index) => (
          <div key={index} className="mb-4">
            <label className="block text-base font-semibold mb-2">{input.category}</label>
            <input
              type="number"
              value={input.currentAmount}
              onChange={(e) => handleInputChange(index, parseFloat(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg"
              aria-label={`Current amount for ${input.category}`}
            />
          </div>
        ))}
        <button
          onClick={calculateRebalancing}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
        >
          Calculate
        </button>
      </div>
      {results.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Results</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Current" fill="#8884d8" />
              <Bar dataKey="Target" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
          <button
            onClick={exportCSV}
            className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 flex items-center"
          >
            <Download className="mr-2" /> Export CSV
          </button>
          <Tips />
        </div>
      )}
      <FAQ />
    </div>
  );
};

export default RebalancingPlanner;

// components/FAQ.tsx
export const FAQ: React.FC = () => (
  <div className="mt-8">
    <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
    <div className="text-base text-gray-700 mb-4">
      <h3 className="text-xl font-semibold mb-2">What is rebalancing?</h3>
      <p>Rebalancing is the process of realigning the weightings of a portfolio of assets. It involves periodically buying or selling assets to maintain an original or desired level of asset allocation or risk.</p>
    </div>
    <div className="text-base text-gray-700 mb-4">
      <h3 className="text-xl font-semibold mb-2">Why is rebalancing important?</h3>
      <p>Rebalancing helps investors maintain their desired level of risk and ensures that their portfolio remains aligned with their financial goals.</p>
    </div>
  </div>
);

// components/Tips.tsx
export const Tips: React.FC = () => (
  <div className="mt-8">
    <h2 className="text-2xl font-semibold mb-4">Tips for Effective Rebalancing</h2>
    <ul className="list-disc list-inside mb-4 text-base">
      <li>Review your portfolio at least once a year.</li>
      <li>Consider transaction costs when rebalancing.</li>
      <li>Stay disciplined and avoid emotional decisions.</li>
      <li>Use tax-advantaged accounts to minimize tax impact.</li>
    </ul>
  </div>
);

// types/index.ts
export interface Category {
  name: string;
  targetPercentage: number;
}

export interface UserInput {
  category: string;
  currentAmount: number;
  targetAmount?: number;
}


This refactored code organizes the Rebalancing Planner tool into a clean, maintainable structure. It uses functional components, TypeScript for type safety, and Tailwind CSS for styling. The code is modular, making it easy to add new features or categories in the future.