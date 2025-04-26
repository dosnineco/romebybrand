import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useUser } from '@clerk/nextjs';

export default function AdminBasicPrices() {
  const { user } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [items, setItems] = useState([
    { item: '', price: '', range: '' }
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('is_admin')
        .eq('clerk_id', user.id)
        .single();

      if (data?.is_admin) {
        setIsAdmin(true);
      }
    };

    if (user) {
      checkAdminStatus();
    }
  }, [user]);

  const handleChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const addNewItem = () => {
    setItems([...items, { item: '', price: '', range: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('basic_prices')
      .insert(items.map(i => ({
        item: i.item,
        price: parseFloat(i.price),
        range: i.range
      })));

    setLoading(false);

    if (!error) {
      setItems([{ item: '', price: '', range: '' }]);
      alert('Items saved successfully!');
    } else {
      console.error(error);
      alert('Error saving items.');
    }
  };

  if (!isAdmin) {
    return <p className="text-center mt-10">You do not have access to this page.</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin - Manage Basic Prices</h1>
      <form onSubmit={handleSubmit}>
        {items.map((item, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="Item Name"
              value={item.item}
              onChange={(e) => handleChange(index, 'item', e.target.value)}
              className="border rounded-lg px-3 py-2"
              required
            />
            <input
              type="number"
              placeholder="Price"
              value={item.price}
              onChange={(e) => handleChange(index, 'price', e.target.value)}
              className="border rounded-lg px-3 py-2"
              required
            />
            <input
              type="text"
              placeholder="Range (e.g., 100-200)"
              value={item.range}
              onChange={(e) => handleChange(index, 'range', e.target.value)}
              className="border rounded-lg px-3 py-2"
              required
            />
          </div>
        ))}

        <div className="flex gap-4">
          <button
            type="button"
            onClick={addNewItem}
            className="bg-green-500 text-white px-4 py-2 rounded-lg"
          >
            Add Another
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save All'}
          </button>
        </div>
      </form>
    </div>
  );
}
