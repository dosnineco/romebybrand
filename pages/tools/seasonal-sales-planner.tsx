
// /pages/tools/seasonal-sales-planner.tsx

import React, { useState } from 'react';
import Head from 'next/head';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';

interface Category {
  name: string;
  sales: number;
}

interface SeasonalSalesPlannerProps {}

const defaultCategories: Category[] = [
  { name: 'Winter', sales: 0 },
  { name: 'Spring', sales: 0 },
  { name: 'Summer', sales: 0 },
  { name: 'Fall', sales: 0 },
];

const SeasonalSalesPlanner: React.FC<SeasonalSalesPlannerProps> = () => {
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [results, setResults] = useState<Category[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  const handleInputChange = (index: number, value: number) => {
    const updatedCategories = [...categories];
    updatedCategories[index].sales = value;
    setCategories(updatedCategories);
  };

  const calculateResults = () => {
    const calculatedResults = categories.map(category => ({
      ...category,
      sales: category.sales * 1.1, // Example calculation
    }));
    setResults(calculatedResults);
    setChartData(calculatedResults);
  };

  const exportCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,'
      + results.map(r => `${r.name},${r.sales}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'seasonal_sales.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-screen-md mx-auto px-4 py-8">
      <Head>
        <title>Seasonal Sales Planner</title>
        <meta name="description" content="Plan your seasonal sales effectively with our free tool." />
        <meta name="keywords" content="seasonal sales, sales planner, finance tool" />
        <link rel="canonical" href="https://www.expensegoose.com/tools/seasonal-sales-planner" />
      </Head>
      <h1 className="text-3xl font-bold text-center mb-6">Seasonal Sales Planner</h1>
      <p className="text-base text-gray-700 mb-4">
        Welcome to the Seasonal Sales Planner! This tool helps you plan and optimize your sales strategy across different seasons. Enter your expected sales for each season, and we'll provide insights and tips to maximize your revenue.
      </p>
      <div>
        {categories.map((category, index) => (
          <div key={index} className="mb-4">
            <label className="block text-xl font-semibold mb-2">{category.name} Sales</label>
            <input
              type="number"
              value={category.sales}
              onChange={(e) => handleInputChange(index, parseFloat(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded"
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
      {results.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Results</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#8884d8" />
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
        <h2 className="text-2xl font-semibold mb-4">Tips for Maximizing Sales</h2>
        <ul className="list-disc list-inside mb-4 text-base">
          <li>Analyze past sales data to identify trends.</li>
          <li>Adjust your marketing strategies according to seasonal demands.</li>
          <li>Consider offering seasonal promotions or discounts.</li>
          <li>Ensure your inventory is well-stocked for peak seasons.</li>
        </ul>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
        <ul className="list-disc list-inside mb-4 text-base">
          <li>How do I use the Seasonal Sales Planner?</li>
          <li>What data do I need to input?</li>
          <li>How accurate are the results?</li>
          <li>Can I export my data?</li>
        </ul>
      </div>
    </div>
  );
};

export default SeasonalSalesPlanner;


This code provides a structured and modular approach to building the Seasonal Sales Planner tool using Next.js and React. It includes a form for user input, a results section with a chart, and additional sections for tips and FAQs. The use of TailwindCSS ensures a modern and responsive design.