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
  publishedat: "",
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

function countWords(html) {
  const text = DOMPurify.sanitize(html, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export default function BlogAdmin() {
  const { user, isSignedIn, isLoaded } = useUser();
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyPost);
  const [loading, setLoading] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const [checklistItems, setChecklistItems] = useState([]);
  const [accessAllowed, setAccessAllowed] = useState(false);
  const fileInputRef = useRef();

  // Tiptap editor instance with Image extension
  const editor = useEditor({
    extensions: [Image, StarterKit],
    editable: true,
    content: "",
    editorProps: {
      attributes: {
        class: "prose prose-lg text-base  w-full min-h-[300px] p-4 border rounded bg-gray-50",
      },
    },
    autofocus: "end",
    onCreate: ({ editor }) => {
      // Initialize editor with empty content or existing form content
      if (editing && form.content) {
        editor.commands.setContent(form.content);
      } else {
        editor.commands.setContent("");
      }
    },

  
    onUpdate: ({ editor }) => {
      setForm((f) => ({ ...f, content: editor.getHTML() }));
    },
  });

  // Check admin/editor access
  useEffect(() => {
    async function checkAccess() {
      if (!user || !user.id) {
        setAccessAllowed(false);
        return;
      }
      const { data, error } = await supabase
        .from("users")
        .select("is_admin")
        .eq("clerk_id", user.id)
        .single();
      if (error || !data) {
        setAccessAllowed(false);
      } else {
        setAccessAllowed(!!data.is_admin);
      }
    }
    if (isLoaded && isSignedIn) {
      checkAccess();
    }
  }, [user, isLoaded, isSignedIn]);

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
    if (!isSignedIn || !accessAllowed) return;
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn, accessAllowed]);

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
    const filePath = `${fileName}`;

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

  function getChecklist(form, publish) {
    const missing = [];
    if (!form.title) missing.push("Title is required");
    if (!form.slug) missing.push("Slug is required");
    if (!form.summary) missing.push("Summary is required");
    if (!form.coverimageurl) missing.push("Cover image is required");
    if (countWords(form.content) < 1000) missing.push("Content must be at least 1000 words");
    // Slug must be unique before publishing
    if (
      publish &&
      posts.some((p) => p.slug === form.slug && p.id !== form.id)
    ) {
      missing.push("Slug must be unique");
    }
    return missing;
  }

  async function savePost(publish = false) {
    setLoading(true);
    const now = new Date().toISOString();

    // Pre-publish checklist
    const missing = getChecklist(form, publish);
    if (publish && missing.length) {
      setChecklistItems(missing);
      setShowChecklist(true);
      setLoading(false);
      return;
    }

    // Scheduled publishing logic
    const nowDate = new Date();
    const scheduledDate = form.publishedat ? new Date(form.publishedat) : nowDate;
    const isReadyToPublish = publish && scheduledDate <= nowDate;

    let post = {
      ...form,
      title: sanitizeInput(form.title),
      slug: sanitizeInput(form.slug),
      summary: sanitizeInput(form.summary),
      content: DOMPurify.sanitize(form.content),
      ispublished: isReadyToPublish,
      publishedat: form.publishedat || (publish ? now : null),
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
    alert(`Post ${publish ? (isReadyToPublish ? "published" : "scheduled") : "saved as draft"} successfully!`);
  }

  async function deletePost(postId) {
    if (!window.confirm("Are you sure you want to delete this draft?")) return;
    setLoading(true);
    const { error } = await supabase.from("blog_posts").delete().eq("id", postId);
    if (error) {
      alert("Error deleting post: " + error.message);
    } else {
      setPosts((posts) => posts.filter((p) => p.id !== postId));
      alert("Draft deleted.");
    }
    setLoading(false);
  }

  function cancelEdit() {
    setEditing(null);
    setForm(emptyPost);
    if (editor) editor.commands.setContent("");
  }

  // Block all UI if not admin/editor
  if (!isLoaded || accessAllowed === null) {
    return (
      <main className="max-w-screen-md mx-auto px-4 py-8">
        <p className="text-center text-lg text-gray-500">Checking permissions...</p>
      </main>
    );
  }
  if (!accessAllowed) {
    return (
      <main className="max-w-screen-md mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center">
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p>You must be an admin or editor to access this page.</p>
        </div>
      </main>
    );
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

        {/* Pre-publish checklist modal */}
        {showChecklist && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
              <h3 className="text-xl font-bold mb-2">Please fix the following before publishing:</h3>
              <ul className="list-disc pl-6 mb-4 text-red-700">
                {checklistItems.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => setShowChecklist(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

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
                        {post.ispublished
                          ? (post.publishedat && new Date(post.publishedat) > new Date()
                            ? "Scheduled"
                            : "Published")
                          : "Draft"}
                      </span>
                    </span>
                    <div className="flex gap-2">
                      <button
                        className="px-4 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 focus:ring-2 focus:ring-blue-400"
                        onClick={() => editPost(post)}
                      >
                        Edit
                      </button>
                      {!post.ispublished && (
                        <button
                          className="px-4 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-400"
                          onClick={() => deletePost(post.id)}
                          disabled={loading}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
            <PublishedBlogList posts={posts} />
          </>
        )}

        {editing && (
          <form
            className="bg-white p-3 rounded-lg w-full mx-auto"
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
                // Title is always editable
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
              <div className=" w-full min-h-[300px] ">
                {editor && (
                  <>
                    <BubbleMenu className="w-full bg-white p-2 rounded border"
                     editor={editor} tippyOptions={{ duration: 30 }}>
                      <div className="flex gap-2 text-base  rounded  px-2 py-1">
                        {/* ...editor buttons... */}
                        <button
                          type="button"
                          className={`font-bold ${editor.isActive('bold') ? 'text-blue-600' : ''}`}
                          onClick={() => editor.chain().focus().toggleBold().run()}
                        >B</button>
                        <button
                          type="button"
                          className={`italic ${editor.isActive('italic') ? 'text-blue-600' : ''}`}
                          onClick={() => editor.chain().focus().toggleItalic().run()}
                        >I</button>
                        <button
                          type="button"
                          className={`underline ${editor.isActive('underline') ? 'text-blue-600' : ''}`}
                          onClick={() => editor.chain().focus().toggleUnderline().run()}
                        >U</button>
                        <button
                          type="button"
                          className={editor.isActive('strike') ? 'text-blue-600' : ''}
                          onClick={() => editor.chain().focus().toggleStrike().run()}
                        >S</button>
                        <button
                          type="button"
                          className={editor.isActive('heading', { level: 1 }) ? 'text-blue-600' : ''}
                          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        >H1</button>
                        <button
                          type="button"
                          className={editor.isActive('heading', { level: 2 }) ? 'text-blue-600' : ''}
                          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        >H2</button>
                        <button
                          type="button"
                          className={editor.isActive('heading', { level: 3 }) ? 'text-blue-600' : ''}
                          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        >H3</button>
                        <button
                          type="button"
                          className={editor.isActive('bulletList') ? 'text-blue-600' : ''}
                          onClick={() => editor.chain().focus().toggleBulletList().run()}
                        >•••</button>
                        <button
                          type="button"
                          className={editor.isActive('orderedList') ? 'text-blue-600' : ''}
                          onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        >123</button>
                        <button
                          type="button"
                          onClick={() => {
                            const url = window.prompt('Enter URL');
                            if (url) {
                              editor.chain().focus().setLink({ href: url }).run();
                            }
                          }}
                        >Url</button>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current && fileInputRef.current.click()}
                        >Img</button>
                      </div>
                    </BubbleMenu>
                    <EditorContent
                      editor={editor}
                    />
                  </>
                )}
              </div>
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Schedule Publish Date</label>
              <input
                type="datetime-local"
                name="publishedat"
                value={form.publishedat?.slice(0, 16) || ""}
                onChange={(e) => setForm(f => ({ ...f, publishedat: e.target.value }))}
                className="w-full border px-2 py-2 rounded text-base"
                disabled={form.ispublished}
              />
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
              {/* Delete button for drafts only */}
              {!form.ispublished && editing !== "new" && (
                <button
                  type="button"
                  className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  onClick={async () => {
                    await deletePost(form.id);
                    cancelEdit();
                  }}
                  disabled={loading}
                >
                  Delete Draft
                </button>
              )}
            </div>
          </form>
        )}
      </main>
    </>
  );
}