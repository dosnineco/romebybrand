import { useState, useEffect } from "react";
import Head from "next/head";
import { supabase } from "../../lib/supabase";
import { useUser } from "@clerk/nextjs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function PageViewsAdmin() {
  const { user } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [pageViews, setPageViews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [graphData, setGraphData] = useState([]);

  const PAGE_SIZE = 10;

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
        fetchPageViews();
      } else {
        setIsAdmin(false);
        setLoading(false);
      }
    };

    const fetchPageViews = async () => {
      setLoading(true);

      const { data, error, count } = await supabase
        .from("page_views")
        .select("*", { count: "exact" })
        .ilike("page_url", `%${searchQuery}%`)
        .order("view_count", { ascending: false })
        .range((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE - 1);

      if (error) {
        console.error("Error fetching page views:", error);
      } else {
        setPageViews(data);
        setTotalPages(Math.ceil(count / PAGE_SIZE));
        prepareGraphData(data);
      }
      setLoading(false);
    };

    const prepareGraphData = (data) => {
      const graphData = data.map((page) => ({
        page: page.page_url,
        views: page.view_count,
      }));
      setGraphData(graphData);
    };

    checkAdminStatus();
  }, [user, searchQuery, currentPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to the first page when searching
    fetchPageViews();
  };

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
        <title>Admin - Page Views</title>
        <meta name="description" content="View all live and current page views on the website." />
        <meta name="keywords" content="Admin, Page Views, Analytics" />
        <link rel="canonical" href="https://expensegoose.com/admin/page-views" />
      </Head>

      <main className="max-w-screen-md mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-6">Page Views Dashboard</h1>

        <form onSubmit={handleSearch} className="mb-6">
          <label htmlFor="search" className="block text-base text-gray-700 mb-2">
            Search by URL
          </label>
          <div className="flex">
            <input
              id="search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow p-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter page URL"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
            >
              Search
            </button>
          </div>
        </form>

        {loading ? (
          <p className="text-center text-gray-700">Loading...</p>
        ) : (
          <>
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Live Page Views</h2>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">Page URL</th>
                    <th className="border border-gray-300 px-4 py-2 text-right">View Count</th>
                    <th className="border border-gray-300 px-4 py-2 text-right">Last Viewed</th>
                  </tr>
                </thead>
                <tbody>
                  {pageViews.map((page) => (
                    <tr key={page.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">{page.page_url}</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">{page.view_count}</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        {new Date(page.last_viewed).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Most Viewed Pages</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={graphData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="page" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="views" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </section>

            <div className="flex justify-between items-center">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50"
              >
                Previous
              </button>
              <p className="text-gray-700">
                Page {currentPage} of {totalPages}
              </p>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}

        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Tips for Using This Dashboard</h2>
          <ul className="list-disc list-inside mb-4 text-base">
            <li>Use the search bar to quickly find specific pages.</li>
            <li>Analyze the graph to identify the most popular pages.</li>
            <li>Use pagination to navigate through large datasets efficiently.</li>
          </ul>
        </section>
      </main>
    </>
  );
}