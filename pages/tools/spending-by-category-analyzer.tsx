Certainly! Below is a refactored Next.js page component for the "Spending by Category Analyzer" tool. This code is organized into logical sections and uses Tailwind CSS for styling. It includes a form for user inputs, a chart for visualizing data, and additional sections like FAQs and tips. The code is designed to be maintainable and scalable.


// /pages/tools/spending-by-category-analyzer.tsx

import React, { useState } from 'react';
import Head from 'next/head';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';

// Constants
const DEFAULT_CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Utilities'];

// Types
interface CategoryData {
  category: string;
  amount: number;
}

// Main Component
const SpendingByCategoryAnalyzer: React.FC = () => {
  // State
  const [categories, setCategories] = useState<CategoryData[]>(DEFAULT_CATEGORIES.map(category => ({ category, amount: 0 })));
  const [chartData, setChartData] = useState<CategoryData[]>([]);

  // Handlers
  const handleAmountChange = (index: number, amount: number) => {
    const updatedCategories = [...categories];
    updatedCategories[index].amount = amount;
    setCategories(updatedCategories);
    updateChartData(updatedCategories);
  };

  const updateChartData = (categories: CategoryData[]) => {
    setChartData(categories);
  };

  const exportCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,' + categories.map(c => `${c.category},${c.amount}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'spending_by_category.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // UI
  return (
    <div className="max-w-screen-md mx-auto px-4 py-8">
      <Head>
        <title>Spending by Category Analyzer</title>
        <meta name="description" content="Analyze your spending by category with our free tool." />
        <meta name="keywords" content="personal finance, spending, budget, analyzer" />
        <link rel="canonical" href="https://www.expensegoose.com/tools/spending-by-category-analyzer" />
      </Head>

      <h1 className="text-3xl font-bold text-center mb-6">Spending by Category Analyzer</h1>
      <p className="text-base text-gray-700 mb-4">
        Welcome to the Spending by Category Analyzer. This tool helps you understand where your money goes by categorizing your expenses. Simply enter your spending amounts for each category, and we'll visualize it for you.
      </p>

      <div className="mb-8">
        {categories.map((category, index) => (
          <div key={index} className="mb-4">
            <label className="block text-xl font-semibold mb-2">{category.category}</label>
            <input
              type="number"
              value={category.amount}
              onChange={(e) => handleAmountChange(index, parseFloat(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg"
              aria-label={`Amount spent on ${category.category}`}
            />
          </div>
        ))}
      </div>

      <button onClick={exportCSV} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 mb-8">
        <Download className="inline-block mr-2" /> Export as CSV
      </button>

      <h2 className="text-2xl font-semibold mb-4">Results</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="amount" fill="#3182ce" />
        </BarChart>
      </ResponsiveContainer>

      <TipsSection />

      <FAQSection />
    </div>
  );
};

// Tips Section Component
const TipsSection: React.FC = () => (
  <div className="mt-8">
    <h3 className="text-xl font-semibold mb-4">Tips for Managing Your Spending</h3>
    <ul className="list-disc list-inside mb-4 text-base">
      <li>Track your expenses regularly to identify spending patterns.</li>
      <li>Set a budget for each category and stick to it.</li>
      <li>Review your spending monthly to adjust your budget as needed.</li>
    </ul>
  </div>
);

// FAQ Section Component
const FAQSection: React.FC = () => (
  <div className="mt-8">
    <h3 className="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
    <ul className="list-disc list-inside mb-4 text-base">
      <li><strong>How do I add a new category?</strong> Currently, you can only use the default categories. Future updates will allow adding custom categories.</li>
      <li><strong>Can I save my data?</strong> Yes, you can export your data as a CSV file.</li>
      <li><strong>Is my data secure?</strong> Yes, all data is processed locally in your browser and not stored on our servers.</li>
    </ul>
  </div>
);

export default SpendingByCategoryAnalyzer;


This code is structured to be easily maintainable and scalable. It uses functional components and hooks, and it is styled with Tailwind CSS for a modern, responsive design. The page includes a form for user inputs, a chart for visualizing spending data, and additional sections for tips and FAQs.