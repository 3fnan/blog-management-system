import { useEffect, useState } from "react";
import api from "../api/axios";
import CommentSection from "../components/CommentSection";

const logout = () => {
    localStorage.clear();
    window.location.reload();
};

function Posts() {
    const [posts, setPosts] = useState([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentUser, setCurrentUser] = useState(null);
    const [editingPost, setEditingPost] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await api.get("me/");
                setCurrentUser(response.data);
            } catch (error) {
                console.error("Failed to fetch current user:", error);
            }
        };

        const fetchPosts = async () => {
            try {
                const response = await api.get("posts/");
                setPosts(response.data);
            } catch (error) {
                console.error("Failed to fetch posts:", error);
                setError("Unable to load posts.");
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
        fetchCurrentUser();
    }, []);

    const createPost = async (e) => {
        e.preventDefault();

        if (!title.trim() || !content.trim()) {
            setError("Title and content are required.");
            return;
        }

        try {
            setError("");

            const response = await api.post("posts/", {
                title,
                content,
            });

            setPosts((currentPosts) => [
                response.data,
                ...currentPosts,
            ]);

            setTitle("");
            setContent("");
        } catch (error) {
            console.error("Failed to create post:", error);
            setError("Unable to create post.");
        }
    };

    const startEditing = (post) => {
        setEditingPost(post.id);
        setEditTitle(post.title);
        setEditContent(post.content);
    };

    const cancelEditing = () => {
        setEditingPost(null);
        setEditTitle("");
        setEditContent("");
    };

    const updatePost = async (postId) => {
        try {
            const response = await api.put(`posts/${postId}/`, {
                title: editTitle,
                content: editContent,
            });

            setPosts((currentPosts) =>
                currentPosts.map((post) =>
                    post.id === postId ? response.data : post
                )
            );

            cancelEditing();
            setError("");
        } catch (error) {
            console.error("Failed to update post:", error);
            setError("Unable to update post.");
        }
    };

    const deletePost = async (postId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this post?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.delete(`posts/${postId}/`);

            setPosts((currentPosts) =>
                currentPosts.filter((post) => post.id !== postId)
            );

            setError("");
        } catch (error) {
            console.error("Failed to delete post:", error);
            setError("Unable to delete post.");
        }
    };

    if (loading) {
        return <p>Loading posts...</p>;
    }

    return (
        <div className="app">
            <header className="app-header">
                <div>
                    <h1>BlogSystem</h1>
                    <p>Share your thoughts with the community.</p>
                </div>

                <button className="logout-button" onClick={logout}>
                    Logout
                </button>
            </header>

            <main className="content">
                <section className="create-post-card">
                    <h2>Create a Post</h2>

                    <form className="post-form" onSubmit={createPost}>
                        <input
                            type="text"
                            placeholder="Post title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />

                        <textarea
                            placeholder="Write your post..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />

                        <button className="primary-button" type="submit">
                            Create Post
                        </button>
                    </form>
                </section>

                {error && <p className="error-message">{error}</p>}

                <section className="posts-section">
                    <h2>Latest Posts</h2>

                    {posts.length === 0 ? (
                        <p className="empty-message">No posts yet.</p>
                    ) : (
                        posts.map((post) => (
                            <article className="post-card" key={post.id}>
                                {editingPost === post.id ? (
                                    <div className="edit-post">
                                        <input
                                            value={editTitle}
                                            onChange={(e) =>
                                                setEditTitle(e.target.value)
                                            }
                                        />

                                        <textarea
                                            value={editContent}
                                            onChange={(e) =>
                                                setEditContent(e.target.value)
                                            }
                                        />

                                        <div className="post-actions">
                                            <button
                                                className="primary-button"
                                                onClick={() =>
                                                    updatePost(post.id)
                                                }
                                            >
                                                Save
                                            </button>

                                            <button
                                                className="secondary-button"
                                                onClick={cancelEditing}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <h3>{post.title}</h3>

                                        <p className="post-content">
                                            {post.content}
                                        </p>

                                        <small className="post-author">
                                            Author ID: {post.author}
                                        </small>

                                        {currentUser &&
                                            post.author === currentUser.id && (
                                                <div className="post-actions">
                                                    <button
                                                        className="secondary-button"
                                                        onClick={() =>
                                                            startEditing(post)
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        className="danger-button"
                                                        onClick={() =>
                                                            deletePost(post.id)
                                                        }
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}

                                        <CommentSection
                                            postId={post.id}
                                        />
                                    </>
                                )}
                            </article>
                        ))
                    )}
                </section>
            </main>
        </div>
    );
}

export default Posts;