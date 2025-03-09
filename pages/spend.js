import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { Edit2, Trash2, Save, X, Plus, Search, Filter } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { FaUtensils, FaShoppingCart, FaCar, FaHome, FaGamepad } from 'react-icons/fa';

const App = () => {
  const { user } = useUser();
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ totalCredits: 0, totalDebits: 0, netBalance: 0 });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    transaction_date: format(new Date(), 'yyyy-MM-dd'),
    post_date: format(new Date(), 'yyyy-MM-dd'),
    description: '',
    amount: '',
    category: 'other',
  });
  const [weeklyBudget, setWeeklyBudget] = useState('');
  const [monthlySpending, setMonthlySpending] = useState('');
  const [spendingInsights, setSpendingInsights] = useState('');


  

  useEffect(() => {
    if (!user) return;
    fetchTransactions();
  }, [user]);

  const fetchTransactions = async () => {
    try {
      let query = supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user?.id);
  
      if (filterPeriod === 'day') {
        query = query.gte('transaction_date', format(subDays(new Date(), 1), 'yyyy-MM-dd'));
      } else if (filterPeriod === 'week') {
        query = query
          .gte('transaction_date', format(startOfWeek(new Date()), 'yyyy-MM-dd'))
          .lte('transaction_date', format(endOfWeek(new Date()), 'yyyy-MM-dd'));
      } else if (filterPeriod === 'month') {
        query = query
          .gte('transaction_date', format(startOfMonth(new Date()), 'yyyy-MM-dd'))
          .lte('transaction_date', format(endOfMonth(new Date()), 'yyyy-MM-dd'));
      }
  
      const { data, error: fetchError } = await query.order('transaction_date', { ascending: false });
  
      if (fetchError) throw fetchError;
  
      let filteredData = data || [];
      if (searchTerm) {
        filteredData = filteredData.filter(t => 
          t.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
  
      setTransactions(filteredData);
      calculateSummary(filteredData);
      calculateSpendingInsights(filteredData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async () => {
    if (!user || !newTransaction.description || !newTransaction.amount) return;

    try {
      const { error: insertError } = await supabase
        .from('transactions')
        .insert([
          {
            user_id: user.id,
            ...newTransaction,
          },
        ]);

      if (insertError) throw insertError;

      fetchTransactions();
      setNewTransaction({
        transaction_date: format(new Date(), 'yyyy-MM-dd'),
        post_date: format(new Date(), 'yyyy-MM-dd'),
        description: '',
        amount: 0,
        category: 'other',
      });
      setShowAddForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const calculateSummary = (data) => {
    const summary = data.reduce(
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
  };

  const calculateSpendingInsights = (data) => {
    const totalSpending = data.reduce((acc, curr) => acc + Math.abs(curr.amount), 0);
    const weeklySpending = totalSpending / 4; // Approximate weekly spending
    const monthlySpending = totalSpending;

    setMonthlySpending(monthlySpending);

    if (weeklyBudget > 0) {
      if (weeklySpending > weeklyBudget) {
        setSpendingInsights('You are over your weekly budget. Consider reducing your spending.');
      } else if (weeklySpending === weeklyBudget) {
        setSpendingInsights('You are at your weekly budget limit. Be cautious with further spending.');
      } else {
        setSpendingInsights('You are within your weekly budget. You can continue spending.');
      }
    } else {
      setSpendingInsights('Set a weekly budget to get spending insights.');
    }
  };

  const handleEdit = (transaction) => {
    setEditingId(transaction.id);
    setEditData(transaction);
  };

  const handleSave = async () => {
    if (!editingId || !user) return;

    try {
      const { error: updateError } = await supabase
        .from('transactions')
        .update(editData)
        .eq('id', editingId)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      setTransactions(prev =>
        prev.map(t => (t.id === editingId ? { ...t, ...editData } : t))
      );
      calculateSummary(
        transactions.map(t => (t.id === editingId ? { ...t, ...editData } : t))
      );
      setEditingId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleDelete = async (id) => {
    if (!user) return;

    try {
      const { error: deleteError } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      const updatedTransactions = transactions.filter(t => t.id !== id);
      setTransactions(updatedTransactions);
      calculateSummary(updatedTransactions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }



  
const fetchWeeklyBudget = async () => {
  if (!user?.id) return; // Ensure user is defined

  try {
    console.log('Fetching budget for user:', user.id);

    const { data, error } = await supabase
      .from('weekly_budget')
      .select('amount') // Select only the necessary field
      .eq('user_id', user.id)
      .maybeSingle(); // Prevents errors if no rows exist

    if (error) {
      console.error('Error fetching budget:', error.message);
      throw error;
    }

    console.log('Budget fetched:', data);

    setWeeklyBudget(data ? data.amount : ''); // Set to previous budget or empty
  } catch (err) {
    console.error('Error:', err.message);
    setError(err.message || 'Error fetching budget');
  }
};



  
  const saveWeeklyBudget = async () => {
    if (!user || !weeklyBudget) return;
  
    try {
      // Check if the user already has a budget entry
      const { data, error: fetchError } = await supabase
        .from('weekly_budget')
        .select('*')
        .eq('user_id', user.id)
        .single();
  
      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError; // Ignore 'no rows found' error
  
      if (data) {
        // If a budget exists, update it
        const { error: updateError } = await supabase
          .from('weekly_budget')
          .update({ amount: weeklyBudget, created_at: new Date() })
          .eq('user_id', user.id);
  
        if (updateError) throw updateError;
      } else {
        // If no budget exists, insert a new one
        const { error: insertError } = await supabase
          .from('weekly_budget')
          .insert([{ user_id: user.id, amount: weeklyBudget }]);
  
        if (insertError) throw insertError;
      }
  
      fetchWeeklyBudget();
    } catch (err) {
      setError(err.message || 'Error saving budget');
    }
  };
  

  const deleteWeeklyBudget = async () => {
    if (!user) return;
  
    try {
  
      const { error } = await supabase
        .from('weekly_budget')
        .delete()
        .eq('user_id', user.id)
  
      if (error) throw error;
  
      setWeeklyBudget('');
    } catch (err) {
      setError(err.message || 'Error deleting budget');
    }
  };
  
  
  return (
    <div className="min-h-screen bg-white p-6">
      <div className="sm:w-full md:max-w-7xl lg:max-w-7xl mx-auto">
        <h1 className="text-xl text-lg text-gray-900 mb-8">
          Transactions
        </h1>

        {/* Weekly Budget and Monthly Spending */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">

<div className="mb-6 flex flex-col md:flex-row gap-4">
<div className="flex-1">
  <label className="block text-sm font-medium text-gray-700">Weekly Budget</label>
  <input
    type="number"
    value={weeklyBudget}
    onChange={e => setWeeklyBudget(parseFloat(e.target.value))}
    className="border rounded px-3 py-2 w-full"
  />
</div>

  <button
    onClick={saveWeeklyBudget}
    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
  >
    Save Budget
  </button>
  {weeklyBudget && (
    <button
      onClick={deleteWeeklyBudget}
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
    >
      Delete Budget
    </button>
  )}
</div>


          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Monthly Spending</label>
            <input
              type="text"
              value={`$${monthlySpending.toFixed(2)}`}
              readOnly
              className="border rounded px-3 py-2 w-full bg-gray-100"
            />
          </div>
        </div>

        {/* Spending Insights */}
        <div className="bg-white rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-700">{spendingInsights}</p>
        </div>

        {/* Add Transaction Form */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            <Plus className="h-5 w-5 inline mr-2" />
            Add Transaction
          </button>
        </div>

        {/* Summary Cards */}


        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {showAddForm && (
          <div className="bg-white rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Add New Transaction</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="date"
                value={newTransaction.transaction_date}
                onChange={e => setNewTransaction(prev => ({ ...prev, transaction_date: e.target.value }))}
                className="border rounded px-3 py-2"
              />
              <input
                type="date"
                value={newTransaction.post_date}
                onChange={e => setNewTransaction(prev => ({ ...prev, post_date: e.target.value }))}
                className="border rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="Description"
                value={newTransaction.description}
                onChange={e => setNewTransaction(prev => ({ ...prev, description: e.target.value }))}
                className="border rounded px-3 py-2"
              />
              <input
                type="number"
                placeholder="Amount"
                value={newTransaction.amount}
                onChange={e => setNewTransaction(prev => ({ ...prev, amount: parseFloat(e.target.value) }))}
                step="0.01"
                className="border rounded px-3 py-2"
              />
              <select
                value={newTransaction.category}
                onChange={e => setNewTransaction(prev => ({ ...prev, category: e.target.value }))}
                className="border rounded px-3 py-2"
              >
                <option value="food">Food</option>
                <option value="shopping">Shopping</option>
                <option value="transport">Transport</option>
                <option value="housing">Housing</option>
                <option value="entertainment">Entertainment</option>
                <option value="gas">Gas</option>

                <option value="other">Other</option>
              </select>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setShowAddForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={addTransaction}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Add Transaction
              </button>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterPeriod}
                onChange={e => setFilterPeriod(e.target.value)}
                className="border rounded px-4 py-2"
              >
                <option value="all">All Time</option>
                <option value="day">Last 24 Hours</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
              <button
                onClick={() => fetchTransactions()}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                <Filter className="h-5 w-5 inline mr-2" />
                Apply
              </button>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map(transaction => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === transaction.id ? (
                        <input
                          type="date"
                          value={editData.transaction_date}
                          onChange={e =>
                            setEditData(prev => ({
                              ...prev,
                              transaction_date: e.target.value,
                            }))
                          }
                          className="border rounded px-2 py-1 w-full"
                        />
                      ) : (
                        format(new Date(transaction.transaction_date), 'MMM d, yyyy')
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === transaction.id ? (
                        <input
                          type="text"
                          value={editData.description}
                          onChange={e =>
                            setEditData(prev => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          className="border rounded px-2 py-1 w-full"
                        />
                      ) : (
                        transaction.description
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getCategoryIcon(transaction.category)}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap ${
                        transaction.amount >= 0
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {editingId === transaction.id ? (
                        <input
                          type="number"
                          value={editData.amount}
                          onChange={e =>
                            setEditData(prev => ({
                              ...prev,
                              amount: parseFloat(e.target.value),
                            }))
                          }
                          step="0.01"
                          className="border rounded px-2 py-1"
                        />
                      ) : (
                        `$${Math.abs(transaction.amount).toFixed(2)}`
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {editingId === transaction.id ? (
                        <div className="space-x-2">
                          <button
                            onClick={handleSave}
                            className="text-green-600 hover:text-green-900"
                          >
                            <Save className="h-5 w-5 inline" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <X className="h-5 w-5 inline" />
                          </button>
                        </div>
                      ) : (
                        <div className="space-x-2">
                          <button
                            onClick={() => handleEdit(transaction)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit2 className="h-5 w-5 inline" />
                          </button>
                          <button
                            onClick={() => handleDelete(transaction.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-5 w-5 inline" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;