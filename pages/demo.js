import React, { useState } from "react";
import Head from "next/head";
import { format } from "date-fns";
import { PlusCircle, Edit2, Trash2, Save, X, TrendingUp, AlertTriangle } from "lucide-react";
import { FaUtensils, FaShoppingCart, FaCar, FaHome, FaGamepad, DollarSign } from "react-icons/fa";

const DEMO_CATEGORIES = [
  { value: "food", label: "Food", icon: <FaUtensils className="text-green-500" /> },
  { value: "shopping", label: "Shopping", icon: <FaShoppingCart className="text-blue-500" /> },
  { value: "transport", label: "Transport", icon: <FaCar className="text-red-500" /> },
  { value: "housing", label: "Housing", icon: <FaHome className="text-purple-500" /> },
  { value: "entertainment", label: "Entertainment", icon: <FaGamepad className="text-yellow-500" /> },
  { value: "investments", label: "Investments", icon: <TrendingUp className="text-indigo-500" /> },
  { value: "savings", label: "Savings", icon: <DollarSign className="text-teal-500" /> },
  { value: "other", label: "Other", icon: <AlertTriangle className="text-gray-500" /> },
];

const DEMO_TRANSACTIONS = [
  {
    id: 1,
    transaction_date: format(new Date(), "yyyy-MM-dd"),
    description: "Groceries",
    amount: -120.5,
    category: "food",
  },
  {
    id: 2,
    transaction_date: format(new Date(), "yyyy-MM-dd"),
    description: "Salary",
    amount: 2500,
    category: "other",
  },
  {
    id: 3,
    transaction_date: format(new Date(), "yyyy-MM-dd"),
    description: "Bus Ticket",
    amount: -2.75,
    category: "transport",
  },
  {
    id: 4,
    transaction_date: format(new Date(), "yyyy-MM-dd"),
    description: "Movie Night",
    amount: -15,
    category: "entertainment",
  },
];

function formatMoney(amount) {
  return amount.toLocaleString("en-US", { minimumFractionDigits: 2 });
}

export default function ExpenseTrackerDemo() {
  const [transactions, setTransactions] = useState(DEMO_TRANSACTIONS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    transaction_date: format(new Date(), "yyyy-MM-dd"),
    description: "",
    amount: "",
    category: "other",
  });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const handleAdd = () => {
    if (!newTransaction.description || !newTransaction.amount) return;
    setTransactions([
      {
        ...newTransaction,
        id: Date.now(),
        amount: parseFloat(newTransaction.amount),
      },
      ...transactions,
    ]);
    setShowAddForm(false);
    setNewTransaction({
      transaction_date: format(new Date(), "yyyy-MM-dd"),
      description: "",
      amount: "",
      category: "other",
    });
  };

  const handleEdit = (transaction) => {
    setEditingId(transaction.id);
    setEditData({ ...transaction });
  };

  const handleSave = () => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === editingId ? { ...t, ...editData } : t))
    );
    setEditingId(null);
    setEditData({});
  };

  const handleDelete = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const getCategoryIcon = (category) => {
    const found = DEMO_CATEGORIES.find((c) => c.value === category);
    return found ? found.icon : <FaShoppingCart className="text-gray-500" />;
  };

  const totalCredits = transactions
    .filter((t) => t.amount > 0)
    .reduce((acc, t) => acc + t.amount, 0);
  const totalDebits = transactions
    .filter((t) => t.amount < 0)
    .reduce((acc, t) => acc + Math.abs(t.amount), 0);
  const netBalance = totalCredits - totalDebits;

  return (
    <>
      <Head>
        <title>Expense Tracker Demo</title>
        <meta name="robots" content="noindex" />
      </Head>
      <main className="min-h-screen bg-gray-50 py-8 px-2">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-2 text-center">Expense Tracker Demo</h1>
          <p className="text-gray-600 text-base mb-6 text-center">
            Try adding, editing, and deleting expenses. <b>Your data is not saved.</b>
          </p>

          <div className="flex justify-between items-center mb-4">
            <button
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
              onClick={() => setShowAddForm(true)}
            >
              <PlusCircle className="w-5 h-5" />
              Add Transaction
            </button>
            <div className="flex gap-4">
              <span className="text-green-700 font-semibold">
                Credits: ${formatMoney(totalCredits)}
              </span>
              <span className="text-red-700 font-semibold">
                Debits: ${formatMoney(totalDebits)}
              </span>
              <span className="text-gray-900 font-bold">
                Net: ${formatMoney(netBalance)}
              </span>
            </div>
          </div>

          {showAddForm && (
            <div className="mb-6 bg-gray-100 p-4 rounded-lg">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-2">
                <input
                  type="date"
                  value={newTransaction.transaction_date}
                  onChange={(e) =>
                    setNewTransaction((prev) => ({
                      ...prev,
                      transaction_date: e.target.value,
                    }))
                  }
                  className="border rounded px-2 py-1"
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
                  className="border rounded px-2 py-1"
                />
                <input
                  type="number"
                  placeholder="Amount"
                  value={newTransaction.amount}
                  onChange={(e) =>
                    setNewTransaction((prev) => ({
                      ...prev,
                      amount: e.target.value,
                    }))
                  }
                  className="border rounded px-2 py-1"
                  step="0.01"
                />
                <select
                  value={newTransaction.category}
                  onChange={(e) =>
                    setNewTransaction((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="border rounded px-2 py-1"
                >
                  {DEMO_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleAdd}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Description</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Category</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Amount</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) =>
                  editingId === transaction.id ? (
                    <tr key={transaction.id} className="bg-yellow-50">
                      <td className="px-2 py-2">
                        <input
                          type="date"
                          value={editData.transaction_date}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              transaction_date: e.target.value,
                            }))
                          }
                          className="border rounded px-2 py-1"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="text"
                          value={editData.description}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          className="border rounded px-2 py-1"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <select
                          value={editData.category}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              category: e.target.value,
                            }))
                          }
                          className="border rounded px-2 py-1"
                        >
                          {DEMO_CATEGORIES.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                              {cat.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="number"
                          value={editData.amount}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              amount: e.target.value,
                            }))
                          }
                          className="border rounded px-2 py-1"
                          step="0.01"
                        />
                      </td>
                      <td className="px-2 py-2 text-right">
                        <button
                          onClick={handleSave}
                          className="text-green-600 hover:text-green-900 mr-2"
                        >
                          <Save className="h-5 w-5 inline" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <X className="h-5 w-5 inline" />
                        </button>
                      </td>
                    </tr>
                  ) : (
                    <tr key={transaction.id}>
                      <td className="px-2 py-2 text-gray-600">
                        {format(new Date(transaction.transaction_date), "MMM d, yyyy")}
                      </td>
                      <td className="px-2 py-2 text-gray-600">{transaction.description}</td>
                      <td className="px-2 py-2">{getCategoryIcon(transaction.category)}</td>
                      <td
                        className={`px-2 py-2 ${
                          transaction.amount >= 0 ? "text-green-700" : "text-red-700"
                        }`}
                      >
                        ${formatMoney(Math.abs(transaction.amount))}
                      </td>
                      <td className="px-2 py-2 text-right">
                        <button
                          onClick={() => handleEdit(transaction)}
                          className="text-blue-600 hover:text-blue-900 mr-2"
                        >
                          <Edit2 className="h-5 w-5 inline" />
                        </button>
                        <button
                          onClick={() => handleDelete(transaction.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-5 w-5 inline" />
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
          <p className="mt-6 text-xs text-gray-500 text-center">
            This is a demo. No signup or database required. Data resets on refresh.
          </p>
        </div>
      </main>
    </>
  );
}