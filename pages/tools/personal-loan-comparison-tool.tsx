
// /pages/tools/personal-loan-comparison-tool.tsx

import React, { useState } from 'react';
import Head from 'next/head';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';

interface LoanOption {
  name: string;
  interestRate: number;
  loanAmount: number;
  term: number;
}

const defaultLoanOptions: LoanOption[] = [
  { name: 'Bank A', interestRate: 3.5, loanAmount: 10000, term: 5 },
  { name: 'Bank B', interestRate: 4.0, loanAmount: 10000, term: 5 },
];

const PersonalLoanComparisonTool: React.FC = () => {
  const [loanOptions, setLoanOptions] = useState<LoanOption[]>(defaultLoanOptions);
  const [chartData, setChartData] = useState<any[]>([]);

  const calculateMonthlyPayment = (loanAmount: number, interestRate: number, term: number) => {
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = term * 12;
    return (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -numberOfPayments));
  };

  const handleCalculate = () => {
    const data = loanOptions.map(option => ({
      name: option.name,
      monthlyPayment: calculateMonthlyPayment(option.loanAmount, option.interestRate, option.term),
    }));
    setChartData(data);
  };

  const handleExportCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,' + chartData.map(e => `${e.name},${e.monthlyPayment}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'loan_comparison.csv');
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="max-w-screen-md mx-auto px-4 py-8">
      <Head>
        <title>Personal Loan Comparison Tool</title>
        <meta name="description" content="Compare personal loan options to find the best fit for your needs." />
        <meta name="keywords" content="personal loan, loan comparison, finance tool" />
        <link rel="canonical" href="https://www.expensegoose.com/tools/personal-loan-comparison-tool" />
      </Head>
      <h1 className="text-3xl font-bold text-center mb-6">Personal Loan Comparison Tool</h1>
      <p className="text-base text-gray-700 mb-4">
        Welcome to the Personal Loan Comparison Tool. Here, you can compare different loan options to find the best fit for your financial needs. Simply input the details of each loan option, and we'll calculate the monthly payments for you.
      </p>
      <div className="mb-8">
        {loanOptions.map((option, index) => (
          <div key={index} className="mb-4">
            <h2 className="text-xl font-semibold mb-4">Loan Option {index + 1}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  value={option.name}
                  onChange={(e) => {
                    const newOptions = [...loanOptions];
                    newOptions[index].name = e.target.value;
                    setLoanOptions(newOptions);
                  }}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-700">Interest Rate (%)</label>
                <input
                  type="number"
                  value={option.interestRate}
                  onChange={(e) => {
                    const newOptions = [...loanOptions];
                    newOptions[index].interestRate = parseFloat(e.target.value);
                    setLoanOptions(newOptions);
                  }}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-700">Loan Amount</label>
                <input
                  type="number"
                  value={option.loanAmount}
                  onChange={(e) => {
                    const newOptions = [...loanOptions];
                    newOptions[index].loanAmount = parseFloat(e.target.value);
                    setLoanOptions(newOptions);
                  }}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-700">Term (years)</label>
                <input
                  type="number"
                  value={option.term}
                  onChange={(e) => {
                    const newOptions = [...loanOptions];
                    newOptions[index].term = parseInt(e.target.value, 10);
                    setLoanOptions(newOptions);
                  }}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
          </div>
        ))}
        <button onClick={handleCalculate} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300">
          Calculate
        </button>
      </div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Results</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="monthlyPayment" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
        <button onClick={handleExportCSV} className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 flex items-center">
          <Download className="mr-2" /> Export as CSV
        </button>
      </div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Tips for Choosing a Personal Loan</h2>
        <ul className="list-disc list-inside mb-4 text-base">
          <li>Consider the total cost of the loan, not just the interest rate.</li>
          <li>Check for any additional fees or charges.</li>
          <li>Ensure the loan term aligns with your financial goals.</li>
          <li>Read the fine print and understand the terms and conditions.</li>
        </ul>
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
        <ul className="list-disc list-inside mb-4 text-base">
          <li>What is a personal loan?</li>
          <li>How do I compare different loan options?</li>
          <li>What factors should I consider when choosing a loan?</li>
          <li>How can I calculate my monthly payments?</li>
        </ul>
      </div>
    </div>
  );
};

export default PersonalLoanComparisonTool;


This code provides a comprehensive and user-friendly personal loan comparison tool using Next.js and TailwindCSS. It includes a form for inputting loan details, a calculation function for monthly payments, a chart for visual comparison, and options to export results as CSV. The page is structured with semantic HTML and accessible design, ensuring a professional and engaging user experience.