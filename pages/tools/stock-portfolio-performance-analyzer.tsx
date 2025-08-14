Certainly! Below is a refactored Next.js page component for the "Stock Portfolio Performance Analyzer" tool. This code is structured to be maintainable, scalable, and accessible, using Tailwind CSS for styling and TypeScript for type safety.


// /pages/tools/stock-portfolio-performance-analyzer.tsx

import React, { useState } from 'react';
import Head from 'next/head';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Download } from 'lucide-react';

interface StockData {
  name: string;
  initialInvestment: number;
  currentValue: number;
}

const defaultStocks: StockData[] = [
  { name: 'AAPL', initialInvestment: 1000, currentValue: 1500 },
  { name: 'GOOGL', initialInvestment: 2000, currentValue: 2500 },
];

const StockPortfolioPerformanceAnalyzer: React.FC = () => {
  const [stocks, setStocks] = useState<StockData[]>(defaultStocks);
  const [newStock, setNewStock] = useState<StockData>({ name: '', initialInvestment: 0, currentValue: 0 });

  const handleAddStock = () => {
    setStocks([...stocks, newStock]);
    setNewStock({ name: '', initialInvestment: 0, currentValue: 0 });
  };

  const handleRemoveStock = (index: number) => {
    setStocks(stocks.filter((_, i) => i !== index));
  };

  const calculatePerformance = () => {
    return stocks.map(stock => ({
      name: stock.name,
      performance: ((stock.currentValue - stock.initialInvestment) / stock.initialInvestment) * 100,
    }));
  };

  const exportCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,' + stocks.map(stock => `${stock.name},${stock.initialInvestment},${stock.currentValue}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'stock_performance.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const performanceData = calculatePerformance();

  return (
    <div className="max-w-screen-md mx-auto px-4 py-8">
      <Head>
        <title>Stock Portfolio Performance Analyzer</title>
        <meta name="description" content="Analyze your stock portfolio performance with our free tool." />
        <meta name="keywords" content="stock, portfolio, performance, analyzer, finance" />
        <link rel="canonical" href="https://www.expensegoose.com/tools/stock-portfolio-performance-analyzer" />
      </Head>
      <h1 className="text-3xl font-bold text-center mb-6">Stock Portfolio Performance Analyzer</h1>
      <p className="text-base text-gray-700 mb-4">
        Welcome to the Stock Portfolio Performance Analyzer. This tool helps you track and analyze the performance of your stock investments. Simply enter your stock details below to get started.
      </p>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Add Stock</h2>
        <div className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Stock Name"
            value={newStock.name}
            onChange={(e) => setNewStock({ ...newStock, name: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Initial Investment"
            value={newStock.initialInvestment}
            onChange={(e) => setNewStock({ ...newStock, initialInvestment: Number(e.target.value) })}
            className="border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Current Value"
            value={newStock.currentValue}
            onChange={(e) => setNewStock({ ...newStock, currentValue: Number(e.target.value) })}
            className="border p-2 rounded"
          />
          <button onClick={handleAddStock} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300">
            Add Stock
          </button>
        </div>
      </div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Your Portfolio</h2>
        <ul className="list-disc list-inside mb-4 text-base">
          {stocks.map((stock, index) => (
            <li key={index} className="flex justify-between items-center">
              <span>{stock.name}: Initial ${stock.initialInvestment}, Current ${stock.currentValue}</span>
              <button onClick={() => handleRemoveStock(index)} className="text-red-500 hover:underline">
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Performance Chart</h2>
        <BarChart width={600} height={300} data={performanceData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="performance" fill="#8884d8" />
        </BarChart>
      </div>
      <div className="mb-8">
        <button onClick={exportCSV} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 flex items-center">
          <Download className="mr-2" /> Export as CSV
        </button>
      </div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Tips for Better Portfolio Management</h2>
        <ul className="list-disc list-inside mb-4 text-base">
          <li>Regularly review your portfolio to ensure it aligns with your financial goals.</li>
          <li>Diversify your investments to minimize risk.</li>
          <li>Stay informed about market trends and news.</li>
          <li>Consider consulting with a financial advisor for personalized advice.</li>
        </ul>
      </div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
        <ul className="list-disc list-inside mb-4 text-base">
          <li>
            <strong>How do I add a new stock?</strong> - Use the form above to enter the stock name, initial investment, and current value, then click "Add Stock".
          </li>
          <li>
            <strong>Can I remove a stock?</strong> - Yes, click the "Remove" button next to the stock you wish to delete.
          </li>
          <li>
            <strong>How is performance calculated?</strong> - Performance is calculated as the percentage change from the initial investment to the current value.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default StockPortfolioPerformanceAnalyzer;


This code includes a form for adding stocks, a list of current stocks, a performance chart using `recharts`, and a section for exporting data as CSV. It also includes a tips section and an FAQ section to enhance user engagement. The page is styled using Tailwind CSS for a modern and responsive design.