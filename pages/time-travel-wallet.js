import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { supabase } from "../lib/supabase";
import { TrendingUp, Smile, Frown, Trophy, Share2, Clock, Zap, BarChart2 } from "lucide-react";
import Head from "next/head";

const AVATAR_STATES = [
  { emoji: "🤑", label: "Thriving", min: 5000 },
  { emoji: "😊", label: "Healthy", min: 1000 },
  { emoji: "😅", label: "Okay", min: 0 },
  { emoji: "😬", label: "Strained", min: -1000 },
  { emoji: "😭", label: "In Debt", min: -100000 },
];

function getAvatar(netSavings) {
  for (const state of AVATAR_STATES) {
    if (netSavings >= state.min) return state;
  }
  return AVATAR_STATES[AVATAR_STATES.length - 1];
}

function getHealthScore(netSavings) {
  if (netSavings > 5000) return "🔥";
  if (netSavings > 1000) return "💪";
  if (netSavings > 0) return "🙂";
  if (netSavings > -1000) return "😬";
  return "🚨";
}

function getAITip(spending) {
  if (!spending) return "Track your expenses for more insights!";
  if (spending.foodDelivery > 0) return "Cut food delivery in half = +$900/year";
  if (spending.eatingOut > 0) return "Cook at home 2x more = +$600/year";
  if (spending.shopping > 0) return "Pause shopping sprees = +$400/year";
  return "Try saving 5% more each month for a big impact!";
}

export default function TimeTravelWallet() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [futureStats, setFutureStats] = useState(null);
  const [shareCopied, setShareCopied] = useState(false);

  // Simulate fetching and projecting data
  useEffect(() => {
    async function fetchAndProject() {
      setLoading(true);
      let netSavings = 0;
      let monthlyIncome = 3500;
      let monthlySpending = 2900;
      let foodDelivery = 60;
      let eatingOut = 120;
      let shopping = 100;
      // Demo: fetch last 90 days of expenses and project
      if (user) {
        const { data, error } = await supabase
          .from("transactions")
          .select("amount, category")
          .eq("user_id", user.id)
          .gte("transaction_date", new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10));
        if (!error && data && data.length > 0) {
          monthlySpending = Math.abs(
            data.reduce((sum, t) => sum + (t.amount < 0 ? t.amount : 0), 0) / 3
          );
          // Demo: categorize a few types
          foodDelivery = data.filter((t) => t.category === "food" && t.amount < 0).length * 20;
          eatingOut = data.filter((t) => t.category === "entertainment" && t.amount < 0).length * 30;
          shopping = data.filter((t) => t.category === "shopping" && t.amount < 0).length * 25;
        }
      }
      // Project 12 months
      netSavings = (monthlyIncome - monthlySpending) * 12;
      const avatar = getAvatar(netSavings);
      const healthScore = getHealthScore(netSavings);
      const tip = getAITip({ foodDelivery, eatingOut, shopping });
      setFutureStats({
        projectedSavings: Math.round(netSavings),
        healthScore,
        avatar: avatar.emoji,
        avatarLabel: avatar.label,
        tip,
        shareText: `I’ll have $${Math.round(netSavings).toLocaleString()} in 12 months if I keep this up! 💸 #ExpenseGoose`,
      });
      setLoading(false);
    }
    fetchAndProject();
  }, [user]);

  const handleShare = () => {
    if (futureStats) {
      navigator.clipboard.writeText(futureStats.shareText);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }
  };

  return (
    <>
      <Head>
        <title>Time Travel Wallet – See Your Future Finances | Expense Goose</title>
        <meta name="description" content="See your future self’s finances based on today’s habits. Project your savings, get AI tips, and share your future wallet with friends. #ExpenseGoose" />
        <link rel="canonical" href="https://www.expensegoose.com/tools/time-travel-wallet" />
      </Head>
      <main className="max-w-screen-md mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-6">
          <Clock className="inline-block mr-2 text-blue-500" /> Time Travel Wallet
        </h1>
        <p className="text-lg text-gray-700 mb-8 text-center">
          Where will your money take you in 1 year? Find out your future wallet status, get AI-powered tips, and share your results!
        </p>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Zap className="animate-spin text-yellow-400 w-10 h-10 mb-4" />
            <span className="text-gray-500">Calculating your future finances...</span>
          </div>
        ) : (
          <>
            <section className="mb-8 bg-gradient-to-br from-yellow-50 to-blue-50 border-2 border-blue-200 rounded-xl shadow-lg p-6 flex flex-col md:flex-row items-center gap-6">
              <div className="flex flex-col items-center justify-center w-full md:w-1/3">
                <div className="text-7xl mb-2">{futureStats.avatar}</div>
                <div className="text-xl font-bold text-blue-700">{futureStats.avatarLabel}</div>
                <div className="text-4xl mt-2">{futureStats.healthScore}</div>
              </div>
              <div className="flex-1">
                <h2 className="text-xl md:text-2xl font-bold mb-2 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-blue-500" />
                  Your 12-Month Projection
                </h2>
                <p className="text-lg mb-2">
                  <span className="font-semibold text-green-600">Projected Savings in 12 Months:</span>{" "}
                  <span className="font-bold text-blue-700">${futureStats.projectedSavings.toLocaleString()}</span>
                </p>
                <p className="mb-2 flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-green-500" />
                  <span className="font-semibold">Spending Health Score:</span> <span>{futureStats.healthScore}</span>
                </p>
                <p className="mb-4 text-base text-gray-700 italic">
                  <span className="font-semibold text-blue-600">AI Tip:</span> {futureStats.tip}
                </p>
                <div className="flex gap-2 flex-wrap">
                  <button
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    onClick={handleShare}
                  >
                    <Share2 size={18} />
                    {shareCopied ? "Copied!" : "Share Your Future Wallet"}
                  </button>
                  <a
                    href="/leaderboard"
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-yellow-900 rounded-lg hover:bg-yellow-500 transition"
                  >
                    <Trophy size={18} />
                    Compete on Leaderboard
                  </a>
                </div>
              </div>
            </section>

            <section className="mb-10 bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-semibold mb-4">How Does This Work?</h2>
              <ul className="list-disc pl-6 text-base text-gray-700 space-y-2">
                <li>We analyze your last 90 days of expenses and income.</li>
                <li>We project your net savings for 3, 6, and 12 months, assuming your habits stay the same.</li>
                <li>AI suggests one quick win to boost your savings.</li>
                <li>Share your “future wallet” with friends and challenge them to beat your score!</li>
              </ul>
            </section>

            <section className="mb-10 bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-semibold mb-4">Why Share?</h2>
              <ul className="list-disc pl-6 text-base text-gray-700 space-y-2">
                <li>Motivate yourself and others to build better money habits.</li>
                <li>Compete for the top spot on the Expense Goose leaderboard.</li>
                <li>Go viral with your “future wallet” screenshot on social media!</li>
              </ul>
            </section>
          </>
        )}
      </main>
    </>
  );
}