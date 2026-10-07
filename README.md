# Blog Management System

A full-stack blog management system built with Django REST Framework and React.

The application allows users to authenticate, create and manage their own blog posts, view posts created by other users, and add comments.

## Features

- JWT-based user authentication
- Create, view, update, and delete blog posts
- Users can modify only their own posts
- View posts created by other users
- Add comments to posts
- Edit and delete own comments
- Backend validation for required fields
- Frontend validation for better user experience
- Automatic JWT access-token refresh
- Django admin panel for managing users, posts, and comments
- Automated backend tests for authentication, authorization, CRUD operations, and validation

## Tech Stack

### Backend

- Python
- Django
- Django REST Framework
- Simple JWT
- SQLite

### Frontend

- React
- Vite
- Axios
- CSS

## Project Structure

```text
BlogSystem/
├── config/
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
├── posts/
│   ├── migrations/
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── permissions.py
│   ├── serializers.py
│   ├── tests.py
│   ├── urls.py
│   └── views.py
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   ├── components/
│   │   │   └── CommentSection.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   └── Posts.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── ...
├── manage.py
├── requirements.txt
├── README.md
└── .gitignore

```

## Backend Setup

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd BlogSystem
```

### 2. Create a virtual environment

```bash
python -m venv .venv
```

### 3. Activate the virtual environment

On Windows:

```powershell
.venv\Scripts\activate
```

### 4. Install dependencies

```bash
pip install -r requirements.txt
```

### 5. Run database migrations

```bash
python manage.py migrate
```

### 6. Create an admin user

```bash
python manage.py createsuperuser
```

### 7. Start the backend server

```bash
python manage.py runserver
```

The backend will run at:

```text
http://127.0.0.1:8000/
```

## Frontend Setup

Open another terminal and navigate to the frontend:

```bash
cd frontend
```

Install the frontend dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Vite will display the frontend URL in the terminal.

For example:

```text
http://localhost:5175/
```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/token/` | Login and obtain JWT tokens |
| POST | `/api/token/refresh/` | Refresh access token |
| GET | `/api/me/` | Get current user |

### Posts

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/posts/` | List posts |
| POST | `/api/posts/` | Create post |
| GET | `/api/posts/<id>/` | View post |
| PUT | `/api/posts/<id>/` | Update post |
| PATCH | `/api/posts/<id>/` | Partially update post |
| DELETE | `/api/posts/<id>/` | Delete post |

### Comments

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/comments/` | List comments |
| POST | `/api/comments/` | Create comment |
| GET | `/api/comments/<id>/` | View comment |
| PATCH | `/api/comments/<id>/` | Update comment |
| DELETE | `/api/comments/<id>/` | Delete comment |

Comments can also be filtered by post:

```text
/api/comments/?post=<post_id>
```

## Authentication and Authorization

The application uses JWT authentication.

After login, the frontend stores the access and refresh tokens and sends the access token with authenticated API requests:

```text
Authorization: Bearer <access-token>
```

When the access token expires, the refresh token is used to obtain a new access token.

Backend permissions ensure that users can only modify or delete their own posts and comments.

Post ownership is assigned by the backend during creation:

```python
serializer.save(author=self.request.user)
```

This prevents the client from choosing another user as the author.

The frontend hides Edit and Delete buttons for content the user does not own, but these controls are only for user experience. The actual authorization and security checks are enforced by the backend.

## Validation

Validation is performed at both the frontend and backend levels.

### Frontend

React checks for empty post and comment content before sending requests.

### Backend

Django REST Framework serializers validate incoming API data before it reaches the database.

Invalid data is rejected with a `400 Bad Request` response.

## Testing

Run the automated backend tests with:

```bash
python manage.py test
```

The test suite covers:

- Authenticated post creation
- Unauthenticated post creation
- Post ownership
- Post update authorization
- Post deletion authorization
- Post validation
- Comment creation
- Comment ownership
- Comment update authorization
- Comment deletion authorization

Current test result:

```text
12 tests passed
```

## Admin Panel

The Django admin panel is available at:

```text
http://127.0.0.1:8000/admin/
```

Administrators can manage:

- Users
- Posts
- Comments

## Future Improvements

- Pagination
- Search and filtering
- User profiles
- Better author information
- Image uploads
- Rich text editing
- Automated frontend tests
- Production deployment