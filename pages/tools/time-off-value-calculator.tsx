
// /pages/tools/time-off-value-calculator.tsx

import React, { useState } from 'react';
import Head from 'next/head';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';
import { saveAs } from 'file-saver';
import { NextPage } from 'next';
import { FAQSection, TipsSection } from '../../components';

interface UserInput {
  category: string;
  daysOff: number;
  dailyRate: number;
}

interface ChartData {
  name: string;
  value: number;
}

const defaultCategories: UserInput[] = [
  { category: 'Vacation', daysOff: 10, dailyRate: 200 },
  { category: 'Sick Leave', daysOff: 5, dailyRate: 200 },
];

const TimeOffValueCalculator: NextPage = () => {
  const [inputs, setInputs] = useState<UserInput[]>(defaultCategories);
  const [results, setResults] = useState<number[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  const handleInputChange = (index: number, field: keyof UserInput, value: string | number) => {
    const updatedInputs = [...inputs];
    updatedInputs[index][field] = typeof value === 'string' ? parseFloat(value) : value;
    setInputs(updatedInputs);
  };

  const calculateResults = () => {
    const calculatedResults = inputs.map(input => input.daysOff * input.dailyRate);
    setResults(calculatedResults);
    setChartData(inputs.map((input, index) => ({ name: input.category, value: calculatedResults[index] })));
  };

  const exportCSV = () => {
    const csvContent = `data:text/csv;charset=utf-8,Category,Days Off,Daily Rate,Total Value\n` +
      inputs.map((input, index) => `${input.category},${input.daysOff},${input.dailyRate},${results[index]}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    saveAs(encodedUri, 'time-off-value.csv');
  };

  return (
    <div className="max-w-screen-md mx-auto px-4 py-8">
      <Head>
        <title>Time Off Value Calculator</title>
        <meta name="description" content="Calculate the value of your time off with our free tool." />
        <meta name="keywords" content="time off, value calculator, personal finance" />
        <link rel="canonical" href="https://www.expensegoose.com/tools/time-off-value-calculator" />
      </Head>
      <h1 className="text-3xl font-bold text-center mb-6">Time Off Value Calculator</h1>
      <p className="text-base text-gray-700 mb-4">
        Discover the financial value of your time off. Whether it's vacation or sick leave, knowing the monetary worth can help you make informed decisions.
      </p>
      <div>
        {inputs.map((input, index) => (
          <div key={index} className="mb-4">
            <h2 className="text-2xl font-semibold mb-4">{input.category}</h2>
            <label className="block mb-2">
              Days Off:
              <input
                type="number"
                value={input.daysOff}
                onChange={(e) => handleInputChange(index, 'daysOff', e.target.value)}
                className="block w-full mt-1 p-2 border border-gray-300 rounded"
              />
            </label>
            <label className="block mb-2">
              Daily Rate:
              <input
                type="number"
                value={input.dailyRate}
                onChange={(e) => handleInputChange(index, 'dailyRate', e.target.value)}
                className="block w-full mt-1 p-2 border border-gray-300 rounded"
              />
            </label>
          </div>
        ))}
        <button
          onClick={calculateResults}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
        >
          Calculate
        </button>
      </div>
      {results.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Results</h2>
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
            className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 flex items-center"
          >
            <Download className="mr-2" /> Export CSV
          </button>
        </div>
      )}
      <TipsSection />
      <FAQSection />
    </div>
  );
};

export default TimeOffValueCalculator;

// components/FAQSection.tsx
export const FAQSection: React.FC = () => (
  <div className="mt-8">
    <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
    <ul className="list-disc list-inside mb-4 text-base">
      <li>How is the value of time off calculated?</li>
      <li>Can I add more categories?</li>
      <li>Is my data saved?</li>
    </ul>
  </div>
);

// components/TipsSection.tsx
export const TipsSection: React.FC = () => (
  <div className="mt-8">
    <h2 className="text-2xl font-semibold mb-4">Tips</h2>
    <ul className="list-disc list-inside mb-4 text-base">
      <li>Consider all types of leave when calculating your total time off value.</li>
      <li>Use this tool to negotiate better leave terms with your employer.</li>
      <li>Regularly update your daily rate to reflect any salary changes.</li>
    </ul>
  </div>
);


This code provides a structured and modular Next.js page component for the "Time Off Value Calculator" tool. It includes separate components for FAQs and tips, uses Tailwind CSS for styling, and ensures accessibility and responsiveness. The code is organized into logical sections for easy maintenance and scalability.