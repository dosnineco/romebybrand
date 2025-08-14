
// /pages/tools/student-loan-repayment-planner.tsx

import React, { useState } from 'react';
import Head from 'next/head';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';

interface LoanInput {
  loanAmount: number;
  interestRate: number;
  monthlyPayment: number;
}

interface ChartData {
  name: string;
  value: number;
}

const StudentLoanRepaymentPlanner: React.FC = () => {
  const [loanInput, setLoanInput] = useState<LoanInput>({ loanAmount: 0, interestRate: 0, monthlyPayment: 0 });
  const [results, setResults] = useState<number>(0);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoanInput({ ...loanInput, [name]: parseFloat(value) });
  };

  const calculateRepayment = () => {
    const { loanAmount, interestRate, monthlyPayment } = loanInput;
    const totalInterest = (loanAmount * (interestRate / 100)) / 12;
    const months = loanAmount / (monthlyPayment - totalInterest);
    setResults(months);
    setChartData([
      { name: 'Loan Amount', value: loanAmount },
      { name: 'Total Interest', value: totalInterest * months },
      { name: 'Total Payment', value: monthlyPayment * months },
    ]);
  };

  const exportCSV = () => {
    const csvContent = `data:text/csv;charset=utf-8,Loan Amount,Interest Rate,Monthly Payment,Months\n${loanInput.loanAmount},${loanInput.interestRate},${loanInput.monthlyPayment},${results}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'loan_repayment_plan.csv');
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="max-w-screen-md mx-auto px-4 py-8">
      <Head>
        <title>Student Loan Repayment Planner</title>
        <meta name="description" content="Plan your student loan repayment effectively with our free tool." />
        <meta name="keywords" content="student loan, repayment planner, finance tool" />
        <link rel="canonical" href="https://www.expensegoose.com/tools/student-loan-repayment-planner" />
      </Head>
      <h1 className="text-3xl font-bold text-center mb-6">Student Loan Repayment Planner</h1>
      <p className="text-base text-gray-700 mb-4">
        Welcome to the Student Loan Repayment Planner. This tool helps you plan your loan repayment strategy effectively. Enter your loan details below to get started.
      </p>
      <div className="mb-8">
        <label className="block mb-2 text-xl font-semibold">Loan Amount</label>
        <input
          type="number"
          name="loanAmount"
          value={loanInput.loanAmount}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <label className="block mb-2 text-xl font-semibold">Interest Rate (%)</label>
        <input
          type="number"
          name="interestRate"
          value={loanInput.interestRate}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <label className="block mb-2 text-xl font-semibold">Monthly Payment</label>
        <input
          type="number"
          name="monthlyPayment"
          value={loanInput.monthlyPayment}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <button
          onClick={calculateRepayment}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Calculate
        </button>
      </div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Results</h2>
        <p className="text-base text-gray-700 mb-4">You will repay your loan in approximately {results.toFixed(2)} months.</p>
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
          <Download className="mr-2" /> Export CSV
        </button>
      </div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Tips for Repayment</h2>
        <ul className="list-disc list-inside mb-4 text-base">
          <li>Consider making extra payments to reduce the principal faster.</li>
          <li>Refinance your loan if you find a lower interest rate.</li>
          <li>Set up automatic payments to avoid missing due dates.</li>
        </ul>
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
        <ul className="list-disc list-inside mb-4 text-base">
          <li>How accurate is this tool? - The tool provides estimates based on the inputs you provide.</li>
          <li>Can I use this for multiple loans? - Yes, you can calculate each loan separately.</li>
          <li>Is my data saved? - No, all calculations are done locally on your device.</li>
        </ul>
      </div>
    </div>
  );
};

export default StudentLoanRepaymentPlanner;


This code provides a comprehensive and user-friendly student loan repayment planner tool using Next.js and React. It includes a form for user inputs, a results section with a bar chart, tips for repayment, and a FAQ section. The page is styled with TailwindCSS for a modern and responsive design.