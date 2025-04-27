

import Faq from '../components/Faqs/Faq';

import Seo from '../components/Misc/Seo';
import PricingComponent from '../components/Misc/PricingComponent';
import { ArrowRight, PenTool as Tool, Zap, Users, BookOpen, Car } from "lucide-react";

import { useState } from "react";

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

function Tools() {
  const [searchTerm, setSearchTerm] = useState("");

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
      path: "/saving-money-calculator",
      color: "text-stone-600",
      bgHover: "hover:bg-stone-50",
    },
    {
      title: "Sales Tracker",
      description: " ",
      icon: Calculator,
      path: "/sales-tracker",
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
      title: "Auto Loan Calculator",
      description: "Calculate your monthly auto loan payments",
      icon: Car,
      path: "/tools/auto-loan-calculator",
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
    },
    {
      title: "Retirement Spending Calculator",
      description: "Plan how much you'll need in retirement",
      icon: Award,
      path: "/tools/retirement-spending-calculator",
      color: "text-indigo-600",
      bgHover: "hover:bg-indigo-50",
    },
    {
      title: "Grocery Budget Calculator",
      description: "Set your monthly grocery spending",
      icon: DollarSign,
      path: "/grocery-budget-calculator",
      color: "text-pink-600",
      bgHover: "hover:bg-pink-50",
    },
    {
      title: "Relocation Calculator",
      description: "Compare expenses when moving to a new city",
      icon: MapPin,
      path: "/relocation-calculator",
      color: "text-teal-600",
      bgHover: "hover:bg-teal-50",
    },
    {
      title: "Cost of Living Comparison",
      description: "Compare the cost of living across cities",
      icon: Banknote,
      path: "/cost-of-living-comparison",
      color: "text-amber-600",
      bgHover: "hover:bg-amber-50",
      comingSoon: true,
    },
    {
      title: "Saving Money Tips",
      description: "Learn how to grow your savings faster",
      icon: Wallet,
      path: "/saving-money",
      color: "text-rose-600",
      bgHover: "hover:bg-rose-50",
      comingSoon: true,
    },

    {
      title: "You Need a Budget",
      description: "Discover the power of budgeting proactively",
      icon: TrendingUp,
      path: "/you-need-a-budget",
      color: "text-emerald-600",
      bgHover: "hover:bg-emerald-50",
      comingSoon: true,
    },
    {
      title: "Zero-Based Budgeting",
      description: "Give every dollar a job before the month begins",
      icon: Calculator,
      path: "/zero-based-budgeting",
      color: "text-fuchsia-600",
      bgHover: "hover:bg-fuchsia-50",
      comingSoon: true,
    },
    {
      title: "Define Budget",
      description: "Understand what budgeting really means",
      icon: Mail,
      path: "/define-budget",
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
        <div className=" p-6 md:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-inherit capitalize font-bold text-xl mb-2">
             I built a tool with 15+ financial tools to help you save more 
            </h1>
            <p className="text-gray-500 text-base">
              Explore our collection of financial tools to help you manage your money better.
            </p>
            <div className="flex items-center justify-between mt-4">
              <a
                href="/checkout"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold"
              >
                Explore All Tools
                <ArrowRight className="ml-2" />
              </a>
            </div>
            <div className="mt-6">
        
        </div>
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



export default function Home() {

  return (
    <>
      <Seo 
          siteTitle="Expense Goose"
          pageTitle="Best Online Expense Software & Business Expense Tracking"
          description="Expense Goose is the leading free expense tracking software for small businesses. Manage your finances with powerful expense management tools and tracking software."
          url="https://www.expensegoose.com"
          image="https://www.expensegoose.com/images/hero.jpg"
      />



      <Tools /> 
      <PricingComponent />
      <Faq />

      <div className="flex items-center justify-center my-8 py-4">
          <a
            href="https://www.producthunt.com/posts/expense-goose?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-expense&#0045;goose"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=950226&theme=dark&t=1743996217555"
              alt="Expense&#0032;Goose - Track&#0032;spending&#0032;with&#0032;100&#0043;&#0032;free&#0032;financial&#0032;tools&#0046; | Product Hunt"
              style={{ width: '250px', height: '54px' }}
              width="250"
              height="54"
            />
          </a>
        </div>
    </>
  );
}
