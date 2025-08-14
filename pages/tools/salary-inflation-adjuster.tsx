
// /pages/tools/salary-inflation-adjuster.tsx

import React, { useState } from 'react';
import Head from 'next/head';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';
import { saveAs } from 'file-saver';
import { CSVLink } from 'react-csv';
import { NextPage } from 'next';

// Constants
const DEFAULT_CATEGORIES = ['Housing', 'Food', 'Transportation', 'Healthcare', 'Education'];

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
const SalaryInflationAdjuster: NextPage = () => {
  // State
  const [userInputs, setUserInputs] = useState<UserInput[]>([]);
  const [results, setResults] = useState<number[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  // Handlers
  const handleInputChange = (index: number, field: string, value: string) => {
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
    const inflationRate = 0.03; // Example inflation rate
    const calculatedResults = userInputs.map(input => input.amount * (1 + inflationRate));
    setResults(calculatedResults);

    const updatedChartData = userInputs.map((input, index) => ({
      name: input.category,
      value: calculatedResults[index],
    }));
    setChartData(updatedChartData);
  };

  const exportCSV = () => {
    const csvData = userInputs.map((input, index) => ({
      Category: input.category,
      'Original Amount': input.amount,
      'Adjusted Amount': results[index],
    }));
    const blob = new Blob([JSON.stringify(csvData)], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'salary-inflation-adjustment.csv');
  };

  // UI
  return (
    <div className="max-w-screen-md mx-auto px-4 py-8">
      <Head>
        <title>Salary Inflation Adjuster</title>
        <meta name="description" content="Adjust your salary for inflation with our free tool." />
        <meta name="keywords" content="salary, inflation, finance, tool" />
        <link rel="canonical" href="https://www.expensegoose.com/tools/salary-inflation-adjuster" />
      </Head>

      <h1 className="text-3xl font-bold text-center mb-6">Salary Inflation Adjuster</h1>
      <p className="text-base text-gray-700 mb-4">
        Welcome to the Salary Inflation Adjuster tool. This tool helps you understand how inflation affects your salary over time. Simply enter your expenses, and we'll adjust them for inflation.
      </p>

      <div className="mb-4">
        {userInputs.map((input, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              value={input.category}
              onChange={(e) => handleInputChange(index, 'category', e.target.value)}
              placeholder="Category"
              className="mr-2 p-2 border rounded"
            />
            <input
              type="number"
              value={input.amount}
              onChange={(e) => handleInputChange(index, 'amount', e.target.value)}
              placeholder="Amount"
              className="mr-2 p-2 border rounded"
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

      <button onClick={calculateResults} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mb-4">
        Calculate
      </button>

      {results.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Results</h2>
          <ul className="list-disc list-inside mb-4 text-base">
            {userInputs.map((input, index) => (
              <li key={index}>
                {input.category}: Original Amount: ${input.amount.toFixed(2)}, Adjusted Amount: ${results[index].toFixed(2)}
              </li>
            ))}
          </ul>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>

          <button onClick={exportCSV} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mt-4">
            Export as CSV
          </button>
        </div>
      )}

      <TipsSection />

      <FAQSection />
    </div>
  );
};

// Tips Component
const TipsSection: React.FC = () => (
  <div className="mt-8">
    <h2 className="text-2xl font-semibold mb-4">Tips for Managing Inflation</h2>
    <ul className="list-disc list-inside mb-4 text-base">
      <li>Review your budget regularly to adjust for inflation.</li>
      <li>Consider investing in assets that typically outpace inflation.</li>
      <li>Look for ways to increase your income, such as side jobs or skill development.</li>
    </ul>
  </div>
);

// FAQ Component
const FAQSection: React.FC = () => (
  <div className="mt-8">
    <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
    <ul className="list-disc list-inside mb-4 text-base">
      <li>
        <strong>What is inflation?</strong> Inflation is the rate at which the general level of prices for goods and services is rising, eroding purchasing power.
      </li>
      <li>
        <strong>How does this tool calculate inflation?</strong> We use a standard inflation rate to adjust your expenses, but actual rates may vary.
      </li>
      <li>
        <strong>Can I add more categories?</strong> Yes, you can add as many categories as you need to reflect your expenses.
      </li>
    </ul>
  </div>
);

export default SalaryInflationAdjuster;


This code provides a comprehensive and modular Next.js page component for the "Salary Inflation Adjuster" tool. It includes a user-friendly interface with TailwindCSS styling, a responsive design, and features like CSV export, a bar chart visualization, and helpful tips and FAQs.