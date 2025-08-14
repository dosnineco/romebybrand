
// /pages/tools/unpaid-work-value-estimator.tsx

import React, { useState } from 'react';
import Head from 'next/head';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';
import { saveAs } from 'file-saver';
import { NextPage } from 'next';
import { SoftwareApplication } from 'schema-dts';
import { JsonLd } from 'react-schemaorg';
import { v4 as uuidv4 } from 'uuid';

// Constants
const DEFAULT_CATEGORIES = [
  { id: uuidv4(), name: 'Childcare', hours: 0 },
  { id: uuidv4(), name: 'Housework', hours: 0 },
  { id: uuidv4(), name: 'Elderly Care', hours: 0 },
];

// Types
interface Category {
  id: string;
  name: string;
  hours: number;
}

interface ChartData {
  name: string;
  value: number;
}

// Main Component
const UnpaidWorkValueEstimator: NextPage = () => {
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [hourlyRate, setHourlyRate] = useState<number>(15);
  const [results, setResults] = useState<number[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  // Handlers
  const handleCategoryChange = (id: string, hours: number) => {
    setCategories(categories.map(cat => cat.id === id ? { ...cat, hours } : cat));
  };

  const handleCalculate = () => {
    const newResults = categories.map(cat => cat.hours * hourlyRate);
    setResults(newResults);
    setChartData(categories.map((cat, index) => ({ name: cat.name, value: newResults[index] })));
  };

  const handleExportCSV = () => {
    const csvContent = `data:text/csv;charset=utf-8,Category,Hours,Value\n` +
      categories.map((cat, index) => `${cat.name},${cat.hours},${results[index]}`).join('\n');
    saveAs(new Blob([csvContent], { type: 'text/csv;charset=utf-8;' }), 'unpaid_work_value.csv');
  };

  // UI Rendering
  return (
    <div className="max-w-screen-md mx-auto px-4 py-8">
      <Head>
        <title>Unpaid Work Value Estimator</title>
        <meta name="description" content="Estimate the value of your unpaid work with our easy-to-use tool." />
        <meta name="keywords" content="unpaid work, value estimator, personal finance" />
        <link rel="canonical" href="https://www.expensegoose.com/tools/unpaid-work-value-estimator" />
      </Head>
      <JsonLd<SoftwareApplication>
        item={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'Unpaid Work Value Estimator',
          description: 'A tool to estimate the value of unpaid work.',
          applicationCategory: 'FinanceApplication',
          operatingSystem: 'All',
        }}
      />
      <h1 className="text-3xl font-bold text-center mb-6">Unpaid Work Value Estimator</h1>
      <p className="text-base text-gray-700 mb-4">
        Have you ever wondered how much your unpaid work is worth? Whether it's childcare, housework, or caring for elderly family members, this tool helps you estimate the monetary value of your efforts.
      </p>
      <div className="mb-8">
        {categories.map(category => (
          <div key={category.id} className="mb-4">
            <label className="block text-xl font-semibold mb-2">{category.name}</label>
            <input
              type="number"
              value={category.hours}
              onChange={(e) => handleCategoryChange(category.id, parseInt(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded"
              aria-label={`Hours spent on ${category.name}`}
            />
          </div>
        ))}
        <div className="mb-4">
          <label className="block text-xl font-semibold mb-2">Hourly Rate ($)</label>
          <input
            type="number"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(parseInt(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded"
            aria-label="Hourly rate"
          />
        </div>
        <button
          onClick={handleCalculate}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Calculate
        </button>
      </div>
      {results.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Results</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
          <button
            onClick={handleExportCSV}
            className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center"
          >
            <Download className="mr-2" /> Export CSV
          </button>
        </div>
      )}
      <Tips />
      <FAQ />
    </div>
  );
};

// Tips Component
const Tips: React.FC = () => (
  <div className="mb-8">
    <h2 className="text-2xl font-semibold mb-4">Tips for Maximizing Your Unpaid Work Value</h2>
    <ul className="list-disc list-inside mb-4 text-base">
      <li>Track your time diligently to get accurate estimates.</li>
      <li>Consider the market rate for similar paid work in your area.</li>
      <li>Use this estimate to negotiate better work-life balance or support.</li>
    </ul>
  </div>
);

// FAQ Component
const FAQ: React.FC = () => (
  <div className="mb-8">
    <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
    <ul className="list-disc list-inside mb-4 text-base">
      <li>
        <strong>How is the value calculated?</strong>
        <p className="text-base text-gray-700 mb-4">The value is calculated by multiplying the hours spent on each category by the hourly rate you provide.</p>
      </li>
      <li>
        <strong>Can I add more categories?</strong>
        <p className="text-base text-gray-700 mb-4">Currently, the tool supports a fixed set of categories, but we plan to add customization options in the future.</p>
      </li>
      <li>
        <strong>Is my data saved?</strong>
        <p className="text-base text-gray-700 mb-4">No, all calculations are done locally in your browser, and no data is saved or sent to a server.</p>
      </li>
    </ul>
  </div>
);

export default UnpaidWorkValueEstimator;


This refactored code provides a clean, modular, and accessible implementation of the "Unpaid Work Value Estimator" tool using Next.js and TailwindCSS. It includes a responsive design, a bar chart for visualizing results, and features like CSV export, tips, and FAQs to enhance user engagement.