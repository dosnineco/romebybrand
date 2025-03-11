import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { motion } from "framer-motion";
import { useUser } from "@clerk/clerk-react";
import { Dialog } from "@headlessui/react";
import { useRouter } from "next/router";
import { FaPlusCircle } from 'react-icons/fa';


export default function QuickExpenses() {
  const { user } = useUser();
  const router = useRouter();
  const userId = user ? user.id : null;
  const [expenses, setExpenses] = useState([]);
  const [presets, setPresets] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPreset, setNewPreset] = useState({ label: "", amount: "" });
  const now = new Date();
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
  .toISOString()
  .split("T")[0];

  useEffect(() => {
    if (userId) {
      fetchPresets();
    }
  }, [userId]);

  const fetchPresets = async () => {
    const { data, error } = await supabase
      .from("presets")
      .select("id, label, amount")
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
    
    const { error } = await supabase.from("transactions").insert([
      {
        user_id: userId,
        transaction_date: localDate,
        post_date: localDate,
        description: label,
        amount: amount,
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
    
    if (newPreset.label && newPreset.amount) {
      const amount = parseFloat(newPreset.amount);
      if (!isNaN(amount)) {
        const { error } = await supabase.from("presets").insert([
          {
            user_id: userId,
            label: newPreset.label,
            amount
          }
        ]);
        if (error) console.error("Error saving preset:", error);
        else {
          setPresets([...presets, { id: Date.now(), label: newPreset.label, amount }]);
          setNewPreset({ label: "", amount: "" });
          setIsDialogOpen(false);
        }
      }
    }
  };

  const deletePreset = async (id) => {
    setPresets(presets.filter((preset) => preset.id !== id));
    
    const { error } = await supabase.from("presets").delete().eq("id", id);
    if (error) console.error("Error deleting preset:", error);
  };

  return (
    <div className="p-4 w-[800px] sm:w-full mx-auto  text-gray-800 rounded-lg  relative">
      <h2 className="text-lg font-semibold mb-4">Quick Expenses</h2>
       <button className="bg-gray-500 text-white p-2 rounded-lg mb-4 flex items-center" onClick={() => router.push('/spend')}>
        ← Expenses
      </button>
      <div className="  flex flex-col gap-2 mb-4">
        {presets.map((preset) => (
          <motion.div
            key={preset.id}
            className="w-auto bg-gray-200 text-gray-700 p-2 rounded-lg cursor-pointer flex justify-between items-center"
            onClick={() => addExpense(preset.label, preset.amount)}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(event, info) => {
              if (info.offset.x < -100) deletePreset(preset.id);
            }}
          >
            <span>{preset.label} - ${preset.amount}</span>
          </motion.div>
        ))}
      </div>
      <button className="bg-gray-300  text-black  flex justify-start items-center p-4 rounded-lg" onClick={() => setIsDialogOpen(true)}>
        <FaPlusCircle/>
      </button>
      <h3 className="text-lg font-semibold mt-4 mb-2">Expense Log</h3>
      <ul className=" p-2 rounded-lg">
        {expenses.map((expense, index) => (
          <motion.li key={index} className="border-b py-1 flex justify-between items-center">
            <span>{expense.label} - ${expense.amount} <span className="text-xs text-gray-500">({expense.date})</span></span>
          </motion.li>
        ))}
      </ul>

      {/* Add Preset Dialog */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-80 relative">
          <h2 className="text-lg font-semibold mb-4">Add Preset</h2>
          <input
            type="text"
            placeholder="eg. Groceries"
            className="w-full p-2 mb-2 border rounded"
            value={newPreset.label}
            onChange={(e) => setNewPreset({ ...newPreset, label: e.target.value })}
          />
          <input
            type="number"
            placeholder="eg. 5000"
            className="w-full p-2 mb-4 border rounded"
            value={newPreset.amount}
            onChange={(e) => setNewPreset({ ...newPreset, amount: e.target.value })}
          />
          <div className="flex justify-end gap-2">
            <button className="bg-gray-500 text-white p-2 rounded" onClick={() => setIsDialogOpen(false)}>Cancel</button>
            <button className="bg-gray-700 text-white p-2 rounded" onClick={addPreset}>Save</button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
