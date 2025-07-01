import { useEffect, useState, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { supabase } from "../../lib/supabase";
import Head from "next/head";
import PublishedBlogList from "../../components/blog_components/PublishedBlogList";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import DOMPurify from "dompurify";
import RichTextRenderer from "../../components/blog_components/RichTextRenderer";

const emptyPost = {
  id: "",
  title: "",
  slug: "",
  summary: "",
  content: "",
  coverimageurl: "",
  ispublished: false,
  publishedat: null,
  authorid: "",
  createdat: "",
  updatedat: "",
};

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function sanitizeInput(input) {
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}

export default function BlogAdmin() {
  const { user, isSignedIn } = useUser();
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyPost);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  // Tiptap editor instance with Image extension
  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: form.content,
    onUpdate: ({ editor }) => {
      setForm((f) => ({ ...f, content: editor.getHTML() }));
    },
  });

  // Sync Tiptap content and editability when editing a post
  useEffect(() => {
    if (editor) {
      if (editing) {
        editor.commands.setContent(form.content || "");
        editor.setEditable(true);
      } else {
        editor.setEditable(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing, editor]);

  useEffect(() => {
    if (!isSignedIn) return;
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn]);

  async function fetchPosts() {
    setLoading(true);
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("createdat", { ascending: false });
    if (!error) setPosts(data);
    setLoading(false);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: sanitizeInput(value),
    }));
    // Auto-generate slug if editing title and not published
    if (name === "title" && !form.ispublished && editing === "new") {
      setForm((f) => ({
        ...f,
        slug: slugify(value),
      }));
    }
  }

  function editPost(post) {
    setEditing(post.id);
    setForm({ ...post });
  }

  function newPost() {
    setEditing("new");
    setForm({
      ...emptyPost,
      authorid: user.id,
      createdat: new Date().toISOString(),
      updatedat: new Date().toISOString(),
    });
    if (editor) {
      editor.commands.setContent("");
    }
  }

  // Upload cover image to Supabase Storage and set public URL
  async function uploadCoverImage(e) {
    const file = e.target.files[0];
    if (!file) return;
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    let { error } = await supabase.storage.from("blog-covers").upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });

    if (error) {
      alert("Upload failed: " + error.message);
      return;
    }

    // Get public URL
    const { data } = supabase.storage.from("blog-covers").getPublicUrl(filePath);
    setForm((f) => ({
      ...f,
      coverimageurl: data.publicUrl,
    }));
  }

  // Upload image for rich text content and insert into editor
  async function uploadEditorImage(e) {
    const file = e.target.files[0];
    if (!file) return;
    const fileExt = file.name.split('.').pop();
    const fileName = `editor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    let { error } = await supabase.storage.from("blog-covers").upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });

    if (error) {
      alert("Upload failed: " + error.message);
      return;
    }

    const { data } = supabase.storage.from("blog-covers").getPublicUrl(filePath);
    if (editor && data.publicUrl) {
      editor.chain().focus().setImage({ src: data.publicUrl }).run();
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function savePost(publish = false) {
    setLoading(true);
    const now = new Date().toISOString();

    // Sanitize all fields before saving
    let post = {
      ...form,
      title: sanitizeInput(form.title),
      slug: sanitizeInput(form.slug),
      summary: sanitizeInput(form.summary),
      content: DOMPurify.sanitize(form.content),
      ispublished: publish ? true : form.ispublished,
      publishedat: publish ? now : form.publishedat,
      updatedat: now,
      authorid: user.id,
    };
    if (!post.id) delete post.id;

    const { error } = await supabase
      .from("blog_posts")
      .upsert([post], { onConflict: "id" });

    if (error) {
      alert("Error saving post: " + error.message);
      setLoading(false);
      return;
    }

    setEditing(null);
    setForm(emptyPost);
    if (editor) editor.commands.setContent("");
    await fetchPosts();
    setLoading(false);
    alert(`Post ${publish ? "published" : "saved as draft"} successfully!`);
  }

  function cancelEdit() {
    setEditing(null);
    setForm(emptyPost);
    if (editor) editor.commands.setContent("");
  }

  return (
    <>
      <Head>
        <meta name="description" content="Create, edit, and publish blog posts." />
      </Head>
      <main className="max-w-screen-md mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-6">Blog Admin Editor</h1>
        <p className="text-base text-gray-700 mb-4 text-center">
          Create, edit, and publish blog posts.
        </p>
        {!editing && (
          <>
            <button
              className="mb-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400"
              onClick={newPost}
            >
              Add a New Post
            </button>
            <section>
              <h2 className="text-2xl font-semibold mb-4">All Posts</h2>
              <ul className="list-disc list-inside mb-4 text-base">
                {posts.map((post) => (
                  <li key={post.id} className="mb-2 flex justify-between items-center">
                    <span>
                      <span className="font-semibold">{post.title}</span>
                      <span className="ml-2 text-gray-500 text-sm">
                        {post.ispublished ? "Published" : "Draft"}
                      </span>
                    </span>
                    <button
                      className="px-4 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 focus:ring-2 focus:ring-blue-400"
                      onClick={() => editPost(post)}
                    >
                      Edit
                    </button>
                  </li>
                ))}
              </ul>
            </section>
            <PublishedBlogList posts={posts} />
          </>
        )}

        {editing && (
          <form
            className="bg-white p-6 rounded-lg w-full mx-auto"
            onSubmit={(e) => {
              e.preventDefault();
              savePost(false);
            }}
          >
            <h2 className="text-2xl font-semibold mb-4">{editing === "new" ? "New Post" : "Edit Post"}</h2>
            <div className="mb-4">
              <label className="block font-semibold mb-1" htmlFor="title">
                Title
              </label>
              <input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full border px-2 py-2 rounded text-base"
                required
                disabled={form.ispublished}
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1" htmlFor="slug">
                Slug
              </label>
              <input
                id="slug"
                name="slug"
                value={form.slug}
                onChange={handleChange}
                className="w-full border px-2 py-2 rounded text-base"
                required
                disabled={form.ispublished}
              />
              {form.ispublished && (
                <p className="text-xs text-gray-500 mt-1">Slug cannot be changed after publishing.</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1" htmlFor="summary">
                Summary
              </label>
              <textarea
                id="summary"
                name="summary"
                value={form.summary}
                onChange={handleChange}
                className="w-full border px-2 py-2 rounded text-base"
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1" htmlFor="coverimageurl">
                Cover Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={uploadCoverImage}
                className="mb-2"
              />
              {form.coverimageurl && (
                <img
                  src={form.coverimageurl}
                  alt="Cover"
                  className="w-full max-h-48 object-cover rounded mb-2"
                />
              )}
              <input
                id="coverimageurl"
                name="coverimageurl"
                value={form.coverimageurl}
                onChange={handleChange}
                className="w-full border px-2 py-2 rounded text-base"
                placeholder="Or paste an image URL"
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Content</label>
              <div className="flex items-center gap-2 mb-2">
                <button
                  type="button"
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                >
                  Insert Image
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={uploadEditorImage}
                />
              </div>
              <div className=" rounded bg-white w-full h-full relative">
                {editor && (
                  <>
                    <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
                      <div className="flex gap-2 bg-white border rounded shadow px-2 py-1">
                        <button
                          type="button"
                          className={`font-bold ${editor.isActive('bold') ? 'text-blue-600' : ''}`}
                          onClick={() => editor.chain().focus().toggleBold().run()}
                        >
                          B
                        </button>
                        <button
                          type="button"
                          className={`italic ${editor.isActive('italic') ? 'text-blue-600' : ''}`}
                          onClick={() => editor.chain().focus().toggleItalic().run()}
                        >
                          I
                        </button>
                        <button
                          type="button"
                          className={`underline ${editor.isActive('underline') ? 'text-blue-600' : ''}`}
                          onClick={() => editor.chain().focus().toggleUnderline().run()}
                        >
                          U
                        </button>
                        <button
                          type="button"
                          className={editor.isActive('strike') ? 'text-blue-600' : ''}
                          onClick={() => editor.chain().focus().toggleStrike().run()}
                        >
                          S
                        </button>
                        <button
                          type="button"
                          className={editor.isActive('heading', { level: 1 }) ? 'text-blue-600' : ''}
                          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        >
                          H1
                        </button>
                        <button
                          type="button"
                          className={editor.isActive('heading', { level: 2 }) ? 'text-blue-600' : ''}
                          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        >
                          H2
                        </button>
                        <button
                          type="button"
                          className={editor.isActive('heading', { level: 3 }) ? 'text-blue-600' : ''}
                          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        >
                          H3
                        </button>
                        <button
                          type="button"
                          className={editor.isActive('bulletList') ? 'text-blue-600' : ''}
                          onClick={() => editor.chain().focus().toggleBulletList().run()}
                        >
                          •••
                        </button>
                        <button
                          type="button"
                          className={editor.isActive('orderedList') ? 'text-blue-600' : ''}
                          onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        >
                          123
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const url = window.prompt('Enter URL');
                            if (url) {
                              editor.chain().focus().setLink({ href: url }).run();
                            }
                          }}
                        >
                          Url
                        </button>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current && fileInputRef.current.click()}
                        >
                          Img
                        </button>
                      </div>
                    </BubbleMenu>
                    <EditorContent
                      className="prose prose-lg w-full min-h-[300px] p-4 border rounded bg-gray-50"

                    editor={editor} />
                  </>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-400"
                disabled={loading}
              >
                Save Draft
              </button>
              <button
                type="button"
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400"
                onClick={() => savePost(true)}
                disabled={loading}
              >
                {form.ispublished ? "Update & Publish" : "Publish"}
              </button>
              <button
                type="button"
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:ring-2 focus:ring-blue-400"
                onClick={cancelEdit}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Example: Render a preview of the content with Tailwind styles */}
        {/* {editing && form.content && (
          <div className="mt-8 max-w-screen-md">
            <h2 className="text-2xl font-semibold mb-4">Preview</h2>
            <RichTextRenderer html={form.content} />
          </div>
        )} */}

        {/* Uncomment to render the raw HTML content for debugging */}

        {/* This is commented out to avoid rendering raw HTML in production */}

        {/* <RichTextRenderer html={form.content} /> */}
      </main>
    </>
  );
}