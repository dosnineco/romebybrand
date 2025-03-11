import { useCallback } from "react";

// Memoized spending analysis
const analyzeSpending = useCallback((data, weeklyBudget) => {
  const monthlyBudgetCap = parseFloat(weeklyBudget) * 4; // Monthly restriction

  // List of predefined categories and recommendations
  const categoryRecommendations = {
    food: "Consider meal prepping or cooking at home more often.",
    groceries: "Look for store discounts and buy in bulk to save money.",
    dining_out: "Limit dining out and explore homemade meal options.",
    shopping: "Stick to a shopping list to avoid impulse purchases.",
    clothing: "Consider shopping during seasonal sales or second-hand options.",
    electronics: "Check for deals and avoid unnecessary upgrades.",
    transport: "Use public transport or carpool to cut costs.",
    fuel: "Drive efficiently and compare gas prices for savings.",
    public_transport: "Consider transit passes for discounted rates.",
    housing: "Review housing costs and optimize utility usage.",
    rent: "Negotiate rent or consider downsizing if necessary.",
    mortgage: "Ensure you're on a manageable mortgage payment plan.",
    utilities: "Turn off unused devices and monitor electricity usage.",
    electricity: "Switch to energy-efficient appliances and habits.",
    water: "Fix leaks and use water-saving fixtures.",
    internet: "Look for bundled plans or alternative providers.",
    entertainment: "Look for free or low-cost entertainment options.",
    movies: "Take advantage of matinee prices or streaming services.",
    subscriptions: "Cancel unused subscriptions to reduce costs.",
    gas: "Reduce unnecessary trips and combine errands.",
    healthcare: "Compare medical plans and use generic medications.",
    insurance: "Review insurance policies to find better rates.",
    education: "Explore scholarships or free learning resources.",
    investments: "Diversify investments and avoid high-risk spending.",
    donations: "Set a fixed budget for charitable giving.",
    travel: "Book in advance and look for travel deals.",
    fitness: "Consider home workouts or community fitness programs.",
    pets: "Buy pet food in bulk and use affordable vet care options.",
    miscellaneous: "Review spending habits and cut unnecessary costs.",
    other: "Ensure expenses in this category are truly essential."
  };

  // Calculate total spending per category
  const categoryTotals = data.reduce((acc, { category, amount }) => {
    acc[category] = (acc[category] || 0) + Math.abs(amount);
    return acc;
  }, {});

  // Distribute budget evenly across categories
  const numberOfCategories = Object.keys(categoryTotals).length;
  const categoryCap = numberOfCategories > 0 ? monthlyBudgetCap / numberOfCategories : 0;

  // Process insights based on spending analysis
  const insights = Object.entries(categoryTotals).map(([category, total]) => {
    const isOverBudget = total > categoryCap;
    
    const recommendation = isOverBudget
      ? categoryRecommendations[category] || "Review your spending in this category for potential savings."
      : "You are within budget.";

    return {
      category,
      total,
      trend: isOverBudget ? "up" : "down",
      recommendation,
    };
  });

  return insights.sort((a, b) => b.total - a.total); // Sort by highest spending
}, []);
