import { useState } from "react";
import Head from "next/head";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function RelocationCalculator() {
  const [currentCityCost, setCurrentCityCost] = useState<number>(3000); // Default cost in current city
  const [newCityCost, setNewCityCost] = useState<number>(3500); // Default cost in new city
  const [monthlyDifference, setMonthlyDifference] = useState<number | null>(null);
  const [graphData, setGraphData] = useState<any[]>([]);

  const calculateDifference = () => {
    const difference = newCityCost - currentCityCost;
    setMonthlyDifference(difference);

    // Generate graph data
    const data = [];
    for (let i = 1; i <= 12; i++) {
      data.push({
        month: `Month ${i}`,
        difference: difference * i,
      });
    }
    setGraphData(data);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateDifference();
  };

  return (
    <>
      <Head>
        <title>Relocation Calculator | Compare Moving Expenses</title>
        <meta
          name="description"
          content="Use our Relocation Calculator to compare expenses between your current city and a new city. Plan your move with confidence."
        />
        <meta
          name="keywords"
          content="relocation calculator, moving expenses, cost of living comparison, city comparison"
        />
        <link rel="canonical" href="https://www.expensegoose.com/tools/relocation-calculator" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Relocation Calculator",
              "description": "Compare expenses when moving to a new city.",
              "applicationCategory": "FinanceApplication",
              "operatingSystem": "Web",
              "url": "https://www.expensegoose.com/tools/relocation-calculator",
            }),
          }}
        />
      </Head>

      <main className="max-w-screen-md mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-6">Relocation Calculator</h1>

        <p className="text-base text-gray-700 mb-4">
          Use our Relocation Calculator to compare expenses between your current city and a new city. Plan your move with confidence.
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Compare Your Living Costs</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="currentCityCost" className="block text-base text-gray-700 mb-2">
                Monthly Cost in Current City ($)
              </label>
              <input
                id="currentCityCost"
                name="currentCityCost"
                type="number"
                value={currentCityCost}
                onChange={(e) => setCurrentCityCost(Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="newCityCost" className="block text-base text-gray-700 mb-2">
                Monthly Cost in New City ($)
              </label>
              <input
                id="newCityCost"
                name="newCityCost"
                type="number"
                value={newCityCost}
                onChange={(e) => setNewCityCost(Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
            >
              Calculate
            </button>
          </form>
        </section>

        {monthlyDifference !== null && (
          <>
            <section className="mb-8">
              <div className="p-4 bg-gray-100 rounded-lg">
                <h2 className="text-2xl font-semibold mb-4">Results</h2>
                <p className="text-base text-gray-700 mb-4">
                  The monthly difference in living costs is:{" "}
                  <span className="font-bold text-blue-600">${monthlyDifference.toFixed(2)}</span>
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Cumulative Cost Difference Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={graphData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" label={{ value: "Month", position: "insideBottomRight", offset: 0 }} />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="difference" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </section>
          </>
        )}

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Tips for Relocating</h2>
          <ul className="list-disc list-inside mb-4 text-base">
            <li>Research the cost of living in the new city before making a decision.</li>
            <li>Consider additional expenses like moving costs and utility setup fees.</li>
            <li>Plan your budget to account for unexpected expenses during the move.</li>
            <li>Look for ways to save, such as downsizing or finding discounts on moving services.</li>
          </ul>
        </section>
      </main>
    </>
  );
}