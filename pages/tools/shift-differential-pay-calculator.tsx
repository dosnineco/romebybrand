Certainly! Below is a refactored Next.js page component for the "Shift Differential Pay Calculator" using TypeScript, TailwindCSS, and React hooks. The code is organized into logical sections and includes modular components for FAQs and tips. The page is designed to be responsive and accessible.


// /pages/tools/shift-differential-pay-calculator.tsx

import React, { useState } from 'react';
import Head from 'next/head';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';

interface UserInput {
  basePay: number;
  shiftHours: number;
  differentialRate: number;
}

interface ChartData {
  name: string;
  value: number;
}

const ShiftDifferentialPayCalculator: React.FC = () => {
  const [userInput, setUserInput] = useState<UserInput>({ basePay: 0, shiftHours: 0, differentialRate: 0 });
  const [result, setResult] = useState<number>(0);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInput({ ...userInput, [name]: parseFloat(value) });
  };

  const calculatePay = () => {
    const { basePay, shiftHours, differentialRate } = userInput;
    const differentialPay = basePay * (differentialRate / 100) * shiftHours;
    setResult(differentialPay);
    setChartData([
      { name: 'Base Pay', value: basePay },
      { name: 'Differential Pay', value: differentialPay },
    ]);
  };

  const exportCSV = () => {
    const csvContent = `data:text/csv;charset=utf-8,Base Pay,Shift Hours,Differential Rate,Differential Pay\n${userInput.basePay},${userInput.shiftHours},${userInput.differentialRate},${result}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'shift_differential_pay.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-screen-md mx-auto px-4 py-8">
      <Head>
        <title>Shift Differential Pay Calculator</title>
        <meta name="description" content="Calculate your shift differential pay with ease using our free tool." />
        <meta name="keywords" content="shift differential, pay calculator, finance tool" />
        <link rel="canonical" href="https://www.expensegoose.com/tools/shift-differential-pay-calculator" />
      </Head>

      <h1 className="text-3xl font-bold text-center mb-6">Shift Differential Pay Calculator</h1>
      <p className="text-base text-gray-700 mb-4">
        Welcome to the Shift Differential Pay Calculator. This tool helps you calculate the additional pay you earn for working shifts with differential rates. Simply enter your base pay, shift hours, and differential rate to get started.
      </p>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Enter Your Details</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-base font-semibold mb-2" htmlFor="basePay">Base Pay ($)</label>
            <input
              type="number"
              id="basePay"
              name="basePay"
              value={userInput.basePay}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-base font-semibold mb-2" htmlFor="shiftHours">Shift Hours</label>
            <input
              type="number"
              id="shiftHours"
              name="shiftHours"
              value={userInput.shiftHours}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-base font-semibold mb-2" htmlFor="differentialRate">Differential Rate (%)</label>
            <input
              type="number"
              id="differentialRate"
              name="differentialRate"
              value={userInput.differentialRate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <button
            type="button"
            onClick={calculatePay}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400"
          >
            Calculate
          </button>
        </form>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Results</h2>
        <p className="text-base text-gray-700 mb-4">Your differential pay is: <strong>${result.toFixed(2)}</strong></p>
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
          className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 flex items-center"
        >
          <Download className="mr-2" /> Export as CSV
        </button>
      </div>

      <TipsSection />
      <FAQSection />
    </div>
  );
};

const TipsSection: React.FC = () => (
  <div className="mb-8">
    <h2 className="text-2xl font-semibold mb-4">Tips for Maximizing Your Shift Pay</h2>
    <ul className="list-disc list-inside mb-4 text-base">
      <li>Consider negotiating your differential rate if you frequently work shifts.</li>
      <li>Track your hours accurately to ensure correct pay calculations.</li>
      <li>Understand your company's policy on shift differentials to maximize your earnings.</li>
    </ul>
  </div>
);

const FAQSection: React.FC = () => (
  <div className="mb-8">
    <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-semibold mb-2">What is shift differential pay?</h3>
        <p className="text-base text-gray-700">Shift differential pay is additional compensation for employees who work shifts outside of normal business hours.</p>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">How is shift differential pay calculated?</h3>
        <p className="text-base text-gray-700">It is typically calculated as a percentage of your base pay, applied to the hours worked during the shift.</p>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">Can I negotiate my shift differential rate?</h3>
        <p className="text-base text-gray-700">Yes, depending on your employer's policies, you may be able to negotiate a higher differential rate.</p>
      </div>
    </div>
  </div>
);

export default ShiftDifferentialPayCalculator;


This code provides a structured and modular approach to building the Shift Differential Pay Calculator. It includes a form for user input, a calculation function, a chart for visualizing results, and sections for tips and FAQs. The use of TailwindCSS ensures a modern and responsive design.