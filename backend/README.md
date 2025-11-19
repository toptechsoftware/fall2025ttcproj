Minimal backend for the todo app.

Environment variables:

- DATABASE_URL: postgres://user:pass@host:port/dbname
- PORT: server port (default: 4000)

Endpoints:

- GET /api/health
- GET /api/todos
- POST /api/todos { text }
- PUT /api/todos/:id/toggle

Run locally:

```powershell
cd backend
npm install
setx DATABASE_URL "postgres://postgres:example@db:5432/todos"  # or use .env
node index.js
```
