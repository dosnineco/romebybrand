
// /pages/tools/personal-luxury-impact-calculator.tsx

import React, { useState } from 'react';
import Head from 'next/head';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';
import { saveAs } from 'file-saver';

// Constants
const DEFAULT_CATEGORIES = [
  { name: 'Dining Out', impact: 0 },
  { name: 'Travel', impact: 0 },
  { name: 'Shopping', impact: 0 },
];

// Types
interface Category {
  name: string;
  impact: number;
}

interface ChartData {
  name: string;
  impact: number;
}

// Main Component
const PersonalLuxuryImpactCalculator: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  // Handlers
  const handleImpactChange = (index: number, value: number) => {
    const updatedCategories = [...categories];
    updatedCategories[index].impact = value;
    setCategories(updatedCategories);
    updateChartData(updatedCategories);
  };

  const updateChartData = (categories: Category[]) => {
    const data = categories.map((category) => ({
      name: category.name,
      impact: category.impact,
    }));
    setChartData(data);
  };

  const exportCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,'
      + categories.map(c => `${c.name},${c.impact}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    saveAs(encodedUri, 'personal_luxury_impact.csv');
  };

  // UI
  return (
    <div className="max-w-screen-md mx-auto px-4 py-8">
      <Head>
        <title>Personal Luxury Impact Calculator</title>
        <meta name="description" content="Calculate the impact of your luxury spending on personal finance." />
        <meta name="keywords" content="personal finance, luxury spending, impact calculator" />
        <link rel="canonical" href="https://www.expensegoose.com/tools/personal-luxury-impact-calculator" />
      </Head>

      <h1 className="text-3xl font-bold text-center mb-6">Personal Luxury Impact Calculator</h1>
      <p className="text-base text-gray-700 mb-4">
        Discover how your luxury spending habits impact your personal finances. Adjust the categories below to see your results.
      </p>

      <div>
        {categories.map((category, index) => (
          <div key={index} className="mb-4">
            <label className="block text-xl font-semibold mb-2">{category.name}</label>
            <input
              type="number"
              value={category.impact}
              onChange={(e) => handleImpactChange(index, parseFloat(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded"
              aria-label={`Impact of ${category.name}`}
            />
          </div>
        ))}
      </div>

      <div className="my-8">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="impact" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <button
        onClick={exportCSV}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
      >
        <Download className="inline-block mr-2" /> Export as CSV
      </button>

      <TipsSection />
      <FAQSection />
    </div>
  );
};

// Tips Section Component
const TipsSection: React.FC = () => (
  <section className="mt-8">
    <h2 className="text-2xl font-semibold mb-4">Tips for Reducing Luxury Spending</h2>
    <ul className="list-disc list-inside mb-4 text-base">
      <li>Set a monthly budget for luxury expenses and stick to it.</li>
      <li>Identify non-essential items and consider cutting back.</li>
      <li>Plan luxury purchases in advance to avoid impulse buying.</li>
    </ul>
  </section>
);

// FAQ Section Component
const FAQSection: React.FC = () => (
  <section className="mt-8">
    <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
    <ul className="list-disc list-inside mb-4 text-base">
      <li>
        <strong>How does this calculator work?</strong>
        <p className="text-base text-gray-700 mb-4">
          Enter your estimated monthly spending in each category to see the impact on your finances.
        </p>
      </li>
      <li>
        <strong>Can I add more categories?</strong>
        <p className="text-base text-gray-700 mb-4">
          Currently, the tool supports predefined categories. Future updates may allow custom categories.
        </p>
      </li>
    </ul>
  </section>
);

export default PersonalLuxuryImpactCalculator;


This code provides a structured and modular Next.js page component for the "Personal Luxury Impact Calculator" tool. It includes a main component with state management, handlers, and UI rendering, as well as separate components for the Tips and FAQ sections. The page is styled using TailwindCSS for a modern and responsive design, and it includes features like CSV export and a bar chart visualization.