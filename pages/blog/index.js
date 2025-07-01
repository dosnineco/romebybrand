import { supabase } from "../../lib/supabase";
import Head from "next/head";
import Link from "next/link";

export async function getStaticProps() {
  const { data } = await supabase
    .from("blog_posts")
    .select("id, title, slug, summary, coverimageurl, publishedat")
    .eq("ispublished", true)
    .order("publishedat", { ascending: false });

  return {
    props: { posts: data || [] },
    revalidate: 60,
  };
}

export default function BlogIndex({ posts }) {
  return (
    <>
      <Head>
        <title>Blog | Expense Goose</title>
        <meta name="description" content="Read the latest posts from Expense Goose." />
      </Head>
      <main className="max-w-screen-md mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Blog</h1>
        <ul className="space-y-8">
          {posts.map((post) => (
            <li key={post.id} className="border-b pb-6">
              <Link href={`/blog/${post.slug}`}>
                <h2 className="text-2xl font-semibold text-blue-600 hover:underline mb-2">
                  {post.title}
                </h2>
              </Link>
              {/* <p className="text-gray-700 mb-2">{post.summary}</p> */}
              {post.coverimageurl && (
                <img
                  src={post.coverimageurl}
                  alt={post.title}
                  className="w-full max-h-48 object-cover rounded mb-2"
                />
              )}
              <p className="text-sm text-gray-500">
                Published on{" "}
                {post.publishedat && !isNaN(new Date(post.publishedat))
                  ? new Date(post.publishedat).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Unknown date"}
              </p>
              <Link
                href={`/blog/${post.slug}`}
                className="inline-block mt-2 text-blue-500 hover:underline"
              >
                Read more &rarr;
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}