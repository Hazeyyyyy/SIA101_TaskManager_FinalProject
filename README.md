Task Manager System

Description
A simple task manager system with backend integration using Node.js and Express. It allows users to add, edit, delete, and manage tasks.

Features
1. Add task
2. Edit task
3. Delete task
4. Mark task as completed
5. Filter tasks by category
6. Search tasks
7. Connect frontend to backend (API)

Tech Stack
- Node.js
- Express.js
- HTML, CSS, JavaScript
- REST API
- Render (for deployment)

Live API
https://taskmanagerdraft.onrender.com

API Endpoints
1. Get all tasks - GET /api/tasks
2. Add task - POST /api/tasks
3. Update task - PUT /api/tasks/:id
4. Delete task - DELETE /api/tasks/:id
5. Toggle task status - PATCH /api/tasks/:id/toggle

How to Run Locally
npm install
node server.js

Purpose of the Project
The purpose of this project is to show how frontend and backend work together.

Note
- Data is stored in memory only
- Data will reset when server restarts
- API is tested using Postman
- System is deployed using Render
