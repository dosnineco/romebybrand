
// /pages/tools/school-supplies-budget-planner.tsx

import React, { useState } from 'react';
import Head from 'next/head';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';

interface Category {
  name: string;
  budget: number;
  actual: number;
}

const defaultCategories: Category[] = [
  { name: 'Notebooks', budget: 50, actual: 0 },
  { name: 'Pens & Pencils', budget: 30, actual: 0 },
  { name: 'Backpack', budget: 70, actual: 0 },
  { name: 'Art Supplies', budget: 40, actual: 0 },
];

const SchoolSuppliesBudgetPlanner: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [totalBudget, setTotalBudget] = useState<number>(0);
  const [totalActual, setTotalActual] = useState<number>(0);

  const handleInputChange = (index: number, field: 'budget' | 'actual', value: number) => {
    const updatedCategories = [...categories];
    updatedCategories[index][field] = value;
    setCategories(updatedCategories);
    calculateTotals(updatedCategories);
  };

  const calculateTotals = (categories: Category[]) => {
    const budgetSum = categories.reduce((sum, category) => sum + category.budget, 0);
    const actualSum = categories.reduce((sum, category) => sum + category.actual, 0);
    setTotalBudget(budgetSum);
    setTotalActual(actualSum);
  };

  const exportCSV = () => {
    const csvContent = `data:text/csv;charset=utf-8,Category,Budget,Actual\n${categories
      .map((c) => `${c.name},${c.budget},${c.actual}`)
      .join('\n')}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'school_supplies_budget.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Head>
        <title>School Supplies Budget Planner</title>
        <meta name="description" content="Plan and track your school supplies budget effectively." />
        <meta name="keywords" content="budget, school supplies, planner, finance tool" />
        <link rel="canonical" href="https://www.expensegoose.com/tools/school-supplies-budget-planner" />
      </Head>
      <div className="max-w-screen-md mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-6">School Supplies Budget Planner</h1>
        <p className="text-base text-gray-700 mb-4">
          Welcome to your personal School Supplies Budget Planner. Here, you can manage your budget for school supplies efficiently. Let's get started!
        </p>
        <div>
          {categories.map((category, index) => (
            <div key={index} className="mb-4">
              <h2 className="text-xl font-semibold mb-2">{category.name}</h2>
              <div className="flex space-x-4">
                <div>
                  <label className="block text-gray-700">Budget</label>
                  <input
                    type="number"
                    value={category.budget}
                    onChange={(e) => handleInputChange(index, 'budget', parseFloat(e.target.value))}
                    className="border rounded px-2 py-1 w-full"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Actual</label>
                  <input
                    type="number"
                    value={category.actual}
                    onChange={(e) => handleInputChange(index, 'actual', parseFloat(e.target.value))}
                    className="border rounded px-2 py-1 w-full"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="my-6">
          <h2 className="text-2xl font-semibold mb-4">Results</h2>
          <p className="text-base text-gray-700 mb-4">Total Budget: ${totalBudget}</p>
          <p className="text-base text-gray-700 mb-4">Total Actual: ${totalActual}</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categories}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="budget" fill="#8884d8" />
              <Bar dataKey="actual" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <button
          onClick={exportCSV}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
        >
          <Download className="inline-block mr-2" /> Export as CSV
        </button>
        <div className="my-8">
          <h2 className="text-2xl font-semibold mb-4">Tips for Budgeting</h2>
          <ul className="list-disc list-inside mb-4 text-base">
            <li>Always compare prices before purchasing.</li>
            <li>Look for discounts and sales.</li>
            <li>Consider buying in bulk for frequently used items.</li>
            <li>Reuse supplies from previous years if possible.</li>
          </ul>
        </div>
        <FAQSection />
      </div>
    </>
  );
};

const FAQSection: React.FC = () => (
  <div className="my-8">
    <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
    <div className="mb-4">
      <h3 className="text-xl font-semibold mb-2">How do I add a new category?</h3>
      <p className="text-base text-gray-700">
        Currently, the tool supports predefined categories. Future updates may include the ability to add custom categories.
      </p>
    </div>
    <div className="mb-4">
      <h3 className="text-xl font-semibold mb-2">Can I save my budget plan?</h3>
      <p className="text-base text-gray-700">
        Yes, you can export your budget plan as a CSV file for future reference.
      </p>
    </div>
  </div>
);

export default SchoolSuppliesBudgetPlanner;


This code provides a comprehensive and user-friendly School Supplies Budget Planner tool using Next.js and TailwindCSS. It includes a responsive design, accessible forms, and a bar chart for visualizing budget data. The code is modular, making it easy to maintain and extend with new features.