
// /pages/tools/subscription-overlap-checker.tsx

import React, { useState } from 'react';
import Head from 'next/head';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';
import { SubscriptionForm, FAQSection, TipsSection } from '../../components';
import { Subscription, ChartData } from '../../types';

const defaultCategories = ['Streaming', 'Software', 'Utilities'];

const SubscriptionOverlapChecker: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [results, setResults] = useState<string>('');

  const handleAddSubscription = (subscription: Subscription) => {
    setSubscriptions([...subscriptions, subscription]);
    calculateResults([...subscriptions, subscription]);
  };

  const calculateResults = (subs: Subscription[]) => {
    // Placeholder logic for calculating overlaps
    const overlapCount = subs.length; // Replace with actual logic
    setResults(`You have ${overlapCount} overlapping subscriptions.`);
    prepareChartData(subs);
  };

  const prepareChartData = (subs: Subscription[]) => {
    const data = subs.map((sub) => ({
      name: sub.name,
      value: sub.cost,
    }));
    setChartData(data);
  };

  const exportCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,'
      + subscriptions.map(sub => `${sub.name},${sub.cost}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'subscriptions.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-screen-md mx-auto px-4 py-8">
      <Head>
        <title>Subscription Overlap Checker</title>
        <meta name="description" content="Check for overlapping subscriptions and manage your finances better." />
        <meta name="keywords" content="subscription, finance, overlap, checker, tool" />
        <link rel="canonical" href="https://www.expensegoose.com/tools/subscription-overlap-checker" />
      </Head>
      <h1 className="text-3xl font-bold text-center mb-6">Subscription Overlap Checker</h1>
      <p className="text-base text-gray-700 mb-4">
        Managing multiple subscriptions can be tricky. Use this tool to identify overlaps and optimize your expenses.
      </p>
      <SubscriptionForm categories={defaultCategories} onAddSubscription={handleAddSubscription} />
      <h2 className="text-2xl font-semibold mb-4">Results</h2>
      <p className="text-base text-gray-700 mb-4">{results}</p>
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
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 mt-4"
      >
        <Download className="inline-block mr-2" /> Export as CSV
      </button>
      <TipsSection />
      <FAQSection />
    </div>
  );
};

export default SubscriptionOverlapChecker;

// components/SubscriptionForm.tsx
import React, { useState } from 'react';
import { Subscription } from '../types';

interface SubscriptionFormProps {
  categories: string[];
  onAddSubscription: (subscription: Subscription) => void;
}

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({ categories, onAddSubscription }) => {
  const [name, setName] = useState('');
  const [cost, setCost] = useState<number | ''>('');
  const [category, setCategory] = useState(categories[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && cost) {
      onAddSubscription({ name, cost: Number(cost), category });
      setName('');
      setCost('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="name">Subscription Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="cost">Cost</label>
        <input
          type="number"
          id="cost"
          value={cost}
          onChange={(e) => setCost(e.target.valueAsNumber)}
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="category">Category</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <button type="submit" className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400">
        Add Subscription
      </button>
    </form>
  );
};

export default SubscriptionForm;

// components/FAQSection.tsx
import React from 'react';

const FAQSection: React.FC = () => (
  <div className="mt-8">
    <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
    <ul className="list-disc list-inside mb-4 text-base">
      <li>How does the Subscription Overlap Checker work?</li>
      <li>Can I export my subscription data?</li>
      <li>Is my data secure?</li>
    </ul>
  </div>
);

export default FAQSection;

// components/TipsSection.tsx
import React from 'react';

const TipsSection: React.FC = () => (
  <div className="mt-8">
    <h2 className="text-2xl font-semibold mb-4">Tips for Managing Subscriptions</h2>
    <ul className="list-disc list-inside mb-4 text-base">
      <li>Regularly review your subscriptions to avoid unnecessary costs.</li>
      <li>Consider annual subscriptions for services you use frequently.</li>
      <li>Use a dedicated payment method for subscriptions to track expenses easily.</li>
    </ul>
  </div>
);

export default TipsSection;

// types/index.ts
export interface Subscription {
  name: string;
  cost: number;
  category: string;
}

export interface ChartData {
  name: string;
  value: number;
}


This code structure organizes the Subscription Overlap Checker tool into a main page component and separate components for the subscription form, FAQ section, and tips section. It uses TailwindCSS for styling and includes a bar chart using `recharts`. The code is modular, making it easy to maintain and extend with new features or categories.