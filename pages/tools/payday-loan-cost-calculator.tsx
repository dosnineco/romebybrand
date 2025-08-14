
// /pages/tools/payday-loan-cost-calculator.tsx

import React, { useState } from 'react';
import Head from 'next/head';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';
import { saveAs } from 'file-saver';

// Constants
const DEFAULT_CATEGORIES = [
  { name: 'Loan Amount', value: 0 },
  { name: 'Interest Rate (%)', value: 0 },
  { name: 'Loan Term (days)', value: 0 },
];

// Types
interface Category {
  name: string;
  value: number;
}

interface ChartData {
  name: string;
  value: number;
}

// Main Component
const PaydayLoanCostCalculator: React.FC = () => {
  // State
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  // Handlers
  const handleInputChange = (index: number, value: number) => {
    const newCategories = [...categories];
    newCategories[index].value = value;
    setCategories(newCategories);
  };

  const calculateResults = () => {
    const loanAmount = categories[0].value;
    const interestRate = categories[1].value / 100;
    const loanTerm = categories[2].value;

    const interest = loanAmount * interestRate * (loanTerm / 365);
    const total = loanAmount + interest;
    setTotalCost(total);

    setChartData([
      { name: 'Loan Amount', value: loanAmount },
      { name: 'Interest', value: interest },
      { name: 'Total Cost', value: total },
    ]);
  };

  const exportCSV = () => {
    const csvContent = `data:text/csv;charset=utf-8,Category,Value\n${chartData
      .map((d) => `${d.name},${d.value}`)
      .join('\n')}`;
    const encodedUri = encodeURI(csvContent);
    saveAs(encodedUri, 'payday-loan-cost.csv');
  };

  // UI
  return (
    <>
      <Head>
        <title>Payday Loan Cost Calculator</title>
        <meta name="description" content="Calculate the cost of your payday loan with our free tool." />
        <meta name="keywords" content="payday loan, cost calculator, finance tool" />
        <link rel="canonical" href="https://www.expensegoose.com/tools/payday-loan-cost-calculator" />
      </Head>
      <div className="max-w-screen-md mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-6">Payday Loan Cost Calculator</h1>
        <p className="text-base text-gray-700 mb-4">
          Welcome to the Payday Loan Cost Calculator. This tool helps you understand the total cost of your payday loan by considering the loan amount, interest rate, and loan term. Simply fill in the details below and click "Calculate" to see your results.
        </p>
        <div className="mb-8">
          {categories.map((category, index) => (
            <div key={index} className="mb-4">
              <label className="block text-base font-semibold mb-2">{category.name}</label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded"
                value={category.value}
                onChange={(e) => handleInputChange(index, parseFloat(e.target.value))}
              />
            </div>
          ))}
          <button
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400"
            onClick={calculateResults}
          >
            Calculate
          </button>
        </div>
        <h2 className="text-2xl font-semibold mb-4">Results</h2>
        <p className="text-base text-gray-700 mb-4">Total Cost: ${totalCost.toFixed(2)}</p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
        <button
          className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400"
          onClick={exportCSV}
        >
          <Download className="inline-block mr-2" />
          Export as CSV
        </button>
        <h2 className="text-2xl font-semibold mt-8 mb-4">Tips</h2>
        <ul className="list-disc list-inside mb-4 text-base">
          <li>Always compare different loan offers before making a decision.</li>
          <li>Consider the total cost, not just the interest rate.</li>
          <li>Pay off your loan as quickly as possible to reduce interest costs.</li>
        </ul>
        <h2 className="text-2xl font-semibold mt-8 mb-4">FAQs</h2>
        <FAQ />
      </div>
    </>
  );
};

// FAQ Component
const FAQ: React.FC = () => (
  <div>
    <h3 className="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
    <ul className="list-disc list-inside mb-4 text-base">
      <li>
        <strong>What is a payday loan?</strong>
        <p className="text-base text-gray-700 mb-4">
          A payday loan is a short-term, high-interest loan typically due on your next payday.
        </p>
      </li>
      <li>
        <strong>How is the interest calculated?</strong>
        <p className="text-base text-gray-700 mb-4">
          Interest is calculated based on the loan amount, interest rate, and loan term.
        </p>
      </li>
      <li>
        <strong>Can I repay my loan early?</strong>
        <p className="text-base text-gray-700 mb-4">
          Yes, repaying your loan early can save you money on interest.
        </p>
      </li>
    </ul>
  </div>
);

export default PaydayLoanCostCalculator;


This code provides a structured and modular approach to building a payday loan cost calculator using Next.js and React. It includes a main component for the calculator, a separate FAQ component, and uses Tailwind CSS for styling. The code is organized into logical sections for imports, constants, types, state, handlers, calculation logic, and UI rendering, ensuring maintainability and scalability.