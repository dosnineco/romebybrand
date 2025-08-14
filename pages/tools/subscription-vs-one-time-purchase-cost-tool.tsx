
// /pages/tools/subscription-vs-one-time-purchase-cost-tool.tsx

import React, { useState } from 'react';
import Head from 'next/head';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';
import { saveAs } from 'file-saver';
import { NextPage } from 'next';
import { SubscriptionForm, FAQSection, TipsSection } from '../../components';

interface UserInput {
  name: string;
  subscriptionCost: number;
  oneTimeCost: number;
}

const defaultCategories: UserInput[] = [
  { name: 'Software A', subscriptionCost: 10, oneTimeCost: 100 },
  { name: 'Software B', subscriptionCost: 20, oneTimeCost: 150 },
];

const SubscriptionVsOneTimePurchaseCostTool: NextPage = () => {
  const [categories, setCategories] = useState<UserInput[]>(defaultCategories);
  const [results, setResults] = useState<{ name: string; totalCost: number }[]>([]);

  const calculateResults = () => {
    const calculatedResults = categories.map((category) => ({
      name: category.name,
      totalCost: category.subscriptionCost * 12, // Assuming annual cost for subscription
    }));
    setResults(calculatedResults);
  };

  const handleAddCategory = () => {
    setCategories([...categories, { name: '', subscriptionCost: 0, oneTimeCost: 0 }]);
  };

  const handleRemoveCategory = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  const handleInputChange = (index: number, field: keyof UserInput, value: string | number) => {
    const updatedCategories = [...categories];
    updatedCategories[index][field] = typeof value === 'string' ? value : Number(value);
    setCategories(updatedCategories);
  };

  const exportCSV = () => {
    const csvContent = `data:text/csv;charset=utf-8,Name,Subscription Cost,One-Time Cost\n${categories
      .map((c) => `${c.name},${c.subscriptionCost},${c.oneTimeCost}`)
      .join('\n')}`;
    const encodedUri = encodeURI(csvContent);
    saveAs(encodedUri, 'subscription_vs_one_time_cost.csv');
  };

  return (
    <div className="max-w-screen-md mx-auto px-4 py-8">
      <Head>
        <title>Subscription vs One-Time Purchase Cost Tool</title>
        <meta name="description" content="Compare subscription costs with one-time purchase costs to make informed financial decisions." />
        <meta name="keywords" content="subscription, one-time purchase, cost comparison, finance tool" />
        <link rel="canonical" href="https://www.expensegoose.com/tools/subscription-vs-one-time-purchase-cost-tool" />
      </Head>
      <h1 className="text-3xl font-bold text-center mb-6">Subscription vs One-Time Purchase Cost Tool</h1>
      <p className="text-base text-gray-700 mb-4">
        Welcome to the Subscription vs One-Time Purchase Cost Tool. Here, you can compare the costs of subscriptions against one-time purchases to help you make informed financial decisions. Simply enter the details of your subscriptions and one-time purchases, and we'll do the rest!
      </p>
      <SubscriptionForm
        categories={categories}
        onAddCategory={handleAddCategory}
        onRemoveCategory={handleRemoveCategory}
        onInputChange={handleInputChange}
      />
      <button
        onClick={calculateResults}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 mb-4"
      >
        Calculate
      </button>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={results}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="totalCost" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
      <button
        onClick={exportCSV}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 mt-4 flex items-center"
      >
        <Download className="mr-2" /> Export CSV
      </button>
      <TipsSection />
      <FAQSection />
    </div>
  );
};

export default SubscriptionVsOneTimePurchaseCostTool;

// components/SubscriptionForm.tsx
import React from 'react';

interface SubscriptionFormProps {
  categories: UserInput[];
  onAddCategory: () => void;
  onRemoveCategory: (index: number) => void;
  onInputChange: (index: number, field: keyof UserInput, value: string | number) => void;
}

export const SubscriptionForm: React.FC<SubscriptionFormProps> = ({
  categories,
  onAddCategory,
  onRemoveCategory,
  onInputChange,
}) => (
  <div>
    {categories.map((category, index) => (
      <div key={index} className="mb-4">
        <input
          type="text"
          value={category.name}
          onChange={(e) => onInputChange(index, 'name', e.target.value)}
          placeholder="Name"
          className="border p-2 rounded mb-2 w-full"
        />
        <input
          type="number"
          value={category.subscriptionCost}
          onChange={(e) => onInputChange(index, 'subscriptionCost', e.target.value)}
          placeholder="Subscription Cost"
          className="border p-2 rounded mb-2 w-full"
        />
        <input
          type="number"
          value={category.oneTimeCost}
          onChange={(e) => onInputChange(index, 'oneTimeCost', e.target.value)}
          placeholder="One-Time Cost"
          className="border p-2 rounded mb-2 w-full"
        />
        <button
          onClick={() => onRemoveCategory(index)}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-300"
        >
          Remove
        </button>
      </div>
    ))}
    <button
      onClick={onAddCategory}
      className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:ring-2 focus:ring-green-300"
    >
      Add Category
    </button>
  </div>
);

// components/FAQSection.tsx
import React from 'react';

export const FAQSection: React.FC = () => (
  <div className="mt-8">
    <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
    <ul className="list-disc list-inside mb-4 text-base">
      <li>How do I use this tool?</li>
      <li>What is the difference between subscription and one-time purchase?</li>
      <li>Can I export my results?</li>
    </ul>
  </div>
);

// components/TipsSection.tsx
import React from 'react';

export const TipsSection: React.FC = () => (
  <div className="mt-8">
    <h2 className="text-2xl font-semibold mb-4">Tips for Using the Tool</h2>
    <ul className="list-disc list-inside mb-4 text-base">
      <li>Consider the long-term costs of subscriptions.</li>
      <li>Think about how often you use the service or product.</li>
      <li>Use the export feature to keep a record of your comparisons.</li>
    </ul>
  </div>
);


This code is structured to be modular and maintainable, with separate components for the subscription form, FAQ section, and tips section. It uses Tailwind CSS for styling and includes a bar chart for visualizing the results. The page is designed to be responsive and accessible, with clear naming conventions and comments for readability.