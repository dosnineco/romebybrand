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


function App() {
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
    },
    {
      title: "Emergency Fund Calculator",
      description: "Estimate the amount to save for emergencies",
      icon: PiggyBank,
      path: "emergency-fund-calculator",
      color: "text-red-600",
      bgHover: "hover:bg-red-50",
    },
    {
      title: "Retirement Spending Calculator",
      description: "Plan how much you'll need in retirement",
      icon: Award,
      path: "retirement-spending-calculator",
      color: "text-indigo-600",
      bgHover: "hover:bg-indigo-50",
    },
    {
      title: "Grocery Budget Calculator",
      description: "Set your monthly grocery spending",
      icon: DollarSign,
      path: "grocery-budget-calculator",
      color: "text-pink-600",
      bgHover: "hover:bg-pink-50",
    },
    {
      title: "Relocation Calculator",
      description: "Compare expenses when moving to a new city",
      icon: MapPin,
      path: "relocation-calculator",
      color: "text-teal-600",
      bgHover: "hover:bg-teal-50",
    },
    {
      title: "Cost of Living Comparison",
      description: "Compare the cost of living across cities",
      icon: Banknote,
      path: "cost-of-living-comparison",
      color: "text-amber-600",
      bgHover: "hover:bg-amber-50",
    },
    {
      title: "Net Worth Calculator",
      description: "Calculate your total assets minus liabilities",
      icon: PieChart,
      path: "net-worth-calculator",
      color: "text-lime-600",
      bgHover: "hover:bg-lime-50",
    },
    {
      title: "Saving Money Tips",
      description: "Learn how to grow your savings faster",
      icon: Wallet,
      path: "saving-money",
      color: "text-rose-600",
      bgHover: "hover:bg-rose-50",
    },
    {
      title: "Every Dollar Tool",
      description: "Track every dollar you spend or save",
      icon: DollarSign,
      path: "every-dollar",
      color: "text-cyan-600",
      bgHover: "hover:bg-cyan-50",
    },
    {
      title: "You Need a Budget",
      description: "Discover the power of budgeting proactively",
      icon: TrendingUp,
      path: "you-need-a-budget",
      color: "text-emerald-600",
      bgHover: "hover:bg-emerald-50",
    },
    {
      title: "Zero-Based Budgeting",
      description: "Give every dollar a job before the month begins",
      icon: Calculator,
      path: "zero-based-budgeting",
      color: "text-fuchsia-600",
      bgHover: "hover:bg-fuchsia-50",
    },
    {
      title: "Define Budget",
      description: "Understand what budgeting really means",
      icon: Mail,
      path: "define-budget",
      color: "text-sky-600",
      bgHover: "hover:bg-sky-50",
    },
    {
      title: "Cost of Living Comparison (Cities)",
      description: "Visualize how expenses vary by location",
      icon: MapPin,
      path: "cost-of-living-comparison-by-city",
      color: "text-gray-700",
      bgHover: "hover:bg-gray-100",
    },
    {
      title: "Saving Money Calculator",
      description: "Project how much you can save over time",
      icon: PiggyBank,
      path: "saving-money-calculator",
      color: "text-stone-600",
      bgHover: "hover:bg-stone-50",
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
    
            <p className="text-inherit font-semibold text-xl mb-2">
            <Settings className="animate-spin	 inline mr-2"/>

            Dashboard
            </p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <a
                  key={tool.path}
                  href={tool.path}
                  className={`group block p-3 py-2 rounded-lg border border-gray-200 transition-all duration-200 ${tool.bgHover}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`p-2 rounded-lg ${tool.color} bg-opacity-10`}>
                      <Icon className={`w-6 h-6 ${tool.color}`} />
                    </div>
                    <h2 className="text-lg font-semibold text-inherit">
                      {tool.title}
                    </h2>
                  </div>
                  <p className="text-inherit text-sm">
                    {tool.description}
                  </p>
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