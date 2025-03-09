import { supabase } from './supabase';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays } from 'date-fns';

export interface SpendingTrend {
  category: string;
  currentSpend: number;
  previousSpend: number;
  percentageChange: number;
}

export interface AIInsight {
  type: 'alert' | 'suggestion' | 'milestone' | 'forecast';
  title: string;
  message: string;
  value?: number;
  trend?: number;
}

export async function analyzeTransactions(userId: string): Promise<AIInsight[]> {
  const insights: AIInsight[] = [];
  
  // Get weekly spending trends
  const weekStart = startOfWeek(new Date());
  const weekEnd = endOfWeek(new Date());
  
  const { data: weeklyTrends } = await supabase
    .rpc('calculate_spending_trends', {
      p_user_id: userId,
      p_start_date: weekStart.toISOString(),
      p_end_date: weekEnd.toISOString()
    });

  // Analyze category spending changes
  if (weeklyTrends) {
    for (const trend of weeklyTrends) {
      if (trend.percentage_change > 20) {
        insights.push({
          type: 'alert',
          title: 'Spending Alert',
          message: `Your ${trend.category.toLowerCase()} spending increased by ${Math.round(trend.percentage_change)}% this week`,
          trend: trend.percentage_change
        });
      }
    }
  }

  // Get savings goals progress
  const { data: goals } = await supabase
    .from('savings_goals')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (goals) {
    const remainingAmount = goals.target_amount - goals.current_amount;
    insights.push({
      type: 'milestone',
      title: 'Savings Goal Progress',
      message: `You're $${remainingAmount.toFixed(2)} away from your ${goals.name}!`,
      value: remainingAmount
    });
  }

  // Calculate safe spending amount
  const { data: monthlyIncome } = await supabase
    .from('transactions')
    .select('amount')
    .eq('user_id', userId)
    .gte('amount', 0)
    .gte('transaction_date', startOfMonth(new Date()).toISOString())
    .lte('transaction_date', endOfMonth(new Date()).toISOString());

  const { data: monthlyExpenses } = await supabase
    .from('transactions')
    .select('amount')
    .eq('user_id', userId)
    .lt('amount', 0)
    .gte('transaction_date', startOfMonth(new Date()).toISOString())
    .lte('transaction_date', endOfMonth(new Date()).toISOString());

  if (monthlyIncome && monthlyExpenses) {
    const totalIncome = monthlyIncome.reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = Math.abs(monthlyExpenses.reduce((sum, t) => sum + t.amount, 0));
    const safeToBudget = Math.max(0, totalIncome * 0.3 - totalExpenses);

    insights.push({
      type: 'forecast',
      title: 'Safe to Spend',
      message: `You can safely spend $${safeToBudget.toFixed(2)} this month`,
      value: safeToBudget
    });
  }

  // Generate budget optimization suggestions
  const { data: categorySpending } = await supabase
    .from('transactions')
    .select('category, amount')
    .eq('user_id', userId)
    .lt('amount', 0)
    .gte('transaction_date', startOfMonth(new Date()).toISOString());

  if (categorySpending) {
    const spendingByCategory = categorySpending.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
      return acc;
    }, {} as Record<string, number>);

    const highestCategory = Object.entries(spendingByCategory)
      .sort(([,a], [,b]) => b - a)[0];

    if (highestCategory) {
      const suggestedSaving = Math.round(highestCategory[1] * 0.2);
      insights.push({
        type: 'suggestion',
        title: 'Smart Tip',
        message: `Save $${suggestedSaving} by reducing your ${highestCategory[0].toLowerCase()} spending`,
        value: suggestedSaving
      });
    }
  }

  return insights;
}