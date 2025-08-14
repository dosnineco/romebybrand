
// /pages/tools/vendor-comparison-tool.tsx

import React, { useState } from 'react';
import Head from 'next/head';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';
import { saveAs } from 'file-saver';
import { NextPage } from 'next';
import { SoftwareApplication } from 'schema-dts';
import { JsonLd } from 'react-schemaorg';

const defaultCategories = ['Software', 'Hardware', 'Services'];

type VendorComparisonInput = {
  category: string;
  vendorName: string;
  cost: number;
};

const VendorComparisonTool: NextPage = () => {
  const [inputs, setInputs] = useState<VendorComparisonInput[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  const handleAddInput = () => {
    setInputs([...inputs, { category: '', vendorName: '', cost: 0 }]);
  };

  const handleInputChange = (index: number, field: keyof VendorComparisonInput, value: string | number) => {
    const newInputs = [...inputs];
    newInputs[index][field] = value;
    setInputs(newInputs);
  };

  const calculateResults = () => {
    const groupedData = inputs.reduce((acc, input) => {
      if (!acc[input.category]) acc[input.category] = [];
      acc[input.category].push(input);
      return acc;
    }, {} as Record<string, VendorComparisonInput[]>);

    const results = Object.entries(groupedData).map(([category, vendors]) => ({
      category,
      totalCost: vendors.reduce((sum, vendor) => sum + vendor.cost, 0),
    }));

    setResults(results);
    setChartData(results.map(result => ({ name: result.category, cost: result.totalCost })));
  };

  const exportCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,'
      + inputs.map(input => `${input.category},${input.vendorName},${input.cost}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    saveAs(encodedUri, 'vendor-comparison.csv');
  };

  return (
    <div className="max-w-screen-md mx-auto px-4 py-8">
      <Head>
        <title>Vendor Comparison Tool</title>
        <meta name="description" content="Compare vendors for your personal finance needs." />
        <meta name="keywords" content="vendor comparison, finance tool, cost analysis" />
        <link rel="canonical" href="https://www.expensegoose.com/tools/vendor-comparison-tool" />
      </Head>

      <JsonLd<SoftwareApplication>
        item={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'Vendor Comparison Tool',
          description: 'A tool to compare vendors for personal finance.',
          applicationCategory: 'FinanceApplication',
        }}
      />

      <h1 className="text-3xl font-bold text-center mb-6">Vendor Comparison Tool</h1>
      <p className="text-base text-gray-700 mb-4">
        Welcome to the Vendor Comparison Tool. This tool helps you compare different vendors based on categories like software, hardware, and services. Enter your data below to get started.
      </p>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Enter Vendor Details</h2>
        {inputs.map((input, index) => (
          <div key={index} className="mb-4">
            <input
              type="text"
              placeholder="Category"
              value={input.category}
              onChange={(e) => handleInputChange(index, 'category', e.target.value)}
              className="border p-2 mr-2"
            />
            <input
              type="text"
              placeholder="Vendor Name"
              value={input.vendorName}
              onChange={(e) => handleInputChange(index, 'vendorName', e.target.value)}
              className="border p-2 mr-2"
            />
            <input
              type="number"
              placeholder="Cost"
              value={input.cost}
              onChange={(e) => handleInputChange(index, 'cost', parseFloat(e.target.value))}
              className="border p-2"
            />
          </div>
        ))}
        <button onClick={handleAddInput} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300">
          Add Vendor
        </button>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Results</h2>
        <button onClick={calculateResults} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 mb-4">
          Calculate
        </button>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="cost" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
        <button onClick={exportCSV} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 mt-4 flex items-center">
          <Download className="mr-2" /> Export CSV
        </button>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Tips for Using the Tool</h2>
        <ul className="list-disc list-inside mb-4 text-base">
          <li>Ensure all vendor details are accurate for the best comparison.</li>
          <li>Use the export feature to save your data for future reference.</li>
          <li>Regularly update your vendor list to reflect any changes in costs.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
        <ul className="list-disc list-inside mb-4 text-base">
          <li>How do I add a new vendor? - Use the "Add Vendor" button to add more entries.</li>
          <li>Can I export my data? - Yes, use the "Export CSV" button to download your data.</li>
          <li>What categories can I use? - You can use any category that fits your needs.</li>
        </ul>
      </section>
    </div>
  );
};

export default VendorComparisonTool;


This refactored code includes a structured layout with sections for inputs, results, tips, and FAQs. It uses Tailwind CSS for styling, React hooks for state management, and includes a bar chart for visualizing results. The code is modular and easy to extend with new features or categories.