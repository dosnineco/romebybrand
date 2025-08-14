
// /pages/tools/bonus-after-tax-calculator.tsx

import React, { useState } from 'react';
import Head from 'next/head';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';
import { saveAs } from 'file-saver';
import { NextPage } from 'next';
import { Tips } from '../../components/Tips';
import { FAQ } from '../../components/FAQ';

interface UserInput {
  bonusAmount: number;
  taxRate: number;
}

interface Result {
  afterTaxBonus: number;
}

const BonusAfterTaxCalculator: NextPage = () => {
  const [userInput, setUserInput] = useState<UserInput>({ bonusAmount: 0, taxRate: 0 });
  const [result, setResult] = useState<Result | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInput((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const calculateAfterTaxBonus = () => {
    const afterTaxBonus = userInput.bonusAmount * (1 - userInput.taxRate / 100);
    setResult({ afterTaxBonus });
    setChartData([
      { name: 'Bonus', value: userInput.bonusAmount },
      { name: 'After Tax', value: afterTaxBonus },
    ]);
  };

  const exportCSV = () => {
    const csvContent = `data:text/csv;charset=utf-8,Bonus Amount,Tax Rate,After Tax Bonus\n${userInput.bonusAmount},${userInput.taxRate},${result?.afterTaxBonus}`;
    const encodedUri = encodeURI(csvContent);
    saveAs(encodedUri, 'bonus_after_tax.csv');
  };

  return (
    <div className="max-w-screen-md mx-auto px-4 py-8">
      <Head>
        <title>Bonus After Tax Calculator</title>
        <meta name="description" content="Calculate your bonus after tax with our free tool." />
        <meta name="keywords" content="bonus, tax, calculator, finance" />
        <link rel="canonical" href="https://www.expensegoose.com/tools/bonus-after-tax-calculator" />
      </Head>

      <h1 className="text-3xl font-bold text-center mb-6">Bonus After Tax Calculator</h1>
      <p className="text-base text-gray-700 mb-4">
        Welcome to the Bonus After Tax Calculator. This tool helps you determine how much of your bonus you'll take home after taxes. Simply enter your bonus amount and the applicable tax rate to get started.
      </p>

      <div className="mb-8">
        <label className="block mb-2 text-xl font-semibold" htmlFor="bonusAmount">Bonus Amount</label>
        <input
          type="number"
          id="bonusAmount"
          name="bonusAmount"
          value={userInput.bonusAmount}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />

        <label className="block mb-2 text-xl font-semibold" htmlFor="taxRate">Tax Rate (%)</label>
        <input
          type="number"
          id="taxRate"
          name="taxRate"
          value={userInput.taxRate}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />

        <button
          onClick={calculateAfterTaxBonus}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Calculate
        </button>
      </div>

      {result && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Results</h2>
          <p className="text-base text-gray-700 mb-4">Your after-tax bonus is: ${result.afterTaxBonus.toFixed(2)}</p>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>

          <button
            onClick={exportCSV}
            className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center"
          >
            <Download className="mr-2" /> Export as CSV
          </button>
        </div>
      )}

      <Tips />

      <FAQ />
    </div>
  );
};

export default BonusAfterTaxCalculator;

// components/Tips.tsx
export const Tips: React.FC = () => (
  <div className="mb-8">
    <h2 className="text-2xl font-semibold mb-4">Tips for Maximizing Your Bonus</h2>
    <ul className="list-disc list-inside mb-4 text-base">
      <li>Consider investing a portion of your bonus for long-term growth.</li>
      <li>Use your bonus to pay down high-interest debt.</li>
      <li>Set aside some of your bonus for an emergency fund.</li>
    </ul>
  </div>
);

// components/FAQ.tsx
export const FAQ: React.FC = () => (
  <div className="mb-8">
    <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
    <ul className="list-disc list-inside mb-4 text-base">
      <li><strong>How is the tax rate applied?</strong> The tax rate is applied to your bonus amount to calculate the after-tax bonus.</li>
      <li><strong>Can I use this tool for other types of income?</strong> This tool is specifically designed for bonuses, but you can use it for similar calculations.</li>
      <li><strong>Is my data saved?</strong> No, all calculations are done locally and your data is not saved.</li>
    </ul>
  </div>
);
