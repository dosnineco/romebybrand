import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '../lib/supabase';
import { Save, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/router';

const Settings = () => {
  const { user } = useUser();
  const router = useRouter();
  const [monthlyBudget, setMonthlyBudget] = useState('');
  const [categoryLimits, setCategoryLimits] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const categories = [
    'food', 'groceries', 'dining_out',
    'shopping', 'clothing', 'electronics',
    'transport', 'fuel', 'public_transport',
    'housing', 'rent', 'utilities',
    'entertainment', 'movies', 'subscriptions',
    'healthcare', 'insurance', 'education',
    'investments', 'donations', 'travel',
    'fitness', 'pets', 'other'
  ];

  useEffect(() => {
    if (user) {
      fetchBudgetSettings();
    }
  }, [user]);

  const fetchBudgetSettings = async () => {
    try {
      // Fetch monthly budget
      const { data: budgetData } = await supabase
        .from('monthly_budgets')
        .select('amount')
        .eq('user_id', user.id)
        .eq('month', new Date().toISOString().slice(0, 7) + '-01')
        .single();

      if (budgetData) {
        setMonthlyBudget(budgetData.amount.toString());
      }

      // Fetch category limits
      const { data: limitsData } = await supabase
        .from('category_limits')
        .select('category, limit_amount')
        .eq('user_id', user.id);

      const limits = {};
      limitsData?.forEach(limit => {
        limits[limit.category] = limit.limit_amount.toString();
      });
      setCategoryLimits(limits);
    } catch (err) {
      setError('Failed to load budget settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Ensure the monthly budget is always updated
      await supabase
        .from('monthly_budgets')
        .upsert([
          {
            user_id: user.id,
            month: new Date().toISOString().slice(0, 7) + '-01',
            amount: parseFloat(monthlyBudget) || 0
          }
        ], { onConflict: ['user_id', 'month'] });

      // Fetch existing category limits from DB
      const { data: existingLimits } = await supabase
        .from('category_limits')
        .select('category')
        .eq('user_id', user.id);

      const existingCategories = existingLimits?.map(limit => limit.category) || [];

      const updates = [];
      const deletions = [];

      Object.entries(categoryLimits).forEach(([category, amount]) => {
        if (amount) {
          updates.push({
            user_id: user.id,
            category,
            limit_amount: parseFloat(amount) || 0
          });
        } else if (existingCategories.includes(category)) {
          deletions.push(category);
        }
      });

      // Update category limits
      if (updates.length > 0) {
        await supabase
          .from('category_limits')
          .upsert(updates, { onConflict: ['user_id', 'category'] });
      }

      // Remove categories that the user emptied out
      if (deletions.length > 0) {
        await supabase
          .from('category_limits')
          .delete()
          .eq('user_id', user.id)
          .in('category', deletions);
      }

      setSuccess('Settings saved successfully!');
    } catch (err) {
      console.error('Save Error:', err);
      setError('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <button 
          className="bg-gray-500 text-white p-2 rounded-lg mb-4 flex items-center"
          onClick={() => router.push('spend')}
        >
          ← Back to Transactions
        </button>

        <div className="bg-white  p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Budget Settings</h1>

          {error && (
            <div className="mb-3 w-full p-3 bg-red-100 text-red-700 rounded-lg flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}

          {success && (
            <div className="mb-3 w-full p-3 bg-green-100 text-green-700 rounded-lg">
              {success}
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monthly Budget
            </label>
            <input
              type="number"
              value={monthlyBudget}
              onChange={(e) => setMonthlyBudget(e.target.value)}
              className="focus:ring-gray-500 focus:border-gray-200 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md w-40 pl-10 pr-4 py-2 border rounded-lg"
              placeholder="00.00"
              step="0.01"
            />
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Category Limits</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map((category) => (
                <div key={category} className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 capitalize">
                    {category.replace('_', ' ')}
                  </label>
                  <input
                    type="number"
                    value={categoryLimits[category] || ''}
                    onChange={(e) => setCategoryLimits(prev => ({
                      ...prev,
                      [category]: e.target.value
                    }))}
                    className="focus:ring-gray-500 focus:border-gray-200 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md w-full pl-10 pr-4 py-2 border rounded-lg"
                    placeholder="00.00"
                    step="0.01"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className={`flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${
                saving ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Save className="h-5 w-5 mr-2" />
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
