
// /pages/tools/subscription-tracker.tsx

import React, { useState } from 'react';
import Head from 'next/head';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';
import { saveAs } from 'file-saver';
import { SubscriptionForm, FAQSection, TipsSection } from '../../components';
import { Subscription, ChartData } from '../../types';

const defaultCategories = ['Streaming', 'Utilities', 'Software', 'Other'];

const SubscriptionTracker: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  const addSubscription = (subscription: Subscription) => {
    setSubscriptions([...subscriptions, subscription]);
    updateChartData([...subscriptions, subscription]);
  };

  const removeSubscription = (index: number) => {
    const updatedSubscriptions = subscriptions.filter((_, i) => i !== index);
    setSubscriptions(updatedSubscriptions);
    updateChartData(updatedSubscriptions);
  };

  const updateChartData = (subscriptions: Subscription[]) => {
    const data = defaultCategories.map(category => {
      const total = subscriptions
        .filter(sub => sub.category === category)
        .reduce((sum, sub) => sum + sub.amount, 0);
      return { category, total };
    });
    setChartData(data);
  };

  const exportCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,'
      + subscriptions.map(sub => `${sub.name},${sub.category},${sub.amount}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    saveAs(encodedUri, 'subscriptions.csv');
  };

  return (
    <div className="max-w-screen-md mx-auto px-4 py-8">
      <Head>
        <title>Subscription Tracker</title>
        <meta name="description" content="Track your subscriptions and manage your finances effectively." />
        <meta name="keywords" content="subscription tracker, personal finance, budget management" />
        <link rel="canonical" href="https://www.expensegoose.com/tools/subscription-tracker" />
      </Head>
      <h1 className="text-3xl font-bold text-center mb-6">Subscription Tracker</h1>
      <p className="text-base text-gray-700 mb-4">
        Managing your subscriptions can be a daunting task, but with the Subscription Tracker, you can easily keep track of all your recurring expenses. Let's get started!
      </p>
      <SubscriptionForm categories={defaultCategories} onAdd={addSubscription} />
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Your Subscriptions</h2>
        <ul className="list-disc list-inside mb-4 text-base">
          {subscriptions.map((sub, index) => (
            <li key={index} className="flex justify-between">
              <span>{sub.name} - {sub.category} - ${sub.amount}</span>
              <button onClick={() => removeSubscription(index)} className="text-red-500">Remove</button>
            </li>
          ))}
        </ul>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
      <button onClick={exportCSV} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mt-4">
        <Download className="inline-block mr-2" /> Export as CSV
      </button>
      <TipsSection />
      <FAQSection />
    </div>
  );
};

export default SubscriptionTracker;

// components/SubscriptionForm.tsx
import React, { useState } from 'react';
import { Subscription } from '../types';

interface SubscriptionFormProps {
  categories: string[];
  onAdd: (subscription: Subscription) => void;
}

export const SubscriptionForm: React.FC<SubscriptionFormProps> = ({ categories, onAdd }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [amount, setAmount] = useState<number | ''>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && category && amount) {
      onAdd({ name, category, amount: Number(amount) });
      setName('');
      setAmount('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="mb-4">
        <label className="block text-gray-700">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
        >
          {categories.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.valueAsNumber || '')}
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
      </div>
      <button type="submit" className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
        Add Subscription
      </button>
    </form>
  );
};

// components/FAQSection.tsx
import React from 'react';

export const FAQSection: React.FC = () => (
  <div className="mt-8">
    <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
    <ul className="list-disc list-inside mb-4 text-base">
      <li>How do I add a subscription?</li>
      <li>Can I export my data?</li>
      <li>How do I remove a subscription?</li>
    </ul>
  </div>
);

// components/TipsSection.tsx
import React from 'react';

export const TipsSection: React.FC = () => (
  <div className="mt-8">
    <h2 className="text-2xl font-semibold mb-4">Tips for Managing Subscriptions</h2>
    <ul className="list-disc list-inside mb-4 text-base">
      <li>Review your subscriptions monthly to ensure you're not overspending.</li>
      <li>Consider annual subscriptions for services you use frequently to save money.</li>
      <li>Set reminders for subscription renewals to avoid unexpected charges.</li>
    </ul>
  </div>
);

// types/index.ts
export interface Subscription {
  name: string;
  category: string;
  amount: number;
}

export interface ChartData {
  category: string;
  total: number;
}


This refactored code organizes the Subscription Tracker tool into a main page component and separate components for the subscription form, FAQ section, and tips section. It uses Tailwind CSS for styling and includes a bar chart using Recharts. The code is modular, making it easy to add new features or categories in the future.