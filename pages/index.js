
import Hero from '../components/Heros/Hero';
import Faq from '../components/Faqs/Faq';
import WhatsNew from '../components/Heros/WhatsNew';
import HowItWorks from '../components/Heros/Howitworks';
import Seo from '../components/Misc/Seo';
import CountdownTimer from '../components/Misc/CountdownTimer';
import ContactForm from "../components/ContactForms/ContactForm";
import WhatsAppChat from '../components/Misc/WhatsAppChat';
import SocialMedia from '../components/Misc/SocialMedia';
import PricingComponent from '../components/Misc/PricingComponent';
import ImagePopup from '../components/Misc/ImagePopup';
import HeroMinimal from '../components/Heros/HeroMinimal';
import { ArrowRight, PenTool as Tool, Zap, Users, BookOpen } from "lucide-react";

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
      title: "Expenses",
      description: "Track and analyze your spending data",
      icon: BarChart2,
      path: "expense",
      color: "text-orange-600",
      bgHover: "hover:bg-orange-50",
      
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
      color: "text-orange-600",
      bgHover: "hover:bg-orange-50",
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
      title: "Budget Calculator",
      description: "Plan your finances with a custom budget",
      icon: Calculator,
      path: "budget-calculator",
      color: "text-purple-600",
      bgHover: "hover:bg-purple-50",
    },
    {
      title: "Monthly Budget Calculator",
      description: "Get a breakdown of your monthly budget",
      icon: ClipboardList,
      path: "monthly-budget-calculator",
      color: "text-yellow-600",
      bgHover: "hover:bg-yellow-50",
      comingSoon: true,
    },
    {
      title: "Emergency Fund Calculator",
      description: "Estimate the amount to save for emergencies",
      icon: PiggyBank,
      path: "emergency-fund-calculator",
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
      title: "Net Worth Calculator",
      description: "Calculate your total assets minus liabilities",
      icon: PieChart,
      path: "net-worth-calculator",
      color: "text-lime-600",
      bgHover: "hover:bg-lime-50",
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
    {
      title: "Cost of Living Comparison (Cities)",
      description: "Visualize how expenses vary by location",
      icon: MapPin,
      path: "cost-of-living-comparison-by-city",
      color: "text-gray-700",
      bgHover: "hover:bg-gray-100",
      comingSoon: true,
    },
    {
      title: "Saving Money Calculator",
      description: "Project how much you can save over time",
      icon: PiggyBank,
      path: "saving-money-calculator",
      color: "text-stone-600",
      bgHover: "hover:bg-stone-50",
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
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
          {/* Header */}
          <div className="mb-8">
            <p className="text-inherit capitalize font-bold text-xl mb-2">
              {/* <Settings className=" inline mr-2" /> */}
              Track spending with 100+ financial tools.
            </p>
            <div className="mt-6">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {filteredTools.map((tool) => {
              const Icon = tool.icon;
              return tool.comingSoon ? (
                <div
                  key={tool.title}
                  className={`group block p-3 py-2 rounded-lg border border-gray-200 transition-all duration-200 ${tool.bgHover}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`p-2 rounded-lg ${tool.color} bg-opacity-10`}>
                      <Icon className="w-6 h-6 text-gray-400" />
                    </div>
                    <h2 className="text-base font-semibold text-gray-400">
                      {tool.title}
                    </h2>
                  </div>
                  <p className="text-gray-400 text-sm italic">Coming Soon</p>
                </div>
              ) : (
                <a
                  key={tool.path}
                  href={tool.path}
                  className={`group block p-3 py-2 rounded-lg border border-gray-200 transition-all duration-200 ${tool.bgHover}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`p-2 rounded-lg ${tool.color} bg-opacity-10`}>
                      <Icon className={`w-6 h-6 ${tool.color}`} />
                    </div>
                    <h2 className="text-base font-semibold text-inherit">
                      {tool.title}
                    </h2>
                  </div>
                  <p className="text-inherit text-sm">{tool.description}</p>
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


      {/* <Hero /> */}

      <Tools /> 
      <PricingComponent />
      <Faq />

    </>
  );
}
