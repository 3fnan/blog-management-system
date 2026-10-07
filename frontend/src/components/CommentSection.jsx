import { useEffect, useState } from "react";
import api from "../api/axios";

function CommentSection({ postId }) {
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentUser, setCurrentUser] = useState(null);
    const [editingComment, setEditingComment] = useState(null);
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

        const fetchComments = async () => {
            try {
                const response = await api.get(`comments/?post=${postId}`);
                setComments(response.data);
            } catch (error) {
                console.error("Failed to fetch comments:", error);
                setError("Unable to load comments.");
            } finally {
                setLoading(false);
            }
        };

        fetchComments();
        fetchCurrentUser();
    }, [postId]);

    const createComment = async (e) => {
        e.preventDefault();

        if (!content.trim()) {
            setError("Comment cannot be empty.");
            return;
        }

        try {
            const response = await api.post("comments/", {
                post: postId,
                content,
            });

            setComments((currentComments) => [
                ...currentComments,
                response.data,
            ]);

            setContent("");
            setError("");
        } catch (error) {
            console.error("Failed to create comment:", error);
            setError("Unable to create comment.");
        }
    };

    const startEditingComment = (comment) => {
        setEditingComment(comment.id);
        setEditContent(comment.content);
        setError("");
    };

    const cancelEditingComment = () => {
        setEditingComment(null);
        setEditContent("");
        setError("");
    };

    const updateComment = async (commentId) => {
        if (!editContent.trim()) {
            setError("Comment cannot be empty.");
            return;
        }

        try {
            const response = await api.patch(`comments/${commentId}/`, {
                content: editContent,
            });

            setComments((currentComments) =>
                currentComments.map((comment) =>
                    comment.id === commentId ? response.data : comment
                )
            );

            cancelEditingComment();
        } catch (error) {
            console.error("Failed to update comment:", error);
            setError("Unable to update comment.");
        }
    };

    const deleteComment = async (commentId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this comment?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.delete(`comments/${commentId}/`);

            setComments((currentComments) =>
                currentComments.filter((comment) => comment.id !== commentId)
            );

            setError("");
        } catch (error) {
            console.error("Failed to delete comment:", error);
            setError("Unable to delete comment.");
        }
    };

    if (loading) {
        return <p>Loading comments...</p>;
    }

    return (
        <section className="comments-section">
            <h4>Comments</h4>

            {error && <p className="error-message">{error}</p>}

            <form className="comment-form" onSubmit={createComment}>
                <textarea
                    placeholder="Write a comment..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />

                <button className="primary-button" type="submit">
                    Add Comment
                </button>
            </form>

            {comments.length === 0 ? (
                <p className="empty-message">No comments yet.</p>
            ) : (
                <div className="comments-list">
                    {comments.map((comment) => (
                        <div className="comment" key={comment.id}>
                            {editingComment === comment.id ? (
                                <>
                                    <textarea
                                        value={editContent}
                                        onChange={(e) =>
                                            setEditContent(e.target.value)
                                        }
                                    />

                                    <div className="comment-actions">
                                        <button
                                            className="primary-button"
                                            onClick={() =>
                                                updateComment(comment.id)
                                            }
                                        >
                                            Save
                                        </button>

                                        <button
                                            className="secondary-button"
                                            onClick={cancelEditingComment}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p>{comment.content}</p>

                                    <small>
                                        Author ID: {comment.author}
                                    </small>

                                    {currentUser &&
                                        comment.author === currentUser.id && (
                                            <div className="comment-actions">
                                                <button
                                                    className="secondary-button"
                                                    onClick={() =>
                                                        startEditingComment(
                                                            comment
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    className="danger-button"
                                                    onClick={() =>
                                                        deleteComment(
                                                            comment.id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

export default CommentSection;