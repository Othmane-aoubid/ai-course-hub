# AI-Powered Online Course Creation Platform

A comprehensive platform for creating and managing online courses with AI assistance.

## Project Structure

```
.
├── backend/
│   ├── node/          # Main Node.js server
│   └── python/        # AI services with Flask
├── frontend/
│   ├── vue-app/       # Vue.js 3 application
│   ├── next-app/      # Next.js application
│   └── react-app/     # React.js application
└── firebase/          # Firebase configuration
```

## Setup Instructions

### Backend Setup

1. Node.js Backend:
```bash
cd backend/node
npm install
node server.js
```

2. Python Backend:
```bash
cd backend/python
python -m venv venv
# Windows
venv\Scripts\activate
# Unix
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

### Frontend Setup

1. Vue.js App:
```bash
cd frontend/vue-app
npm install
npm run dev
```

2. Next.js App:
```bash
cd frontend/next-app
npm install
npm run dev
```

3. React.js App:
```bash
cd frontend/react-app
npm install
npm start
```

## Firebase Setup

1. Create a Firebase project
2. Update firebase/firebaseConfig.js with your credentials
3. Enable Authentication, Firestore, and Storage in Firebase Console

## Features

- Course Creation Wizard
- AI-Powered Content Generation
- Interactive Quizzes and Assignments
- Student Progress Tracking
- Discussion Forums
