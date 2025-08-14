
// /pages/tools/part-time-vs-full-time-income-comparison.tsx

import React, { useState } from 'react';
import Head from 'next/head';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Download } from 'lucide-react';

interface IncomeData {
  category: string;
  partTime: number;
  fullTime: number;
}

const defaultCategories: IncomeData[] = [
  { category: 'Salary', partTime: 0, fullTime: 0 },
  { category: 'Bonuses', partTime: 0, fullTime: 0 },
  { category: 'Other Income', partTime: 0, fullTime: 0 },
];

const PartTimeVsFullTimeIncomeComparison: React.FC = () => {
  const [incomeData, setIncomeData] = useState<IncomeData[]>(defaultCategories);
  const [results, setResults] = useState<{ partTimeTotal: number; fullTimeTotal: number }>({ partTimeTotal: 0, fullTimeTotal: 0 });

  const handleInputChange = (index: number, field: keyof IncomeData, value: number) => {
    const updatedData = [...incomeData];
    updatedData[index][field] = value;
    setIncomeData(updatedData);
  };

  const calculateResults = () => {
    const partTimeTotal = incomeData.reduce((sum, item) => sum + item.partTime, 0);
    const fullTimeTotal = incomeData.reduce((sum, item) => sum + item.fullTime, 0);
    setResults({ partTimeTotal, fullTimeTotal });
  };

  const exportCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,' + incomeData.map(e => `${e.category},${e.partTime},${e.fullTime}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'income_comparison.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-screen-md mx-auto px-4 py-8">
      <Head>
        <title>Part-Time vs Full-Time Income Comparison</title>
        <meta name="description" content="Compare your part-time and full-time income to make informed financial decisions." />
        <meta name="keywords" content="income comparison, part-time, full-time, finance tool" />
        <link rel="canonical" href="https://www.expensegoose.com/tools/part-time-vs-full-time-income-comparison" />
      </Head>
      <h1 className="text-3xl font-bold text-center mb-6">Part-Time vs Full-Time Income Comparison</h1>
      <p className="text-base text-gray-700 mb-4">
        Welcome to the Part-Time vs Full-Time Income Comparison tool. This tool helps you compare your income from part-time and full-time jobs, allowing you to make informed financial decisions. Simply enter your income details below and see the results.
      </p>
      <div>
        {incomeData.map((item, index) => (
          <div key={index} className="mb-4">
            <h2 className="text-xl font-semibold mb-2">{item.category}</h2>
            <div className="flex space-x-4">
              <div>
                <label className="block text-gray-700">Part-Time</label>
                <input
                  type="number"
                  className="border rounded-lg px-3 py-2 w-full"
                  value={item.partTime}
                  onChange={(e) => handleInputChange(index, 'partTime', parseFloat(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-gray-700">Full-Time</label>
                <input
                  type="number"
                  className="border rounded-lg px-3 py-2 w-full"
                  value={item.fullTime}
                  onChange={(e) => handleInputChange(index, 'fullTime', parseFloat(e.target.value))}
                />
              </div>
            </div>
          </div>
        ))}
        <button
          onClick={calculateResults}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
        >
          Calculate
        </button>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Results</h2>
        <p className="text-base text-gray-700 mb-4">Part-Time Total: ${results.partTimeTotal}</p>
        <p className="text-base text-gray-700 mb-4">Full-Time Total: ${results.fullTimeTotal}</p>
        <BarChart width={500} height={300} data={incomeData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="partTime" fill="#8884d8" />
          <Bar dataKey="fullTime" fill="#82ca9d" />
        </BarChart>
      </div>
      <button
        onClick={exportCSV}
        className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 flex items-center"
      >
        <Download className="mr-2" /> Export as CSV
      </button>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Tips</h2>
        <ul className="list-disc list-inside mb-4 text-base">
          <li>Consider all sources of income when comparing part-time and full-time work.</li>
          <li>Think about non-monetary benefits of full-time work, such as health insurance and retirement plans.</li>
          <li>Use this tool regularly to track changes in your income over time.</li>
        </ul>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
        <FAQ />
      </div>
    </div>
  );
};

const FAQ: React.FC = () => (
  <div>
    <h3 className="text-xl font-semibold mb-4">What is this tool for?</h3>
    <p className="text-base text-gray-700 mb-4">
      This tool helps you compare your income from part-time and full-time jobs to make informed financial decisions.
    </p>
    <h3 className="text-xl font-semibold mb-4">How do I use this tool?</h3>
    <p className="text-base text-gray-700 mb-4">
      Enter your income details for both part-time and full-time jobs, then click "Calculate" to see the comparison.
    </p>
    <h3 className="text-xl font-semibold mb-4">Can I export the results?</h3>
    <p className="text-base text-gray-700 mb-4">
      Yes, you can export the results as a CSV file by clicking the "Export as CSV" button.
    </p>
  </div>
);

export default PartTimeVsFullTimeIncomeComparison;


This code provides a comprehensive and user-friendly tool for comparing part-time and full-time income. It includes a form for input, a calculation function, a results display with a bar chart, and options to export data. The page is styled using Tailwind CSS and is designed to be responsive and accessible.