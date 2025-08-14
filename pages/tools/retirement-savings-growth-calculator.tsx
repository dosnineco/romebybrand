
// /pages/tools/retirement-savings-growth-calculator.tsx

import React, { useState } from 'react';
import Head from 'next/head';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';

interface UserInput {
  initialSavings: number;
  monthlyContribution: number;
  annualInterestRate: number;
  years: number;
}

interface ChartData {
  year: number;
  savings: number;
}

const RetirementSavingsGrowthCalculator: React.FC = () => {
  const [userInput, setUserInput] = useState<UserInput>({
    initialSavings: 0,
    monthlyContribution: 0,
    annualInterestRate: 0,
    years: 0,
  });

  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [result, setResult] = useState<number>(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInput({ ...userInput, [name]: parseFloat(value) });
  };

  const calculateSavings = () => {
    const { initialSavings, monthlyContribution, annualInterestRate, years } = userInput;
    let savings = initialSavings;
    const data: ChartData[] = [];

    for (let year = 1; year <= years; year++) {
      savings += monthlyContribution * 12;
      savings += savings * (annualInterestRate / 100);
      data.push({ year, savings });
    }

    setChartData(data);
    setResult(savings);
  };

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + chartData.map(d => `${d.year},${d.savings}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "retirement_savings.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-screen-md mx-auto px-4 py-8">
      <Head>
        <title>Retirement Savings Growth Calculator</title>
        <meta name="description" content="Calculate your retirement savings growth over time." />
        <meta name="keywords" content="retirement, savings, calculator, finance" />
        <link rel="canonical" href="https://www.expensegoose.com/tools/retirement-savings-growth-calculator" />
      </Head>

      <h1 className="text-3xl font-bold text-center mb-6">Retirement Savings Growth Calculator</h1>
      <p className="text-base text-gray-700 mb-4">
        Welcome to the Retirement Savings Growth Calculator. Here, you can estimate how your savings will grow over time with regular contributions and interest.
      </p>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Enter Your Details</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-base font-semibold mb-2" htmlFor="initialSavings">Initial Savings ($)</label>
            <input
              type="number"
              id="initialSavings"
              name="initialSavings"
              value={userInput.initialSavings}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-base font-semibold mb-2" htmlFor="monthlyContribution">Monthly Contribution ($)</label>
            <input
              type="number"
              id="monthlyContribution"
              name="monthlyContribution"
              value={userInput.monthlyContribution}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-base font-semibold mb-2" htmlFor="annualInterestRate">Annual Interest Rate (%)</label>
            <input
              type="number"
              id="annualInterestRate"
              name="annualInterestRate"
              value={userInput.annualInterestRate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-base font-semibold mb-2" htmlFor="years">Years</label>
            <input
              type="number"
              id="years"
              name="years"
              value={userInput.years}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <button
            type="button"
            onClick={calculateSavings}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
          >
            Calculate
          </button>
        </form>
      </div>

      {chartData.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Results</h2>
          <p className="text-base text-gray-700 mb-4">Your estimated savings after {userInput.years} years is <strong>${result.toFixed(2)}</strong>.</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="savings" fill="#8884d8" />
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

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Tips for Maximizing Your Savings</h2>
        <ul className="list-disc list-inside mb-4 text-base">
          <li>Start saving early to take advantage of compound interest.</li>
          <li>Increase your monthly contributions whenever possible.</li>
          <li>Review your investment strategy regularly to ensure it aligns with your goals.</li>
        </ul>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
        <ul className="list-disc list-inside mb-4 text-base">
          <li><strong>How accurate is this calculator?</strong> This tool provides estimates based on the inputs you provide. Actual results may vary.</li>
          <li><strong>Can I use this calculator for other types of savings?</strong> Yes, you can use it for any savings plan with regular contributions and interest.</li>
          <li><strong>How often should I update my inputs?</strong> It's a good idea to update your inputs whenever your financial situation changes.</li>
        </ul>
      </div>
    </div>
  );
};

export default RetirementSavingsGrowthCalculator;


This code provides a comprehensive and user-friendly retirement savings growth calculator. It includes a form for user inputs, a calculation function, a chart to visualize the growth, and options to export the results. The page is styled using Tailwind CSS for a modern and responsive design.