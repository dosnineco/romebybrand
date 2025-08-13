
// /pages/tools/annuity-payout-calculator.tsx

import React, { useState } from 'react';
import Head from 'next/head';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';
import { saveAs } from 'file-saver';
import { NextPage } from 'next';
import { SoftwareApplication } from 'schema-dts';
import { JsonLd } from 'react-schemaorg';

const defaultCategories = ['Retirement', 'Education', 'Vacation'];

interface UserInput {
  category: string;
  principal: number;
  rate: number;
  years: number;
}

interface Result {
  category: string;
  payout: number;
}

const AnnuityPayoutCalculator: NextPage = () => {
  const [inputs, setInputs] = useState<UserInput[]>([
    { category: 'Retirement', principal: 10000, rate: 5, years: 10 },
  ]);
  const [results, setResults] = useState<Result[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  const handleInputChange = (index: number, field: keyof UserInput, value: string) => {
    const newInputs = [...inputs];
    newInputs[index][field] = field === 'category' ? value : parseFloat(value);
    setInputs(newInputs);
  };

  const addCategory = () => {
    setInputs([...inputs, { category: '', principal: 0, rate: 0, years: 0 }]);
  };

  const removeCategory = (index: number) => {
    const newInputs = inputs.filter((_, i) => i !== index);
    setInputs(newInputs);
  };

  const calculateResults = () => {
    const newResults = inputs.map(input => {
      const payout = input.principal * Math.pow(1 + input.rate / 100, input.years);
      return { category: input.category, payout };
    });
    setResults(newResults);
    setChartData(newResults.map(result => ({ name: result.category, payout: result.payout })));
  };

  const exportCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,Category,Principal,Rate,Years,Payout\n' +
      results.map(result => `${result.category},${inputs.find(input => input.category === result.category)?.principal},${inputs.find(input => input.category === result.category)?.rate},${inputs.find(input => input.category === result.category)?.years},${result.payout}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    saveAs(encodedUri, 'annuity_payouts.csv');
  };

  return (
    <div className="max-w-screen-md mx-auto px-4 py-8">
      <Head>
        <title>Annuity Payout Calculator</title>
        <meta name="description" content="Calculate your annuity payouts with our free tool." />
        <meta name="keywords" content="annuity, payout, calculator, finance, retirement" />
        <link rel="canonical" href="https://www.expensegoose.com/tools/annuity-payout-calculator" />
      </Head>
      <JsonLd<SoftwareApplication>
        item={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'Annuity Payout Calculator',
          description: 'A tool to calculate annuity payouts.',
          applicationCategory: 'FinanceApplication',
          operatingSystem: 'All',
        }}
      />
      <h1 className="text-3xl font-bold text-center mb-6">Annuity Payout Calculator</h1>
      <p className="text-base text-gray-700 mb-4">
        Welcome to the Annuity Payout Calculator. This tool helps you estimate the future value of your annuities based on your inputs. Simply enter your details below and see how your investments can grow over time.
      </p>
      <div>
        {inputs.map((input, index) => (
          <div key={index} className="mb-4">
            <label className="block text-xl font-semibold mb-2">Category</label>
            <input
              type="text"
              value={input.category}
              onChange={(e) => handleInputChange(index, 'category', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-2"
            />
            <label className="block text-xl font-semibold mb-2">Principal</label>
            <input
              type="number"
              value={input.principal}
              onChange={(e) => handleInputChange(index, 'principal', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-2"
            />
            <label className="block text-xl font-semibold mb-2">Rate (%)</label>
            <input
              type="number"
              value={input.rate}
              onChange={(e) => handleInputChange(index, 'rate', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-2"
            />
            <label className="block text-xl font-semibold mb-2">Years</label>
            <input
              type="number"
              value={input.years}
              onChange={(e) => handleInputChange(index, 'years', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-2"
            />
            <button
              onClick={() => removeCategory(index)}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 mt-2"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={addCategory}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mb-4"
        >
          Add Category
        </button>
        <button
          onClick={calculateResults}
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 mb-4"
        >
          Calculate
        </button>
      </div>
      {results.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Results</h2>
          <ul className="list-disc list-inside mb-4 text-base">
            {results.map((result, index) => (
              <li key={index}>
                {result.category}: ${result.payout.toFixed(2)}
              </li>
            ))}
          </ul>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="payout" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
          <button
            onClick={exportCSV}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mt-4"
          >
            <Download className="inline-block mr-2" /> Export CSV
          </button>
        </div>
      )}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Tips for Maximizing Your Annuity Payouts</h2>
        <ul className="list-disc list-inside mb-4 text-base">
          <li>Start investing early to take advantage of compound interest.</li>
          <li>Regularly review and adjust your investment strategy.</li>
          <li>Consider diversifying your portfolio to mitigate risks.</li>
        </ul>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
        <ul className="list-disc list-inside mb-4 text-base">
          <li>What is an annuity? An annuity is a financial product that pays out a fixed stream of payments to an individual.</li>
          <li>How is the payout calculated? The payout is calculated based on the principal, rate, and number of years.</li>
          <li>Can I add more categories? Yes, you can add as many categories as you like.</li>
        </ul>
      </div>
    </div>
  );
};

export default AnnuityPayoutCalculator;
