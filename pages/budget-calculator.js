import React, { useState } from 'react';
import Head from 'next/head';

const BudgetCalculator = () => {
  const [budget, setBudget] = useState({
    rent: '',
    utilities: '',
    groceries: '',
    transportation: '',
    entertainment: '',
    other: '',
  });

  const [expenses, setExpenses] = useState({
    rent: '',
    utilities: '',
    groceries: '',
    transportation: '',
    entertainment: '',
    other: '',
  });

  const [totalBudget, setTotalBudget] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);

  const handleBudgetChange = (field, value) => {
    setBudget((prev) => ({
      ...prev,
      [field]: value ? parseFloat(value) : '',
    }));
  };

  const handleExpenseChange = (field, value) => {
    setExpenses((prev) => ({
      ...prev,
      [field]: value ? parseFloat(value) : '',
    }));
  };

  const calculateTotals = () => {
    const totalBudget = Object.values(budget).reduce((acc, curr) => acc + (curr || 0), 0);
    const totalExpenses = Object.values(expenses).reduce((acc, curr) => acc + (curr || 0), 0);
    setTotalBudget(totalBudget);
    setTotalExpenses(totalExpenses);
  };

  return (
    <>
      <Head>
        <title>Budget Calculator</title>
        <meta
          name="description"
          content="Plan your finances with our Budget Calculator. Set a custom budget and compare it with your actual expenses."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://yourdomain.com/budget-calculator" />
      </Head>
      <div className="min-h-screen p-4 sm:p-6">
        <div className="container mx-auto max-w-screen-md">
          <h1 className="text-3xl font-bold mb-6 text-center">Budget Calculator</h1>
          <p className="text-lg text-gray-700 mb-6 text-center">
            Plan your finances with a custom budget and compare it with your actual expenses.
          </p>
          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Set Your Budget</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.keys(budget).map((key) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{key}</label>
                  <input
                    type="number"
                    placeholder={`Enter ${key} budget`}
                    value={budget[key]}
                    onChange={(e) => handleBudgetChange(key, e.target.value)}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
              ))}
            </div>
            <h2 className="text-xl font-bold mt-8 mb-4 text-gray-800">Enter Your Expenses</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.keys(expenses).map((key) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{key}</label>
                  <input
                    type="number"
                    placeholder={`Enter ${key} expenses`}
                    value={expenses[key]}
                    onChange={(e) => handleExpenseChange(key, e.target.value)}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-center">
              <button
                onClick={calculateTotals}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition duration-200"
              >
                Calculate Totals
              </button>
            </div>
            {totalBudget > 0 && (
              <div className="mt-6 text-center">
                <h2 className="text-2xl font-bold text-gray-900">Budget vs Expenses</h2>
                <p className="text-lg text-gray-700 mt-2">
                  <span className="font-semibold">Total Budget:</span> ${totalBudget.toFixed(2)}
                </p>
                <p className="text-lg text-gray-700 mt-2">
                  <span className="font-semibold">Total Expenses:</span> ${totalExpenses.toFixed(2)}
                </p>
                <p
                  className={`text-lg mt-4 ${
                    totalExpenses > totalBudget ? 'text-red-600' : 'text-green-600'
                  }`}
                >
                  {totalExpenses > totalBudget
                    ? `You are over budget by $${(totalExpenses - totalBudget).toFixed(2)}`
                    : `You are within budget. You have $${(totalBudget - totalExpenses).toFixed(2)} remaining.`}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BudgetCalculator;