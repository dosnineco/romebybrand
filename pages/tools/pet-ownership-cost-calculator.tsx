Certainly! Below is the refactored code for the "Pet Ownership Cost Calculator" as a Next.js page component. This code includes modular components, Tailwind CSS for styling, and a focus on accessibility and performance.


// /pages/tools/pet-ownership-cost-calculator.tsx

import React, { useState } from 'react';
import Head from 'next/head';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';

interface Category {
  name: string;
  cost: number;
}

interface UserInput {
  categories: Category[];
}

const defaultCategories: Category[] = [
  { name: 'Food', cost: 50 },
  { name: 'Vet', cost: 30 },
  { name: 'Toys', cost: 20 },
];

const PetOwnershipCostCalculator: React.FC = () => {
  const [userInput, setUserInput] = useState<UserInput>({ categories: defaultCategories });
  const [results, setResults] = useState<number>(0);

  const handleInputChange = (index: number, cost: number) => {
    const updatedCategories = [...userInput.categories];
    updatedCategories[index].cost = cost;
    setUserInput({ categories: updatedCategories });
  };

  const calculateTotalCost = () => {
    const total = userInput.categories.reduce((acc, category) => acc + category.cost, 0);
    setResults(total);
  };

  const exportCSV = () => {
    const csvContent = `data:text/csv;charset=utf-8,Category,Cost\n${userInput.categories
      .map((cat) => `${cat.name},${cat.cost}`)
      .join('\n')}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'pet_ownership_costs.csv');
    document.body.appendChild(link);
    link.click();
  };

  const chartData = userInput.categories.map((category) => ({
    name: category.name,
    cost: category.cost,
  }));

  return (
    <div className="max-w-screen-md mx-auto px-4 py-8">
      <Head>
        <title>Pet Ownership Cost Calculator</title>
        <meta name="description" content="Calculate the cost of owning a pet with our easy-to-use tool." />
        <meta name="keywords" content="pet, cost, calculator, finance" />
        <link rel="canonical" href="https://www.expensegoose.com/tools/pet-ownership-cost-calculator" />
      </Head>

      <h1 className="text-3xl font-bold text-center mb-6">Pet Ownership Cost Calculator</h1>
      <p className="text-base text-gray-700 mb-4">
        Owning a pet is a rewarding experience, but it's important to understand the financial commitment involved. Use this calculator to estimate your monthly pet ownership costs.
      </p>

      <div className="mb-4">
        {userInput.categories.map((category, index) => (
          <div key={index} className="mb-2">
            <label className="block text-base font-semibold mb-1">{category.name}</label>
            <input
              type="number"
              value={category.cost}
              onChange={(e) => handleInputChange(index, parseFloat(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg"
              aria-label={`Cost for ${category.name}`}
            />
          </div>
        ))}
      </div>

      <button
        onClick={calculateTotalCost}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 mb-4"
      >
        Calculate Total Cost
      </button>

      <h2 className="text-2xl font-semibold mb-4">Results</h2>
      <p className="text-base text-gray-700 mb-4">Total Monthly Cost: ${results}</p>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="cost" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>

      <button
        onClick={exportCSV}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 mt-4"
      >
        <Download className="inline-block mr-2" /> Export as CSV
      </button>

      <TipsSection />
      <FAQSection />
    </div>
  );
};

const TipsSection: React.FC = () => (
  <div className="mt-8">
    <h3 className="text-xl font-semibold mb-4">Tips for Reducing Pet Costs</h3>
    <ul className="list-disc list-inside mb-4 text-base">
      <li>Consider buying pet supplies in bulk to save money.</li>
      <li>Regular vet check-ups can prevent costly health issues.</li>
      <li>DIY toys and treats can be a fun and cost-effective alternative.</li>
    </ul>
  </div>
);

const FAQSection: React.FC = () => (
  <div className="mt-8">
    <h3 className="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
    <ul className="list-disc list-inside mb-4 text-base">
      <li>How accurate is this calculator? - The calculator provides an estimate based on average costs.</li>
      <li>Can I add more categories? - Currently, the tool supports predefined categories.</li>
      <li>How can I save my results? - Use the export button to download your results as a CSV file.</li>
    </ul>
  </div>
);

export default PetOwnershipCostCalculator;


This code is structured to be modular and maintainable, with separate components for tips and FAQs. It uses Tailwind CSS for styling and ensures accessibility and responsiveness. The chart is implemented using `recharts`, and the CSV export functionality is included.