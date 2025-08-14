
// /pages/tools/social-security-benefit-estimator.tsx

import React, { useState } from 'react';
import Head from 'next/head';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Download } from 'lucide-react';
import { NextPage } from 'next';
import { saveAs } from 'file-saver';

// Constants
const DEFAULT_CATEGORIES = ['Retirement Age', 'Current Earnings', 'Expected Earnings Growth'];

// Types
interface UserInput {
  retirementAge: number;
  currentEarnings: number;
  expectedGrowth: number;
}

interface ChartData {
  name: string;
  value: number;
}

// Main Component
const SocialSecurityBenefitEstimator: NextPage = () => {
  // State
  const [userInput, setUserInput] = useState<UserInput>({
    retirementAge: 67,
    currentEarnings: 50000,
    expectedGrowth: 3,
  });
  const [results, setResults] = useState<number>(0);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInput((prev) => ({ ...prev, [name]: Number(value) }));
  };

  const calculateBenefits = () => {
    const { retirementAge, currentEarnings, expectedGrowth } = userInput;
    const estimatedBenefit = (currentEarnings * (1 + expectedGrowth / 100) ** (retirementAge - 2023)) / 1000;
    setResults(estimatedBenefit);
    setChartData([
      { name: 'Current Earnings', value: currentEarnings },
      { name: 'Estimated Benefit', value: estimatedBenefit },
    ]);
  };

  const exportCSV = () => {
    const csvContent = `data:text/csv;charset=utf-8,Category,Value\nCurrent Earnings,${userInput.currentEarnings}\nEstimated Benefit,${results}`;
    const encodedUri = encodeURI(csvContent);
    saveAs(encodedUri, 'social-security-benefit-estimator.csv');
  };

  // UI
  return (
    <div className="max-w-screen-md mx-auto px-4 py-8">
      <Head>
        <title>Social Security Benefit Estimator</title>
        <meta name="description" content="Estimate your social security benefits with our free tool." />
        <meta name="keywords" content="social security, benefits, estimator, finance tool" />
        <link rel="canonical" href="https://www.expensegoose.com/tools/social-security-benefit-estimator" />
      </Head>

      <h1 className="text-3xl font-bold text-center mb-6">Social Security Benefit Estimator</h1>
      <p className="text-base text-gray-700 mb-4">
        Welcome to the Social Security Benefit Estimator. This tool helps you estimate your future social security benefits based on your current earnings and expected growth.
      </p>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Input Your Details</h2>
        <form className="mb-8">
          <div className="mb-4">
            <label htmlFor="retirementAge" className="block text-base font-semibold mb-2">Retirement Age</label>
            <input
              type="number"
              id="retirementAge"
              name="retirementAge"
              value={userInput.retirementAge}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="currentEarnings" className="block text-base font-semibold mb-2">Current Earnings</label>
            <input
              type="number"
              id="currentEarnings"
              name="currentEarnings"
              value={userInput.currentEarnings}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="expectedGrowth" className="block text-base font-semibold mb-2">Expected Earnings Growth (%)</label>
            <input
              type="number"
              id="expectedGrowth"
              name="expectedGrowth"
              value={userInput.expectedGrowth}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <button
            type="button"
            onClick={calculateBenefits}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400"
          >
            Calculate
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Results</h2>
        <p className="text-base text-gray-700 mb-4">Estimated Benefit: ${results.toFixed(2)}k</p>
        <BarChart width={500} height={300} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
        <button
          onClick={exportCSV}
          className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 flex items-center"
        >
          <Download className="mr-2" /> Export as CSV
        </button>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Tips for Maximizing Benefits</h2>
        <ul className="list-disc list-inside mb-4 text-base">
          <li>Consider delaying retirement to increase your benefits.</li>
          <li>Keep track of your earnings record to ensure accuracy.</li>
          <li>Explore additional retirement savings options.</li>
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
      <li>How accurate is this estimator?</li>
      <li>Can I use this tool for planning my retirement?</li>
      <li>What factors can affect my social security benefits?</li>
    </ul>
  </div>
);

export default SocialSecurityBenefitEstimator;


This code provides a structured and modular Next.js page component for a "Social Security Benefit Estimator" tool. It includes user input handling, benefit calculation, chart visualization, CSV export functionality, and a FAQ section, all styled with Tailwind CSS for a modern and responsive design.