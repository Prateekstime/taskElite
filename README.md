TaskElite is a full-stack task & project management system built with Next.js, Node.js, Express, and MongoDB.
It provides powerful task tracking, role-based access,
and insightful data visualization with ApexCharts.


📌 Features
✅ Admin Dashboard
Create, read, update, and delete tasks/projects
Assign tasks to specific users
Visualize project progress and team productivity with interactive charts

✅ User Dashboard
View tasks assigned by the admin
Update task status and progress
Monitor personal productivity with dynamic charts

✅ Data Visualization
Beautiful, responsive charts powered by ApexCharts
Task distribution, completion rate, and performance trends

✅ Authentication & Authorization
Secure login for Admin and Users
Role-based access control for routes and UI

⚙️ Tech Stack
Layer	Tech
Frontend	Next.js, React, ApexCharts
Backend	Node.js, Express
Database	MongoDB, Mongoose
Auth	JWT (JSON Web Tokens)
Charts	ApexCharts


taskElite/
├── client/                 # Next.js frontend
│   ├── pages/
│   ├── components/
│   ├── styles/
│   └── utils/
├── server/                 # Express backend
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API endpoints
│   ├── controllers/        # Business logic
│   ├── middleware/         # Auth, error handling
│   ├── config/             # DB connection
│   └── server.js           # Entry point
├── .env                    # Environment variables
├── package.json
└── README.md
