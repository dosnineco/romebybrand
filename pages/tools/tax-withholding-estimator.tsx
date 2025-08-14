
// /pages/tools/tax-withholding-estimator.tsx

import React, { useState } from 'react';
import Head from 'next/head';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';
import { saveAs } from 'file-saver';
import { NextPage } from 'next';
import { SoftwareApplication } from 'schema-dts';
import { JsonLd } from 'react-schemaorg';

const defaultCategories = ['Salary', 'Bonus', 'Investments'];

interface UserInput {
  category: string;
  amount: number;
}

interface Result {
  category: string;
  estimatedTax: number;
}

const TaxWithholdingEstimator: NextPage = () => {
  const [userInputs, setUserInputs] = useState<UserInput[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  const handleInputChange = (index: number, field: string, value: string) => {
    const newInputs = [...userInputs];
    newInputs[index] = { ...newInputs[index], [field]: value };
    setUserInputs(newInputs);
  };

  const addCategory = () => {
    setUserInputs([...userInputs, { category: '', amount: 0 }]);
  };

  const removeCategory = (index: number) => {
    const newInputs = userInputs.filter((_, i) => i !== index);
    setUserInputs(newInputs);
  };

  const calculateResults = () => {
    const newResults = userInputs.map(input => ({
      category: input.category,
      estimatedTax: input.amount * 0.2, // Example tax calculation
    }));
    setResults(newResults);
    setChartData(newResults.map(result => ({ name: result.category, tax: result.estimatedTax })));
  };

  const exportCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,'
      + results.map(r => `${r.category},${r.estimatedTax}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    saveAs(encodedUri, 'tax_withholding_estimator_results.csv');
  };

  return (
    <div className="max-w-screen-md mx-auto px-4 py-8">
      <Head>
        <title>Tax Withholding Estimator</title>
        <meta name="description" content="Estimate your tax withholding with our free tool." />
        <meta name="keywords" content="tax, withholding, estimator, finance" />
        <link rel="canonical" href="https://www.expensegoose.com/tools/tax-withholding-estimator" />
      </Head>
      <JsonLd<SoftwareApplication>
        item={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'Tax Withholding Estimator',
          description: 'A tool to estimate your tax withholding.',
          applicationCategory: 'FinanceApplication',
          operatingSystem: 'All',
        }}
      />
      <h1 className="text-3xl font-bold text-center mb-6">Tax Withholding Estimator</h1>
      <p className="text-base text-gray-700 mb-4">
        Welcome to the Tax Withholding Estimator! This tool helps you estimate the amount of tax you should withhold from your income. Simply enter your income categories and amounts, and we'll do the rest.
      </p>
      <div>
        {userInputs.map((input, index) => (
          <div key={index} className="mb-4">
            <input
              type="text"
              value={input.category}
              onChange={(e) => handleInputChange(index, 'category', e.target.value)}
              placeholder="Category"
              className="border p-2 mr-2"
            />
            <input
              type="number"
              value={input.amount}
              onChange={(e) => handleInputChange(index, 'amount', e.target.value)}
              placeholder="Amount"
              className="border p-2 mr-2"
            />
            <button onClick={() => removeCategory(index)} className="text-red-500">Remove</button>
          </div>
        ))}
        <button onClick={addCategory} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mb-4">Add Category</button>
        <button onClick={calculateResults} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mb-4">Calculate</button>
      </div>
      {results.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Results</h2>
          <ul className="list-disc list-inside mb-4 text-base">
            {results.map((result, index) => (
              <li key={index}>{result.category}: ${result.estimatedTax.toFixed(2)}</li>
            ))}
          </ul>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="tax" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
          <button onClick={exportCSV} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mt-4 flex items-center">
            <Download className="mr-2" /> Export CSV
          </button>
        </div>
      )}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Tips for Accurate Estimation</h2>
        <ul className="list-disc list-inside mb-4 text-base">
          <li>Ensure all income sources are included for a comprehensive estimate.</li>
          <li>Review your tax bracket to understand the applicable rates.</li>
          <li>Consider consulting a tax professional for personalized advice.</li>
        </ul>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
        <ul className="list-disc list-inside mb-4 text-base">
          <li>How accurate is this estimator? - The tool provides an estimate based on the inputs you provide. For precise calculations, consult a tax professional.</li>
          <li>Can I use this tool for business income? - This tool is designed for personal finance. For business income, consider specialized software or professional advice.</li>
        </ul>
      </div>
    </div>
  );
};

export default TaxWithholdingEstimator;


This code provides a comprehensive and user-friendly Next.js page component for a Tax Withholding Estimator tool. It includes a form for user inputs, calculation logic, a results section with a chart, and additional sections for tips and FAQs. The page is styled using TailwindCSS for a modern and responsive design.