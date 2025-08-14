Certainly! Below is a refactored Next.js page component for the "Meal Prep vs Takeout Cost Comparison" tool. This code is organized into logical sections and uses functional React components and hooks. It includes Tailwind CSS for styling and is designed to be modular and scalable.


// /pages/tools/meal-prep-vs-takeout-cost-comparison.tsx

import React, { useState } from 'react';
import Head from 'next/head';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Download } from 'lucide-react';

interface MealCost {
  name: string;
  mealPrepCost: number;
  takeoutCost: number;
}

const defaultMeals: MealCost[] = [
  { name: 'Breakfast', mealPrepCost: 5, takeoutCost: 10 },
  { name: 'Lunch', mealPrepCost: 7, takeoutCost: 15 },
  { name: 'Dinner', mealPrepCost: 10, takeoutCost: 20 },
];

const MealPrepVsTakeoutCostComparison: React.FC = () => {
  const [meals, setMeals] = useState<MealCost[]>(defaultMeals);

  const handleInputChange = (index: number, field: keyof MealCost, value: number) => {
    const updatedMeals = [...meals];
    updatedMeals[index][field] = value;
    setMeals(updatedMeals);
  };

  const calculateTotalCosts = () => {
    return meals.reduce(
      (totals, meal) => {
        totals.mealPrep += meal.mealPrepCost;
        totals.takeout += meal.takeoutCost;
        return totals;
      },
      { mealPrep: 0, takeout: 0 }
    );
  };

  const exportCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,Meal,Meal Prep Cost,Takeout Cost\n' +
      meals.map(meal => `${meal.name},${meal.mealPrepCost},${meal.takeoutCost}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'meal_prep_vs_takeout.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalCosts = calculateTotalCosts();

  return (
    <div className="max-w-screen-md mx-auto px-4 py-8">
      <Head>
        <title>Meal Prep vs Takeout Cost Comparison</title>
        <meta name="description" content="Compare the costs of meal prepping versus takeout." />
        <meta name="keywords" content="meal prep, takeout, cost comparison, personal finance" />
        <link rel="canonical" href="https://www.expensegoose.com/tools/meal-prep-vs-takeout-cost-comparison" />
      </Head>

      <h1 className="text-3xl font-bold text-center mb-6">Meal Prep vs Takeout Cost Comparison</h1>
      <p className="text-base text-gray-700 mb-4">
        Discover how much you can save by preparing meals at home instead of ordering takeout. Enter your meal costs below to see a detailed comparison.
      </p>

      <div className="mb-8">
        {meals.map((meal, index) => (
          <div key={index} className="mb-4">
            <h2 className="text-xl font-semibold mb-2">{meal.name}</h2>
            <div className="flex space-x-4">
              <div>
                <label className="block text-gray-700">Meal Prep Cost</label>
                <input
                  type="number"
                  value={meal.mealPrepCost}
                  onChange={(e) => handleInputChange(index, 'mealPrepCost', parseFloat(e.target.value))}
                  className="border rounded-lg p-2 w-full"
                />
              </div>
              <div>
                <label className="block text-gray-700">Takeout Cost</label>
                <input
                  type="number"
                  value={meal.takeoutCost}
                  onChange={(e) => handleInputChange(index, 'takeoutCost', parseFloat(e.target.value))}
                  className="border rounded-lg p-2 w-full"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Results</h2>
        <p className="text-base text-gray-700 mb-4">
          Total Meal Prep Cost: ${totalCosts.mealPrep.toFixed(2)}
        </p>
        <p className="text-base text-gray-700 mb-4">
          Total Takeout Cost: ${totalCosts.takeout.toFixed(2)}
        </p>
        <BarChart width={500} height={300} data={meals}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="mealPrepCost" fill="#8884d8" />
          <Bar dataKey="takeoutCost" fill="#82ca9d" />
        </BarChart>
      </div>

      <button
        onClick={exportCSV}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
      >
        <Download className="inline-block mr-2" /> Export as CSV
      </button>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Tips for Saving Money</h2>
        <ul className="list-disc list-inside mb-4 text-base">
          <li>Plan your meals for the week to avoid last-minute takeout orders.</li>
          <li>Buy ingredients in bulk to save on costs.</li>
          <li>Use leftovers creatively to minimize waste.</li>
        </ul>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">How accurate are these cost comparisons?</h3>
          <p className="text-base text-gray-700">
            The accuracy depends on the data you input. Make sure to enter realistic costs for both meal prep and takeout.
          </p>
        </div>
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Can I add more meals to compare?</h3>
          <p className="text-base text-gray-700">
            Currently, the tool supports a fixed number of meals. Future updates may allow for more customization.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MealPrepVsTakeoutCostComparison;


This code includes a form for entering meal costs, a bar chart for visual comparison, and sections for tips and FAQs. It uses Tailwind CSS for styling and is designed to be responsive and accessible.