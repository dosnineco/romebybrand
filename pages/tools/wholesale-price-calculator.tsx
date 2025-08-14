
// /pages/tools/wholesale-price-calculator.tsx

import React, { useState } from 'react';
import Head from 'next/head';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';
import { saveAs } from 'file-saver';
import { WholesalePriceCalculatorForm, FAQSection, TipsSection } from '../../components';

type Category = {
  name: string;
  cost: number;
  markup: number;
};

type ChartData = {
  name: string;
  cost: number;
  price: number;
};

const defaultCategories: Category[] = [
  { name: 'Electronics', cost: 100, markup: 20 },
  { name: 'Clothing', cost: 50, markup: 30 },
];

const WholesalePriceCalculator: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  const calculateResults = () => {
    const results = categories.map((category) => ({
      name: category.name,
      cost: category.cost,
      price: category.cost + (category.cost * category.markup) / 100,
    }));
    setChartData(results);
  };

  const exportCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,'
      + 'Category,Cost,Price\n'
      + chartData.map(d => `${d.name},${d.cost},${d.price}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    saveAs(encodedUri, 'wholesale_price_calculator_results.csv');
  };

  return (
    <div className="max-w-screen-md mx-auto px-4 py-8">
      <Head>
        <title>Wholesale Price Calculator</title>
        <meta name="description" content="Calculate wholesale prices with ease using our free tool." />
        <meta name="keywords" content="wholesale, price calculator, finance tool" />
        <link rel="canonical" href="https://www.expensegoose.com/tools/wholesale-price-calculator" />
      </Head>
      <h1 className="text-3xl font-bold text-center mb-6">Wholesale Price Calculator</h1>
      <p className="text-base text-gray-700 mb-4">
        Welcome to the Wholesale Price Calculator. This tool helps you determine the selling price of your products based on cost and markup percentage. Simply enter your product details below to get started.
      </p>
      <WholesalePriceCalculatorForm categories={categories} setCategories={setCategories} calculateResults={calculateResults} />
      <div className="my-8">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="cost" fill="#8884d8" />
            <Bar dataKey="price" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <button onClick={exportCSV} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300">
        <Download className="inline-block mr-2" /> Export as CSV
      </button>
      <TipsSection />
      <FAQSection />
    </div>
  );
};

export default WholesalePriceCalculator;

// components/WholesalePriceCalculatorForm.tsx

import React from 'react';

type Props = {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  calculateResults: () => void;
};

const WholesalePriceCalculatorForm: React.FC<Props> = ({ categories, setCategories, calculateResults }) => {
  const handleInputChange = (index: number, field: keyof Category, value: string) => {
    const updatedCategories = [...categories];
    updatedCategories[index][field] = field === 'name' ? value : parseFloat(value);
    setCategories(updatedCategories);
  };

  const addCategory = () => {
    setCategories([...categories, { name: '', cost: 0, markup: 0 }]);
  };

  return (
    <div>
      {categories.map((category, index) => (
        <div key={index} className="mb-4">
          <input
            type="text"
            value={category.name}
            onChange={(e) => handleInputChange(index, 'name', e.target.value)}
            placeholder="Category Name"
            className="border p-2 mb-2 w-full"
          />
          <input
            type="number"
            value={category.cost}
            onChange={(e) => handleInputChange(index, 'cost', e.target.value)}
            placeholder="Cost"
            className="border p-2 mb-2 w-full"
          />
          <input
            type="number"
            value={category.markup}
            onChange={(e) => handleInputChange(index, 'markup', e.target.value)}
            placeholder="Markup (%)"
            className="border p-2 mb-2 w-full"
          />
        </div>
      ))}
      <button onClick={addCategory} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 mb-4">
        Add Category
      </button>
      <button onClick={calculateResults} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300">
        Calculate
      </button>
    </div>
  );
};

export default WholesalePriceCalculatorForm;

// components/FAQSection.tsx

import React from 'react';

const FAQSection: React.FC = () => (
  <div className="mt-8">
    <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
    <ul className="list-disc list-inside mb-4 text-base">
      <li>How do I use the Wholesale Price Calculator?</li>
      <li>What is a markup percentage?</li>
      <li>Can I export my results?</li>
    </ul>
  </div>
);

export default FAQSection;

// components/TipsSection.tsx

import React from 'react';

const TipsSection: React.FC = () => (
  <div className="mt-8">
    <h2 className="text-2xl font-semibold mb-4">Tips for Using the Calculator</h2>
    <ul className="list-disc list-inside mb-4 text-base">
      <li>Ensure your cost inputs are accurate for precise results.</li>
      <li>Experiment with different markup percentages to find optimal pricing.</li>
      <li>Use the export feature to save your calculations for future reference.</li>
    </ul>
  </div>
);

export default TipsSection;


