# DASH - Decisive Assistant for Scheduling


### A modern, intelligent, and full-stack task management application designed to bring clarity and focus to your daily workflow.

---

## 📜 Problem Statement

In a fast-paced world, managing daily tasks, deadlines, and personal goals can become overwhelming. Standard to-do list applications often lack the intelligence to help users prioritize effectively, leading to missed deadlines and a constant feeling of being reactive rather than proactive. There is a need for a smarter, more engaging tool that not only tracks tasks but also actively assists the user in managing them through automated reminders and intelligent features.

## ✨ Project Summary

**DASH (Decisive Assistant for Scheduling)** is a full-stack MERN application engineered to solve this problem. It's more than just a to-do list; it's a productivity hub designed to act as a user's personal assistant. By combining a secure and robust backend with a sleek, fast, and intuitive frontend, DASH provides a seamless experience for task management. From multi-channel notifications to smart data visualizations, every feature is built to empower the user, reduce clutter, and make productivity a satisfying experience.

---

## 🚀 Core Features

DASH is packed with professional-grade features designed for a modern user.

### 🔐 Secure User Authentication
- **Full Registration Flow:** Users can sign up with a name, email, and phone number.
- **Email OTP Verification:** A mandatory one-time password verification system ensures valid user accounts. Login is disabled until the user's email is verified.
- **Secure Password Handling:** All passwords are fully hashed on the backend.
- **JWT-based Sessions:** Industry-standard JSON Web Tokens are used for secure and persistent user sessions.

### ✅ Interactive Task Management
- **Full CRUD Functionality:** Create, Read, Update, and Delete tasks through a sleek, modal-based interface.
- **Rich Task Details:** Each task can have a title, description, due date & time, and a percentage-based priority level (0-100%).
- **Card-Based UI:** Tasks are displayed in a modern, responsive card grid, showing all relevant information at a glance.
- **Quick Actions:** Mark tasks as complete or star them for importance with a single click.
- **Task Details View:** Click on any task card to open a detailed, read-only view.

### ⏰ Advanced Reminder System
- **Multiple Alarms:** Users can add multiple, specific date-and-time reminders to any single task.
- **Recurring Daily Alarms:** Any reminder can be set to repeat daily, creating a powerful system for routine tasks.
- **Automated Multi-Channel Notifications:** A `node-cron` job on the backend runs every minute to check for due alarms and sends notifications via **Email**.
- **In-App Notification History:** A dedicated "Notifications" page provides a complete history of all reminders sent.

### 🧠 Smart & Automated Features
- **Automatic Cleanup:** Any task whose due date has passed is automatically moved to the trash, keeping the user's workspace clean and focused on current items.
- **Productivity Dashboard:** The Profile Page features a dynamic pie chart that visualizes the user's progress (Pending vs. Completed tasks).

### 🖥️ Professional User Interface
- **Clean, Minimalist Design:** Built with a "Zenith Focus" philosophy to be intuitive and distraction-free.
- **Full Responsiveness:** The UI is designed to work beautifully on all screen sizes.
- **Toast Notifications:** All feedback (success messages, errors) is delivered through non-intrusive, animated toast notifications.
- **Dedicated Views:** Separate, fully functional pages for `All Tasks`, `Starred`, `Completed`, and `Trash`.
- **Full-Featured Calendar:** An interactive calendar page visually displays all tasks with due dates.

---

## 🛠️ Tech Stack Used

This project was built using a modern, full-stack MERN architecture.

### **Frontend**
- **React.js (v18+):** For building the user interface.
- **Vite:** As the fast, modern build tool.
- **React Router (v6):** For all client-side routing.
- **Tailwind CSS:** For all styling, creating a utility-first, responsive design.
- **Axios:** For making all HTTP requests to the backend.
- **React Context API:** For global state management (user authentication and tasks).
- **React Toastify:** For professional, animated notifications.
- **React Big Calendar & Moment.js:** For the interactive task calendar.
- **Chart.js:** For the productivity pie chart on the profile page.

### **Backend**
- **Node.js:** As the JavaScript runtime environment.
- **Express.js:** As the web server framework.
- **MongoDB:** As the NoSQL database for storing all data.
- **Mongoose:** As the ODM for modeling our application data.
- **JSON Web Tokens (JWT):** For securing the API and managing user sessions.
- **Bcrypt.js:** For hashing user passwords.
- **Nodemailer:** For sending all email notifications (OTPs, reminders).
- **Node-Cron:** For scheduling the automated reminder and cleanup services.

---

## 📧 Contact

This project was developed by Vamshi Krishna.

For any questions, feedback, or collaborations, feel free to reach out via email:
- **vamshikrishnadaripelli22@gmail.com**
- **mallikarjuna.sindiri@gmail.com**
# Dash
