import { supabase } from "../../lib/supabase";
import Head from "next/head";
import RichTextRenderer from "../../components/blog_components/RichTextRenderer";
import BreadcrumbsMinimal from '../../components/BreadCrumbs/BreadcrumbsWithIcons';

export async function getStaticPaths() {
  // Fetch all published posts' slugs
  const { data } = await supabase
    .from("blog_posts")
    .select("slug")
    .eq("ispublished", true);

  const paths = (data || []).map((post) => ({
    params: { slug: post.slug },
  }));

  return { paths, fallback: "blocking" };
}

export async function getStaticProps({ params }) {
  const { slug } = params;
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("ispublished", true)
    .single();

  if (!data) {
    return { notFound: true };
  }

  return {
    props: { post: data },
    revalidate: 60, // ISR: revalidate every 60 seconds
  };
}

export default function BlogPostPage({ post }) {
  return (
    <>
      <Head>
        <title>{post.title} | Expense Goose Blog</title>
        <meta name="description" content={post.summary} />
        <meta name="keywords" content={post.title} />
        <link rel="canonical" href={`https://www.expensegoose.com/blog/${post.slug}`} />
      </Head>
      <main className="max-w-screen-md mx-auto px-4 py-8">
       <BreadcrumbsMinimal/>

        <h1 className="text-3xl font-bold text-center mb-6">{post.title}</h1>
        <p className="text-base text-gray-700 mb-4 ">{post.summary}</p>
        {post.coverimageurl && (
          <img
            src={post.coverimageurl}
            alt={post.title}
            className="w-full max-h-96 object-cover rounded mb-6"
          />
        )}
        {/* <RichTextRenderer html={post.content} /> */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">Published on {new Date(post.created_at).toLocaleDateString()}</p>
        </div>
      </main>
    </>
  );
}