# 📱 Subscription Manager (React Native + Expo)

<div align="center">

A modern, cross-platform mobile app built using **Expo**, **React Native**, **TypeScript**, **Expo Router**, and **Zustand**.
This app helps users track and manage their monthly subscriptions with a smooth, intuitive UI.
Currently under development.

[![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Zustand](https://img.shields.io/badge/Zustand-FF6B6B?style=for-the-badge)](https://zustand-demo.pmnd.rs/)

</div>

---

## 🚀 Tech Stack

### **Frontend**

- ⚛️ **React Native**
- 📦 **Expo SDK 51+**
- 🔀 **Expo Router** (File-based navigation)
- 🔡 **TypeScript**
- 🧠 **Zustand** (Global state management)
- 🎨 _(UI library to be added soon)_

### **Tooling**

- 🧹 **ESLint v9 (Flat Config)**
- ✨ **Prettier**
- 📱 **Expo Go** & **EAS Build**
- 📦 npm (Node 20 LTS)

---

## 🛠️ Development Setup

### **1. Install dependencies**

```bash
npm install
```

### **2. Start development server**

```bash
npx expo start
```

### **3. Run on devices**

- **Android:** press `a` or scan QR in Expo Go
- **iOS:** scan QR using Expo Go
- **Development Build:**

  ```bash
  npx eas build --profile development --platform android
  npx eas build --profile development --platform ios
  ```

---

## 🚢 Build for Production

### **Android**

```bash
npx eas build --platform android --profile production
```

### **iOS**

```bash
npx eas build --platform ios --profile production
```

---

## 🔮 Roadmap

- Add UI library (NativeWind or Tamagui)
- Implement authentication (Clerk / Supabase)
- Build Subscription CRUD flows
- Add notifications & reminders
- Add analytics & charts for spending patterns
- Dark mode support
- Sync with cloud backend

---

## 🧑‍💻 Author

**Prathamesh Mali**
Frontend Engineer | React / React Native / Next.js

---

## 📝 License

MIT License — free to use, modify, or share.

---

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev/)
- UI components from [@gorhom/bottom-sheet](https://github.com/gorhom/react-native-bottom-sheet)
- State management with [Zustand](https://zustand-demo.pmnd.rs/)

---

<div align="center">

Made with ❤️ using React Native and Expo

⭐ Star this repo if you find it helpful!

</div>
