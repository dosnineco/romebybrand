
// /pages/tools/home-renovation-roi-calculator.tsx

import React, { useState } from 'react';
import Head from 'next/head';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Download } from 'lucide-react';
import { NextPage } from 'next';
import { saveAs } from 'file-saver';

// Constants
const DEFAULT_CATEGORIES = [
  { name: 'Kitchen', cost: 20000, roi: 0.8 },
  { name: 'Bathroom', cost: 15000, roi: 0.7 },
  { name: 'Living Room', cost: 10000, roi: 0.6 },
];

// Types
interface Category {
  name: string;
  cost: number;
  roi: number;
}

interface ChartData {
  name: string;
  Cost: number;
  ROI: number;
}

// Page Component
const HomeRenovationROICalculator: NextPage = () => {
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [totalROI, setTotalROI] = useState<number>(0);

  // Handlers
  const handleInputChange = (index: number, field: keyof Category, value: string) => {
    const updatedCategories = [...categories];
    updatedCategories[index][field] = parseFloat(value) || 0;
    setCategories(updatedCategories);
    calculateResults(updatedCategories);
  };

  const calculateResults = (categories: Category[]) => {
    const totalCost = categories.reduce((sum, category) => sum + category.cost, 0);
    const totalROI = categories.reduce((sum, category) => sum + category.cost * category.roi, 0);
    setTotalCost(totalCost);
    setTotalROI(totalROI);
    prepareChartData(categories);
  };

  const prepareChartData = (categories: Category[]) => {
    const data = categories.map(category => ({
      name: category.name,
      Cost: category.cost,
      ROI: category.cost * category.roi,
    }));
    setChartData(data);
  };

  const exportCSV = () => {
    const csvContent = `data:text/csv;charset=utf-8,Category,Cost,ROI\n${categories
      .map(category => `${category.name},${category.cost},${category.cost * category.roi}`)
      .join('\n')}`;
    const encodedUri = encodeURI(csvContent);
    saveAs(encodedUri, 'home-renovation-roi.csv');
  };

  return (
    <div className="max-w-screen-md mx-auto px-4 py-8">
      <Head>
        <title>Home Renovation ROI Calculator</title>
        <meta name="description" content="Calculate the return on investment for your home renovation projects." />
        <meta name="keywords" content="home renovation, ROI calculator, investment, remodeling" />
        <link rel="canonical" href="https://www.expensegoose.com/tools/home-renovation-roi-calculator" />
      </Head>

      <h1 className="text-3xl font-bold text-center mb-6">Home Renovation ROI Calculator</h1>
      <p className="text-base text-gray-700 mb-4">
        Welcome to the Home Renovation ROI Calculator! This tool helps you estimate the return on investment (ROI) for your home renovation projects. Simply enter the cost and expected ROI for each category, and we'll do the rest.
      </p>

      <div>
        {categories.map((category, index) => (
          <div key={index} className="mb-4">
            <h2 className="text-xl font-semibold mb-2">{category.name}</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-gray-700 mb-1">Cost ($)</label>
                <input
                  type="number"
                  value={category.cost}
                  onChange={(e) => handleInputChange(index, 'cost', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="flex-1">
                <label className="block text-gray-700 mb-1">ROI (%)</label>
                <input
                  type="number"
                  value={category.roi * 100}
                  onChange={(e) => handleInputChange(index, 'roi', (parseFloat(e.target.value) / 100).toString())}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="my-8">
        <h2 className="text-2xl font-semibold mb-4">Results</h2>
        <p className="text-base text-gray-700 mb-4">Total Cost: ${totalCost.toFixed(2)}</p>
        <p className="text-base text-gray-700 mb-4">Total ROI: ${totalROI.toFixed(2)}</p>
        <BarChart width={600} height={300} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Cost" fill="#8884d8" />
          <Bar dataKey="ROI" fill="#82ca9d" />
        </BarChart>
      </div>

      <button
        onClick={exportCSV}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <Download className="inline-block mr-2" /> Export as CSV
      </button>

      <div className="my-8">
        <h2 className="text-2xl font-semibold mb-4">Tips for Maximizing ROI</h2>
        <ul className="list-disc list-inside mb-4 text-base">
          <li>Focus on high-impact areas like kitchens and bathrooms.</li>
          <li>Consider energy-efficient upgrades for long-term savings.</li>
          <li>Keep your renovations in line with neighborhood standards.</li>
        </ul>
      </div>

      <div className="my-8">
        <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">What is ROI?</h3>
          <p className="text-base text-gray-700 mb-4">
            ROI, or Return on Investment, is a measure used to evaluate the efficiency of an investment. It is calculated by dividing the net profit by the initial cost of the investment.
          </p>
        </div>
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">How accurate are these estimates?</h3>
          <p className="text-base text-gray-700 mb-4">
            The estimates provided by this tool are based on average ROI percentages for common renovation projects. Actual results may vary based on a variety of factors.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomeRenovationROICalculator;


This code provides a complete Next.js page component for a "Home Renovation ROI Calculator" tool. It includes a form for inputting renovation costs and expected ROI, calculates the total cost and ROI, displays the results in a bar chart, and offers tips and FAQs. The page is styled using Tailwind CSS and includes SEO tags and a CSV export feature.