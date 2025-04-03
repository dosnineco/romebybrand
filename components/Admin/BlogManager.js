import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import QuillEditor from '../Misc/QuillEditor';

const BlogManager = () => {
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isBrowser, setIsBrowser] = useState(false); // Track if running in the browser

  useEffect(() => {
    setIsBrowser(typeof window !== 'undefined'); // Check if running in the browser
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching posts:', error);
      } else {
        setPosts(data);
      }
    };
    fetchPosts();
  }, []);

  const handleSave = async (post) => {
    if (post.id) {
      const { error } = await supabase.from('blog_posts').update(post).eq('id', post.id);
      if (error) {
        console.error('Error updating post:', error);
      }
    } else {
      const { error } = await supabase.from('blog_posts').insert(post);
      if (error) {
        console.error('Error creating post:', error);
      }
    }
    setEditingPost(null);
    setIsCreating(false);
    fetchPosts();
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (error) {
      console.error('Error deleting post:', error);
    } else {
      fetchPosts();
    }
  };

  if (!isBrowser) return null; // Prevent rendering on the server

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Blog Manager</h1>
      <button
        onClick={() => setIsCreating(true)}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        Create New Post
      </button>
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="p-4 border rounded-lg">
            <h2 className="text-xl font-bold">{post.title}</h2>
            <p className="text-sm text-gray-500">By {post.author} on {new Date(post.created_at).toLocaleDateString()}</p>
            <div className="mt-2 flex space-x-2">
              <button
                onClick={() => setEditingPost(post)}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(post.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {(isCreating || editingPost) && (
        <QuillEditor
          template={editingPost || { title: '', content: '', author: 'Admin' }}
          onClose={() => {
            setEditingPost(null);
            setIsCreating(false);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default BlogManager;