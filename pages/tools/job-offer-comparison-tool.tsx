
// /pages/tools/job-offer-comparison-tool.tsx

import React, { useState } from 'react';
import Head from 'next/head';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';
import { saveAs } from 'file-saver';
import { NextPage } from 'next';
import { JobOfferComparisonForm } from '../../components/JobOfferComparisonForm';
import { FAQSection } from '../../components/FAQSection';
import { TipsSection } from '../../components/TipsSection';

interface JobOffer {
  companyName: string;
  salary: number;
  benefits: number;
  workLifeBalance: number;
}

const defaultJobOffers: JobOffer[] = [
  { companyName: 'Company A', salary: 70000, benefits: 5000, workLifeBalance: 8 },
  { companyName: 'Company B', salary: 75000, benefits: 4000, workLifeBalance: 7 },
];

const JobOfferComparisonTool: NextPage = () => {
  const [jobOffers, setJobOffers] = useState<JobOffer[]>(defaultJobOffers);
  const [chartData, setChartData] = useState<any[]>([]);

  const calculateResults = () => {
    const data = jobOffers.map((offer) => ({
      name: offer.companyName,
      Total: offer.salary + offer.benefits + offer.workLifeBalance * 1000,
    }));
    setChartData(data);
  };

  const handleAddOffer = (newOffer: JobOffer) => {
    setJobOffers([...jobOffers, newOffer]);
  };

  const handleExportCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,'
      + 'Company Name,Salary,Benefits,Work-Life Balance\n'
      + jobOffers.map(offer => `${offer.companyName},${offer.salary},${offer.benefits},${offer.workLifeBalance}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    saveAs(encodedUri, 'job-offer-comparison.csv');
  };

  return (
    <div className="max-w-screen-md mx-auto px-4 py-8">
      <Head>
        <title>Job Offer Comparison Tool</title>
        <meta name="description" content="Compare job offers based on salary, benefits, and work-life balance." />
        <meta name="keywords" content="job offer, comparison, salary, benefits, work-life balance" />
        <link rel="canonical" href="https://www.expensegoose.com/tools/job-offer-comparison-tool" />
      </Head>

      <h1 className="text-3xl font-bold text-center mb-6">Job Offer Comparison Tool</h1>
      <p className="text-base text-gray-700 mb-4">
        Welcome to the Job Offer Comparison Tool. Here, you can compare different job offers based on salary, benefits, and work-life balance. Simply enter the details of each offer, and we'll help you visualize and compare them.
      </p>

      <JobOfferComparisonForm onAddOffer={handleAddOffer} />

      <div className="my-8">
        <button
          onClick={calculateResults}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
        >
          Calculate Results
        </button>
      </div>

      {chartData.length > 0 && (
        <div className="mb-8">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Total" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="mb-8">
        <button
          onClick={handleExportCSV}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
        >
          <Download className="inline-block mr-2" /> Export as CSV
        </button>
      </div>

      <TipsSection />

      <FAQSection />
    </div>
  );
};

export default JobOfferComparisonTool;

// components/JobOfferComparisonForm.tsx
import React, { useState } from 'react';

interface JobOfferComparisonFormProps {
  onAddOffer: (offer: JobOffer) => void;
}

export const JobOfferComparisonForm: React.FC<JobOfferComparisonFormProps> = ({ onAddOffer }) => {
  const [companyName, setCompanyName] = useState('');
  const [salary, setSalary] = useState(0);
  const [benefits, setBenefits] = useState(0);
  const [workLifeBalance, setWorkLifeBalance] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddOffer({ companyName, salary, benefits, workLifeBalance });
    setCompanyName('');
    setSalary(0);
    setBenefits(0);
    setWorkLifeBalance(0);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="companyName">Company Name</label>
        <input
          type="text"
          id="companyName"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="salary">Salary</label>
        <input
          type="number"
          id="salary"
          value={salary}
          onChange={(e) => setSalary(Number(e.target.value))}
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="benefits">Benefits</label>
        <input
          type="number"
          id="benefits"
          value={benefits}
          onChange={(e) => setBenefits(Number(e.target.value))}
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="workLifeBalance">Work-Life Balance (1-10)</label>
        <input
          type="number"
          id="workLifeBalance"
          value={workLifeBalance}
          onChange={(e) => setWorkLifeBalance(Number(e.target.value))}
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
      </div>
      <button type="submit" className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300">
        Add Offer
      </button>
    </form>
  );
};

// components/FAQSection.tsx
import React from 'react';

export const FAQSection: React.FC = () => (
  <section className="mb-8">
    <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
    <ul className="list-disc list-inside mb-4 text-base">
      <li>How do I use this tool?</li>
      <li>What factors should I consider when comparing job offers?</li>
      <li>Can I export my results?</li>
    </ul>
  </section>
);

// components/TipsSection.tsx
import React from 'react';

export const TipsSection: React.FC = () => (
  <section className="mb-8">
    <h2 className="text-2xl font-semibold mb-4">Tips for Comparing Job Offers</h2>
    <ul className="list-disc list-inside mb-4 text-base">
      <li>Consider the total compensation package, not just the salary.</li>
      <li>Think about long-term growth opportunities.</li>
      <li>Evaluate the company culture and work-life balance.</li>
    </ul>
  </section>
);


This refactored code organizes the tool into separate components for better maintainability and scalability. It uses Tailwind CSS for styling and ensures accessibility and responsiveness. The code is structured to make it easy to add new features or categories in the future.