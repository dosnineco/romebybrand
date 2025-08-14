
// /pages/tools/wealth-growth-projection-tool.tsx

import React, { useState } from 'react';
import Head from 'next/head';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Download } from 'lucide-react';
import { saveAs } from 'file-saver';
import { WealthGrowthForm, FAQSection, TipsSection } from '../../components';
import { calculateWealthGrowth, prepareChartData } from '../../utils/calculations';

const WealthGrowthProjectionTool: React.FC = () => {
  // Constants
  const defaultCategories = ['Savings', 'Investments', 'Expenses'];

  // Types
  interface UserInput {
    category: string;
    amount: number;
  }

  // State
  const [userInputs, setUserInputs] = useState<UserInput[]>([]);
  const [results, setResults] = useState<number[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  // Handlers
  const handleAddCategory = (category: string, amount: number) => {
    setUserInputs([...userInputs, { category, amount }]);
  };

  const handleCalculate = () => {
    const calculatedResults = calculateWealthGrowth(userInputs);
    setResults(calculatedResults);
    setChartData(prepareChartData(userInputs, calculatedResults));
  };

  const handleExportCSV = () => {
    const csvContent = `data:text/csv;charset=utf-8,Category,Amount\n${userInputs
      .map(input => `${input.category},${input.amount}`)
      .join('\n')}`;
    const encodedUri = encodeURI(csvContent);
    saveAs(encodedUri, 'wealth_growth_projection.csv');
  };

  // UI
  return (
    <div className="max-w-screen-md mx-auto px-4 py-8">
      <Head>
        <title>Wealth Growth Projection Tool</title>
        <meta name="description" content="Project your wealth growth with our free tool." />
        <meta name="keywords" content="wealth, growth, projection, finance, tool" />
        <link rel="canonical" href="https://www.expensegoose.com/tools/wealth-growth-projection-tool" />
      </Head>

      <h1 className="text-3xl font-bold text-center mb-6">Wealth Growth Projection Tool</h1>
      <p className="text-base text-gray-700 mb-4">
        Welcome to the Wealth Growth Projection Tool. This tool helps you project your financial growth over time by analyzing your savings, investments, and expenses. Let's get started!
      </p>

      <WealthGrowthForm onAddCategory={handleAddCategory} onCalculate={handleCalculate} />

      {results.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Results</h2>
          <BarChart width={600} height={300} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="amount" fill="#8884d8" />
          </BarChart>
          <button
            onClick={handleExportCSV}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 mt-4"
          >
            <Download className="inline-block mr-2" /> Export as CSV
          </button>
        </div>
      )}

      <TipsSection />

      <FAQSection />
    </div>
  );
};

export default WealthGrowthProjectionTool;

// components/WealthGrowthForm.tsx
import React, { useState } from 'react';

interface WealthGrowthFormProps {
  onAddCategory: (category: string, amount: number) => void;
  onCalculate: () => void;
}

export const WealthGrowthForm: React.FC<WealthGrowthFormProps> = ({ onAddCategory, onCalculate }) => {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState<number | ''>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (category && amount) {
      onAddCategory(category, Number(amount));
      setCategory('');
      setAmount('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="flex flex-col mb-4">
        <label htmlFor="category" className="text-base font-semibold mb-2">Category</label>
        <input
          type="text"
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2"
          required
        />
      </div>
      <div className="flex flex-col mb-4">
        <label htmlFor="amount" className="text-base font-semibold mb-2">Amount</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.valueAsNumber)}
          className="border border-gray-300 rounded-lg px-4 py-2"
          required
        />
      </div>
      <button type="submit" className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 mb-4">
        Add Category
      </button>
      <button type="button" onClick={onCalculate} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300">
        Calculate
      </button>
    </form>
  );
};

// components/FAQSection.tsx
import React from 'react';

export const FAQSection: React.FC = () => (
  <div className="mb-8">
    <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
    <ul className="list-disc list-inside mb-4 text-base">
      <li>How does this tool work?</li>
      <li>What data do I need to input?</li>
      <li>Can I export my results?</li>
    </ul>
  </div>
);

// components/TipsSection.tsx
import React from 'react';

export const TipsSection: React.FC = () => (
  <div className="mb-8">
    <h2 className="text-2xl font-semibold mb-4">Tips for Maximizing Your Wealth Growth</h2>
    <ul className="list-disc list-inside mb-4 text-base">
      <li>Regularly review and adjust your financial plan.</li>
      <li>Consider diversifying your investments.</li>
      <li>Keep track of your expenses to identify saving opportunities.</li>
    </ul>
  </div>
);

// utils/calculations.ts
export const calculateWealthGrowth = (inputs: { category: string; amount: number }[]) => {
  // Implement your calculation logic here
  return inputs.map(input => input.amount * 1.1); // Example: 10% growth
};

export const prepareChartData = (inputs: { category: string; amount: number }[], results: number[]) => {
  return inputs.map((input, index) => ({
    category: input.category,
    amount: results[index],
  }));
};


This code provides a structured and modular approach to building the Wealth Growth Projection Tool using Next.js and TypeScript. It includes separate components for the form, FAQ, and tips sections, and uses utility functions for calculations and chart data preparation. Tailwind CSS is applied for styling, ensuring a modern and responsive design.