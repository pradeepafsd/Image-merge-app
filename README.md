# Image Merge App

A MERN full-stack application that allows users to upload templates and user images, merge them with drag-and-resize functionality, preview, and download the final image.

---

## Features

- Upload templates (PNG/JPG, max 1MB)
- Upload user images (PNG/JPG, max 1MB)
- Merge user images onto templates
- Drag and resize user image on the canvas
- Preview merged image
- Generate & download merged image
- Refresh template and user data
- Responsive canvas preview

---

## Folder Structure
root

├─ backend

│ ├─ models

│ │ ├─ Template.js

│ │ └─ User.js

│ ├─ routes

│ │ ├─ templateRoutes.js

│ │ └─ userRoutes.js

│ ├─ uploads

│ ├─ index.js

│ ├─ .env

│ └─ .gitignore

├─ frontend

│ ├─ src

│ │ ├─ components

│ │ │ ├─ UploadTemplate.jsx

│ │ │ ├─ UploadUser.jsx

│ │ │ └─ MergeEditor.jsx

│ │ ├─ api.js

│ │ └─ App.jsx

│ ├─ .env

│ └─ package.json

├─ package.json

└─ README.md


---

## Environment Variables

### Backend `.env`

```bash
MONGO_URI=<your_mongodb_connection_string>
```

### Frontend `.env`

```bash
VITE_API_URL=<your_backend_url>
```

> Keep your `.env` files secret and do **not commit** to GitHub.

---

## Backend Setup

1. Install dependencies:

```bash
cd backend
npm install
```

2. Create .env file with MONGO_URI.
3. Start backend server:

```bash
nodemon
```

4. Ensure uploads/ folder exists for storing uploaded files.

---

## Frontend Setup

1. Install dependencies:

```bash
cd frontend
npm install
```

2. Create .env file with VITE_API_URL pointing to backend.

3. Start frontend:

```bash
npm run dev
```

---

## API Endpoints

### Templates

POST /api/templates → Upload a template file

GET /api/templates → Get all templates

### Users

POST /api/users → Upload user photo

GET /api/users → Get all users

---

## Notes

- File uploads are restricted to PNG/JPG and max size 1MB.

- Canvas preview is responsive and supports drag & corner resizing.

- Refreshing data clears canvas and reloads available templates & users.

---

## Technologies

- Frontend: React, Bootstrap, Axios

- Backend: Node.js, Express, MongoDB, Mongoose, Multer

- Others: dotenv, path

---

## Gitignore (Backend Example)

node_modules/

.env

uploads/

---

## License

This project is open-source and free to use.

