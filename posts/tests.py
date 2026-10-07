from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Comment, Post


class PostAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="user1",
            password="testpass123",
        )

        self.other_user = User.objects.create_user(
            username="user2",
            password="testpass123",
        )

        self.post = Post.objects.create(
            title="Test Post",
            content="This is a test post.",
            author=self.user,
        )

    def test_authenticated_user_can_create_post(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.post(
            "/api/posts/",
            {
                "title": "New Post",
                "content": "New post content.",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["author"], self.user.id)

    def test_unauthenticated_user_cannot_create_post(self):
        response = self.client.post(
            "/api/posts/",
            {
                "title": "New Post",
                "content": "New post content.",
            },
            format="json",
        )

        self.assertIn(response.status_code,[status.HTTP_401_UNAUTHORIZED,status.HTTP_403_FORBIDDEN,],)

    def test_owner_can_update_post(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.patch(
            f"/api/posts/{self.post.id}/",
            {
                "title": "Updated Post",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.post.refresh_from_db()
        self.assertEqual(self.post.title, "Updated Post")

    def test_other_user_cannot_update_post(self):
        self.client.force_authenticate(user=self.other_user)

        response = self.client.patch(
            f"/api/posts/{self.post.id}/",
            {
                "title": "Hacked Post",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        self.post.refresh_from_db()
        self.assertEqual(self.post.title, "Test Post")

    def test_owner_can_delete_post(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.delete(
            f"/api/posts/{self.post.id}/"
        )

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(
            Post.objects.filter(id=self.post.id).exists()
        )

    def test_other_user_cannot_delete_post(self):
        self.client.force_authenticate(user=self.other_user)

        response = self.client.delete(
            f"/api/posts/{self.post.id}/"
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(
            Post.objects.filter(id=self.post.id).exists()
        )

    def test_invalid_post_is_rejected(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.post(
            "/api/posts/",
            {
                "title": "",
                "content": "",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class CommentAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="commentuser1",
            password="testpass123",
        )

        self.other_user = User.objects.create_user(
            username="commentuser2",
            password="testpass123",
        )

        self.post = Post.objects.create(
            title="Comment Test Post",
            content="Post used for comment tests.",
            author=self.user,
        )

        self.comment = Comment.objects.create(
            content="Original comment",
            post=self.post,
            author=self.user,
        )

    def test_authenticated_user_can_create_comment(self):
        self.client.force_authenticate(user=self.other_user)

        response = self.client.post(
            "/api/comments/",
            {
                "post": self.post.id,
                "content": "New comment",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["author"], self.other_user.id)

    def test_comment_owner_can_update_comment(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.patch(
            f"/api/comments/{self.comment.id}/",
            {
                "content": "Updated comment",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.comment.refresh_from_db()
        self.assertEqual(self.comment.content, "Updated comment")

    def test_other_user_cannot_update_comment(self):
        self.client.force_authenticate(user=self.other_user)

        response = self.client.patch(
            f"/api/comments/{self.comment.id}/",
            {
                "content": "Hacked comment",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        self.comment.refresh_from_db()
        self.assertEqual(self.comment.content, "Original comment")

    def test_comment_owner_can_delete_comment(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.delete(
            f"/api/comments/{self.comment.id}/"
        )

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(
            Comment.objects.filter(id=self.comment.id).exists()
        )

    def test_other_user_cannot_delete_comment(self):
        self.client.force_authenticate(user=self.other_user)

        response = self.client.delete(
            f"/api/comments/{self.comment.id}/"
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(
            Comment.objects.filter(id=self.comment.id).exists()
        )