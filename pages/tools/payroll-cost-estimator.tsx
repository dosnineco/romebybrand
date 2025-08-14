Certainly! Below is the refactored code for the Next.js page component, `payroll-cost-estimator.tsx`, following the specified requirements. This code includes modular components, Tailwind CSS styling, and a focus on accessibility and performance.


// /pages/tools/payroll-cost-estimator.tsx

import React, { useState } from 'react';
import Head from 'next/head';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';

// Constants
const DEFAULT_CATEGORIES = [
  { name: 'Salary', amount: 0 },
  { name: 'Benefits', amount: 0 },
  { name: 'Taxes', amount: 0 },
];

// Types
interface Category {
  name: string;
  amount: number;
}

interface ChartData {
  name: string;
  value: number;
}

// Main Component
const PayrollCostEstimator: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  // Handlers
  const handleCategoryChange = (index: number, amount: number) => {
    const updatedCategories = [...categories];
    updatedCategories[index].amount = amount;
    setCategories(updatedCategories);
    calculateTotalCost(updatedCategories);
  };

  const calculateTotalCost = (categories: Category[]) => {
    const total = categories.reduce((acc, category) => acc + category.amount, 0);
    setTotalCost(total);
    prepareChartData(categories);
  };

  const prepareChartData = (categories: Category[]) => {
    const data = categories.map(category => ({
      name: category.name,
      value: category.amount,
    }));
    setChartData(data);
  };

  const exportCSV = () => {
    const csvContent = `data:text/csv;charset=utf-8,${categories.map(c => `${c.name},${c.amount}`).join('\n')}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'payroll_cost_estimator.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-screen-md mx-auto px-4 py-8">
      <Head>
        <title>Payroll Cost Estimator</title>
        <meta name="description" content="Estimate your payroll costs with our free tool." />
        <meta name="keywords" content="payroll, cost estimator, finance tool" />
        <link rel="canonical" href="https://www.expensegoose.com/tools/payroll-cost-estimator" />
      </Head>

      <h1 className="text-3xl font-bold text-center mb-6">Payroll Cost Estimator</h1>
      <p className="text-base text-gray-700 mb-4">
        Welcome to the Payroll Cost Estimator. This tool helps you calculate the total cost of payroll by considering various categories such as salary, benefits, and taxes. Simply enter the amounts for each category to get started.
      </p>

      <div className="mb-8">
        {categories.map((category, index) => (
          <div key={index} className="mb-4">
            <label className="block text-base font-semibold mb-2" htmlFor={`category-${index}`}>
              {category.name}
            </label>
            <input
              type="number"
              id={`category-${index}`}
              value={category.amount}
              onChange={(e) => handleCategoryChange(index, parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Results</h2>
        <p className="text-base text-gray-700 mb-4">Total Payroll Cost: ${totalCost.toFixed(2)}</p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#3182ce" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <button
        onClick={exportCSV}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <Download className="inline-block mr-2" /> Export as CSV
      </button>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Tips</h2>
        <ul className="list-disc list-inside mb-4 text-base">
          <li>Regularly update your payroll categories to reflect any changes in your business expenses.</li>
          <li>Consider consulting with a financial advisor for more accurate payroll forecasting.</li>
          <li>Use this tool monthly to track your payroll trends over time.</li>
        </ul>
      </div>

      <FAQSection />
    </div>
  );
};

// FAQ Component
const FAQSection: React.FC = () => (
  <div className="mt-8">
    <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
    <div className="mb-4">
      <h3 className="text-xl font-semibold mb-2">What is the Payroll Cost Estimator?</h3>
      <p className="text-base text-gray-700">
        The Payroll Cost Estimator is a tool designed to help you calculate the total cost of payroll by considering various categories such as salary, benefits, and taxes.
      </p>
    </div>
    <div className="mb-4">
      <h3 className="text-xl font-semibold mb-2">How do I use this tool?</h3>
      <p className="text-base text-gray-700">
        Simply enter the amounts for each category and the tool will calculate the total payroll cost for you.
      </p>
    </div>
    <div className="mb-4">
      <h3 className="text-xl font-semibold mb-2">Can I export the results?</h3>
      <p className="text-base text-gray-700">
        Yes, you can export the results as a CSV file by clicking the "Export as CSV" button.
      </p>
    </div>
  </div>
);

export default PayrollCostEstimator;


This code is structured to be modular and maintainable, with separate components for the FAQ section and a clear separation of concerns. Tailwind CSS is used for styling, and the page is designed to be responsive and accessible.