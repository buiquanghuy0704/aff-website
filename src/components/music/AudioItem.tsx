import React, { useState, useEffect, useRef } from "react";
import playIcon from "@/assets/icons/play.png";
import next from "@/assets/icons/next.png";
import back from "@/assets/icons/back.png";
import pauseIcon from "@/assets/icons/pause.png";

interface AudioItemProps {
  audioFile: string;
}

const AudioItem: React.FC<AudioItemProps> = ({ audioFile }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(new Audio(audioFile));

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(event.target.value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  useEffect(() => {
    const audio = audioRef.current;
    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      if (audio.currentTime >= audio.duration) {
        setIsPlaying(false);
      }
    };
    const setDurationOnLoad = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", setDurationOnLoad);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", setDurationOnLoad);
    };
  }, [audioFile]);

  return (
    <div className=" absolute left-0 bottom-0 flex items-center gap-5 p-2 rounded-lg w-full">
      {/* Progress Container */}
      <div className="flex-1 flex flex-col items-center gap-3.5">
        <div className="flex justify-center items-center gap-4">
          <img className="w-8 h-8 cursor-pointer" src={back} />
          <button
            className="flex items-center justify-center w-10 h-10 bg-blue-300 rounded-full hover:opacity-80 border-none cursor-pointer shadow-xl"
            onClick={togglePlay}
          >
            <img
              src={isPlaying ? pauseIcon : playIcon}
              alt={isPlaying ? "Pause" : "Play"}
              className="w-3"
            />
          </button>
          <img className="w-8 h-8 cursor-pointer" src={next} />
        </div>
        <input
          type="range"
          className="w-full h-[2px] cursor-pointer accent-blue-300"
          value={currentTime}
          max={duration || 100} // Fallback to avoid NaN issues
          onChange={handleSeek}
        />
        <div className="flex w-full text-xs justify-between items-center">
          <span className="text-[6px]">{formatTime(currentTime)}</span>
          <span className="text-[6px]"> {formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

export default AudioItem;
