
# 🏏 Cricket Coach App

**Cricket Coach App** is a cross-platform mobile application designed to assist cricket coaches and players in planning, training, and performance monitoring. Developed using React Native and Microsoft Azure, it bridges technology and sports to deliver an intelligent cricket coaching platform.

> 🚧 This project is under active development. UI components, navigation flows, and data integration are continuously evolving.

---

## 👨‍💻 Project Team

- Mitansh Sharma
- Mit Patel
- Krutarth Patel
- Shiv Patel
- Jay Kevadiya
- Smit Patel

Students at the **University of Windsor**

---

## 🎯 Project Overview

Cricket Coach App aims to modernize cricket coaching by providing:
- 🎓 Role-based access for Coaches and Players
- 📝 Drill assignment and session tracking
- 📊 Performance monitoring and statistics
- 🔐 Secure login with persistent sessions
- ☁️ Scalable architecture with future cloud integration

---

## 🚀 Tech Stack

| Layer             | Technology                                          |
|------------------|------------------------------------------------------|
| 🧱 Framework      | [React Native](https://reactnative.dev/) (Expo)     |
| 💻 Language       | TypeScript                                           |
| 🎨 UI Library     | React Native Paper                                  |
| 🧭 Navigation     | React Navigation (Drawer + Stack)                   |
| 🗂 State Mgmt     | Zustand                                              |
| 🔐 Auth           | Microsoft Azure AD B2C                              |
| 💾 Storage        | AsyncStorage (Local)                                |
| ☁️ Backend (Planned)| Azure Functions / Firebase                         |
| 📈 Charts (Planned)| Victory Native / React Native SVG                  |

---

## 🔐 Authentication Flow

- Secure sign-in via **Microsoft Azure AD B2C**
- JWT token is stored locally using **AsyncStorage**
- User role is determined post-login and navigation is dynamically adjusted
- Role persists across app launches

---

## 👥 User Roles & Features

### 🧑‍🏫 Coach Dashboard
- View & manage student profiles
- Assign training drills
- Monitor individual progress
- Analyze session data

### 🏏 Player Dashboard
- Access assigned drills
- Submit session feedback
- Track personal growth
- View coach instructions

---

## 🧭 Navigation Flow

### Coach:
```
Login → Coach Home → Players → Assign Drills → Feedback
```

### Player:
```
Login → Player Home → My Coach → My Drills → My Feedback
```

Drawer navigation changes based on authenticated role.

---

## 📁 Folder Structure

```
Cricket_App/
├── assets/           # Fonts, images, and logos
├── components/       # Reusable UI elements
├── navigation/       # App navigators with role-based logic
├── screens/          # Page components split by role
│   ├── Coach/
│   └── Player/
├── services/         # Azure Auth & API services
├── store/            # Zustand stores
├── utils/            # Helpers and constants
├── App.tsx           # Main app entry point
└── README.md
```

---

## ⚙️ Installation & Setup

### 🧾 Prerequisites
- Node.js ≥ 18
- Expo CLI: `npm install -g expo-cli`
- Azure AD B2C Tenant
- Android Studio or Xcode for emulator/device testing

### 📦 Installation

```bash
git clone https://github.com/Mitansh13/Cricket_App.git
cd Cricket_App
npm install
```

### ▶️ Running the App

```bash
npx expo start
```

Use Expo Go app to scan the QR code or press `a`/`i` for emulator.

---

## 🧪 Current Development Status

| Feature                       | Status         |
|------------------------------|----------------|
| Azure AD Login               | ✅ Completed    |
| JWT Persistent Auth          | ✅ Completed    |
| Coach Drawer Navigation      | ✅ Completed    |
| Player Drawer Navigation     | ✅ Completed    |
| Player Drill Interface       | 🟡 In Progress  |
| Session Feedback System      | 🟡 In Progress  |
| Charts for Analytics         | 🔲 Planned      |
| Cloud Backend Integration    | 🔲 Planned      |

---

## 📸 UI Screenshots

> UI previews will be added soon to showcase core screens.

---

## 📄 License

This project was developed by students of the **University of Windsor** as part of an academic curriculum in collaboration with industrial requirements.

It is intended strictly for educational and evaluation purposes.  
**Commercial use, distribution, or modification without explicit permission from the authors is not allowed.**  
All rights reserved to the development team and the University of Windsor.

---
