
// /pages/tools/yearly-expense-tracker.tsx

import React, { useState } from 'react';
import Head from 'next/head';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';
import { saveAs } from 'file-saver';
import { ExpenseForm, FAQSection, TipsSection } from '../../components';

interface ExpenseCategory {
  name: string;
  amount: number;
}

const defaultCategories: ExpenseCategory[] = [
  { name: 'Housing', amount: 0 },
  { name: 'Food', amount: 0 },
  { name: 'Transportation', amount: 0 },
  { name: 'Utilities', amount: 0 },
  { name: 'Healthcare', amount: 0 },
  { name: 'Entertainment', amount: 0 },
];

const YearlyExpenseTracker: React.FC = () => {
  const [categories, setCategories] = useState<ExpenseCategory[]>(defaultCategories);
  const [totalExpense, setTotalExpense] = useState<number>(0);

  const handleInputChange = (index: number, value: number) => {
    const updatedCategories = [...categories];
    updatedCategories[index].amount = value;
    setCategories(updatedCategories);
    calculateTotalExpense(updatedCategories);
  };

  const calculateTotalExpense = (categories: ExpenseCategory[]) => {
    const total = categories.reduce((sum, category) => sum + category.amount, 0);
    setTotalExpense(total);
  };

  const exportToCSV = () => {
    const csvContent = `data:text/csv;charset=utf-8,Category,Amount\n${categories
      .map((cat) => `${cat.name},${cat.amount}`)
      .join('\n')}`;
    const encodedUri = encodeURI(csvContent);
    saveAs(encodedUri, 'yearly-expense-tracker.csv');
  };

  const chartData = categories.map((category) => ({
    name: category.name,
    amount: category.amount,
  }));

  return (
    <div className="max-w-screen-md mx-auto px-4 py-8">
      <Head>
        <title>Yearly Expense Tracker</title>
        <meta name="description" content="Track your yearly expenses with our free tool." />
        <meta name="keywords" content="expense tracker, personal finance, budgeting" />
        <link rel="canonical" href="https://www.expensegoose.com/tools/yearly-expense-tracker" />
      </Head>

      <h1 className="text-3xl font-bold text-center mb-6">Yearly Expense Tracker</h1>
      <p className="text-base text-gray-700 mb-4">
        Welcome to your personal Yearly Expense Tracker. This tool helps you keep track of your annual expenses across various categories. Simply input your expenses, and we'll do the rest!
      </p>

      <ExpenseForm categories={categories} onInputChange={handleInputChange} />

      <h2 className="text-2xl font-semibold mb-4">Results</h2>
      <p className="text-base text-gray-700 mb-4">Total Yearly Expense: ${totalExpense}</p>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="amount" fill="#3182ce" />
        </BarChart>
      </ResponsiveContainer>

      <button
        onClick={exportToCSV}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 mt-4"
      >
        <Download className="inline-block mr-2" /> Export as CSV
      </button>

      <TipsSection />

      <FAQSection />
    </div>
  );
};

export default YearlyExpenseTracker;

// components/ExpenseForm.tsx
import React from 'react';

interface ExpenseFormProps {
  categories: ExpenseCategory[];
  onInputChange: (index: number, value: number) => void;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ categories, onInputChange }) => (
  <div>
    <h2 className="text-2xl font-semibold mb-4">Enter Your Expenses</h2>
    {categories.map((category, index) => (
      <div key={index} className="mb-4">
        <label className="block text-base text-gray-700 mb-2">{category.name}</label>
        <input
          type="number"
          value={category.amount}
          onChange={(e) => onInputChange(index, parseFloat(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>
    ))}
  </div>
);

// components/FAQSection.tsx
import React from 'react';

export const FAQSection: React.FC = () => (
  <div>
    <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
    <ul className="list-disc list-inside mb-4 text-base">
      <li>How do I use this tool?</li>
      <li>Can I add more categories?</li>
      <li>How is the total calculated?</li>
    </ul>
  </div>
);

// components/TipsSection.tsx
import React from 'react';

export const TipsSection: React.FC = () => (
  <div>
    <h2 className="text-2xl font-semibold mb-4">Tips for Managing Your Expenses</h2>
    <ul className="list-disc list-inside mb-4 text-base">
      <li>Set a monthly budget and stick to it.</li>
      <li>Track your expenses regularly to avoid overspending.</li>
      <li>Look for areas where you can cut costs.</li>
    </ul>
  </div>
);


This refactored code organizes the Yearly Expense Tracker into a main page component and separate components for the expense form, FAQ section, and tips section. It uses Tailwind CSS for styling and ensures accessibility and responsiveness. The code is modular, making it easy to add new features or categories in the future.