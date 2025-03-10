import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { motion } from "framer-motion";
import { useUser } from "@clerk/clerk-react";

export default function QuickExpenses() {
  const { user } = useUser();
  const userId = user ? user.id : null;
  const [expenses, setExpenses] = useState([]);
  const [presets, setPresets] = useState([]);

  useEffect(() => {
    if (userId) {
      fetchPresets();
    }
  }, [userId]);

  const fetchPresets = async () => {
    const { data, error } = await supabase
      .from("presets")
      .select("label, amount")
      .eq("user_id", userId);
    if (error) console.error("Error fetching presets:", error);
    else setPresets(data);
  };

  const addExpense = async (label, amount) => {
    if (!userId) {
      console.error("User not logged in");
      return;
    }

    const newExpense = { label, amount, date: new Date().toLocaleString() };
    setExpenses([...expenses, newExpense]);
    
    // Save to Supabase
    const { error } = await supabase.from("transactions").insert([
      {
        user_id: userId,
        transaction_date: new Date().toISOString().split("T")[0],
        post_date: new Date().toISOString().split("T")[0],
        description: label,
        amount: -amount, // Assuming expenses are negative
        category: "other"
      }
    ]);
    if (error) console.error("Error saving expense:", error);
  };

  const addPreset = async () => {
    if (!userId) {
      console.error("User not logged in");
      return;
    }
    
    const label = prompt("Enter expense label:");
    const amount = parseInt(prompt("Enter amount:"), 10);
    if (label && !isNaN(amount)) {
      setPresets([...presets, { label, amount }]);
      
      // Save preset to Supabase
      const { error } = await supabase.from("presets").insert([
        {
          user_id: userId,
          label,
          amount
        }
      ]);
      if (error) console.error("Error saving preset:", error);
    }
  };

  return (
    <div className="p-4 w-96 mx-auto bg-white ">
      <h2 className="text-xl font-bold mb-4">Quick Expenses</h2>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {presets.map((preset, index) => (
          <button
            key={index}
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
            onClick={() => addExpense(preset.label, preset.amount)}
          >
            {preset.label} - ${preset.amount}
          </button>
        ))}
      </div>
      <button className="bg-green-500 text-white p-2 rounded-lg mb-4" onClick={addPreset}>
        + Add Preset
      </button>
      <h3 className="text-lg font-semibold mb-2">Expense Log</h3>
      <ul className="bg-gray-100 p-2 rounded-lg">
        {expenses.map((expense, index) => (
          <motion.li
            key={index}
            className="border-b py-1 flex justify-between items-center"
          >
            <span>{expense.label} - ${expense.amount} <span className="text-xs text-gray-500">({expense.date})</span></span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
