import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useUser } from '@clerk/clerk-react';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, parseISO } from 'date-fns';
import { Settings,  PlusCircle,FilePlus ,Edit2, Trash2, Save, X, Plus, Search, Filter, TrendingUp, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { FaUtensils, FaShoppingCart, FaCar, FaHome, FaGamepad } from 'react-icons/fa';
import { useRouter } from "next/router";
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { TiRefresh } from "react-icons/ti";




const App = () => {
  const router = useRouter();
  const { user } = useUser();
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ totalCredits: 0, totalDebits: 0, netBalance: 0 });

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [customStartDate, setCustomStartDate] = useState('');
const [customEndDate, setCustomEndDate] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('month');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    transaction_date: format(new Date(), 'yyyy-MM-dd'),
    post_date: format(new Date(), 'yyyy-MM-dd'),
    description: '',
    amount: '',
    category: 'other',
  });

  const [monthlySpending, setMonthlySpending] = useState(0);
  const [weeklyBudget, setWeeklyBudget] = useState(() => JSON.parse(localStorage.getItem('weeklyBudget')) || 10000);
  const [categoryLimits, setCategoryLimits] = useState(() => JSON.parse(localStorage.getItem('categoryLimits')) || []);
  const [spendingInsights, setSpendingInsights] = useState([]);

  const [savingsProgress, setSavingsProgress] = useState(0);
  const [savingsGoal, setSavingsGoal] = useState(0); // Savings goal from category limits
  const [savingsTotal, setSavingsTotal] = useState(0); // Total savings so far


  useEffect(() => {
    if (!user) return;
    fetchBudgetAndCategoryLimits().then(() => fetchTransactions());
  }, [user]);
  
  
  // Memoized filter function
  const filterTransactions = useCallback((data) => {
    return data.filter((t) => {
      const matchesSearch = searchTerm
        ? t.description.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
  
      let matchesFilter = true;
      const date = parseISO(t.transaction_date);
  
      if (filterPeriod === 'day') {
        matchesFilter = date >= subDays(new Date(), 1);
      } else if (filterPeriod === 'week') {
        matchesFilter = date >= startOfWeek(new Date()) && date <= endOfWeek(new Date());
      } else if (filterPeriod === 'month') {
        matchesFilter = date >= startOfMonth(new Date()) && date <= endOfMonth(new Date());
      } else if (filterPeriod === 'year') {
        matchesFilter = date.getFullYear() === parseInt(selectedYear, 10);
      } else if (filterPeriod === 'custom range') {
        matchesFilter =
          date >= new Date(customStartDate) && date <= new Date(customEndDate);
      }
  
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, filterPeriod, selectedYear, customStartDate, customEndDate]);


  const fetchBudgetAndCategoryLimits = async () => {
    if (!user) return;
    try {
      const [{ data: budgetData, error: budgetError }, { data: categoryLimitsData, error: categoryLimitsError }] = await Promise.all([
        supabase.from('monthly_budgets').select('amount').eq('user_id', user.id).eq('month', format(new Date(), 'yyyy-MM-01')),
        supabase.from('category_limits').select('*').eq('user_id', user.id)
      ]);
      
      if (budgetError) throw budgetError;
      if (categoryLimitsError) throw categoryLimitsError;
      
      const budget = budgetData.length ? budgetData[0].amount / 4 : 10000;
      setWeeklyBudget(budget);
      localStorage.setItem('weeklyBudget', JSON.stringify(budget));
      
      setCategoryLimits(categoryLimitsData || []);
      localStorage.setItem('categoryLimits', JSON.stringify(categoryLimitsData || []));
    } catch (err) {
      setError(err.message || 'Error fetching budget data');
    }
  };
  

  // const analyzeSpending = useCallback((data) => {
  //   if (!Array.isArray(data) || data.length === 0) return [];
  
  //     // Use a Map for category totals (faster lookups)
  //     const categoryTotals = new Map();
    
  //     for (const { category, amount } of data) {
  //       categoryTotals.set(category, (categoryTotals.get(category) || 0) + Math.abs(amount));
  //     }
    
  //     // Convert categoryLimits array into a Map for O(1) lookups
  //     const categoryLimitMap = new Map(categoryLimits.map(({ category, limit_amount }) => [category, limit_amount]));
    
  //     const insights = Array.from(categoryTotals.entries()).map(([category, total]) => {
  //       const categoryLimit = categoryLimitMap.get(category) ?? (weeklyBudget * 4) * 0.2;
  //       const isOverBudget = total > categoryLimit;
  
  //     let recommendation = isOverBudget
  //       ? `You've exceeded your budget for ${category}. Consider reducing expenses.`
  //       : 'You are within budget.';
  
  //     return {
  //       category,
  //       total,
  //       trend: isOverBudget ? 'up' : 'down',
  //       recommendation,
  //     };
  //   });
  
  //   return insights.sort((a, b) => b.total - a.total);
  // }, [weeklyBudget, categoryLimits]);

  const analyzeSpending = useCallback((data) => {
    if (!Array.isArray(data) || data.length === 0) return [];
  
    const categoryTotals = new Map();
    let savingsTotal = 0;
  
    for (const { category, amount } of data) {
      if (category === 'savings') {
        savingsTotal += Math.abs(amount); // Track savings separately
      } else {
        categoryTotals.set(category, (categoryTotals.get(category) || 0) + Math.abs(amount));
      }
    }
  
    // Calculate savings progress
    const savingsLimit = categoryLimits.find((limit) => limit.category === 'savings')?.limit_amount || 0;
    setSavingsGoal(savingsLimit);
    setSavingsTotal(savingsTotal);
    setSavingsProgress((savingsTotal / savingsLimit) * 100);
  
    const categoryLimitMap = new Map(categoryLimits.map(({ category, limit_amount }) => [category, limit_amount]));
  
    const insights = Array.from(categoryTotals.entries()).map(([category, total]) => {
      const categoryLimit = categoryLimitMap.get(category) ?? (weeklyBudget * 4) * 0.2;
      const isOverBudget = total > categoryLimit;
  
      let recommendation = isOverBudget
        ? `You've exceeded your budget for ${category}. Consider reducing expenses.`
        : 'You are within budget.';
  
      return {
        category,
        total,
        trend: isOverBudget ? 'up' : 'down',
        recommendation,
      };
    });
  
    return insights.sort((a, b) => b.total - a.total);
  }, [weeklyBudget, categoryLimits]);

  const handleEdit = (transaction) => {
    setEditingId(transaction.id);
    setEditData({ ...transaction });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: field === 'amount' ? parseFloat(value) : value
    }));
  };

  // Optimized fetch with local state updates
  const fetchTransactions = async () => {
    if (!user) return;

    try {
      const { data, error: fetchError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('transaction_date', { ascending: false });

      if (fetchError) throw fetchError;

      const filteredData = filterTransactions(data || []);
      setTransactions(filteredData);
      
      // Update summary and insights
      const summary = filteredData.reduce(
        (acc, curr) => {
          if (curr.amount >= 0) {
            acc.totalCredits += curr.amount;
          } else {
            acc.totalDebits += Math.abs(curr.amount);
          }
          return acc;
        },
        { totalCredits: 0, totalDebits: 0, netBalance: 0 }
      );

      summary.netBalance = summary.totalCredits - summary.totalDebits;
      setSummary(summary);
      
      const monthlyTotal = filteredData.reduce((acc, curr) => acc + Math.abs(curr.amount), 0);
      setMonthlySpending(monthlyTotal);
      
      const insights = analyzeSpending(filteredData);
      setSpendingInsights(insights);
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Optimized add transaction with local state update
  const addTransaction = async () => {
    if (!user || !newTransaction.description || !newTransaction.amount) return;

    try {
      const newTx = {
        user_id: user.id,
        ...newTransaction,
        amount: parseFloat(newTransaction.amount)
      };

      const { data, error: insertError } = await supabase
        .from('transactions')
        .insert([newTx])
        .select()
        .single();

      if (insertError) throw insertError;

      // Update local state
      setTransactions(prev => [data, ...prev]);
      setShowAddForm(false);
      setNewTransaction({
        transaction_date: format(new Date(), 'yyyy-MM-dd'),
        post_date: format(new Date(), 'yyyy-MM-dd'),
        description: '',
        amount: '',
        category: 'other',
      });

      // Recalculate insights
      const updatedTransactions = [data, ...transactions];
      const insights = analyzeSpending(updatedTransactions);
      setSpendingInsights(insights);
    } catch (err) {
      setError(err.message || 'An error occurred');
    }
  };

  // Optimized edit with local state update
  const handleSave = async () => {
    if (!editingId || !user) return;

    try {
      const { error: updateError } = await supabase
        .from('transactions')
        .update(editData)
        .eq('id', editingId)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      // Update local state
      setTransactions(prev =>
        prev.map(t => (t.id === editingId ? { ...t, ...editData } : t))
      );
      
      const updatedTransactions = transactions.map(t => 
        t.id === editingId ? { ...t, ...editData } : t
      );
      
      const insights = analyzeSpending(updatedTransactions);
      setSpendingInsights(insights);
      
      setEditingId(null);
      setEditData({});
    } catch (err) {
      setError(err.message || 'An error occurred');
    }
  };

  // Optimized delete with local state update
  const handleDelete = async (id) => {
    if (!user) return;

    try {
      const { error: deleteError } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      // Update local state
      const updatedTransactions = transactions.filter(t => t.id !== id);
      setTransactions(updatedTransactions);
      
      const insights = analyzeSpending(updatedTransactions);
      setSpendingInsights(insights);
    } catch (err) {
      setError(err.message || 'An error occurred');
    }
  };





  const getCategoryIcon = (category) => {
    switch (category) {
      case 'food':
        return <FaUtensils className="text-green-500" />;
      case 'shopping':
        return <FaShoppingCart className="text-blue-500" />;
      case 'transport':
        return <FaCar className="text-red-500" />;
      case 'housing':
        return <FaHome className="text-purple-500" />;
      case 'entertainment':
        return <FaGamepad className="text-yellow-500" />;
      default:
        return <FaShoppingCart className="text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
      <div className="flex flex-col items-center">
        <AiOutlineLoading3Quarters className="animate-spin text-4xl text-blue-500" />
        <p className="mt-4 text-lg text-gray-600">Loading, please wait...</p>
      </div>
    </div>
    );
  }
 



  const renderTableRow = (transaction) => {
    const isEditing = editingId === transaction.id;

    if (isEditing) {
      return (
        <tr key={transaction.id}>
          <td className="px-4 py-2">
            <input
              type="date"
              value={editData.transaction_date}
              onChange={(e) => handleInputChange('transaction_date', e.target.value)}
              className="w-full border rounded px-2 py-1"
            />
          </td>
          <td className="px-4 py-2">
            <input
              type="text"
              value={editData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full border rounded px-2 py-1"
            />
          </td>
          <td className="px-4 py-2">
            <select
    value={editData.category}
    onChange={(e) => handleInputChange('category', e.target.value)}
    className="w-full border rounded px-2 py-1"
  >
     <option value="food">Food</option>
            <option value="shopping">Shopping</option>
            <option value="transport">Transport</option>
            <option value="housing">Housing</option>
            <option value="entertainment">Entertainment</option>
            <option value="investments">Investments</option>
          <option value="savings">Savings</option>
            <option value="other">Other</option>
            </select>

          </td>
          <td className="px-4 py-2">
            <input
              type="number"
              value={editData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              className="w-full border rounded px-2 py-1"
              step="0.01"
            />
          </td>
          <td className="px-4 py-2 text-right">
            <div className="flex justify-end gap-2">
              <button
                onClick={handleSave}
                className="text-green-600 hover:text-green-900"
              >
                <Save className="h-5 w-5" />
              </button>
              <button
                onClick={handleCancelEdit}
                className="text-gray-600 hover:text-gray-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </td>
        </tr>
      );
    }

    return (
      <tr key={transaction.id}>
        <td className="px-4 text-base py-4 whitespace-nowrap">
          {format(new Date(transaction.transaction_date), "MMM d, yyyy")}
        </td>
        <td className="px-4 py-4 text-base ">{transaction.description}</td>
        <td className="px-4 py-4 whitespace-nowrap">
          {getCategoryIcon(transaction.category)}
        </td>
        <td
          className={`px-4 py-4 whitespace-nowrap ${
            transaction.amount >= 0 ? "text-gray-600" : "text-red-400"
          }`}
        >
          ${Math.abs(transaction.amount).toFixed(2)}
        </td>
        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex justify-end gap-2">
            <button
              onClick={() => handleEdit(transaction)}
              className="text-blue-600 hover:text-blue-900"
            >
              <Edit2 className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleDelete(transaction.id)}
              className="text-red-600 hover:text-red-900"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </td>
      </tr>
    );
  };


  return (
    <div className="min-h-screen  bg-white p-4 sm:p-6">
      <div className="w-full mx-auto">
      <div className="flex justify-between mb-4">
            {/* Left-aligned button */}

            <button
              className="bg-gray-500 text-white p-2 rounded-lg flex items-center"
              onClick={() => router.push('/quick')}
            >
            Quick Expenses
            </button>

            {/* Right-aligned button */}
            <button
              className="bg-gray-500 text-white p-2 rounded-lg flex items-center"
              onClick={() => router.push('/settings')}
            >
              <Settings className="w-6 h-6" />
            </button>
        </div>
        <div className="p-2 mb-4 grid gap-2 sm:grid-cols-2 md:grid-cols-3 grid-cols-1">
        <div className="p-4 bg-white rounded-lg shadow-md mb-6">

        {/* Savings insight */}
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Savings Progress</h2>
          <div className="relative w-full bg-gray-200 rounded-full h-4">
            <div
              className="absolute top-0 left-0 h-4 bg-green-500 rounded-full"
              style={{ width: `${savingsProgress}%` }}
            ></div>
          </div>
          <p className="mt-2 text-sm text-gray-700">
            You have saved <strong>${savingsTotal.toFixed(2)}</strong> out of your goal of <strong>${savingsGoal.toFixed(2)}</strong>.
          </p>
          {savingsProgress >= 100 ? (
            <p className="mt-2 text-sm text-green-600">Congratulations! You've reached your savings goal!</p>
          ) : (
            <p className="mt-2 text-sm text-gray-600">
              Keep going! You're <strong>{(savingsGoal - savingsTotal).toFixed(2)}</strong> away from your goal.
            </p>
          )}
        </div>
              
      {/* {spendingInsights.map((insight, index) => (
        <div
          key={insight.category}
          className={`min-h-30 p-4 flex flex-col items-center text-center rounded-xl border-2 border-solid `}
        >
          <div className="flex  justify-between items-center w-full mb-1">
            <h3 className="text-sm font-semibold text-gray-900 capitalize inline">{insight.category}</h3>
            {insight.trend === "up" ? (
              <AlertTriangle className="h-4 w-4 text-red-500" />
            ) : (
              <TrendingUp className="h-4 w-4 text-green-500" />
            )}
          </div>
          <p className="text-base m-0 font-bold text-gray-900 inline">${insight.total.toFixed(2)}</p>
          {insight.recommendation && (
            <p className="text-xs text-gray-700 m-0">{insight.recommendation}</p>
          )}
        </div>
      ))} */}

{spendingInsights.map((insight, index) => (
    <div
      key={insight.category}
      className={`min-h-30 p-4 flex flex-col items-center text-center rounded-xl border-2 border-solid ${
        insight.trend === 'up' ? 'border-red-500' : 'border-green-500'
      }`}
    >
      <div className="flex justify-between items-center w-full mb-1">
        <h3 className="text-sm font-semibold text-gray-900 capitalize inline">{insight.category}</h3>
        {insight.trend === 'up' ? (
          <AlertTriangle className="h-4 w-4 text-red-500" />
        ) : (
          <TrendingUp className="h-4 w-4 text-green-500" />
        )}
      </div>
      <p className="text-base m-0 font-bold text-gray-900 inline">${insight.total.toFixed(2)}</p>
      {insight.recommendation && (
        <p className="text-xs text-gray-700 m-0">{insight.recommendation}</p>
      )}
    </div>
  ))}


    <div className="p-3 rounded-xl bg-gray-200 flex flex-col items-center text-center">
      <label className="text-sm font-medium text-gray-900 mb-1">
        Monthly Spending
      </label>
      <input
        type="text"
        value={`$${monthlySpending.toFixed(2)}`}
        readOnly
        className="w-full rounded-md px-3 py-2 bg-white text-center text-gray-900"
      />
    </div>

    <div className="p-3 rounded-xl bg-gray-200 flex flex-col items-center text-center">
      <label className="text-sm font-medium text-gray-900 mb-1">
        Remaining Budget
      </label>
      <input
        type="text"
        value={`$${(weeklyBudget * 4 - monthlySpending).toFixed(2)}`}
        readOnly
        className={`w-full rounded-md px-3 py-2 text-center ${
          monthlySpending > weeklyBudget * 4 ? 'bg-red-200 text-red-900' : 'bg-white text-gray-900'
        }`}
      />
      {monthlySpending > weeklyBudget * 4 && (
        <p className="text-red-600 text-sm mt-2">
          Warning: You’ve exceeded your budget!
        </p>
      )}
    </div>


    </div>
        {/* Add Transaction Button */}
        <div className="mb-6 flex justify-center">
  <button
    onClick={() => setShowAddForm(true)}
    className="flex items-center justify-center bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition duration-200"
    aria-label="Add New Transaction"
  >
    <PlusCircle className="w-6 h-6 mr-2" />
    <span className="text-sm font-medium">Add Transaction</span>
  </button>
</div>

        {/* Add Transaction Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Add New Transaction</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="date"
                value={newTransaction.transaction_date}
                onChange={(e) =>
                  setNewTransaction((prev) => ({
                    ...prev,
                    transaction_date: e.target.value,
                  }))
                }
                className="border rounded-lg px-3 py-2"
              />
              <input
                type="date"
                value={newTransaction.post_date}
                onChange={(e) =>
                  setNewTransaction((prev) => ({
                    ...prev,
                    post_date: e.target.value,
                  }))
                }
                className="border rounded-lg px-3 py-2"
              />
              <input
                type="text"
                placeholder="Description"
                value={newTransaction.description}
                onChange={(e) =>
                  setNewTransaction((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="border rounded-lg px-3 py-2"
              />
              <input
                type="number"
                placeholder="Amount"
                value={newTransaction.amount}
                onChange={(e) =>
                  setNewTransaction((prev) => ({
                    ...prev,
                    amount: parseFloat(e.target.value),
                  }))
                }
                step="0.01"
                className="border rounded-lg px-3 py-2"
              />
             <select
                value={newTransaction.category}
                onChange={(e) =>
                  setNewTransaction((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
                className="border rounded-lg px-3 py-2"
              >
             <option value="food">Food</option>
            <option value="shopping">Shopping</option>
            <option value="transport">Transport</option>
            <option value="housing">Housing</option>
            <option value="entertainment">Entertainment</option>
            <option value="investments">Investments</option>
            <option value="savings">Savings</option>
            <option value="other">Other</option>
            </select>

            </div>
            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => setShowAddForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 flex-1"
              >
                Cancel
              </button>
              <button
                onClick={addTransaction}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex-1"
              >
                Save
              </button>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        {/* <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <div className="flex gap-2">
              <select
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value)}
                className="border rounded-lg px-4 py-2 flex-1"
              >
                <option value="all">All Time</option>
                <option value="day">Last 24 Hours</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
                <option value="custom range">Custom Range</option>
              </select>
              <button
                onClick={() => fetchTransactions()}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                <Filter className="h-5 w-5 inline mr-2" />
                Apply
              </button>
            </div>
          </div>
        </div> */}

<div className="bg-gray-50 rounded-lg p-4 mb-6">
  <div className="flex flex-col sm:flex-row gap-4">
    <div className="flex-1 relative">
      <input
        type="text"
        placeholder="Search transactions..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border rounded-lg"
      />
      <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
    </div>
    <div className="flex gap-2">
      <select
        value={filterPeriod}
        onChange={(e) => setFilterPeriod(e.target.value)}
        className="border rounded-lg px-4 py-2 flex-1"
      >
        <option value="all">All Time</option>
        <option value="day">Last 24 Hours</option>
        <option value="week">This Week</option>
        <option value="month">This Month</option>
        <option value="year">This Year</option>
        <option value="custom range">Custom Range</option>
      </select>
      <button
        onClick={() => fetchTransactions()}
        className="bg-blue-500 text-sm text-center items-center justify-center center text-white px-4 py-2 rounded-lg"
      >
        <TiRefresh className="h-6 w-6 inline mr-2" />
          Refresh 
      </button>
    </div>
  </div>

  {/* Conditional Form for Custom Range or Year */}
  {(filterPeriod === 'custom range' || filterPeriod === 'year') && (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
      {filterPeriod === 'custom range' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
        </>
      )}
      {filterPeriod === 'year' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Select Year
          </label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          >
            {Array.from({ length: 10 }, (_, i) => {
              const year = new Date().getFullYear() - i;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
        </div>
      )}
    </div>
  )}
</div>

        {/* Transactions Table */}
        <div className="bg-white rounded-lg overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden sm:block">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className=" bg-white divide-y divide-gray-200">
                  {transactions.map(renderTableRow)}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Table (Card Layout) */}
          <div className="sm:hidden">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="bg-white border-b border-gray-200 p-4"
              >
                {editingId === transaction.id ? (
                  <div className="space-y-3">
                    <div>
                      <input
                        type="date"
                        value={editData.transaction_date}
                        onChange={(e) => handleInputChange('transaction_date', e.target.value)}
                        className="w-full border rounded px-2 py-1"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={editData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        className="w-full border rounded px-2 py-1"
                      />
                    </div>
                    <div>
                      <select
                        value={editData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="w-full border rounded px-2 py-1"
                      >
                            <option value="food">Food</option>
                        <option value="shopping">Shopping</option>
                        <option value="transport">Transport</option>
                        <option value="housing">Housing</option>
                        <option value="entertainment">Entertainment</option>
                        <option value="investments">Investments</option>
                        <option value="savings">Savings</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <input
                        type="number"
                        value={editData.amount}
                        onChange={(e) => handleInputChange('amount', e.target.value)}
                        className="w-full border rounded px-2 py-1"
                        step="0.01"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={handleSave}
                        className="text-green-600 hover:text-green-900"
                      >
                        <Save className="h-7 w-7" />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium text-gray-900">
                        {format(new Date(transaction.transaction_date), "MMM d, yyyy")}
                      </div>
                      <div
                        className={`text-sm ${
                          transaction.amount >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        ${Math.abs(transaction.amount).toFixed(2)}
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      {transaction.description}
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      {getCategoryIcon(transaction.category)}
                      <span className="text-sm text-gray-700">
                        {transaction.category}
                      </span>
                    </div>
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => handleEdit(transaction)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit2 className="h-7 w-7" />
                      </button>
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-7 w-7" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;