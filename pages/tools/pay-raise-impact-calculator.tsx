
// /pages/tools/pay-raise-impact-calculator.tsx

import React, { useState } from 'react';
import Head from 'next/head';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';

interface UserInput {
  currentSalary: number;
  raisePercentage: number;
}

interface ChartData {
  name: string;
  value: number;
}

const PayRaiseImpactCalculator: React.FC = () => {
  const [userInput, setUserInput] = useState<UserInput>({ currentSalary: 0, raisePercentage: 0 });
  const [result, setResult] = useState<number | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInput({ ...userInput, [name]: parseFloat(value) });
  };

  const calculateRaiseImpact = () => {
    const newSalary = userInput.currentSalary + (userInput.currentSalary * userInput.raisePercentage) / 100;
    setResult(newSalary);
    setChartData([
      { name: 'Current Salary', value: userInput.currentSalary },
      { name: 'New Salary', value: newSalary },
    ]);
  };

  const exportCSV = () => {
    const csvContent = `data:text/csv;charset=utf-8,Current Salary,New Salary\n${userInput.currentSalary},${result}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'pay_raise_impact.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-screen-md mx-auto px-4 py-8">
      <Head>
        <title>Pay Raise Impact Calculator</title>
        <meta name="description" content="Calculate the impact of your pay raise on your salary." />
        <meta name="keywords" content="pay raise, salary calculator, finance tool" />
        <link rel="canonical" href="https://www.expensegoose.com/tools/pay-raise-impact-calculator" />
      </Head>
      <h1 className="text-3xl font-bold text-center mb-6">Pay Raise Impact Calculator</h1>
      <p className="text-base text-gray-700 mb-4">
        Discover how a pay raise can impact your salary. Enter your current salary and the percentage increase to see the results.
      </p>
      <div className="mb-8">
        <label className="block text-base font-semibold mb-2" htmlFor="currentSalary">
          Current Salary
        </label>
        <input
          type="number"
          id="currentSalary"
          name="currentSalary"
          value={userInput.currentSalary}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <label className="block text-base font-semibold mb-2" htmlFor="raisePercentage">
          Raise Percentage
        </label>
        <input
          type="number"
          id="raisePercentage"
          name="raisePercentage"
          value={userInput.raisePercentage}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <button
          onClick={calculateRaiseImpact}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
        >
          Calculate
        </button>
      </div>
      {result !== null && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Results</h2>
          <p className="text-base text-gray-700 mb-4">Your new salary will be: ${result.toFixed(2)}</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
          <button
            onClick={exportCSV}
            className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 flex items-center"
          >
            <Download className="mr-2" /> Export as CSV
          </button>
        </div>
      )}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Tips for Maximizing Your Raise</h2>
        <ul className="list-disc list-inside mb-4 text-base">
          <li>Negotiate for additional benefits alongside your salary increase.</li>
          <li>Consider investing the extra income to grow your wealth.</li>
          <li>Review your budget to accommodate your new salary.</li>
        </ul>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
        <ul className="list-disc list-inside mb-4 text-base">
          <li>How do I calculate my raise percentage?</li>
          <li>What should I do with my increased salary?</li>
          <li>How often should I expect a raise?</li>
        </ul>
      </div>
    </div>
  );
};

export default PayRaiseImpactCalculator;


This code provides a structured and modular Next.js page component for the "Pay Raise Impact Calculator" tool. It includes a form for user input, calculation logic, a chart for visualizing results, and sections for tips and FAQs. The design is responsive and accessible, using Tailwind CSS for styling.