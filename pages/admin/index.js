import Link from "next/link";
import Head from "next/head";

export default function AdminDashboard() {
  const adminPages = [
    { title: "Analytics Dashboard", path: "/admin/analytics" },
    { title: "Blog Admin", path: "/admin/blog-admin" },
    { title: "Indexing Tool", path: "/admin/indexing" },
    { title: "Subscribers", path: "/admin/subscribers" },
  ];

  return (
    <>
      <Head>
        <title>Admin Dashboard</title>
        <meta name="description" content="Admin dashboard with links to all admin tools and pages." />
        <meta name="keywords" content="admin, dashboard, tools, analytics, settings" />
        <link rel="canonical" href="/admin" />
      </Head>

      <div className="w-full max-w-screen-md mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-6">Admin Dashboard</h1>
        <p className="text-base text-gray-700 mb-4 text-center">
          Access all admin tools and pages from here.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {adminPages.map((page) => (
            <Link className="block p-4 bg-gray-100 rounded-lg " transition key={page.path} href={page.path}>
             
                <h2 className="text-xl  text-center font-semibold text-gray-600">{page.title}</h2>
                <p className="text-sm  text-center  text-gray-500">Go to {page.title}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}