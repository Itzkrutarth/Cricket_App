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

The Cricket Coach App focuses on building a mobile/web-based platform that allows cricket coaches to streamline the feedback process during training sessions. The platform will enable coaches to:

1. Log in to their account
2. Select the student they are working with
3. Capture a short, 5-second video of the player
4. Automatically store the video within the student's coaching session
5. Annotate the video using basic tools (draw, pause, slow-motion, etc.)
6. Add feedback below the video, including:
   - Text notes for technical observations
   - Voice notes for detailed explanations
   - A list of recommended cricket drills


### Skills Students Will Gain:
- Front-end development (mobile/web interface design)
- Back-end development (video storage, user management, session tracking)
- Video capture and playback tools integration
- UX design for performance coaching platforms

This collaboration will allow students to build a fully functional, user-focused application with clear scope and real coaching use cases. We would be happy to discuss how we can tailor the project based on your students' strengths and academic goals.

---

## 🚀 Tech Stack

| Layer              | Technology                                          |
|--------------------|-----------------------------------------------------|
| 🧱 Framework      | [React Native](https://reactnative.dev/) (Expo)      |
| 💻 Language       | TypeScript                                           |
| 🎨 UI Library     | React Native Paper                                   |
| 🧭 Navigation     | React Navigation (Drawer + Stack)                    |
| 🗂 State Mgmt      | Zustand                                              |
| 🔐 Auth           | Microsoft Azure AD B2C                               |
| 💾 Storage        | AsyncStorage (Local)                                 |
| ☁️ Backend (Planned)| Azure Functions / AzureDB                          |
| 📈 Charts (Planned)| Victory Native / React Native SVG                   |

---

## 🔐 Authentication Flow

- Secure sign-in via **Microsoft Azure AD B2C**
- JWT token is stored locally using **AsyncStorage**
- User role (Coach or Player) is determined post-login and navigation is dynamically adjusted
- Role persists across app launches

---

## 👥 User Roles & Features

### 🧑‍🏫 Coach Dashboard
- View & manage student profiles
- Assign training drills
- Monitor individual progress
- Analyze session data
- Provide annotated video feedback

### 🏏 Player Dashboard
- Access assigned drills
- Submit session feedback
- Track personal growth
- View coach annotations and recommendations

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
├── styles/       
│   ├── coachHomeStyle..
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
- Expo Go app for emulator/device testing on iOS/Android

### 📦 Installation

```bash
git clone https://github.com/Mitansh13/Cricket_App.git
cd Cricket_App
npm install
```

### ▶️ Running the App

```bash
npx expo start or npx expo start --tunnel 
```

Use Expo Go app to scan the QR code or press `a`/`i` for emulator.

---

## 🧪 Development Timeline

| Date Range         | Tasks                                      | Status       | Team Members       |
|--------------------|--------------------------------------------|--------------|--------------------|
| May 26 - May 30    | Login Page, SignUp Page, Front-end         | ✅ Completed  | Mit, Krutarth      |
| May 24 - May 25    | Test Routing Between Pages, Navigation     | ✅ Completed  | Krutarth           |
| May 24 - May 26    | Test on i-Pad Screen, iPad Test            | ✅ Completed  | Smit               |
| Jun 07 - Jun 08    | Coach Profile Update, Video Recording      | ✅ Completed  | Mit, Mit           |
| Jun 08 - Jun 09    | Updated Favorite Screen, Zoom In and Out   | ✅ Completed  | Mit, Mit           |
| Jun 18 - Jun 19    | Task Screen, Update the Existing UI        | ✅ Completed  | Jay                |
| Jun 23 - Jun 29    | Update The Student Profile                 | ✅ Completed  | Jay                |
| Jul 01 - Jul 02    | Voice Button on Coach and Student Side, Feedback Section | ✅ Completed | Mit, Mit |
| Jul 05 - Jul 10    | Bug Fixes in UI, New Camera, Event Calendar Feature | ✅ Completed  | Mit, Shiv, Jay |
| Jun - Jul          | Update Profile (Student/Coach), Task Assignment Progress | ✅ Completed | Jaykumar Kevadiya |

---

 
## 📄 License

This project was developed by students of the **University of Windsor** as part of an academic curriculum in collaboration with industrial requirements from Become Better.

It is intended strictly for educational and evaluation purposes.  
**Commercial use, distribution, or modification without explicit permission from the authors is not allowed.**  
All rights reserved to the development team and the University of Windsor.

---

## 📩 Contact

- **Archit Singh**  
  Cricket Coach | Founder, Become Better  
  [www.becomebetter.ca](www.becomebetter.ca)  

Looking forward to your thoughts!
