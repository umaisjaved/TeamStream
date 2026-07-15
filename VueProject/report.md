# Team Stream

A modern real-time chat application built using **Vue 3**, **Vite**, and **Socket.IO**. Team Stream allows users to communicate in themed chat rooms, send private messages, and experience real-time messaging with a clean and responsive interface.

---

## Features

- User Registration and Login
- JWT Authentication
- Protected Routes
- Persistent Login using Local Storage
- Join Multiple Chat Rooms
- Real-Time Messaging
- Online Users List
- Private Direct Messaging
- Typing Indicators
- Message History
- Join/Leave Notifications
- Responsive User Interface

---

## Tech Stack

### Frontend

- Vue 3 (Composition API)
- Vite
- Vue Router 4
- Pinia
- Axios
- Socket.IO Client
- Scoped CSS

### Backend

- Node.js
- Express.js
- Socket.IO
- JWT Authentication

---

## Project Structure

```
client/
│
├── src/
│   ├── components/
│   │   ├── MessageInput.vue
│   │   ├── MessageList.vue
│   │   ├── PrivateChat.vue
│   │   └── UserList.vue
│   │
│   ├── views/
│   │   ├── AuthView.vue
│   │   ├── HomeView.vue
│   │   └── ChatView.vue
│   │
│   ├── router/
│   ├── stores/
│   ├── App.vue
│   └── main.js
│
└── vite.config.js
```

---

## Screens

- Login Page
- Sign Up Page
- Room Selection
- Main Chat Interface
- Private Chat Window

---

## Application Flow

1. User signs up or logs in.
2. JWT token is stored for authentication.
3. User selects a chat room.
4. Socket.IO establishes a real-time connection.
5. Users can:
   - Send messages
   - Receive messages instantly
   - View online users
   - Start private conversations
   - See typing indicators

---

## State Management

The application uses **Pinia** for global state management.

### Authentication Store

Responsible for:

- JWT Token
- Username
- Login Status
- Persistent Authentication

### Chat Store

Responsible for:

- Current Room
- Messages
- Online Users
- Private Chats
- Typing Status

---

## Routing

| Route | Description |
|--------|-------------|
| `/login` | Authentication |
| `/rooms` | Room Selection |
| `/chat` | Chat Interface |

Protected routes redirect unauthenticated users back to the login page.

---

## Installation

Move into the project directory

```bash
cd team-stream
```

Install dependencies

```bash
npm install
```

Start the development server

```bash
npm run dev
```

The application will run at

```
http://localhost:5173
```

---

## Future Improvements

- Emoji Support
- File Sharing
- Voice Messages
- Video Calling
- User Profiles
- Message Reactions
- Dark Mode
- Push Notifications

---

## Authors

- Mutahara Batool
- Umais Javed

---

## License

This project was developed as a semester project for the **Web Engineering** course at the **University of Sialkot**.