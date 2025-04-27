import { useState,useEffect } from "react";
import Head from "next/head";
import Link from "next/link"; // Import Link for navigation
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { supabase } from "../../../lib/supabase";

export default function AutoLoanCalculator() {
  const [loanAmount, setLoanAmount] = useState<number>(25000); // Default loan amount
  const [interestRate, setInterestRate] = useState<number>(5); // Default interest rate
  const [loanTerm, setLoanTerm] = useState<number>(60); // Default loan term in months
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);
  const [graphData, setGraphData] = useState<any[]>([]);

  const calculateMonthlyPayment = () => {
    const monthlyRate = interestRate / 100 / 12;
    const payment =
      (loanAmount * monthlyRate) /
      (1 - Math.pow(1 + monthlyRate, -loanTerm));
    setMonthlyPayment(payment);

    const [loanAmounts, setLoanAmounts] = useState<number[]>([]);

    useEffect(() => {
      // Fetch loan amounts from the database
      const fetchLoanAmounts = async () => {
        const { data: loans, error } = await supabase
          .from("auto_loans")
          .select("loan_amount");
  
        if (error) {
          console.error("Error fetching loan amounts:", error);
          return;
        }
  
        setLoanAmounts(loans.map((loan: { loan_amount: number }) => loan.loan_amount));
      };
  
      fetchLoanAmounts();
    }, []);
  

    // Generate graph data
    const data = [];
    let remainingBalance = loanAmount;
    for (let i = 1; i <= loanTerm; i++) {
      const interest = remainingBalance * monthlyRate;
      const principal = payment - interest;
      remainingBalance -= principal;
      data.push({
        month: i,
        balance: Math.max(remainingBalance, 0),
      });
    }
    setGraphData(data);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateMonthlyPayment();
  };

  // Example loan amounts for links
  const loanAmounts = [15000, 20000, 25000];

  return (
    <>
      <Head>
        <title>Auto Loan Calculator | Calculate Your Car Payments</title>
        <meta
          name="description"
          content="Use our Auto Loan Calculator to estimate your monthly car payments. Plan your car loan with ease and confidence."
        />
        <meta
          name="keywords"
          content="auto loan calculator, car loan calculator, car payment calculator, car finance calculator, car loan repayment calculator"
        />
        <link rel="canonical" href="https://www.expensegoose.com/tools/auto-loan-calculator" />
      </Head>

      <main className="max-w-screen-md mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-6">
          Auto Loan Calculator
        </h1>

        <p className="text-base text-gray-700 mb-4">
          Use our Auto Loan Calculator to estimate your monthly car payments. Plan your car loan with ease and confidence.
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Calculate Your Car Loan</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="loanAmount" className="block text-base text-gray-700 mb-2">
                Loan Amount ($)
              </label>
              <input
                id="loanAmount"
                name="loanAmount"
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="interestRate" className="block text-base text-gray-700 mb-2">
                Interest Rate (%)
              </label>
              <input
                id="interestRate"
                name="interestRate"
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="loanTerm" className="block text-base text-gray-700 mb-2">
                Loan Term (Months)
              </label>
              <input
                id="loanTerm"
                name="loanTerm"
                type="number"
                value={loanTerm}
                onChange={(e) => setLoanTerm(Number(e.target.value))}
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

        {monthlyPayment !== null && (
          <>
            <section className="mb-8">
              <div className="p-4 bg-gray-100 rounded-lg">
                <h2 className="text-2xl font-semibold mb-4">Results</h2>
                <p className="text-base text-gray-700 mb-4">
                  Your estimated monthly payment is:{" "}
                  <span className="font-bold text-blue-600">
                    ${monthlyPayment.toFixed(2)}
                  </span>
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Loan Balance Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={graphData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" label={{ value: "Month", position: "insideBottomRight", offset: 0 }} />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="balance" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </section>
          </>
        )}

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Tips for Managing Your Auto Loan</h2>
          <ul className="list-disc list-inside mb-4 text-base">
            <li>Shop around for the best interest rates before committing to a loan.</li>
            <li>Consider making a larger down payment to reduce your monthly payments.</li>
            <li>Pay off your loan early if possible to save on interest.</li>
            <li>Keep your loan term as short as possible to minimize total interest paid.</li>
          </ul>
        </section>

        {/* <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Explore More Loan Calculators</h2>
          <ul className="list-disc list-inside mb-4 text-base">
            {loanAmounts.map((amount) => (
              <li key={amount}>
                <Link
                href={`/tools/auto-loan-calculator/auto-loan-calculator-${amount}`}
                className="text-blue-500 hover:underline"
              >
                Auto Loan Calculator for ${amount.toLocaleString()}
              </Link>
              </li>
            ))}
          </ul>
        </section> */}

<section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Explore More Loan Calculators</h2>
          <ul className="list-disc list-inside mb-4 text-base">
            {loanAmounts.map((amount) => (
              <li key={amount}>
                <Link
                  href={`/tools/auto-loan-calculator/auto-loan-calculator-${amount}`}
                  className="text-blue-500 hover:underline"
                >
                  Auto Loan Calculator for ${amount.toLocaleString()}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}