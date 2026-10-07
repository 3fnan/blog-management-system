from rest_framework import permissions
from rest_framework.permissions import BasePermission

class IsOwnerOrReadOnly(permissions.BasePermission):
     def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.author == request.user

class IsAuthorOrReadOnly(BasePermission):

    def has_permission(self, request, view):
        return (
            request.method in ["GET", "HEAD", "OPTIONS"]
            or request.user.is_authenticated
        )

    def has_object_permission(self, request, view, obj):
        if request.method in ["GET", "HEAD", "OPTIONS"]:
            return True

        return obj.author == request.user


class IsCommentOwnerOrReadOnly(BasePermission):

    def has_permission(self, request, view):
        return (
            request.method in ["GET", "HEAD", "OPTIONS"]
            or request.user.is_authenticated
        )

    def has_object_permission(self, request, view, obj):
        if request.method in ["GET", "HEAD", "OPTIONS"]:
            return True

        return obj.author == request.user


