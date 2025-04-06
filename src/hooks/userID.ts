import { useState, useEffect } from "react";
import { dataRef } from "../firebase";

const generateUserId = () => {
  return "user_" + Math.random().toString(36).substr(2) + Date.now();
};

const useUserId = () => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let storedUserId = localStorage.getItem("userIdPomodoro");

    if (!storedUserId) {
      storedUserId = generateUserId();
      localStorage.setItem("userIdPomodoro", storedUserId);

      // Set default config in Firebase
      const defaultConfig = {
        pomodoro: 1500, // 25 minutes in seconds
        shortRest: 300, // 5 minutes in seconds
        longRest: 600, // 10 minutes in seconds
      };

      const userConfigRef = dataRef.ref(`todoList/${storedUserId}/config`);

      // Save the default config to Firebase
      userConfigRef
        .set(defaultConfig)

    }

    setUserId(storedUserId);
  }, []);

  return userId;
};

export default useUserId;
