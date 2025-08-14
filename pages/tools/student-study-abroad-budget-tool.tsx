
// /pages/tools/student-study-abroad-budget-tool.tsx

import React, { useState } from 'react';
import Head from 'next/head';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';
import { saveAs } from 'file-saver';
import { CSVLink } from 'react-csv';

// Constants
const DEFAULT_CATEGORIES = [
  { name: 'Tuition', amount: 0 },
  { name: 'Accommodation', amount: 0 },
  { name: 'Food', amount: 0 },
  { name: 'Travel', amount: 0 },
  { name: 'Miscellaneous', amount: 0 },
];

// Types
interface Category {
  name: string;
  amount: number;
}

// Main Component
const StudentStudyAbroadBudgetTool: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [totalBudget, setTotalBudget] = useState<number>(0);

  // Handlers
  const handleAmountChange = (index: number, amount: number) => {
    const updatedCategories = [...categories];
    updatedCategories[index].amount = amount;
    setCategories(updatedCategories);
    calculateTotalBudget(updatedCategories);
  };

  const calculateTotalBudget = (categories: Category[]) => {
    const total = categories.reduce((sum, category) => sum + category.amount, 0);
    setTotalBudget(total);
  };

  const exportToCSV = () => {
    const csvData = categories.map(category => ({
      Category: category.name,
      Amount: category.amount,
    }));
    return csvData;
  };

  // UI
  return (
    <div className="max-w-screen-md mx-auto px-4 py-8">
      <Head>
        <title>Student Study Abroad Budget Tool</title>
        <meta name="description" content="Plan your study abroad budget effectively with our comprehensive tool." />
        <meta name="keywords" content="study abroad, budget tool, personal finance, student finance" />
        <link rel="canonical" href="https://www.expensegoose.com/tools/student-study-abroad-budget-tool" />
      </Head>

      <h1 className="text-3xl font-bold text-center mb-6">Student Study Abroad Budget Tool</h1>
      <p className="text-base text-gray-700 mb-4">
        Planning to study abroad? Use this tool to estimate your budget and manage your expenses effectively.
      </p>

      <div className="mb-8">
        {categories.map((category, index) => (
          <div key={index} className="mb-4">
            <label className="block text-xl font-semibold mb-2">{category.name}</label>
            <input
              type="number"
              value={category.amount}
              onChange={(e) => handleAmountChange(index, parseFloat(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg"
              aria-label={`Amount for ${category.name}`}
            />
          </div>
        ))}
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Total Budget: ${totalBudget}</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={categories}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#3182ce" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-between items-center mb-8">
        <CSVLink data={exportToCSV()} filename="budget.csv" className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Export to CSV
        </CSVLink>
      </div>

      <TipsSection />
      <FAQSection />
    </div>
  );
};

// Tips Component
const TipsSection: React.FC = () => (
  <div className="mb-8">
    <h2 className="text-2xl font-semibold mb-4">Tips for Managing Your Budget</h2>
    <ul className="list-disc list-inside mb-4 text-base">
      <li>Track your expenses regularly to avoid overspending.</li>
      <li>Look for student discounts and deals.</li>
      <li>Consider part-time work to supplement your budget.</li>
      <li>Plan your travel during off-peak seasons to save money.</li>
    </ul>
  </div>
);

// FAQ Component
const FAQSection: React.FC = () => (
  <div className="mb-8">
    <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
    <div className="mb-4">
      <h3 className="text-xl font-semibold mb-2">How accurate is this tool?</h3>
      <p className="text-base text-gray-700 mb-4">
        This tool provides an estimate based on the inputs you provide. It's important to adjust the amounts based on your personal circumstances.
      </p>
    </div>
    <div className="mb-4">
      <h3 className="text-xl font-semibold mb-2">Can I add more categories?</h3>
      <p className="text-base text-gray-700 mb-4">
        Currently, the tool supports a fixed set of categories. We plan to add more customization options in future updates.
      </p>
    </div>
  </div>
);

export default StudentStudyAbroadBudgetTool;


This code provides a structured and modular approach to building the "Student Study Abroad Budget Tool" using Next.js and TypeScript. It includes a main component for the tool, separate components for tips and FAQs, and uses TailwindCSS for styling. The code is organized into logical sections, making it easy to maintain and extend.