
// /pages/tools/technology-depreciation-calculator.tsx

import React, { useState } from 'react';
import Head from 'next/head';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';

interface DepreciationItem {
  name: string;
  initialCost: number;
  lifespan: number;
}

const defaultItems: DepreciationItem[] = [
  { name: 'Laptop', initialCost: 1000, lifespan: 3 },
  { name: 'Smartphone', initialCost: 800, lifespan: 2 },
];

const TechnologyDepreciationCalculator: React.FC = () => {
  const [items, setItems] = useState<DepreciationItem[]>(defaultItems);
  const [results, setResults] = useState<number[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  const handleInputChange = (index: number, field: keyof DepreciationItem, value: string) => {
    const updatedItems = [...items];
    updatedItems[index][field] = field === 'name' ? value : parseFloat(value);
    setItems(updatedItems);
  };

  const calculateDepreciation = () => {
    const newResults = items.map(item => item.initialCost / item.lifespan);
    setResults(newResults);

    const newChartData = items.map((item, index) => ({
      name: item.name,
      Depreciation: newResults[index],
    }));
    setChartData(newChartData);
  };

  const addItem = () => {
    setItems([...items, { name: '', initialCost: 0, lifespan: 1 }]);
  };

  const removeItem = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const exportCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,'
      + items.map((item, index) => `${item.name},${item.initialCost},${item.lifespan},${results[index]}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'depreciation_results.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-screen-md mx-auto px-4 py-8">
      <Head>
        <title>Technology Depreciation Calculator</title>
        <meta name="description" content="Calculate the depreciation of your technology items over time." />
        <meta name="keywords" content="technology, depreciation, calculator, finance" />
        <link rel="canonical" href="https://www.expensegoose.com/tools/technology-depreciation-calculator" />
      </Head>
      <h1 className="text-3xl font-bold text-center mb-6">Technology Depreciation Calculator</h1>
      <p className="text-base text-gray-700 mb-4">
        Welcome to the Technology Depreciation Calculator. This tool helps you estimate the annual depreciation of your technology items, allowing you to better manage your finances.
      </p>
      <div>
        {items.map((item, index) => (
          <div key={index} className="mb-4">
            <input
              type="text"
              value={item.name}
              onChange={(e) => handleInputChange(index, 'name', e.target.value)}
              placeholder="Item Name"
              className="border p-2 mr-2"
            />
            <input
              type="number"
              value={item.initialCost}
              onChange={(e) => handleInputChange(index, 'initialCost', e.target.value)}
              placeholder="Initial Cost"
              className="border p-2 mr-2"
            />
            <input
              type="number"
              value={item.lifespan}
              onChange={(e) => handleInputChange(index, 'lifespan', e.target.value)}
              placeholder="Lifespan (years)"
              className="border p-2 mr-2"
            />
            <button onClick={() => removeItem(index)} className="text-red-500">Remove</button>
          </div>
        ))}
        <button onClick={addItem} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mb-4">Add Item</button>
        <button onClick={calculateDepreciation} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mb-4">Calculate</button>
      </div>
      {results.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Results</h2>
          <ul className="list-disc list-inside mb-4 text-base">
            {items.map((item, index) => (
              <li key={index}>{item.name}: ${results[index].toFixed(2)} per year</li>
            ))}
          </ul>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Depreciation" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
          <button onClick={exportCSV} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mt-4 flex items-center">
            <Download className="mr-2" /> Export CSV
          </button>
        </div>
      )}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Tips for Managing Technology Depreciation</h2>
        <ul className="list-disc list-inside mb-4 text-base">
          <li>Regularly assess the value of your technology assets.</li>
          <li>Consider the resale value when purchasing new technology.</li>
          <li>Keep track of warranties and service agreements.</li>
        </ul>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
        <ul className="list-disc list-inside mb-4 text-base">
          <li>How is depreciation calculated? - Depreciation is calculated by dividing the initial cost by the lifespan of the item.</li>
          <li>Why is it important to track depreciation? - Tracking depreciation helps in financial planning and asset management.</li>
          <li>Can I add more items? - Yes, you can add as many items as you need.</li>
        </ul>
      </div>
    </div>
  );
};

export default TechnologyDepreciationCalculator;


This code provides a comprehensive and user-friendly Next.js page component for a Technology Depreciation Calculator. It includes a form for inputting technology items, calculates depreciation, displays results in a list and a bar chart, and offers tips and FAQs for users. The page is styled using TailwindCSS for a modern and responsive design.