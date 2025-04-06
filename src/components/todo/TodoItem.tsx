import type { MenuProps } from "antd";
import { Dropdown } from "antd";
import React from "react";
import cross from "../../assets/icons/cross.png";
import menu from "../../assets/icons/menu.png";
import type { ITodoItem } from "../../interfaces";
import DoingMark from "./DoingMark";

interface Props {
  todo: ITodoItem;
  onUpdateTodoItemStatus: (todo: ITodoItem) => Promise<void>;
  onRemoveTodoItem: (todo: ITodoItem) => Promise<void>;
  onUpdateTodoItemLabel: (todo: ITodoItem, newLabel: string) => Promise<void>;
  onUpdateDoingTodoItemStatus: (todo: ITodoItem) => Promise<void>;
}

const TodoItem = (props: Props) => {
  const {
    todo,
    onUpdateTodoItemStatus,
    onRemoveTodoItem,
    onUpdateTodoItemLabel,
    onUpdateDoingTodoItemStatus,
  } = props;
  const [isUpdating, setIsUpdating] = React.useState<boolean>(false);
  const [input, setInput] = React.useState<string>(todo.label);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const items: MenuProps["items"] = [
    {
      key: "0",
      label: (
        <p className="text-sm">{todo.isDoing ? "Stop doing" : "Do it now!"}</p>
      ),
      onClick: () => onUpdateDoingTodoItemStatus(todo),
      disabled: todo.isDone,
    },
    {
      key: "1",
      label: <p className="text-sm">{todo.isDone ? "Re-do" : "Complete"}</p>,
      onClick: () => onUpdateTodoItemStatus(todo),
    },
    {
      key: "2",
      label: <p className="text-sm">Update</p>,
      disabled: todo.isDone,
      onClick: () => {
        setIsUpdating(true);
        setTimeout(() => {
          inputRef.current?.focus();
        }, 50);
      },
      extra: "(Hit enter to update)",
    },
    {
      type: "divider",
    },
    {
      key: "3",
      label: <p className="text-sm">Remove</p>,
      danger: true,
      onClick: () => onRemoveTodoItem(todo),
    },
  ];

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const onCloseUpdate = () => {
    setIsUpdating(false);
    setInput(todo.label);
  };

  return (
    <div
      className={`flex justify-between items-center relative  p-2 rounded-lg border border-gray-300 w-full hover:bg-gray-100 mb-2 transition-all duration-400 ease-linear ${
        todo.isDone
          ? "bg-green-100 border-green-200 hover:bg-green-200"
          : isUpdating
          ? "hover:bg-white"
          : todo.isDoing
          ? "bg-gradient-to-r from-blue-200 to-purple-200 p-1 animate-text"
          : ""
      }`}
    >
      {todo.isDoing && <DoingMark />}
      {isUpdating ? (
        <>
          <input
            className="text-sm w-full focus:outline-none"
            ref={inputRef}
            value={input}
            onChange={(e) => onChangeInput(e)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onUpdateTodoItemLabel(
                  todo,
                  (e.target as HTMLInputElement).value
                );
                setIsUpdating(false);
              }
            }}
          />
          <img
            src={cross}
            className="w-4 h-4 cursor-pointer"
            onClick={onCloseUpdate}
          />
        </>
      ) : (
        <>
          <p className="text-sm">
            {todo.label.length >= 50
              ? `${todo.label.slice(0, 50)}...`
              : todo.label}
          </p>
          <Dropdown menu={{ items }} trigger={["click"]}>
            <img className="w-3 h-3 cursor-pointer" src={menu} />
          </Dropdown>
        </>
      )}
    </div>
  );
};

export default TodoItem;
