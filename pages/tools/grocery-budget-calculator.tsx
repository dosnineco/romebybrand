import { useState } from "react";
import Head from "next/head";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import SignUpBanner from "../../components/Misc/SignUpBanner";

export default function GroceryBudgetCalculator() {
  const [monthlyIncome, setMonthlyIncome] = useState<number>(5000); // Default income
  const [groceryPercentage, setGroceryPercentage] = useState<number>(10); // Default percentage
  const [groceryBudget, setGroceryBudget] = useState<number | null>(null);
  const [graphData, setGraphData] = useState<any[]>([]);

  const calculateBudget = () => {
    const budget = (monthlyIncome * groceryPercentage) / 100;
    setGroceryBudget(budget);

    // Generate graph data
    const data = [];
    for (let i = 1; i <= 12; i++) {
      data.push({
        month: `Month ${i}`,
        budget: budget,
      });
    }
    setGraphData(data);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateBudget();
  };

  return (
    <>
      <Head>
        <title>Grocery Budget Calculator | Plan Your Monthly Grocery Spending</title>
        <meta
          name="description"
          content="Use our Grocery Budget Calculator to set your monthly grocery spending based on your income. Plan your budget with ease and confidence."
        />
        <meta
          name="keywords"
          content="grocery budget calculator, budget planning, monthly grocery spending, financial planning"
        />
        <link rel="canonical" href="https://www.expensegoose.com/tools/grocery-budget-calculator" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Grocery Budget Calculator",
              "description": "Set your monthly grocery spending based on your income.",
              "applicationCategory": "FinanceApplication",
              "operatingSystem": "Web",
              "url": "https://www.expensegoose.com/tools/grocery-budget-calculator",
            }),
          }}
        />
      </Head>

      <main className="max-w-screen-md mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-6">Grocery Budget Calculator</h1>

        <p className="text-base text-gray-700 mb-4">
          Use our Grocery Budget Calculator to set your monthly grocery spending based on your income. Plan your budget with ease and confidence.
        </p>
        <SignUpBanner/>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Calculate Your Grocery Budget</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="monthlyIncome" className="block text-base text-gray-700 mb-2">
                Monthly Income ($)
              </label>
              <input
                id="monthlyIncome"
                name="monthlyIncome"
                type="number"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="groceryPercentage" className="block text-base text-gray-700 mb-2">
                Grocery Budget Percentage (%)
              </label>
              <input
                id="groceryPercentage"
                name="groceryPercentage"
                type="number"
                value={groceryPercentage}
                onChange={(e) => setGroceryPercentage(Number(e.target.value))}
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

        {groceryBudget !== null && (
          <>
            <section className="mb-8">
              <div className="p-4 bg-gray-100 rounded-lg">
                <h2 className="text-2xl font-semibold mb-4">Results</h2>
                <p className="text-base text-gray-700 mb-4">
                  Your estimated monthly grocery budget is:{" "}
                  <span className="font-bold text-blue-600">${groceryBudget.toFixed(2)}</span>
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Grocery Budget Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={graphData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" label={{ value: "Month", position: "insideBottomRight", offset: 0 }} />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="budget" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </section>
          </>
        )}

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Tips for Managing Your Grocery Budget</h2>
          <ul className="list-disc list-inside mb-4 text-base">
            <li>Plan your meals in advance to avoid overspending.</li>
            <li>Shop with a list to stay focused on your budget.</li>
            <li>Look for discounts and coupons to save money.</li>
            <li>Buy in bulk for non-perishable items to reduce costs.</li>
          </ul>
        </section>
      </main>
    </>
  );
}