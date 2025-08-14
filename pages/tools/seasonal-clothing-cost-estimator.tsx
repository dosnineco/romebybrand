Certainly! Below is the refactored code for the "Seasonal Clothing Cost Estimator" tool as a Next.js page component. The code is organized into logical sections and uses Tailwind CSS for styling. I've modularized repeated UI elements and ensured accessibility and performance optimizations.


// /pages/tools/seasonal-clothing-cost-estimator.tsx

import React, { useState } from 'react';
import Head from 'next/head';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';

interface ClothingItem {
  name: string;
  cost: number;
}

interface UserInput {
  season: string;
  items: ClothingItem[];
}

const defaultCategories: ClothingItem[] = [
  { name: 'Jacket', cost: 0 },
  { name: 'Sweater', cost: 0 },
  { name: 'Boots', cost: 0 },
];

const SeasonalClothingCostEstimator: React.FC = () => {
  const [userInput, setUserInput] = useState<UserInput>({
    season: 'Winter',
    items: defaultCategories,
  });

  const [results, setResults] = useState<number>(0);
  const [chartData, setChartData] = useState<any[]>([]);

  const handleInputChange = (index: number, value: number) => {
    const newItems = [...userInput.items];
    newItems[index].cost = value;
    setUserInput({ ...userInput, items: newItems });
  };

  const calculateResults = () => {
    const totalCost = userInput.items.reduce((acc, item) => acc + item.cost, 0);
    setResults(totalCost);
    setChartData(userInput.items.map(item => ({ name: item.name, cost: item.cost })));
  };

  const exportCSV = () => {
    const csvContent = `data:text/csv;charset=utf-8,${userInput.items.map(item => `${item.name},${item.cost}`).join('\n')}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'seasonal_clothing_costs.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-screen-md mx-auto px-4 py-8">
      <Head>
        <title>Seasonal Clothing Cost Estimator</title>
        <meta name="description" content="Estimate your seasonal clothing costs with our free tool." />
        <meta name="keywords" content="clothing, cost estimator, personal finance, seasonal clothing" />
        <link rel="canonical" href="https://www.expensegoose.com/tools/seasonal-clothing-cost-estimator" />
      </Head>

      <h1 className="text-3xl font-bold text-center mb-6">Seasonal Clothing Cost Estimator</h1>
      <p className="text-base text-gray-700 mb-4">
        Welcome to the Seasonal Clothing Cost Estimator! This tool helps you estimate the cost of clothing for different seasons. Simply input your expected costs for each item, and we'll calculate the total for you.
      </p>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Enter Your Costs</h2>
        {userInput.items.map((item, index) => (
          <div key={index} className="mb-4">
            <label className="block text-base font-semibold mb-2">{item.name}</label>
            <input
              type="number"
              value={item.cost}
              onChange={(e) => handleInputChange(index, parseFloat(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg"
              aria-label={`Cost for ${item.name}`}
            />
          </div>
        ))}
        <button
          onClick={calculateResults}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
        >
          Calculate
        </button>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Results</h2>
        <p className="text-base text-gray-700 mb-4">Total Estimated Cost: ${results.toFixed(2)}</p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="cost" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
        <button
          onClick={exportCSV}
          className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 flex items-center"
        >
          <Download className="mr-2" /> Export CSV
        </button>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Tips</h2>
        <ul className="list-disc list-inside mb-4 text-base">
          <li>Consider buying off-season for discounts.</li>
          <li>Invest in quality over quantity for long-term savings.</li>
          <li>Check for sales and use coupons to reduce costs.</li>
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
        <FAQ />
      </div>
    </div>
  );
};

const FAQ: React.FC = () => (
  <div>
    <h3 className="text-xl font-semibold mb-4">FAQs</h3>
    <ul className="list-disc list-inside mb-4 text-base">
      <li>How accurate is this estimator? - The estimator provides a rough estimate based on your inputs.</li>
      <li>Can I add more items? - Currently, the tool supports a fixed set of items, but future updates may allow customization.</li>
      <li>Is my data saved? - No, all data is processed locally and not stored.</li>
    </ul>
  </div>
);

export default SeasonalClothingCostEstimator;


This code is structured to be easily maintainable and scalable, with clear separation of concerns and modular components. The use of Tailwind CSS ensures a modern and responsive design.