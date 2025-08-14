
// /pages/tools/public-transport-vs-car-ownership-calculator.tsx

import React, { useState } from 'react';
import Head from 'next/head';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';
import { saveAs } from 'file-saver';

interface UserInput {
  category: string;
  cost: number;
}

const defaultCategories: UserInput[] = [
  { category: 'Public Transport', cost: 0 },
  { category: 'Car Ownership', cost: 0 },
];

const PublicTransportVsCarOwnershipCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<UserInput[]>(defaultCategories);
  const [results, setResults] = useState<{ [key: string]: number }>({});
  const [chartData, setChartData] = useState<any[]>([]);

  const handleInputChange = (index: number, value: number) => {
    const newInputs = [...inputs];
    newInputs[index].cost = value;
    setInputs(newInputs);
  };

  const calculateResults = () => {
    const newResults: { [key: string]: number } = {};
    inputs.forEach(input => {
      newResults[input.category] = input.cost;
    });
    setResults(newResults);
    prepareChartData(newResults);
  };

  const prepareChartData = (results: { [key: string]: number }) => {
    const data = Object.keys(results).map(key => ({
      name: key,
      cost: results[key],
    }));
    setChartData(data);
  };

  const exportCSV = () => {
    const csvContent = `data:text/csv;charset=utf-8,Category,Cost\n${inputs
      .map(input => `${input.category},${input.cost}`)
      .join('\n')}`;
    const encodedUri = encodeURI(csvContent);
    saveAs(encodedUri, 'results.csv');
  };

  return (
    <div className="max-w-screen-md mx-auto px-4 py-8">
      <Head>
        <title>Public Transport vs Car Ownership Calculator</title>
        <meta name="description" content="Calculate and compare the costs of public transport and car ownership." />
        <meta name="keywords" content="public transport, car ownership, calculator, finance tool" />
        <link rel="canonical" href="https://www.expensegoose.com/tools/public-transport-vs-car-ownership-calculator" />
      </Head>
      <h1 className="text-3xl font-bold text-center mb-6">Public Transport vs Car Ownership Calculator</h1>
      <p className="text-base text-gray-700 mb-4">
        Welcome to the Public Transport vs Car Ownership Calculator. This tool helps you compare the costs of using public transport versus owning a car. Simply enter your estimated monthly costs for each category, and we'll do the rest!
      </p>
      <div>
        {inputs.map((input, index) => (
          <div key={index} className="mb-4">
            <label className="block text-xl font-semibold mb-2">{input.category} Cost</label>
            <input
              type="number"
              value={input.cost}
              onChange={(e) => handleInputChange(index, parseFloat(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded"
              aria-label={`${input.category} Cost`}
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
      {Object.keys(results).length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Results</h2>
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
            <Download className="mr-2" /> Export as CSV
          </button>
        </div>
      )}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Tips</h2>
        <ul className="list-disc list-inside mb-4 text-base">
          <li>Consider all potential costs, including maintenance and insurance for car ownership.</li>
          <li>Think about the environmental impact of your choice.</li>
          <li>Factor in the convenience and time savings of each option.</li>
        </ul>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">FAQs</h2>
        <ul className="list-disc list-inside mb-4 text-base">
          <li>How accurate are these calculations? - The results are estimates based on your inputs.</li>
          <li>Can I add more categories? - Currently, the tool supports two categories, but future updates may allow more.</li>
        </ul>
      </div>
    </div>
  );
};

export default PublicTransportVsCarOwnershipCalculator;


This code provides a structured and modular approach to building the "Public Transport vs Car Ownership Calculator" tool using Next.js and React. It includes a clean UI with TailwindCSS, a responsive design, and features like CSV export and a bar chart for visual comparison.