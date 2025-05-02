import { useState, useEffect } from "react";
import Head from "next/head";
import { supabase } from "../../lib/supabase";
import { useUser } from "@clerk/nextjs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";


export default function PageViewsAdmin() {
  const { user } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("users")
        .select("is_admin")
        .eq("clerk_id", user.id)
        .single();

      if (data?.is_admin) {
        setIsAdmin(true);
        fetchUsers();
      } else {
        setIsAdmin(false);
        setLoading(false);
      }
    };

    const fetchUsers = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("users")
        .select("email, full_name, referrer");

      if (error) {
        console.error("Error fetching users:", error);
      } else {
        setUsers(data);
      }
      setLoading(false);
    };

    checkAdminStatus();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-screen-md mx-auto px-4 py-8">
        <p className="text-center text-gray-700 mt-10">You must be logged in to access this page.</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-screen-md mx-auto px-4 py-8">
        <p className="text-center text-gray-700 mt-10">You do not have access to this page.</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Admin - User Referrals</title>
        <meta name="description" content="View user referral data." />
      </Head>

      <main className="max-w-screen-md mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-6">User Referrals</h1>

        {loading ? (
          <p className="text-center text-gray-700">Loading...</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Full Name</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Referrer</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.email} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.full_name}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.referrer || "Direct"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </>
  );
}