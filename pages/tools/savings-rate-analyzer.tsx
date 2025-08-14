
// /pages/tools/savings-rate-analyzer.tsx

import React, { useState } from 'react';
import Head from 'next/head';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';
import { NextPage } from 'next';
import { saveAs } from 'file-saver';

// Constants
const DEFAULT_CATEGORIES = ['Income', 'Expenses', 'Savings'];

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
const SavingsRateAnalyzer: NextPage = () => {
  // State
  const [inputs, setInputs] = useState<UserInput[]>([]);
  const [results, setResults] = useState<number | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  // Handlers
  const handleAddCategory = () => {
    setInputs([...inputs, { category: '', amount: 0 }]);
  };

  const handleInputChange = (index: number, field: keyof UserInput, value: string | number) => {
    const newInputs = [...inputs];
    newInputs[index][field] = field === 'amount' ? parseFloat(value as string) : value;
    setInputs(newInputs);
  };

  const calculateResults = () => {
    const totalIncome = inputs.filter(input => input.category === 'Income').reduce((acc, curr) => acc + curr.amount, 0);
    const totalSavings = inputs.filter(input => input.category === 'Savings').reduce((acc, curr) => acc + curr.amount, 0);
    const savingsRate = totalIncome ? (totalSavings / totalIncome) * 100 : 0;
    setResults(savingsRate);
    prepareChartData(totalIncome, totalSavings);
  };

  const prepareChartData = (income: number, savings: number) => {
    setChartData([
      { name: 'Income', value: income },
      { name: 'Savings', value: savings },
    ]);
  };

  const exportCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,' + inputs.map(input => `${input.category},${input.amount}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    saveAs(encodedUri, 'savings_rate_data.csv');
  };

  // UI
  return (
    <div className="max-w-screen-md mx-auto px-4 py-8">
      <Head>
        <title>Savings Rate Analyzer</title>
        <meta name="description" content="Analyze your savings rate with our free tool." />
        <meta name="keywords" content="savings, finance, personal finance, savings rate" />
        <link rel="canonical" href="https://www.expensegoose.com/tools/savings-rate-analyzer" />
      </Head>
      <h1 className="text-3xl font-bold text-center mb-6">Savings Rate Analyzer</h1>
      <p className="text-base text-gray-700 mb-4">
        Welcome to the Savings Rate Analyzer! This tool helps you understand how much of your income you're saving. Simply input your income and savings details, and let us do the rest.
      </p>
      <div>
        {inputs.map((input, index) => (
          <div key={index} className="mb-4">
            <input
              type="text"
              value={input.category}
              onChange={(e) => handleInputChange(index, 'category', e.target.value)}
              placeholder="Category"
              className="border p-2 mr-2"
            />
            <input
              type="number"
              value={input.amount}
              onChange={(e) => handleInputChange(index, 'amount', e.target.value)}
              placeholder="Amount"
              className="border p-2"
            />
          </div>
        ))}
        <button onClick={handleAddCategory} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mb-4">
          Add Category
        </button>
        <button onClick={calculateResults} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mb-4">
          Calculate
        </button>
        {results !== null && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Results</h2>
            <p className="text-base text-gray-700 mb-4">Your savings rate is {results.toFixed(2)}%.</p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
            <button onClick={exportCSV} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mt-4">
              <Download className="inline-block mr-2" /> Export CSV
            </button>
          </div>
        )}
      </div>
      <Tips />
      <FAQ />
    </div>
  );
};

// Tips Component
const Tips: React.FC = () => (
  <div>
    <h2 className="text-2xl font-semibold mb-4">Tips for Increasing Your Savings Rate</h2>
    <ul className="list-disc list-inside mb-4 text-base">
      <li>Track your expenses to identify areas where you can cut back.</li>
      <li>Set a savings goal and automate your savings.</li>
      <li>Review your budget regularly to ensure you're on track.</li>
    </ul>
  </div>
);

// FAQ Component
const FAQ: React.FC = () => (
  <div>
    <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
    <ul className="list-disc list-inside mb-4 text-base">
      <li>What is a savings rate? - It's the percentage of your income that you save.</li>
      <li>How can I improve my savings rate? - By reducing expenses and increasing income.</li>
      <li>Why is savings rate important? - It helps you build financial security.</li>
    </ul>
  </div>
);

export default SavingsRateAnalyzer;


This code provides a comprehensive Next.js page component for a "Savings Rate Analyzer" tool. It includes a form for user inputs, calculation logic, a chart for visual representation, and additional sections like tips and FAQs. The use of Tailwind CSS ensures a modern and responsive design, while the modular structure allows for easy maintenance and scalability.