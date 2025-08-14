
// /pages/tools/interest-savings-from-extra-payments.tsx

import React, { useState } from 'react';
import Head from 'next/head';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';
import { saveAs } from 'file-saver';

// Constants
const DEFAULT_CATEGORIES = ['Mortgage', 'Car Loan', 'Student Loan'];

// Types
interface UserInput {
  category: string;
  principal: number;
  interestRate: number;
  extraPayment: number;
}

interface ChartData {
  name: string;
  savings: number;
}

// Main Component
const InterestSavingsFromExtraPayments: React.FC = () => {
  // State
  const [userInputs, setUserInputs] = useState<UserInput[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [results, setResults] = useState<number[]>([]);

  // Handlers
  const handleAddCategory = () => {
    setUserInputs([...userInputs, { category: '', principal: 0, interestRate: 0, extraPayment: 0 }]);
  };

  const handleInputChange = (index: number, field: keyof UserInput, value: string | number) => {
    const updatedInputs = [...userInputs];
    updatedInputs[index][field] = typeof value === 'string' ? parseFloat(value) : value;
    setUserInputs(updatedInputs);
  };

  const calculateSavings = () => {
    const newResults = userInputs.map(input => {
      const { principal, interestRate, extraPayment } = input;
      const monthlyRate = interestRate / 100 / 12;
      const savings = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -360)) - extraPayment;
      return savings;
    });
    setResults(newResults);

    const newChartData = userInputs.map((input, index) => ({
      name: input.category || `Category ${index + 1}`,
      savings: newResults[index],
    }));
    setChartData(newChartData);
  };

  const exportCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,Category,Savings\n' +
      chartData.map(d => `${d.name},${d.savings}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    saveAs(encodedUri, 'interest_savings.csv');
  };

  // UI
  return (
    <div className="max-w-screen-md mx-auto px-4 py-8">
      <Head>
        <title>Interest Savings from Extra Payments</title>
        <meta name="description" content="Calculate your interest savings from making extra payments on your loans." />
        <meta name="keywords" content="interest savings, extra payments, personal finance, loan calculator" />
        <link rel="canonical" href="https://www.expensegoose.com/tools/interest-savings-from-extra-payments" />
      </Head>

      <h1 className="text-3xl font-bold text-center mb-6">Interest Savings from Extra Payments</h1>
      <p className="text-base text-gray-700 mb-4">
        Discover how much you can save on interest by making extra payments on your loans. Use this tool to input your loan details and see the potential savings.
      </p>

      <div className="mb-8">
        {userInputs.map((input, index) => (
          <div key={index} className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Loan {index + 1}</h2>
            <div className="flex flex-col space-y-2">
              <label className="text-base">
                Category:
                <input
                  type="text"
                  value={input.category}
                  onChange={(e) => handleInputChange(index, 'category', e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                />
              </label>
              <label className="text-base">
                Principal:
                <input
                  type="number"
                  value={input.principal}
                  onChange={(e) => handleInputChange(index, 'principal', e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                />
              </label>
              <label className="text-base">
                Interest Rate (%):
                <input
                  type="number"
                  value={input.interestRate}
                  onChange={(e) => handleInputChange(index, 'interestRate', e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                />
              </label>
              <label className="text-base">
                Extra Payment:
                <input
                  type="number"
                  value={input.extraPayment}
                  onChange={(e) => handleInputChange(index, 'extraPayment', e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                />
              </label>
            </div>
          </div>
        ))}
        <button onClick={handleAddCategory} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300">
          Add Loan
        </button>
      </div>

      <button onClick={calculateSavings} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 mb-8">
        Calculate Savings
      </button>

      {results.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Results</h2>
          <ul className="list-disc list-inside mb-4 text-base">
            {results.map((result, index) => (
              <li key={index}>{userInputs[index].category || `Category ${index + 1}`}: ${result.toFixed(2)} saved</li>
            ))}
          </ul>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="savings" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>

          <button onClick={exportCSV} className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 flex items-center">
            <Download className="mr-2" /> Export CSV
          </button>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Tips for Maximizing Savings</h2>
        <ul className="list-disc list-inside mb-4 text-base">
          <li>Make consistent extra payments to reduce the principal faster.</li>
          <li>Consider bi-weekly payments to effectively make an extra payment each year.</li>
          <li>Refinance to a lower interest rate if possible to save more on interest.</li>
        </ul>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
        <ul className="list-disc list-inside mb-4 text-base">
          <li>How does making extra payments save on interest?</li>
          <li>Can I use this tool for any type of loan?</li>
          <li>What if my interest rate changes?</li>
        </ul>
      </div>
    </div>
  );
};

export default InterestSavingsFromExtraPayments;


This refactored code organizes the component into logical sections, uses Tailwind CSS for styling, and includes a responsive design with a bar chart for visualizing savings. It also provides a CSV export feature and includes a tips section and FAQs for user engagement.