
// /pages/tools/rent-vs-buy-calculator.tsx

import React, { useState } from 'react';
import Head from 'next/head';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';
import { saveAs } from 'file-saver';
import { NextPage } from 'next';

// Constants
const DEFAULT_CATEGORIES = ['Rent', 'Buy'];

// Types
interface UserInput {
  rent: number;
  buy: number;
}

interface ChartData {
  name: string;
  value: number;
}

// Main Component
const RentVsBuyCalculator: NextPage = () => {
  // State
  const [userInput, setUserInput] = useState<UserInput>({ rent: 0, buy: 0 });
  const [chartData, setChartData] = useState<ChartData[]>([]);

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInput({ ...userInput, [name]: Number(value) });
  };

  const calculateResults = () => {
    const data = DEFAULT_CATEGORIES.map((category) => ({
      name: category,
      value: userInput[category.toLowerCase() as keyof UserInput],
    }));
    setChartData(data);
  };

  const exportCSV = () => {
    const csvContent = `data:text/csv;charset=utf-8,${chartData
      .map((d) => `${d.name},${d.value}`)
      .join('\n')}`;
    const encodedUri = encodeURI(csvContent);
    saveAs(encodedUri, 'rent-vs-buy-results.csv');
  };

  // UI
  return (
    <div className="max-w-screen-md mx-auto px-4 py-8">
      <Head>
        <title>Rent vs Buy Calculator</title>
        <meta name="description" content="Calculate whether renting or buying is better for you." />
        <meta name="keywords" content="rent, buy, calculator, finance, personal finance" />
        <link rel="canonical" href="https://www.expensegoose.com/tools/rent-vs-buy-calculator" />
      </Head>

      <h1 className="text-3xl font-bold text-center mb-6">Rent vs Buy Calculator</h1>
      <p className="text-base text-gray-700 mb-4">
        Welcome to the Rent vs Buy Calculator. This tool helps you decide whether renting or buying a home is the better financial decision for you.
      </p>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Input Your Details</h2>
        <form className="space-y-4">
          <div>
            <label htmlFor="rent" className="block text-base font-medium text-gray-700">
              Monthly Rent
            </label>
            <input
              type="number"
              id="rent"
              name="rent"
              value={userInput.rent}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="buy" className="block text-base font-medium text-gray-700">
              Monthly Mortgage
            </label>
            <input
              type="number"
              id="buy"
              name="buy"
              value={userInput.buy}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <button
            type="button"
            onClick={calculateResults}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Calculate
          </button>
        </form>
      </div>

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
        <button
          onClick={exportCSV}
          className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
        >
          <Download className="mr-2" />
          Export as CSV
        </button>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Tips</h2>
        <ul className="list-disc list-inside mb-4 text-base">
          <li>Consider the long-term costs of both renting and buying.</li>
          <li>Factor in additional costs such as maintenance, taxes, and insurance.</li>
          <li>Think about your lifestyle and future plans.</li>
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
  <div className="space-y-4">
    <div>
      <h3 className="text-xl font-semibold mb-2">What factors should I consider when deciding to rent or buy?</h3>
      <p className="text-base text-gray-700">
        Consider your financial situation, lifestyle, and future plans. Renting offers flexibility, while buying can be a long-term investment.
      </p>
    </div>
    <div>
      <h3 className="text-xl font-semibold mb-2">How accurate is this calculator?</h3>
      <p className="text-base text-gray-700">
        This calculator provides an estimate based on your inputs. For a detailed analysis, consider consulting a financial advisor.
      </p>
    </div>
  </div>
);

export default RentVsBuyCalculator;


This code provides a structured and modular approach to building a "Rent vs Buy Calculator" tool using Next.js and TypeScript. It includes a main component for the calculator, a separate FAQ component, and uses TailwindCSS for styling. The page is designed to be responsive and accessible, with a focus on usability and maintainability.