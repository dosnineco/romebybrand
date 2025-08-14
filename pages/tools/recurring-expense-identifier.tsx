
// /pages/tools/recurring-expense-identifier.tsx

import React, { useState } from 'react';
import Head from 'next/head';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';

// Constants
const DEFAULT_CATEGORIES = ['Rent', 'Utilities', 'Subscriptions', 'Groceries'];

// Types
interface Expense {
  category: string;
  amount: number;
}

// Main Component
const RecurringExpenseIdentifier: React.FC = () => {
  // State
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [category, setCategory] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [chartData, setChartData] = useState<any[]>([]);

  // Handlers
  const handleAddExpense = () => {
    if (category && amount > 0) {
      const newExpense = { category, amount };
      setExpenses([...expenses, newExpense]);
      updateChartData([...expenses, newExpense]);
      setCategory('');
      setAmount(0);
    }
  };

  const updateChartData = (expenses: Expense[]) => {
    const data = expenses.reduce((acc, expense) => {
      const found = acc.find(item => item.category === expense.category);
      if (found) {
        found.amount += expense.amount;
      } else {
        acc.push({ category: expense.category, amount: expense.amount });
      }
      return acc;
    }, [] as { category: string; amount: number }[]);
    setChartData(data);
  };

  const handleExportCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,Category,Amount\n' +
      expenses.map(e => `${e.category},${e.amount}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'recurring_expenses.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // UI
  return (
    <div className="max-w-screen-md mx-auto px-4 py-8">
      <Head>
        <title>Recurring Expense Identifier</title>
        <meta name="description" content="Identify and manage your recurring expenses with ease." />
        <meta name="keywords" content="personal finance, recurring expenses, budget tool" />
        <link rel="canonical" href="https://www.expensegoose.com/tools/recurring-expense-identifier" />
      </Head>

      <h1 className="text-3xl font-bold text-center mb-6">Recurring Expense Identifier</h1>
      <p className="text-base text-gray-700 mb-4">
        Welcome to the Recurring Expense Identifier tool. Here, you can easily track and manage your recurring expenses to better understand your financial habits.
      </p>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Add Your Expenses</h2>
        <div className="mb-4">
          <label className="block text-base mb-2">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg mb-4"
            placeholder="e.g., Rent"
          />
          <label className="block text-base mb-2">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded-lg mb-4"
            placeholder="e.g., 1000"
          />
          <button
            onClick={handleAddExpense}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
          >
            Add Expense
          </button>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Expense Overview</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
        <button
          onClick={handleExportCSV}
          className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 flex items-center"
        >
          <Download className="mr-2" /> Export as CSV
        </button>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Tips for Managing Recurring Expenses</h2>
        <ul className="list-disc list-inside mb-4 text-base">
          <li>Review your expenses regularly to identify unnecessary costs.</li>
          <li>Set up alerts for upcoming payments to avoid late fees.</li>
          <li>Consider consolidating subscriptions to save money.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
        <FAQ />
      </section>
    </div>
  );
};

// FAQ Component
const FAQ: React.FC = () => (
  <div>
    <h3 className="text-xl font-semibold mb-4">FAQs</h3>
    <ul className="list-disc list-inside mb-4 text-base">
      <li>How do I add a new category? - Simply type the category name in the input field and add the amount.</li>
      <li>Can I export my data? - Yes, you can export your data as a CSV file.</li>
      <li>Is my data saved? - No, the data is not saved and will be lost upon page refresh.</li>
    </ul>
  </div>
);

export default RecurringExpenseIdentifier;


This code provides a structured and modular approach to building the "Recurring Expense Identifier" tool using Next.js and React. It includes a main component for managing expenses, a chart for visualizing data, and a FAQ section for user guidance. The use of TailwindCSS ensures a modern and responsive design.