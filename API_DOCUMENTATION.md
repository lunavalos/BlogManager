# API Documentation - Lunavalos Blog Backend

This backend provides a REST and GraphQL API for the blog content, built with Payload CMS 3.0.

## Base URL
`http://localhost:3000/api` (Local)
`https://[your-production-url]/api` (Production)

## Authentication
Public endpoints (READ) for published content are available without authentication. Administrative tasks and reading drafts require authentication.

### Login (REST)
`POST /api/users/login`
Body: `{ "email": "...", "password": "..." }`

---

## Collections

### Posts
- **Endpoint**: `/api/posts`
- **Access**: READ (Public for published), CREATE/UPDATE/DELETE (Authenticated)
- **Fields**:
  - `title`: string
  - `slug`: string (auto-generated from title)
  - `content`: Lexical JSON
  - `author`: Relationship (Authors)
  - `categories`: Array of Relationships (Categories)
  - `featuredImage`: Upload (Media)
  - `publishedDate`: Date
  - `_status`: `draft` | `published`

### Authors
- **Endpoint**: `/api/authors`
- **Fields**: `name`, `bio`, `profilePicture`

### Categories
- **Endpoint**: `/api/categories`
- **Fields**: `title`, `slug`

### Media
- **Endpoint**: `/api/media`
- **Fields**: `alt`, `url`, `filename`, `mimeType`, `filesize`, `width`, `height`

---

## Querying Examples

### Get all published posts
`GET /api/posts?where[_status][equals]=published`

### Get a single post by slug
`GET /api/posts?where[slug][equals]=mi-primer-post`

### Include related data (Depth)
To get full author and category objects instead of just IDs:
`GET /api/posts?depth=2`

### Field Selection (Optimization)
`GET /api/posts?select[title]=true&select[slug]=true`

---

## Draft Preview
To preview a draft post from the frontend:
1. Ensure `PAYLOAD_PUBLIC_DRAFT_SECRET` is set in the backend.
2. The frontend should handle `/api/preview?slug=[slug]&secret=[secret]`.
3. The backend `preview` hook generates this URL for the admin UI.

---

## Security Features
- **CORS**: Restricted to authorized domains.
- **CSRF**: Enabled for all mutating requests.
- **Rate Limiting**: 100 requests per 15 minutes per IP.
- **Security Headers**: HSTS, CSP, X-Frame-Options, etc., implemented via middleware.
- **Input Sanitization**: Handled by Payload's field types and Lexical editor.

---

## GraphQL
The GraphQL playground and endpoint are available at:
`/api/graphql`
