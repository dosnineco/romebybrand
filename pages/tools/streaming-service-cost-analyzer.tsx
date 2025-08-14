
// /pages/tools/streaming-service-cost-analyzer.tsx

import React, { useState } from 'react';
import Head from 'next/head';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';
import { NextPage } from 'next';
import { saveAs } from 'file-saver';

// Constants
const DEFAULT_SERVICES = [
  { name: 'Netflix', cost: 15 },
  { name: 'Hulu', cost: 12 },
  { name: 'Disney+', cost: 8 },
];

// Types
interface Service {
  name: string;
  cost: number;
}

interface ChartData {
  name: string;
  cost: number;
}

// Main Component
const StreamingServiceCostAnalyzer: NextPage = () => {
  const [services, setServices] = useState<Service[]>(DEFAULT_SERVICES);
  const [newService, setNewService] = useState<Service>({ name: '', cost: 0 });
  const [chartData, setChartData] = useState<ChartData[]>(DEFAULT_SERVICES);

  // Handlers
  const handleAddService = () => {
    if (newService.name && newService.cost > 0) {
      setServices([...services, newService]);
      setChartData([...chartData, newService]);
      setNewService({ name: '', cost: 0 });
    }
  };

  const handleRemoveService = (index: number) => {
    const updatedServices = services.filter((_, i) => i !== index);
    setServices(updatedServices);
    setChartData(updatedServices);
  };

  const handleExportCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,' + services.map(s => `${s.name},${s.cost}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    saveAs(encodedUri, 'streaming-services-cost.csv');
  };

  // UI
  return (
    <div className="max-w-screen-md mx-auto px-4 py-8">
      <Head>
        <title>Streaming Service Cost Analyzer</title>
        <meta name="description" content="Analyze and manage your streaming service costs effectively." />
        <meta name="keywords" content="streaming, cost, analyzer, finance, tool" />
        <link rel="canonical" href="https://www.expensegoose.com/tools/streaming-service-cost-analyzer" />
      </Head>

      <h1 className="text-3xl font-bold text-center mb-6">Streaming Service Cost Analyzer</h1>
      <p className="text-base text-gray-700 mb-4">
        Welcome to the Streaming Service Cost Analyzer! This tool helps you keep track of your monthly expenses on streaming services. Add your services below to see a breakdown of your costs.
      </p>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Add a New Service</h2>
        <div className="flex flex-col sm:flex-row mb-4">
          <input
            type="text"
            placeholder="Service Name"
            value={newService.name}
            onChange={(e) => setNewService({ ...newService, name: e.target.value })}
            className="border p-2 mb-2 sm:mb-0 sm:mr-2 flex-grow"
          />
          <input
            type="number"
            placeholder="Monthly Cost"
            value={newService.cost}
            onChange={(e) => setNewService({ ...newService, cost: parseFloat(e.target.value) })}
            className="border p-2 mb-2 sm:mb-0 sm:mr-2 flex-grow"
          />
          <button
            onClick={handleAddService}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
          >
            Add Service
          </button>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Your Services</h2>
        <ul className="list-disc list-inside mb-4 text-base">
          {services.map((service, index) => (
            <li key={index} className="flex justify-between">
              <span>{service.name}: ${service.cost}</span>
              <button
                onClick={() => handleRemoveService(index)}
                className="text-red-500 hover:underline"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Cost Breakdown</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="cost" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Tips for Managing Streaming Costs</h2>
        <ul className="list-disc list-inside mb-4 text-base">
          <li>Regularly review your subscriptions and cancel those you don't use.</li>
          <li>Consider sharing subscriptions with family or friends to split costs.</li>
          <li>Look for bundle deals that offer multiple services at a reduced rate.</li>
        </ul>
      </div>

      <button
        onClick={handleExportCSV}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 flex items-center"
      >
        <Download className="mr-2" /> Export as CSV
      </button>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
        <FAQ />
      </div>
    </div>
  );
};

// FAQ Component
const FAQ: React.FC = () => (
  <div>
    <h3 className="text-xl font-semibold mb-4">FAQs</h3>
    <ul className="list-disc list-inside mb-4 text-base">
      <li>
        <strong>How do I add a new service?</strong>
        <p className="text-gray-700">Enter the service name and monthly cost, then click "Add Service".</p>
      </li>
      <li>
        <strong>Can I remove a service?</strong>
        <p className="text-gray-700">Yes, click "Remove" next to the service you wish to delete.</p>
      </li>
      <li>
        <strong>How do I export my data?</strong>
        <p className="text-gray-700">Click the "Export as CSV" button to download your data.</p>
      </li>
    </ul>
  </div>
);

export default StreamingServiceCostAnalyzer;


This code provides a complete Next.js page component for the "Streaming Service Cost Analyzer" tool. It includes a form for adding new services, a list of current services, a bar chart for visualizing costs, and a section for tips and FAQs. The page is styled using TailwindCSS and includes accessibility features and SEO tags.