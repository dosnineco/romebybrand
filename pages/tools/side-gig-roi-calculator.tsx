
// /pages/tools/side-gig-roi-calculator.tsx

import React, { useState } from 'react';
import Head from 'next/head';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';
import { saveAs } from 'file-saver';

// Constants
const DEFAULT_CATEGORIES = [
  { name: 'Freelancing', rate: 50 },
  { name: 'Tutoring', rate: 30 },
  { name: 'Delivery', rate: 20 },
];

// Types
interface Category {
  name: string;
  rate: number;
}

interface UserInput {
  hours: number;
  category: string;
}

// Main Component
const SideGigROICalculator: React.FC = () => {
  // State
  const [userInputs, setUserInputs] = useState<UserInput[]>([]);
  const [results, setResults] = useState<number[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  // Handlers
  const handleAddInput = () => {
    setUserInputs([...userInputs, { hours: 0, category: DEFAULT_CATEGORIES[0].name }]);
  };

  const handleInputChange = (index: number, field: keyof UserInput, value: string | number) => {
    const newInputs = [...userInputs];
    newInputs[index][field] = field === 'hours' ? Number(value) : value;
    setUserInputs(newInputs);
  };

  const calculateResults = () => {
    const newResults = userInputs.map(input => {
      const category = DEFAULT_CATEGORIES.find(cat => cat.name === input.category);
      return category ? input.hours * category.rate : 0;
    });
    setResults(newResults);
    prepareChartData(newResults);
  };

  const prepareChartData = (results: number[]) => {
    const data = userInputs.map((input, index) => ({
      name: input.category,
      Hours: input.hours,
      Earnings: results[index],
    }));
    setChartData(data);
  };

  const exportCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,Category,Hours,Earnings\n' +
      chartData.map(d => `${d.name},${d.Hours},${d.Earnings}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    saveAs(encodedUri, 'side-gig-roi.csv');
  };

  // UI
  return (
    <div className="max-w-screen-md mx-auto px-4 py-8">
      <Head>
        <title>Side Gig ROI Calculator</title>
        <meta name="description" content="Calculate the return on investment for your side gigs." />
        <meta name="keywords" content="side gig, ROI, calculator, finance" />
        <link rel="canonical" href="https://www.expensegoose.com/tools/side-gig-roi-calculator" />
      </Head>

      <h1 className="text-3xl font-bold text-center mb-6">Side Gig ROI Calculator</h1>
      <p className="text-base text-gray-700 mb-4">
        Welcome to the Side Gig ROI Calculator! This tool helps you estimate the return on investment for your side gigs. Simply enter the hours you plan to work and select the type of gig, and we'll calculate your potential earnings.
      </p>

      <div className="mb-4">
        {userInputs.map((input, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="number"
              value={input.hours}
              onChange={(e) => handleInputChange(index, 'hours', e.target.value)}
              className="border rounded px-2 py-1 mr-2"
              aria-label="Hours"
            />
            <select
              value={input.category}
              onChange={(e) => handleInputChange(index, 'category', e.target.value)}
              className="border rounded px-2 py-1"
              aria-label="Category"
            >
              {DEFAULT_CATEGORIES.map((category, idx) => (
                <option key={idx} value={category.name}>{category.name}</option>
              ))}
            </select>
          </div>
        ))}
        <button onClick={handleAddInput} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300">
          Add Another Gig
        </button>
      </div>

      <button onClick={calculateResults} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 mb-4">
        Calculate ROI
      </button>

      {results.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Results</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Earnings" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>

          <button onClick={exportCSV} className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 mt-4">
            <Download className="mr-2" /> Export as CSV
          </button>

          <TipsSection />
        </div>
      )}

      <FAQSection />
    </div>
  );
};

// Tips Section Component
const TipsSection: React.FC = () => (
  <div className="mt-8">
    <h3 className="text-xl font-semibold mb-4">Tips for Maximizing Your Side Gig ROI</h3>
    <ul className="list-disc list-inside mb-4 text-base">
      <li>Track your time and earnings to identify the most profitable gigs.</li>
      <li>Consider skill development to increase your hourly rate.</li>
      <li>Network with others in your field to discover new opportunities.</li>
    </ul>
  </div>
);

// FAQ Section Component
const FAQSection: React.FC = () => (
  <div className="mt-8">
    <h3 className="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
    <ul className="list-disc list-inside mb-4 text-base">
      <li><strong>How accurate are the earnings estimates?</strong> The estimates are based on average rates and may vary based on your experience and location.</li>
      <li><strong>Can I add my own categories?</strong> Currently, you can only select from predefined categories, but we plan to add this feature soon.</li>
      <li><strong>How can I improve my ROI?</strong> Focus on high-demand skills and efficient time management to maximize your earnings.</li>
    </ul>
  </div>
);

export default SideGigROICalculator;


This code provides a comprehensive and modular implementation of the "Side Gig ROI Calculator" tool using Next.js and TypeScript. It includes a main component for the calculator, separate components for tips and FAQs, and uses TailwindCSS for styling. The code is organized into logical sections, ensuring maintainability and scalability.