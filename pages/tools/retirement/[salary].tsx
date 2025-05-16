import { useState, useEffect } from "react";
import Head from "next/head";
import { supabase } from "../../../lib/supabase";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import SignUpBanner from "../../../components/Misc/SignUpBanner";

export default function RetirementCalculator({ salary }: { salary: number }) {
  const [currentSavings, setCurrentSavings] = useState<number>(0);
  const [retirementAge, setRetirementAge] = useState<number>(65);
  const [annualExpenses, setAnnualExpenses] = useState<number>(salary);
  const [yearsRetired, setYearsRetired] = useState<number>(20);
  const [inflationRate, setInflationRate] = useState<number>(2);
  const [investmentGrowthRate, setInvestmentGrowthRate] = useState<number>(5);
  const [result, setResult] = useState<number | null>(null);
  const [graphData, setGraphData] = useState<any[]>([]);

  useEffect(() => {
    setAnnualExpenses(salary); // Prepopulate the calculator with the yearly salary
  }, [salary]);

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

  return (
    <>
      <Head>
        <title>How Much Money Do You Need to Retire with ${salary.toLocaleString()} a Year Income?</title>
        <meta
          name="description"
          content={`Find out how much money you need to retire comfortably with a yearly income of $${salary.toLocaleString()}. Use our retirement calculator to plan your future.`}
        />
        <meta name="keywords" content={`retirement calculator, retire with $${salary}, financial planning`} />
        <link rel="canonical" href={`https://www.expensegoose.com/tools/retirement/${salary}`} />
      </Head>

      <main className="max-w-screen-md mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-6">
          How Much Money Do You Need to Retire with ${salary.toLocaleString()} a Year Income?
        </h1>

        <p className="text-base text-gray-700 mb-4">
          Plan your retirement confidently! Estimate how much you'll need after considering inflation and investment growth.
        </p>

        <SignUpBanner/>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Calculate Your Retirement Needs</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
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

        {result !== null && (
          <section className="mb-8">
            <div className="p-4 bg-gray-100 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Results</h2>
              <p className="text-base text-gray-700 mb-4">
                Estimated additional savings needed: <span className="font-bold text-blue-600">${result.toLocaleString()}</span>
              </p>
            </div>

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
      </main>
    </>
  );
}

export async function getStaticPaths() {
    const { data: salaries, error } = await supabase
      .from("retirement_salaries")
      .select("yearly_salary");
  
    if (error) {
      console.error(error);
      return { paths: [], fallback: false };
    }
  
    const paths = salaries.map((salary: { yearly_salary: number }) => ({
      params: { salary: salary.yearly_salary.toString() },  // 👈 Correct: param name must match [salary]
    }));
  
    return { paths, fallback: false };
  }
  
  export async function getStaticProps({ params }: { params: { salary: string } }) {
    const salary = parseInt(params.salary, 10);
  
    return {
      props: {
        salary,
      },
    };
  }
  