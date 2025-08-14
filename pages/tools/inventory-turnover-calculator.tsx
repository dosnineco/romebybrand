
// /pages/tools/inventory-turnover-calculator.tsx

import React, { useState } from 'react';
import Head from 'next/head';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';
import { saveAs } from 'file-saver';
import { CSVLink } from 'react-csv';

// Constants
const DEFAULT_CATEGORIES = ['Electronics', 'Furniture', 'Clothing'];

// Types
interface InventoryItem {
  category: string;
  costOfGoodsSold: number;
  averageInventory: number;
}

interface ChartData {
  name: string;
  turnover: number;
}

// Main Component
const InventoryTurnoverCalculator: React.FC = () => {
  // State
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  // Handlers
  const handleAddItem = () => {
    setItems([...items, { category: '', costOfGoodsSold: 0, averageInventory: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleChange = (index: number, field: keyof InventoryItem, value: string | number) => {
    const newItems = [...items];
    newItems[index][field] = typeof value === 'string' ? value : Number(value);
    setItems(newItems);
  };

  const calculateTurnover = () => {
    const results = items.map(item => ({
      name: item.category,
      turnover: item.costOfGoodsSold / item.averageInventory || 0,
    }));
    setChartData(results);
  };

  const exportCSV = () => {
    const csvData = items.map(item => ({
      Category: item.category,
      'Cost of Goods Sold': item.costOfGoodsSold,
      'Average Inventory': item.averageInventory,
      'Inventory Turnover': item.costOfGoodsSold / item.averageInventory || 0,
    }));
    return csvData;
  };

  // UI
  return (
    <div className="max-w-screen-md mx-auto px-4 py-8">
      <Head>
        <title>Inventory Turnover Calculator</title>
        <meta name="description" content="Calculate your inventory turnover ratio with ease." />
        <meta name="keywords" content="inventory, turnover, calculator, finance" />
        <link rel="canonical" href="https://yourdomain.com/tools/inventory-turnover-calculator" />
      </Head>

      <h1 className="text-3xl font-bold text-center mb-6">Inventory Turnover Calculator</h1>
      <p className="text-base text-gray-700 mb-4">
        Welcome to my Inventory Turnover Calculator. This tool helps you understand how efficiently your inventory is being managed. Simply input your data below to get started.
      </p>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Input Your Inventory Data</h2>
        {items.map((item, index) => (
          <div key={index} className="mb-4">
            <input
              type="text"
              placeholder="Category"
              value={item.category}
              onChange={(e) => handleChange(index, 'category', e.target.value)}
              className="border p-2 mr-2"
            />
            <input
              type="number"
              placeholder="Cost of Goods Sold"
              value={item.costOfGoodsSold}
              onChange={(e) => handleChange(index, 'costOfGoodsSold', e.target.value)}
              className="border p-2 mr-2"
            />
            <input
              type="number"
              placeholder="Average Inventory"
              value={item.averageInventory}
              onChange={(e) => handleChange(index, 'averageInventory', e.target.value)}
              className="border p-2 mr-2"
            />
            <button onClick={() => handleRemoveItem(index)} className="text-red-500">Remove</button>
          </div>
        ))}
        <button onClick={handleAddItem} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300">Add Item</button>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Results</h2>
        <button onClick={calculateTurnover} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 mb-4">Calculate Turnover</button>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="turnover" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
        <CSVLink data={exportCSV()} filename="inventory_turnover.csv" className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 inline-flex items-center mt-4">
          <Download className="mr-2" /> Export CSV
        </CSVLink>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Tips for Improving Inventory Turnover</h2>
        <ul className="list-disc list-inside mb-4 text-base">
          <li>Regularly review your inventory levels and adjust orders accordingly.</li>
          <li>Consider discounts or promotions to move slow-selling items.</li>
          <li>Optimize your supply chain to reduce lead times.</li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
        <div>
          <h3 className="text-xl font-semibold mb-2">What is inventory turnover?</h3>
          <p className="text-base text-gray-700 mb-4">
            Inventory turnover is a financial ratio that shows how many times a company's inventory is sold and replaced over a period.
          </p>
          <h3 className="text-xl font-semibold mb-2">Why is inventory turnover important?</h3>
          <p className="text-base text-gray-700 mb-4">
            It helps businesses understand how efficiently they are managing their inventory, which can impact cash flow and profitability.
          </p>
        </div>
      </section>
    </div>
  );
};

export default InventoryTurnoverCalculator;


This refactored code organizes the Inventory Turnover Calculator into a clean, modular, and scalable Next.js page component. It uses TailwindCSS for styling, React hooks for state management, and includes a CSV export feature. The page is designed to be responsive and accessible, with a focus on usability and readability.