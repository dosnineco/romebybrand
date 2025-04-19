import { 
  BarChart2, 
  Calculator, 
  Mail, 
  DollarSign,
  Settings,
  Search,
  Award,
  MapPin,
  PiggyBank,
  Banknote,
  PieChart,
  Wallet,
  TrendingUp,
  ClipboardList
} from "lucide-react";

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { supabase } from '../lib/supabase';

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useUser();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('users')
            .select('is_subscribed')
            .eq('clerk_id', user.id)
            .single();

          if (error) {
            console.error('Error fetching subscription status:', error);
          } else {
            setIsSubscribed(data?.is_subscribed || false);
          }
        } catch (err) {
          console.error('Unexpected error checking subscription status:', err);
        }
      }
      setLoading(false);
    };

    checkSubscriptionStatus();
  }, [user]);

  const tools = [

    {
      title: "Budget Calculator",
      description: "Track and analyze your spending data",
      icon: ClipboardList,
      path: "/budget-calculator",
      color: "text-orange-600",
      bgHover: "hover:bg-orange-50",
      
    },
    {
      title: "Saving Money Calculator",
      description: "Project how much you can save over time",
      icon: PiggyBank,
      path: "saving-money-calculator",
      color: "text-stone-600",
      bgHover: "hover:bg-stone-50",
    },
    {
      title: "Sales Tracker",
      description: " ",
      icon: Calculator,
      path: "/tools/sales-tracker",
      color: "text-yellow-600",
      bgHover: "hover:bg-yellow-50",
    },
    {
      title: "Cost of Living Calculator",
      description: " ",
      icon: Calculator,
      path: "/tools/cost-of-living",
      color: "text-green-600",
      bgHover: "hover:bg-green-50",
    },

    {
      title: "Living Expenses Calculator",
      description: "Calculate your monthly living expenses",
      icon: BarChart2,
      path: "/tools/living-expenses",
      color: "text-pink-600",
      bgHover: "hover:bg-pink-50",
    },
    {
      title: "Monthly Spending Calculator",
      description: "Estimate your monthly spending based on your income and expenses",
      icon: Mail,
      path: "/tools/monthly-calculator",
      color: "text-blue-600",
      bgHover: "hover:bg-blue-50",
    },
    {
      title: "Emergency Fund Calculator",
      description: "Estimate the amount to save for emergencies",
      icon: PiggyBank,
      path: "/tools/emergency-fund-calculator",
      color: "text-red-600",
      bgHover: "hover:bg-red-50",
      comingSoon: true,
    },
    {
      title: "Retirement Spending Calculator",
      description: "Plan how much you'll need in retirement",
      icon: Award,
      path: "retirement-spending-calculator",
      color: "text-indigo-600",
      bgHover: "hover:bg-indigo-50",
      comingSoon: true,
    },
    {
      title: "Grocery Budget Calculator",
      description: "Set your monthly grocery spending",
      icon: DollarSign,
      path: "grocery-budget-calculator",
      color: "text-pink-600",
      bgHover: "hover:bg-pink-50",
      comingSoon: true,
    },
    {
      title: "Relocation Calculator",
      description: "Compare expenses when moving to a new city",
      icon: MapPin,
      path: "relocation-calculator",
      color: "text-teal-600",
      bgHover: "hover:bg-teal-50",
      comingSoon: true,
    },
    {
      title: "Cost of Living Comparison",
      description: "Compare the cost of living across cities",
      icon: Banknote,
      path: "cost-of-living-comparison",
      color: "text-amber-600",
      bgHover: "hover:bg-amber-50",
      comingSoon: true,
    },
    {
      title: "Saving Money Tips",
      description: "Learn how to grow your savings faster",
      icon: Wallet,
      path: "saving-money",
      color: "text-rose-600",
      bgHover: "hover:bg-rose-50",
      comingSoon: true,
    },
    {
      title: "Every Dollar Tool",
      description: "Track every dollar you spend or save",
      icon: DollarSign,
      path: "every-dollar",
      color: "text-cyan-600",
      bgHover: "hover:bg-cyan-50",
      comingSoon: true,
    },
    {
      title: "You Need a Budget",
      description: "Discover the power of budgeting proactively",
      icon: TrendingUp,
      path: "you-need-a-budget",
      color: "text-emerald-600",
      bgHover: "hover:bg-emerald-50",
      comingSoon: true,
    },
    {
      title: "Zero-Based Budgeting",
      description: "Give every dollar a job before the month begins",
      icon: Calculator,
      path: "zero-based-budgeting",
      color: "text-fuchsia-600",
      bgHover: "hover:bg-fuchsia-50",
      comingSoon: true,
    },
    {
      title: "Define Budget",
      description: "Understand what budgeting really means",
      icon: Mail,
      path: "define-budget",
      color: "text-sky-600",
      bgHover: "hover:bg-sky-50",
      comingSoon: true,
    },
    

 
  ];
  
  const filteredTools = tools.filter(tool =>
    tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl  p-6 md:p-8">
          {/* Header */}
          <div className="mb-8 w-full grid grid-cols-2 items-center justify-center gap-4">
            <p className="text-inherit font-semibold text-xl mb-2">
              {/* <Settings className=" inline mr-2" /> */}
              Dashboard
            </p>
            

          {!loading && (
            <div className="flex items-center justify-center">
              {isSubscribed ? (
                <div className="flex items-center justify-center px-4 py-2">
                  <Award className="h-6 w-6 text-yellow-500 mr-2" />
                  <span className="text-yellow-500 font-bold">Premium</span>
                </div>
              ) : (
                <a href="/checkout" className="flex items-center justify-center px-4 py-2">
                  <Lock className="h-6 w-6 text-gray-500 mr-2" />
                  <span className="text-gray-500 font-bold hover:underline">Free</span>
                </a>
              )}
            </div>
          )}
          </div>

          {/* Search */}
          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-inherit" />
            <input
              type="text"
              placeholder="Search tools..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {filteredTools.map((tool) => {
              const Icon = tool.icon;
              return tool.comingSoon ? (
                <div
                  key={tool.title}
                  className={`group block p-4 rounded-lg bg-gray-100 transition-all duration-200 ${tool.bgHover}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${tool.color} bg-opacity-10 flex items-center justify-center`}>
                      <Icon className="w-8 h-8 text-gray-400" />
                    </div>
                    <h2 className="text-base font-semibold text-gray-400">
                      {tool.title}
                    </h2>
                  </div>
                </div>
              ) : (
                <a
                  key={tool.path}
                  href={tool.path}
                  className={`group block p-4 rounded-lg bg-gray-100 transition-all duration-200 ${tool.bgHover}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${tool.color} bg-opacity-10 flex items-center justify-center`}>
                      <Icon className={`w-8 h-8 ${tool.color}`} />
                    </div>
                    <h2 className="text-base font-semibold text-inherit">
                      {tool.title}
                    </h2>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;