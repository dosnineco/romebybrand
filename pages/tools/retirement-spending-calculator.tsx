import { useState } from "react";
import Head from "next/head";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import jsPDF from "jspdf";

export default function RetirementSpendingCalculatorPro() {
  const [currentSavings, setCurrentSavings] = useState<number>(0);
  const [retirementAge, setRetirementAge] = useState<number>(65);
  const [annualExpenses, setAnnualExpenses] = useState<number>(40000);
  const [yearsRetired, setYearsRetired] = useState<number>(20);
  const [inflationRate, setInflationRate] = useState<number>(2);
  const [investmentGrowthRate, setInvestmentGrowthRate] = useState<number>(5);
  const [result, setResult] = useState<number | null>(null);
  const [graphData, setGraphData] = useState<any[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let futureExpenses = annualExpenses;
    let totalNeeded = 0;
    const chartData = [];

    for (let i = 0; i < yearsRetired; i++) {
      futureExpenses *= 1 + inflationRate / 100;
      totalNeeded += futureExpenses / Math.pow(1 + investmentGrowthRate / 100, i);
      chartData.push({ year: i + 1, expenses: Math.round(futureExpenses) });
    }

    const gap = totalNeeded - currentSavings;

    setResult(gap > 0 ? gap : 0);
    setGraphData(chartData);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Retirement Spending Plan", 20, 20);
    doc.text(`Estimated additional savings needed: $${result?.toLocaleString()}`, 20, 40);
    doc.save("retirement-plan.pdf");
  };

  const handleShare = () => {
    const subject = encodeURIComponent("My Retirement Spending Plan");
    const body = encodeURIComponent(
      `Here's my retirement calculation: I need approximately $${result?.toLocaleString()} more saved.`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <>
      <Head>
        <title>Retirement Spending Calculator Pro | Expense Goose</title>
        <meta name="description" content="Pro Retirement Calculator: factor in inflation, growth rates, and export your results!" />
        <meta name="keywords" content="retirement calculator, inflation, investment returns, financial planning" />
        <link rel="canonical" href="https://www.expensegoose.com/retirement-spending-calculator" />
      </Head>

      <main className="max-w-screen-md mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-6">Retirement Spending Calculator</h1>

        <p className="text-base text-gray-700 mb-4">
          Plan your retirement confidently! Estimate how much you'll need after considering inflation and investment growth.
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Calculate Your Retirement Needs</h2>
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Form Inputs */}
            {[{
              id: 'currentSavings', label: 'Current Savings ($)', value: currentSavings, setter: setCurrentSavings,
            }, {
              id: 'retirementAge', label: 'Retirement Age', value: retirementAge, setter: setRetirementAge,
            }, {
              id: 'annualExpenses', label: 'Estimated Annual Expenses ($)', value: annualExpenses, setter: setAnnualExpenses,
            }, {
              id: 'yearsRetired', label: 'Years in Retirement', value: yearsRetired, setter: setYearsRetired,
            }, {
              id: 'inflationRate', label: 'Expected Inflation Rate (%)', value: inflationRate, setter: setInflationRate,
            }, {
              id: 'investmentGrowthRate', label: 'Expected Investment Growth Rate (%)', value: investmentGrowthRate, setter: setInvestmentGrowthRate,
            }].map(field => (
              <div key={field.id}>
                <label htmlFor={field.id} className="block text-base text-gray-700 mb-2">{field.label}</label>
                <input
                  id={field.id}
                  name={field.id}
                  type="number"
                  value={field.value}
                  onChange={(e) => field.setter(Number(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            ))}

            <button type="submit" className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500">
              Calculate
            </button>
          </form>
        </section>

        {/* Results */}
        {result !== null && (
          <section className="mb-8">
            <div className="p-4 bg-gray-100 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Results</h2>
              <p className="text-base text-gray-700 mb-4">
                Estimated additional savings needed: <span className="font-bold text-blue-600">${result.toLocaleString()}</span>
              </p>
              <div className="flex gap-4">
                <button onClick={handleExportPDF} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500">
                  Save as PDF
                </button>
                <button onClick={handleShare} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500">
                  Share via Email
                </button>
              </div>
            </div>

            {/* Graph */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Projected Annual Expenses</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={graphData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottomRight', offset: 0 }} />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="expenses" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}

        {/* Tips Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Tips to Save More for Retirement</h2>
          <ul className="list-disc list-inside text-base text-gray-700 space-y-2">
            <li>Start saving as early as possible to maximize compounding.</li>
            <li>Contribute to tax-advantaged retirement accounts.</li>
            <li>Adjust investments based on risk tolerance and age.</li>
            <li>Review your retirement plan annually.</li>
            <li>Cut unnecessary expenses to increase savings rates.</li>
          </ul>
        </section>
      </main>
    </>
  );
}
