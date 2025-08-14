
// /pages/tools/rental-property-roi-calculator.tsx

import React, { useState } from 'react';
import Head from 'next/head';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';
import { saveAs } from 'file-saver';
import { NextPage } from 'next';

// Constants
const DEFAULT_CATEGORIES = ['Rent', 'Expenses', 'Mortgage'];

// Types
interface UserInput {
  category: string;
  amount: number;
}

interface ChartData {
  name: string;
  value: number;
}

// Main Component
const RentalPropertyROICalculator: NextPage = () => {
  // State
  const [inputs, setInputs] = useState<UserInput[]>([]);
  const [results, setResults] = useState<number>(0);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  // Handlers
  const handleInputChange = (index: number, field: string, value: string) => {
    const updatedInputs = [...inputs];
    updatedInputs[index] = { ...updatedInputs[index], [field]: value };
    setInputs(updatedInputs);
  };

  const addCategory = () => {
    setInputs([...inputs, { category: '', amount: 0 }]);
  };

  const removeCategory = (index: number) => {
    const updatedInputs = inputs.filter((_, i) => i !== index);
    setInputs(updatedInputs);
  };

  const calculateROI = () => {
    const totalIncome = inputs.reduce((acc, input) => acc + (input.category === 'Rent' ? input.amount : 0), 0);
    const totalExpenses = inputs.reduce((acc, input) => acc + (input.category !== 'Rent' ? input.amount : 0), 0);
    const roi = totalIncome - totalExpenses;
    setResults(roi);
    prepareChartData(totalIncome, totalExpenses);
  };

  const prepareChartData = (income: number, expenses: number) => {
    setChartData([
      { name: 'Income', value: income },
      { name: 'Expenses', value: expenses },
    ]);
  };

  const exportCSV = () => {
    const csvContent = `data:text/csv;charset=utf-8,Category,Amount\n${inputs
      .map(input => `${input.category},${input.amount}`)
      .join('\n')}`;
    const encodedUri = encodeURI(csvContent);
    saveAs(encodedUri, 'rental-property-roi.csv');
  };

  // UI
  return (
    <div className="max-w-screen-md mx-auto px-4 py-8">
      <Head>
        <title>Rental Property ROI Calculator</title>
        <meta name="description" content="Calculate your rental property's ROI with ease." />
        <meta name="keywords" content="rental, property, ROI, calculator, finance" />
        <link rel="canonical" href="https://www.expensegoose.com/tools/rental-property-roi-calculator" />
      </Head>

      <h1 className="text-3xl font-bold text-center mb-6">Rental Property ROI Calculator</h1>
      <p className="text-base text-gray-700 mb-4">
        Welcome to my Rental Property ROI Calculator. This tool helps you calculate the return on investment for your rental properties. Simply input your income and expenses to get started.
      </p>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Inputs</h2>
        {inputs.map((input, index) => (
          <div key={index} className="mb-4">
            <input
              type="text"
              value={input.category}
              onChange={(e) => handleInputChange(index, 'category', e.target.value)}
              placeholder="Category"
              className="border p-2 mr-2"
            />
            <input
              type="number"
              value={input.amount}
              onChange={(e) => handleInputChange(index, 'amount', e.target.value)}
              placeholder="Amount"
              className="border p-2 mr-2"
            />
            <button onClick={() => removeCategory(index)} className="text-red-500">Remove</button>
          </div>
        ))}
        <button onClick={addCategory} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Add Category</button>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Results</h2>
        <button onClick={calculateROI} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mb-4">Calculate ROI</button>
        <p className="text-base text-gray-700 mb-4">Your ROI is: ${results}</p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
        <button onClick={exportCSV} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mt-4 flex items-center">
          <Download className="mr-2" /> Export CSV
        </button>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Tips</h2>
        <ul className="list-disc list-inside mb-4 text-base">
          <li>Ensure all categories are filled correctly for accurate results.</li>
          <li>Regularly update your inputs to reflect current market conditions.</li>
          <li>Consider both fixed and variable expenses in your calculations.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">FAQs</h2>
        <ul className="list-disc list-inside mb-4 text-base">
          <li>What is ROI? - ROI stands for Return on Investment, a measure of the profitability of an investment.</li>
          <li>How often should I update my inputs? - It's best to update them monthly or whenever there are significant changes.</li>
          <li>Can I add more categories? - Yes, use the 'Add Category' button to include more income or expense categories.</li>
        </ul>
      </section>
    </div>
  );
};

export default RentalPropertyROICalculator;


This code provides a comprehensive and user-friendly Rental Property ROI Calculator using Next.js and TailwindCSS. It includes a form for inputting financial data, a calculation function for ROI, a chart for visualizing income and expenses, and options to export the data as a CSV file. The page is structured with semantic HTML and styled for accessibility and responsiveness.