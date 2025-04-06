import React from "react";
import gear from "../../assets/icons/wall-clock.png";
import { Dropdown, MenuProps } from "antd";
import { useNavigate } from "react-router-dom";

interface ITimerSetting {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const TimerSetting = (props: ITimerSetting) => {
  const { setIsModalOpen } = props;
  const navigate = useNavigate();
  const divRef = React.useRef(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [startY, setStartY] = React.useState(0);
  const [topPosition, setTopPosition] = React.useState(400); // Initial top position

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setStartY(e.clientY);
    e.preventDefault(); // Prevents text selection
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const deltaY = e.clientY - startY;
      setTopPosition((prev) => prev + deltaY);
      setStartY(e.clientY);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <p className="text-sm">Config timer</p>,
      onClick: () => setIsModalOpen(true),
    },
    { type: "divider" },
    {
      key: "2",
      label: <p className="text-sm">Audio list</p>,
      onClick: () => navigate("/dashboard"),
    },
  ];

  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, startY]);
  return (
    <div
      ref={divRef}
      className="z-10 absolute w-10 bg-gray-200 rounded-tr-xl rounded-br-xl flex items-center justify-end p-1"
      style={{ top: `${topPosition}px`, left: "-20px", cursor: "grab" }}
      onMouseDown={handleMouseDown}
    >
      <Dropdown menu={{ items }} trigger={["click"]}>
        <img
          src={gear}
          className="w-5 h-5 animate-spin [animation-duration:2s]"
          alt="gear"
        />
      </Dropdown>
    </div>
  );
};

export default TimerSetting;
