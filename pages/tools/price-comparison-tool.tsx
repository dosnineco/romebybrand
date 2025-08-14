
// /pages/tools/price-comparison-tool.tsx

import React, { useState } from 'react';
import Head from 'next/head';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';
import { saveAs } from 'file-saver';
import { NextPage } from 'next';
import { SoftwareApplication } from 'schema-dts';
import { JsonLd } from 'react-schemaorg';
import { FAQSection, TipsSection } from '../../components';

const defaultCategories = ['Groceries', 'Electronics', 'Clothing'];

type UserInput = {
  category: string;
  price: number;
};

const PriceComparisonTool: NextPage = () => {
  const [inputs, setInputs] = useState<UserInput[]>([]);
  const [results, setResults] = useState<number[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  const handleAddInput = () => {
    setInputs([...inputs, { category: '', price: 0 }]);
  };

  const handleInputChange = (index: number, field: keyof UserInput, value: string | number) => {
    const newInputs = [...inputs];
    newInputs[index][field] = field === 'price' ? parseFloat(value as string) : value;
    setInputs(newInputs);
  };

  const calculateResults = () => {
    const calculatedResults = inputs.map(input => input.price * 1.1); // Example calculation
    setResults(calculatedResults);
    setChartData(inputs.map((input, index) => ({ name: input.category, price: input.price, result: calculatedResults[index] })));
  };

  const exportCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,' + inputs.map(input => `${input.category},${input.price}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    saveAs(encodedUri, 'price-comparison.csv');
  };

  return (
    <div className="max-w-screen-md mx-auto px-4 py-8">
      <Head>
        <title>Price Comparison Tool</title>
        <meta name="description" content="Compare prices across different categories with our Price Comparison Tool." />
        <meta name="keywords" content="price comparison, finance tool, budgeting" />
        <link rel="canonical" href="https://www.expensegoose.com/tools/price-comparison-tool" />
      </Head>
      <JsonLd<SoftwareApplication>
        item={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'Price Comparison Tool',
          operatingSystem: 'All',
          applicationCategory: 'FinanceApplication',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
        }}
      />
      <h1 className="text-3xl font-bold text-center mb-6">Price Comparison Tool</h1>
      <p className="text-base text-gray-700 mb-4">
        Welcome to the Price Comparison Tool! Here, you can compare prices across different categories to make informed financial decisions.
      </p>
      <div className="mb-4">
        {inputs.map((input, index) => (
          <div key={index} className="flex mb-2">
            <input
              type="text"
              value={input.category}
              onChange={(e) => handleInputChange(index, 'category', e.target.value)}
              placeholder="Category"
              className="flex-1 px-3 py-2 border rounded mr-2"
            />
            <input
              type="number"
              value={input.price}
              onChange={(e) => handleInputChange(index, 'price', e.target.value)}
              placeholder="Price"
              className="flex-1 px-3 py-2 border rounded mr-2"
            />
          </div>
        ))}
        <button onClick={handleAddInput} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300">
          Add Category
        </button>
      </div>
      <button onClick={calculateResults} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 mb-4">
        Calculate
      </button>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="price" fill="#8884d8" />
          <Bar dataKey="result" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
      <button onClick={exportCSV} className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 mt-4">
        <Download className="mr-2" /> Export CSV
      </button>
      <TipsSection />
      <FAQSection />
    </div>
  );
};

export default PriceComparisonTool;

// components/FAQSection.tsx
export const FAQSection: React.FC = () => (
  <div className="mt-8">
    <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
    <ul className="list-disc list-inside mb-4 text-base">
      <li>How does the Price Comparison Tool work?</li>
      <li>Can I export my results?</li>
      <li>Is this tool free to use?</li>
    </ul>
  </div>
);

// components/TipsSection.tsx
export const TipsSection: React.FC = () => (
  <div className="mt-8">
    <h2 className="text-2xl font-semibold mb-4">Tips for Using the Tool</h2>
    <ul className="list-disc list-inside mb-4 text-base">
      <li>Ensure accurate data entry for precise results.</li>
      <li>Use the export feature to save your comparisons.</li>
      <li>Regularly update your categories for better insights.</li>
    </ul>
  </div>
);


This refactored code organizes the Price Comparison Tool into a modular and maintainable structure, using functional components and hooks. It includes a responsive design with Tailwind CSS, accessible forms, and a chart for visual comparison. The FAQ and Tips sections are modularized for easy updates and scalability.