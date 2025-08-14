
// /pages/tools/inflation-impact-estimator.tsx

import React, { useState } from 'react';
import Head from 'next/head';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';
import { saveAs } from 'file-saver';
import { NextPage } from 'next';
import { Tips, FAQ } from '../../components';

interface UserInput {
  category: string;
  amount: number;
}

interface ChartData {
  name: string;
  value: number;
}

const defaultCategories: UserInput[] = [
  { category: 'Groceries', amount: 300 },
  { category: 'Rent', amount: 1200 },
  { category: 'Utilities', amount: 150 },
];

const InflationImpactEstimator: NextPage = () => {
  const [inputs, setInputs] = useState<UserInput[]>(defaultCategories);
  const [results, setResults] = useState<number[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  const handleInputChange = (index: number, field: keyof UserInput, value: string) => {
    const updatedInputs = [...inputs];
    updatedInputs[index][field] = field === 'amount' ? parseFloat(value) : value;
    setInputs(updatedInputs);
  };

  const calculateResults = () => {
    const inflationRate = 0.03; // Example inflation rate
    const newResults = inputs.map(input => input.amount * (1 + inflationRate));
    setResults(newResults);

    const newChartData = inputs.map((input, index) => ({
      name: input.category,
      value: newResults[index],
    }));
    setChartData(newChartData);
  };

  const exportCSV = () => {
    const csvContent = `data:text/csv;charset=utf-8,Category,Original Amount,Inflated Amount\n${inputs.map((input, index) => `${input.category},${input.amount},${results[index]}`).join('\n')}`;
    const encodedUri = encodeURI(csvContent);
    saveAs(encodedUri, 'inflation-impact.csv');
  };

  return (
    <div className="max-w-screen-md mx-auto px-4 py-8">
      <Head>
        <title>Inflation Impact Estimator</title>
        <meta name="description" content="Estimate the impact of inflation on your personal finances." />
        <meta name="keywords" content="inflation, finance, estimator, personal finance" />
        <link rel="canonical" href="https://www.expensegoose.com/tools/inflation-impact-estimator" />
      </Head>
      <h1 className="text-3xl font-bold text-center mb-6">Inflation Impact Estimator</h1>
      <p className="text-base text-gray-700 mb-4">
        Welcome to the Inflation Impact Estimator. This tool helps you understand how inflation can affect your personal finances over time. Simply input your expenses, and we'll calculate the potential impact.
      </p>
      <div>
        {inputs.map((input, index) => (
          <div key={index} className="mb-4">
            <label className="block text-base font-semibold mb-2">
              {input.category}
            </label>
            <input
              type="number"
              value={input.amount}
              onChange={(e) => handleInputChange(index, 'amount', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              aria-label={`Amount for ${input.category}`}
            />
          </div>
        ))}
        <button
          onClick={calculateResults}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400"
        >
          Calculate
        </button>
      </div>
      {results.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Results</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
          <button
            onClick={exportCSV}
            className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 flex items-center"
          >
            <Download className="mr-2" /> Export as CSV
          </button>
        </div>
      )}
      <Tips />
      <FAQ />
    </div>
  );
};

export default InflationImpactEstimator;

// components/Tips.tsx
export const Tips: React.FC = () => (
  <div className="mt-8">
    <h3 className="text-xl font-semibold mb-4">Tips for Managing Inflation</h3>
    <ul className="list-disc list-inside mb-4 text-base">
      <li>Consider diversifying your investments to hedge against inflation.</li>
      <li>Review your budget regularly to adjust for price changes.</li>
      <li>Look for ways to reduce discretionary spending.</li>
    </ul>
  </div>
);

// components/FAQ.tsx
export const FAQ: React.FC = () => (
  <div className="mt-8">
    <h3 className="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
    <ul className="list-disc list-inside mb-4 text-base">
      <li>
        <strong>What is inflation?</strong> Inflation is the rate at which the general level of prices for goods and services is rising, eroding purchasing power.
      </li>
      <li>
        <strong>How does this tool calculate inflation impact?</strong> The tool applies a fixed inflation rate to your input amounts to estimate future costs.
      </li>
      <li>
        <strong>Can I change the inflation rate?</strong> Currently, the tool uses a default rate, but future updates may allow customization.
      </li>
    </ul>
  </div>
);


This code provides a structured and modular approach to building the "Inflation Impact Estimator" tool using Next.js and TypeScript. It includes separate components for tips and FAQs, uses Tailwind CSS for styling, and ensures accessibility and responsiveness.