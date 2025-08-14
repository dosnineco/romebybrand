
// /pages/tools/vacation-budget-planner.tsx

import React, { useState } from 'react';
import Head from 'next/head';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';

interface BudgetCategory {
  name: string;
  amount: number;
}

interface ChartData {
  name: string;
  value: number;
}

const defaultCategories: BudgetCategory[] = [
  { name: 'Flights', amount: 0 },
  { name: 'Accommodation', amount: 0 },
  { name: 'Food', amount: 0 },
  { name: 'Activities', amount: 0 },
  { name: 'Miscellaneous', amount: 0 },
];

const VacationBudgetPlanner: React.FC = () => {
  const [categories, setCategories] = useState<BudgetCategory[]>(defaultCategories);
  const [totalBudget, setTotalBudget] = useState<number>(0);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  const handleCategoryChange = (index: number, amount: number) => {
    const updatedCategories = [...categories];
    updatedCategories[index].amount = amount;
    setCategories(updatedCategories);
    calculateTotalBudget(updatedCategories);
  };

  const calculateTotalBudget = (categories: BudgetCategory[]) => {
    const total = categories.reduce((sum, category) => sum + category.amount, 0);
    setTotalBudget(total);
    prepareChartData(categories);
  };

  const prepareChartData = (categories: BudgetCategory[]) => {
    const data = categories.map(category => ({
      name: category.name,
      value: category.amount,
    }));
    setChartData(data);
  };

  const exportToCSV = () => {
    const csvContent = `data:text/csv;charset=utf-8,Category,Amount\n${categories
      .map(category => `${category.name},${category.amount}`)
      .join('\n')}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'vacation_budget.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-screen-md mx-auto px-4 py-8">
      <Head>
        <title>Vacation Budget Planner</title>
        <meta name="description" content="Plan your vacation budget effectively with our Vacation Budget Planner tool." />
        <meta name="keywords" content="vacation, budget, planner, finance, travel" />
        <link rel="canonical" href="https://www.expensegoose.com/tools/vacation-budget-planner" />
      </Head>

      <h1 className="text-3xl font-bold text-center mb-6">Vacation Budget Planner</h1>
      <p className="text-base text-gray-700 mb-4">
        Planning a vacation can be exciting, but managing your budget is crucial to ensure a stress-free experience. Use our Vacation Budget Planner to allocate your funds wisely and enjoy your trip without financial worries.
      </p>

      <div className="mb-8">
        {categories.map((category, index) => (
          <div key={index} className="mb-4">
            <label className="block text-xl font-semibold mb-2">{category.name}</label>
            <input
              type="number"
              value={category.amount}
              onChange={(e) => handleCategoryChange(index, parseFloat(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg"
              aria-label={`Budget for ${category.name}`}
            />
          </div>
        ))}
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Total Budget: ${totalBudget}</h2>
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
        onClick={exportToCSV}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
      >
        <Download className="inline-block mr-2" /> Export as CSV
      </button>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Tips for Budgeting Your Vacation</h2>
        <ul className="list-disc list-inside mb-4 text-base">
          <li>Research your destination to estimate costs accurately.</li>
          <li>Set a daily spending limit to avoid overspending.</li>
          <li>Look for deals and discounts on flights and accommodations.</li>
          <li>Consider travel insurance to protect your investment.</li>
          <li>Keep some funds aside for unexpected expenses.</li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">How do I use the Vacation Budget Planner?</h3>
          <p className="text-base text-gray-700 mb-4">
            Simply enter your estimated expenses for each category, and the tool will calculate your total budget. You can also export your budget as a CSV file for future reference.
          </p>
        </div>
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Can I add more categories?</h3>
          <p className="text-base text-gray-700 mb-4">
            Currently, the tool supports a fixed set of categories. However, we are working on adding more customization options in the future.
          </p>
        </div>
      </section>
    </div>
  );
};

export default VacationBudgetPlanner;


This code provides a complete Next.js page component for a "Vacation Budget Planner" tool. It includes a form for inputting budget categories, a bar chart to visualize the budget, and options to export the data as a CSV file. The page is styled using TailwindCSS and is designed to be responsive and accessible.