import React from "react";
import headphones from "../../assets/icons/headphones.png";
import play from "../../assets/icons/play-button.png";
import back from "../../assets/icons/back-button.png";
import { IAudio } from "../../interfaces";
import AudioItem from "./AudioItem";
import Lottie from "react-lottie-player";
import speaker from "../../assets/lotify/speaker.json";
import musicPlaying from "../../assets/lotify/music-playing.json";

const MusicPlayer = () => {
  const [isShowAudioList, setIsShowAudioList] = React.useState<boolean>(false);
  const [selectedAudio, setSelectedAudio] = React.useState<IAudio>();
  const [audioList, setAudioList] = React.useState<IAudio[]>([]);

  const onSelectAudio = (audio: IAudio) => {
    setIsShowAudioList(false);
    setSelectedAudio(audio);
  };

  const onBackToAudioList = () => {
    setIsShowAudioList(true);
  };

  React.useEffect(() => {
    setAudioList([]);
  }, []);

  return (
    <div className="absolute bottom-0 left-0">
      <div
        className="w-10 h-10 flex justify-center items-center bg-slate-100 rounded-full cursor-pointer"
        onClick={() => setIsShowAudioList(!isShowAudioList)}
      >
        <img className="w-4 h-4 animate-bounce" src={headphones} />
      </div>
      {isShowAudioList && (
        <div className="absolute left-10 bottom-10 rounded-lg h-[330px] w-[200px] bg-slate-200 overflow-auto">
          {audioList.map((item) => (
            <div
              key={item.id}
              className="flex h-[50px] items-center justify-between cursor-pointer hover:bg-slate-300"
              onClick={() => onSelectAudio(item)}
            >
              <div className="rounded-full w-12 h-12 flex items-center justify-center">
                <img className="w-6 h-6" src={play} />
              </div>
              <div className="flex-1">
                <p className="text-[12px] text-gray-600">{item.name}</p>
                <p className="text-[10px] text-gray-500">{item.description}</p>
              </div>
              {selectedAudio?.id === item.id && (
                <Lottie
                  loop
                  animationData={musicPlaying}
                  play
                  className="w-[80px] h-[80px]"
                />
              )}
            </div>
          ))}
        </div>
      )}
      {selectedAudio && !isShowAudioList && (
        <div className="absolute left-10 bottom-10 rounded-lg h-[330px] w-[200px] bg-slate-200 p-2 flex flex-col items-center">
          <div className="w-full flex mb-2">
            <img
              src={back}
              className="w-4 h-4 cursor-pointer "
              onClick={onBackToAudioList}
            />
          </div>
          <div className="relative w-[150px] h-[150px] rounded-lg mb-2 overflow-hidden">
            <img src={selectedAudio.image} className="w-full h-full" />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            <Lottie
              loop
              animationData={speaker}
              play
              className="w-[100px] h-[100px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            />
          </div>
          <div className="w-full">
            <p className="text-[12px] truncate text-center">
              {selectedAudio.name}
            </p>
            <p className="text-[10px] text-gray-600 truncate text-center">
              {selectedAudio.description}
            </p>
          </div>
          <AudioItem audioFile={selectedAudio.path} />
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;
