import { Progress } from "antd";
import React from "react";
import resting from "../../assets/icons/resting.png";
import working from "../../assets/icons/working.png";
import { dataRef } from "../../firebase";
import useUserId from "../../hooks/userID";
import { ITimerConfig } from "../../interfaces";
import ConfigModal from "./ConfigModal";
import TimerSetting from "./TimerSetting";
import MusicPlayer from "../music/MusicPlayer";

type MODE = "WORK" | "SHORT_REST" | "LONG_REST";

const Timer = () => {
  const userId = useUserId();
  const [totalTime, setTotalTime] = React.useState<number>(0);
  const [timerConfig, setTimerConfig] = React.useState<ITimerConfig>();
  const [currentMode, setCurrentMode] = React.useState<MODE>("WORK");
  const [currentTime, setCurrentTime] = React.useState<number>(0);
  const [isRunning, setIsRunning] = React.useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

  const modes = [
    {
      key: "WORK",
      label: "Work",
    },
    {
      key: "SHORT_REST",
      label: "Short rest",
    },
    {
      key: "LONG_REST",
      label: "Long rest",
    },
  ];

  // Convert seconds to mm:ss format
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (isNaN(minutes) || isNaN(remainingSeconds)) {
      return "...";
    }

    if (seconds === 0 && isRunning) {
      setIsRunning(false);
    }

    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const restartTimer = () => {
    setCurrentTime(totalTime);
    setIsRunning(false);
  };

  const onChangeMode = (mode: MODE) => {
    setIsRunning(false);
    setCurrentMode(mode);
  };

  const onGetTimerConfig = () => {
    if (!userId) return;

    const userTimerConfigRef = dataRef.ref(`todoList/${userId}/config`);
    userTimerConfigRef.on("value", (snapshot) => {
      const data = snapshot.val();
      setTimerConfig(data);
      setCurrentTime(data.pomodoro);
    });
  };

  const onUpdateTimerConfig = async (newValue: ITimerConfig) => {
    if (!userId) return;

    const userConfigRef = dataRef.ref(`todoList/${userId}/config`);

    try {
      await userConfigRef.set(newValue);
      setIsModalOpen(false); // Close the modal on success
    } catch (error) {
      console.error("Error updating timer config:", error);
    }
  };

  React.useEffect(() => {
    if (currentMode === "WORK") {
      setTotalTime(timerConfig?.pomodoro as number);
    } else if (currentMode === "SHORT_REST") {
      setTotalTime(timerConfig?.shortRest as number);
    } else {
      setTotalTime(timerConfig?.longRest as number);
    }
  }, [currentMode]);

  React.useEffect(() => {
    setCurrentTime(totalTime);
  }, [totalTime]);

  React.useEffect(() => {
    const cleanup = onGetTimerConfig();
    return cleanup;
  }, [userId]);

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && currentTime > 0) {
      timer = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev - 1 === 0) {
            setCurrentMode("SHORT_REST");
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [currentTime, isRunning]);

  return (
    <div className="relative flex flex-col items-center justify-center h-full">
      <MusicPlayer />
      <TimerSetting setIsModalOpen={setIsModalOpen} />
      <ConfigModal
        isModalOpen={isModalOpen}
        timerConfig={timerConfig}
        setIsModalOpen={setIsModalOpen}
        onUpdateTimerConfig={onUpdateTimerConfig}
      />
      <div className="flex mb-4 items-center gap-4">
        {modes.map((mode) => (
          <div
            key={mode.key}
            className={`cursor-pointer flex items-center justify-center text-sm border border-gray-200 hover:bg-gray-200 rounded-2xl px-3 py-2 transition-all ease-linear ${
              currentMode === mode.key
                ? "bg-blue-300 text-white border-blue-300 hover:bg-blue-500"
                : ""
            }`}
            onClick={() => onChangeMode(mode.key as MODE)}
          >
            {mode.label}
          </div>
        ))}
      </div>
      <Progress
        size={300}
        type="circle"
        strokeWidth={4}
        percent={((totalTime - currentTime) / totalTime) * 100}
        format={() => <p>{formatTime(currentTime)}</p>}
        strokeColor={{
          "0%": "#87d068",
          "50%": "#ffe58f",
          "100%": "#ffccc7",
        }}
      />
      <div className="mt-4 flex items-center">
        {currentMode === "WORK" ? (
          <>
            <p>Work mode</p>
            <img src={working} className="w-4 h-4 ml-2" />
          </>
        ) : (
          <>
            <p>Time to rest</p>
            <img src={resting} className="w-4 h-4 ml-2" />
          </>
        )}
      </div>
      <div className="mt-4 flex items-center gap-2">
        <button
          className="px-4 py-2 bg-blue-300 text-white rounded-lg hover:bg-blue-400 transition-all ease-linear"
          onClick={() => setIsRunning(!isRunning)}
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button
          className="px-4 py-2 bg-red-300 text-white rounded-lg hover:bg-red-400 transition-all ease-linear"
          onClick={restartTimer}
        >
          Restart
        </button>
      </div>
    </div>
  );
};

export default Timer;
