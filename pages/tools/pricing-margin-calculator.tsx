Certainly! Below is a refactored Next.js page component for a "Pricing Margin Calculator" tool. This component is structured to be modular, maintainable, and scalable, with a focus on usability and accessibility. It uses Tailwind CSS for styling and includes a chart using `recharts`.


// /pages/tools/pricing-margin-calculator.tsx

import React, { useState } from 'react';
import Head from 'next/head';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';

interface UserInput {
  itemName: string;
  costPrice: number;
  sellingPrice: number;
}

interface ChartData {
  name: string;
  value: number;
}

const defaultItems: UserInput[] = [
  { itemName: 'Item 1', costPrice: 0, sellingPrice: 0 },
];

const PricingMarginCalculator: React.FC = () => {
  const [items, setItems] = useState<UserInput[]>(defaultItems);
  const [results, setResults] = useState<number[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  const handleInputChange = (index: number, field: keyof UserInput, value: string) => {
    const updatedItems = [...items];
    updatedItems[index][field] = field === 'itemName' ? value : parseFloat(value);
    setItems(updatedItems);
  };

  const calculateResults = () => {
    const newResults = items.map(item => ((item.sellingPrice - item.costPrice) / item.sellingPrice) * 100);
    setResults(newResults);

    const newChartData = items.map((item, index) => ({
      name: item.itemName,
      value: newResults[index],
    }));
    setChartData(newChartData);
  };

  const addItem = () => {
    setItems([...items, { itemName: `Item ${items.length + 1}`, costPrice: 0, sellingPrice: 0 }]);
  };

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + items.map(item => `${item.itemName},${item.costPrice},${item.sellingPrice}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "pricing_margin_calculator.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="max-w-screen-md mx-auto px-4 py-8">
      <Head>
        <title>Pricing Margin Calculator</title>
        <meta name="description" content="Calculate your pricing margins easily with our free tool." />
        <meta name="keywords" content="pricing, margin, calculator, finance, tool" />
        <link rel="canonical" href="https://www.expensegoose.com/tools/pricing-margin-calculator" />
      </Head>

      <h1 className="text-3xl font-bold text-center mb-6">Pricing Margin Calculator</h1>
      <p className="text-base text-gray-700 mb-4">
        Welcome to my Pricing Margin Calculator! This tool helps you calculate the profit margin for your products. Simply enter the cost and selling prices, and let the calculator do the rest.
      </p>

      <div className="mb-8">
        {items.map((item, index) => (
          <div key={index} className="mb-4">
            <label className="block text-base font-semibold mb-2">Item Name</label>
            <input
              type="text"
              value={item.itemName}
              onChange={(e) => handleInputChange(index, 'itemName', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-2"
            />
            <label className="block text-base font-semibold mb-2">Cost Price</label>
            <input
              type="number"
              value={item.costPrice}
              onChange={(e) => handleInputChange(index, 'costPrice', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-2"
            />
            <label className="block text-base font-semibold mb-2">Selling Price</label>
            <input
              type="number"
              value={item.sellingPrice}
              onChange={(e) => handleInputChange(index, 'sellingPrice', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        ))}
        <button onClick={addItem} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300">
          Add Item
        </button>
      </div>

      <button onClick={calculateResults} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 mb-8">
        Calculate
      </button>

      {results.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Results</h2>
          <ul className="list-disc list-inside mb-4 text-base">
            {results.map((result, index) => (
              <li key={index}>{items[index].itemName}: {result.toFixed(2)}%</li>
            ))}
          </ul>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>

          <button onClick={exportCSV} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 mt-4 flex items-center">
            <Download className="mr-2" /> Export CSV
          </button>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Tips for Maximizing Profit Margins</h2>
        <ul className="list-disc list-inside mb-4 text-base">
          <li>Regularly review your pricing strategy to ensure competitiveness.</li>
          <li>Consider bulk purchasing to reduce cost prices.</li>
          <li>Analyze market trends to adjust prices accordingly.</li>
        </ul>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
        <ul className="list-disc list-inside mb-4 text-base">
          <li><strong>What is a profit margin?</strong> - It's the percentage of profit made from selling a product.</li>
          <li><strong>How do I use this calculator?</strong> - Enter the cost and selling prices of your items, then click calculate.</li>
          <li><strong>Can I export the results?</strong> - Yes, you can export the results as a CSV file.</li>
        </ul>
      </div>
    </div>
  );
};

export default PricingMarginCalculator;


### Explanation:

- **Imports**: The component imports necessary libraries and hooks, including `recharts` for charting and `lucide-react` for icons.
- **State Management**: Uses `useState` to manage user inputs, results, and chart data.
- **Handlers**: Functions are provided to handle input changes, add new items, calculate results, and export data as CSV.
- **UI Components**: The UI is structured with semantic HTML and styled using Tailwind CSS for a clean, responsive design.
- **Accessibility**: Ensures accessible inputs and buttons with appropriate labels and focus states.
- **Chart**: A bar chart is included to visually represent the calculated profit margins.
- **Tips and FAQs**: Additional sections are included to enhance user engagement and provide helpful information.