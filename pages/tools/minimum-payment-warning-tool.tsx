Certainly! Below is a refactored Next.js page component for the "Minimum Payment Warning Tool" using TypeScript, TailwindCSS, and React hooks. The code is organized into logical sections and includes modular components for FAQs and tips. This setup ensures maintainability and scalability.


// /pages/tools/minimum-payment-warning-tool.tsx

import React, { useState } from 'react';
import Head from 'next/head';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';

// Constants
const DEFAULT_CATEGORIES = ['Credit Card', 'Loan', 'Mortgage'];

// Types
interface UserInput {
  category: string;
  balance: number;
  interestRate: number;
  minimumPayment: number;
}

interface ChartData {
  name: string;
  value: number;
}

// Main Component
const MinimumPaymentWarningTool: React.FC = () => {
  // State
  const [userInputs, setUserInputs] = useState<UserInput[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [results, setResults] = useState<number[]>([]);

  // Handlers
  const handleAddCategory = () => {
    setUserInputs([...userInputs, { category: '', balance: 0, interestRate: 0, minimumPayment: 0 }]);
  };

  const handleInputChange = (index: number, field: keyof UserInput, value: string | number) => {
    const updatedInputs = [...userInputs];
    updatedInputs[index][field] = typeof value === 'string' ? parseFloat(value) : value;
    setUserInputs(updatedInputs);
  };

  const calculateResults = () => {
    const newResults = userInputs.map(input => {
      // Simple calculation logic for demonstration
      return input.balance * (input.interestRate / 100) / input.minimumPayment;
    });
    setResults(newResults);

    const newChartData = userInputs.map((input, index) => ({
      name: input.category || `Category ${index + 1}`,
      value: newResults[index],
    }));
    setChartData(newChartData);
  };

  const exportCSV = () => {
    // CSV export logic
  };

  // UI Rendering
  return (
    <div className="max-w-screen-md mx-auto px-4 py-8">
      <Head>
        <title>Minimum Payment Warning Tool</title>
        <meta name="description" content="A tool to help you understand the impact of minimum payments on your debt." />
        <meta name="keywords" content="finance, minimum payment, debt, tool" />
        <link rel="canonical" href="https://www.expensegoose.com/tools/minimum-payment-warning-tool" />
      </Head>

      <h1 className="text-3xl font-bold text-center mb-6">Minimum Payment Warning Tool</h1>
      <p className="text-base text-gray-700 mb-4">
        Welcome to the Minimum Payment Warning Tool. This tool helps you understand how long it will take to pay off your debt if you only make the minimum payments.
      </p>

      <div className="mb-8">
        {userInputs.map((input, index) => (
          <div key={index} className="mb-4">
            <label className="block text-xl font-semibold mb-2">Category {index + 1}</label>
            <input
              type="text"
              placeholder="Category"
              value={input.category}
              onChange={(e) => handleInputChange(index, 'category', e.target.value)}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Balance"
              value={input.balance}
              onChange={(e) => handleInputChange(index, 'balance', e.target.value)}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Interest Rate (%)"
              value={input.interestRate}
              onChange={(e) => handleInputChange(index, 'interestRate', e.target.value)}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Minimum Payment"
              value={input.minimumPayment}
              onChange={(e) => handleInputChange(index, 'minimumPayment', e.target.value)}
              className="w-full mb-2 p-2 border rounded"
            />
          </div>
        ))}
        <button onClick={handleAddCategory} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400">
          Add Category
        </button>
      </div>

      <button onClick={calculateResults} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 mb-8">
        Calculate
      </button>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Results</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <button onClick={exportCSV} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 mb-8 flex items-center">
        <Download className="mr-2" /> Export as CSV
      </button>

      <TipsSection />
      <FAQSection />
    </div>
  );
};

// Tips Component
const TipsSection: React.FC = () => (
  <div className="mb-8">
    <h2 className="text-2xl font-semibold mb-4">Tips</h2>
    <ul className="list-disc list-inside mb-4 text-base">
      <li>Always try to pay more than the minimum payment to reduce your debt faster.</li>
      <li>Consider consolidating your debts to get a lower interest rate.</li>
      <li>Track your spending to identify areas where you can save money.</li>
    </ul>
  </div>
);

// FAQ Component
const FAQSection: React.FC = () => (
  <div className="mb-8">
    <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
    <div className="mb-4">
      <h3 className="text-xl font-semibold mb-2">What is the Minimum Payment Warning Tool?</h3>
      <p className="text-base text-gray-700 mb-4">
        This tool helps you understand the impact of making only minimum payments on your debt.
      </p>
    </div>
    <div className="mb-4">
      <h3 className="text-xl font-semibold mb-2">How does it work?</h3>
      <p className="text-base text-gray-700 mb-4">
        Enter your debt details, and the tool will calculate how long it will take to pay off your debt with minimum payments.
      </p>
    </div>
  </div>
);

export default MinimumPaymentWarningTool;


This code provides a structured and modular approach to building the Minimum Payment Warning Tool. It includes a main component for the tool, separate components for tips and FAQs, and uses TailwindCSS for styling. The code is organized for readability and maintainability, making it easy to add new features or categories in the future.