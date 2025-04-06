import React from "react";
import gear from "../../assets/icons/setting.png";
import { Dropdown, MenuProps } from "antd";

interface ITodoSetting {
  completeAllTodo: () => Promise<void>;
  redoAllTodo: () => Promise<void>;
  clearAllTodo: () => Promise<void>;
}

const TodoSetting = (props: ITodoSetting) => {
  const { completeAllTodo, redoAllTodo, clearAllTodo } = props;
  const divRef = React.useRef(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [startY, setStartY] = React.useState(0);
  const [topPosition, setTopPosition] = React.useState(140); // Initial top position

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
      label: <p className="text-sm">Complete all</p>,
      onClick: () => completeAllTodo(),
    },
    {
      key: "2",
      label: <p className="text-sm">Redo all</p>,
      onClick: () => redoAllTodo(),
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: <p className="text-sm">Remove all</p>,
      danger: true,
      onClick: () => clearAllTodo(),
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
      className="z-10 absolute w-10 bg-gray-200 rounded-tl-xl rounded-bl-xl flex items-center justify-start p-1"
      style={{ top: `${topPosition}px`, right: "-10px", cursor: "grab" }}
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

export default TodoSetting;
