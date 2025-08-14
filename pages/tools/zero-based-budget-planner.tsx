
// /pages/tools/zero-based-budget-planner.tsx

import React, { useState } from 'react';
import Head from 'next/head';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';
import { saveAs } from 'file-saver';
import { NextPage } from 'next';
import { BudgetCategory, BudgetItem, ChartData } from '../../types';

const defaultCategories: BudgetCategory[] = [
  { name: 'Housing', items: [] },
  { name: 'Food', items: [] },
  { name: 'Transportation', items: [] },
  { name: 'Utilities', items: [] },
  { name: 'Entertainment', items: [] },
];

const ZeroBasedBudgetPlanner: NextPage = () => {
  const [categories, setCategories] = useState<BudgetCategory[]>(defaultCategories);
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTotalIncome(Number(e.target.value));
  };

  const handleAddCategory = () => {
    setCategories([...categories, { name: '', items: [] }]);
  };

  const handleCategoryNameChange = (index: number, name: string) => {
    const updatedCategories = [...categories];
    updatedCategories[index].name = name;
    setCategories(updatedCategories);
  };

  const handleAddItem = (categoryIndex: number) => {
    const updatedCategories = [...categories];
    updatedCategories[categoryIndex].items.push({ name: '', amount: 0 });
    setCategories(updatedCategories);
  };

  const handleItemChange = (categoryIndex: number, itemIndex: number, field: 'name' | 'amount', value: string | number) => {
    const updatedCategories = [...categories];
    updatedCategories[categoryIndex].items[itemIndex][field] = field === 'amount' ? Number(value) : value;
    setCategories(updatedCategories);
  };

  const calculateResults = () => {
    const totalExpenses = categories.reduce((acc, category) => {
      return acc + category.items.reduce((sum, item) => sum + item.amount, 0);
    }, 0);

    const remaining = totalIncome - totalExpenses;
    setChartData([
      { name: 'Income', value: totalIncome },
      { name: 'Expenses', value: totalExpenses },
      { name: 'Remaining', value: remaining },
    ]);
  };

  const exportCSV = () => {
    const csvContent = `data:text/csv;charset=utf-8,Category,Item,Amount\n` +
      categories.map(category =>
        category.items.map(item => `${category.name},${item.name},${item.amount}`).join('\n')
      ).join('\n');
    const encodedUri = encodeURI(csvContent);
    saveAs(encodedUri, 'budget.csv');
  };

  return (
    <div className="max-w-screen-md mx-auto px-4 py-8">
      <Head>
        <title>Zero-Based Budget Planner</title>
        <meta name="description" content="Plan your budget effectively with the Zero-Based Budget Planner." />
        <meta name="keywords" content="budget, finance, zero-based, planner" />
        <link rel="canonical" href="https://www.expensegoose.com/tools/zero-based-budget-planner" />
      </Head>
      <h1 className="text-3xl font-bold text-center mb-6">Zero-Based Budget Planner</h1>
      <p className="text-base text-gray-700 mb-4">
        Welcome to the Zero-Based Budget Planner. This tool helps you allocate every dollar of your income to specific expenses, ensuring that your total income minus your total expenses equals zero. Let's get started!
      </p>
      <div className="mb-4">
        <label className="block text-base font-semibold mb-2">Total Monthly Income</label>
        <input
          type="number"
          value={totalIncome}
          onChange={handleIncomeChange}
          className="w-full p-2 border border-gray-300 rounded"
          aria-label="Total Monthly Income"
        />
      </div>
      {categories.map((category, categoryIndex) => (
        <div key={categoryIndex} className="mb-4">
          <input
            type="text"
            value={category.name}
            onChange={(e) => handleCategoryNameChange(categoryIndex, e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-2"
            placeholder="Category Name"
            aria-label={`Category Name ${categoryIndex + 1}`}
          />
          {category.items.map((item, itemIndex) => (
            <div key={itemIndex} className="flex mb-2">
              <input
                type="text"
                value={item.name}
                onChange={(e) => handleItemChange(categoryIndex, itemIndex, 'name', e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded mr-2"
                placeholder="Item Name"
                aria-label={`Item Name ${itemIndex + 1}`}
              />
              <input
                type="number"
                value={item.amount}
                onChange={(e) => handleItemChange(categoryIndex, itemIndex, 'amount', e.target.value)}
                className="w-24 p-2 border border-gray-300 rounded"
                placeholder="Amount"
                aria-label={`Item Amount ${itemIndex + 1}`}
              />
            </div>
          ))}
          <button
            onClick={() => handleAddItem(categoryIndex)}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
          >
            Add Item
          </button>
        </div>
      ))}
      <button
        onClick={handleAddCategory}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 mb-4"
      >
        Add Category
      </button>
      <button
        onClick={calculateResults}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 mb-4"
      >
        Calculate
      </button>
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
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 mt-4"
      >
        <Download className="inline-block mr-2" /> Export CSV
      </button>
      <h2 className="text-2xl font-semibold mb-4 mt-8">Tips for Effective Budgeting</h2>
      <ul className="list-disc list-inside mb-4 text-base">
        <li>Review your budget regularly to ensure it aligns with your financial goals.</li>
        <li>Be realistic about your expenses and adjust categories as needed.</li>
        <li>Consider setting aside a small amount for unexpected expenses.</li>
      </ul>
      <h2 className="text-2xl font-semibold mb-4 mt-8">Frequently Asked Questions</h2>
      <FAQ />
    </div>
  );
};

const FAQ: React.FC = () => (
  <div>
    <h3 className="text-xl font-semibold mb-4">FAQs</h3>
    <ul className="list-disc list-inside mb-4 text-base">
      <li>What is a zero-based budget? A zero-based budget is a method where your income minus expenses equals zero.</li>
      <li>How often should I update my budget? It's best to review your budget monthly or whenever your financial situation changes.</li>
      <li>Can I add more categories? Yes, you can add as many categories as you need to fit your financial situation.</li>
    </ul>
  </div>
);

export default ZeroBasedBudgetPlanner;
