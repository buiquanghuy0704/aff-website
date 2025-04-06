import { Progress, Spin } from "antd";
import React from "react";
import Lottie from "react-lottie-player";
import { v4 as uuidv4 } from "uuid";
import lottieJson from "../../assets/lotify/create.json";
import { dataRef } from "../../firebase";
import useUserId from "../../hooks/userID";
import type { ITodoItem } from "../../interfaces";
import Setting from "./TodoSetting";
import TodoItem from "./TodoItem";

interface ITodoList {
  setIsExploding: React.Dispatch<React.SetStateAction<boolean>>;
}

const TodoList = (props: ITodoList) => {
  const { setIsExploding } = props;
  const userId = useUserId();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [todoList, setTodoList] = React.useState<ITodoItem[]>([]);
  const [input, setInput] = React.useState<string>("");
  const [completedCount, setCompletedCount] = React.useState<number>(0);
  const [encouragement, setEncouragement] = React.useState<string>("");

  // Handle drag start
  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    e.dataTransfer.setData("text/plain", index.toString()); // Store the index of the dragged item
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  // Handle drop
  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    dropIndex: number
  ) => {
    e.preventDefault();
    const dragIndex = Number(e.dataTransfer.getData("text/plain"));
    const newTodoList = [...todoList];

    if (todoList[dragIndex].isDone === todoList[dropIndex].isDone) {
      // Reorder the array
      const [draggedItem] = newTodoList.splice(dragIndex, 1); // Remove dragged item
      newTodoList.splice(dropIndex, 0, draggedItem); // Insert it at the drop position

      setTodoList(newTodoList); // Update state
    }
  };

  const updateCompletedCountAndMessage = (sortedTasks: ITodoItem[]) => {
    const totalItems = sortedTasks.length;
    const completed = sortedTasks.filter((task) => task.isDone).length;
    setCompletedCount(completed);

    if (totalItems === completed && totalItems > 0) {
      setIsExploding(true);
    } else {
      setIsExploding(false);
    }

    const percentage = totalItems > 0 ? (completed * 100) / totalItems : 0;
    let message = "";

    switch (true) {
      case percentage === 0:
        message = "Let's get started! Every task completed is a step forward!";
        break;
      case percentage <= 10:
        message = "Great first step! Keep the momentum going!";
        break;
      case percentage <= 20:
        message =
          "You're on your way! A few more tasks and you'll feel unstoppable!";
        break;
      case percentage <= 30:
        message = "Nice progress! You're building a solid habit!";
        break;
      case percentage <= 40:
        message = "Almost halfway there! Keep pushing forward!";
        break;
      case percentage <= 50:
        message = "Halfway done! You're crushing it!";
        break;
      case percentage <= 60:
        message = "Over the hump! The finish line is getting closer!";
        break;
      case percentage <= 70:
        message = "Wow, you're a task-tackling machine! Keep it up!";
        break;
      case percentage <= 80:
        message = "So close! You’ve got this in the bag!";
        break;
      case percentage <= 90:
        message = "Almost there! One final push to victory!";
        break;
      case percentage < 100:
        message = "Incredible effort! Just a tiny bit left to conquer!";
        break;
      case percentage === 100:
        message = "100% complete! You’re a todo list superstar! 🎉";
        break;
      default:
        message = "Keep going! Every step counts!";
    }

    return message;
  };

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const onGetTodoList = () => {
    if (!userId) return;

    setLoading(true);
    const userTodoRef = dataRef.ref(`todoList/${userId}/tasks`); // Updated to /tasks path

    userTodoRef.on(
      "value",
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const tasksArray = Object.values(data) as ITodoItem[]; // Direct array from /tasks

          const filteredTasks = tasksArray.filter((task) => !task.isDeleted);

          const sortedTasks = filteredTasks.sort((a, b) => {
            return a.isDone === b.isDone ? 0 : a.isDone ? 1 : -1; // Done tasks go to the bottom
          });

          setTodoList(sortedTasks);
          const encouragementMessage =
            updateCompletedCountAndMessage(sortedTasks);
          setEncouragement(encouragementMessage);
        } else {
          setTodoList([]);
          setEncouragement("Start by adding a task!"); // Optional default message
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching todos:", error);
        setLoading(false);
      }
    );

    return () => {
      userTodoRef.off("value");
      setLoading(false); // Ensure loading is reset on cleanup
    };
  };

  const onAddTodoItem = async () => {
    if (!input.trim() || !userId) return;

    const now = Date.now();
    const newTodo: ITodoItem = {
      id: uuidv4(),
      label: input,
      isDone: false,
      createdTime: now,
      updatedTime: now,
      isDeleted: false,
      isDoing: false,
    };

    const updatedTodos = [newTodo, ...todoList];
    const userTodoRef = dataRef.ref(`todoList/${userId}/tasks`);

    try {
      await userTodoRef.set(updatedTodos);
      setInput("");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const onUpdateTodoItemStatus = async (todo: ITodoItem) => {
    if (!userId) return;

    const updatedTodos = todoList.map((item) =>
      item.id === todo.id
        ? {
            ...item,
            isDone: !item.isDone, // Toggle isDone
            updatedTime: Date.now(), // Update timestamp
            isDoing: false, // Reset isDoing
          }
        : item
    );

    const userTodoRef = dataRef.ref(`todoList/${userId}/tasks`); // Updated path

    try {
      await userTodoRef.set(updatedTodos); // Set the array directly
    } catch (error) {
      console.error("Error updating todo status:", error);
    }
  };

  const onUpdateDoingTodoItemStatus = async (todo: ITodoItem) => {
    if (!userId) return;

    const updatedTodos = todoList.map((item) =>
      item.id === todo.id
        ? { ...item, isDoing: !item.isDoing, updatedTime: Date.now() }
        : item
    );

    const userTodoRef = dataRef.ref(`todoList/${userId}/tasks`);

    try {
      await userTodoRef.set(updatedTodos);
    } catch (error) {
      console.error("Error updating doing status:", error);
    }
  };

  const onUpdateTodoItemLabel = async (todo: ITodoItem, newLabel: string) => {
    if (!newLabel.trim() || !userId) return; // Added userId check

    const userTodoRef = dataRef.ref(`todoList/${userId}/tasks`);

    try {
      // Fetch current tasks from the database
      const snapshot = await userTodoRef.once("value");
      const tasks = snapshot.val() || []; // Default to empty array if no tasks

      // Find the task to update
      const taskIndex = tasks.findIndex(
        (task: ITodoItem) => task.id === todo.id
      );

      if (taskIndex === -1) {
        console.error("Task not found in database");
        return;
      }

      // Update the task with new label and timestamp
      const updatedTasks = [...tasks];
      updatedTasks[taskIndex] = {
        ...updatedTasks[taskIndex],
        label: newLabel.trim(),
        updatedTime: Date.now(),
      };

      // Save updated tasks to Firebase
      await userTodoRef.set(updatedTasks);

      // Optimistically update local state (optional, since onGetTodoList listener will sync)
      setTodoList((prevList) =>
        prevList.map((item) =>
          item.id === todo.id
            ? { ...item, label: newLabel.trim(), updatedTime: Date.now() }
            : item
        )
      );
    } catch (error) {
      console.error("Error updating todo item label:", error);
    }
  };

  const onRemoveTodoItem = async (todo: ITodoItem) => {
    if (!userId) return;

    const userTodoRef = dataRef.ref(`todoList/${userId}/tasks`);

    try {
      // Fetch current tasks from the database
      const snapshot = await userTodoRef.once("value");
      const tasks = snapshot.val() || [];

      // Find the task to mark as deleted
      const taskIndex = tasks.findIndex(
        (task: ITodoItem) => task.id === todo.id
      );

      if (taskIndex === -1) {
        console.error("Task not found in database");
        return;
      }

      // Update the task to mark as deleted
      const updatedTasks = [...tasks];
      updatedTasks[taskIndex] = {
        ...updatedTasks[taskIndex],
        isDeleted: true,
        isDoing: false, // Reset isDoing
        updatedTime: Date.now(),
      };

      // Save updated tasks to Firebase
      await userTodoRef.set(updatedTasks);

      // Optimistically update local state (optional due to real-time listener)
      setTodoList((prevList) =>
        prevList.map((item) =>
          item.id === todo.id
            ? {
                ...item,
                isDeleted: true,
                isDoing: false,
                updatedTime: Date.now(),
              }
            : item
        )
      );
    } catch (error) {
      console.error("Error marking todo as deleted:", error);
    }
  };

  const completeAllTodo = async () => {
    if (!userId) return;

    const userTodoRef = dataRef.ref(`todoList/${userId}/tasks`);

    try {
      // Fetch the current tasks array
      const snapshot = await userTodoRef.once("value");
      const tasks = snapshot.val() || [];

      // Get start and end of today in milliseconds
      const now = new Date();
      const startOfDay = new Date(now.setHours(0, 0, 0, 0)).getTime();
      const endOfDay = new Date(now.setHours(23, 59, 59, 999)).getTime();

      // Update tasks created today to isDone: true
      const updatedTasks = tasks.map((task: ITodoItem) =>
        task.createdTime >= startOfDay &&
        task.createdTime <= endOfDay &&
        !task.isDeleted
          ? { ...task, isDone: true, updatedTime: Date.now() }
          : task
      );

      // Write the updated array back to the database
      await userTodoRef.set(updatedTasks);

      // Update local state optimistically
      setTodoList((prevList) =>
        prevList.map((item) =>
          item.createdTime >= startOfDay &&
          item.createdTime <= endOfDay &&
          !item.isDeleted
            ? { ...item, isDone: true, updatedTime: Date.now() }
            : item
        )
      );
    } catch (error) {
      console.error("Error completing all todos:", error);
    }
  };

  const redoAllTodo = async () => {
    if (!userId) return;

    const userTodoRef = dataRef.ref(`todoList/${userId}/tasks`);

    try {
      // Fetch the current tasks array
      const snapshot = await userTodoRef.once("value");
      const tasks = snapshot.val() || [];

      // Get start and end of today in milliseconds
      const now = new Date();
      const startOfDay = new Date(now.setHours(0, 0, 0, 0)).getTime();
      const endOfDay = new Date(now.setHours(23, 59, 59, 999)).getTime();

      // Update tasks created today to isDone: false
      const updatedTasks = tasks.map((task: ITodoItem) =>
        task.createdTime >= startOfDay &&
        task.createdTime <= endOfDay &&
        !task.isDeleted
          ? { ...task, isDone: false, updatedTime: Date.now() }
          : task
      );

      // Write the updated array back to the database
      await userTodoRef.set(updatedTasks);

      // Update local state optimistically
      setTodoList((prevList) =>
        prevList.map((item) =>
          item.createdTime >= startOfDay &&
          item.createdTime <= endOfDay &&
          !item.isDeleted
            ? { ...item, isDone: false, updatedTime: Date.now() }
            : item
        )
      );
    } catch (error) {
      console.error("Error redoing all todos:", error);
    }
  };

  const clearAllTodo = async () => {
    if (!userId) return;

    const userTodoRef = dataRef.ref(`todoList/${userId}/tasks`);

    try {
      // Fetch the current tasks array
      const snapshot = await userTodoRef.once("value");
      const tasks = snapshot.val() || [];

      // Get start and end of today in milliseconds
      const now = new Date();
      const startOfDay = new Date(now.setHours(0, 0, 0, 0)).getTime();
      const endOfDay = new Date(now.setHours(23, 59, 59, 999)).getTime();

      // Update tasks created today to isDeleted: true
      const updatedTasks = tasks.map((task: ITodoItem) =>
        task.createdTime >= startOfDay &&
        task.createdTime <= endOfDay &&
        !task.isDeleted
          ? { ...task, isDeleted: true, updatedTime: Date.now() }
          : task
      );

      // Write the updated array back to the database
      await userTodoRef.set(updatedTasks);

      // Update local state optimistically
      setTodoList((prevList) =>
        prevList.map((item) =>
          item.createdTime >= startOfDay &&
          item.createdTime <= endOfDay &&
          !item.isDeleted
            ? { ...item, isDeleted: true, updatedTime: Date.now() }
            : item
        )
      );
    } catch (error) {
      console.error("Error clearing all todos:", error);
    }
  };

  React.useEffect(() => {
    const cleanup = onGetTodoList();
    return cleanup;
  }, [userId]);

  return (
    <div className="flex flex-col h-full">
      <Setting
        completeAllTodo={completeAllTodo}
        redoAllTodo={redoAllTodo}
        clearAllTodo={clearAllTodo}
      />

      <div className="w-full overflow-auto pr-2 flex-1">
        {loading && (
          <div className="flex h-full justify-center items-center">
            <Spin />
          </div>
        )}
        {todoList.length ? (
          <div className="flex items-center justify-between mb-4">
            <p
              className={`text-[10px] animate-bounce ${
                completedCount === todoList.length ? "text-green-700" : ""
              }`}
            >
              {encouragement}
            </p>
            <Progress
              size={40}
              type="circle"
              percent={(completedCount * 100) / todoList.length}
              format={() => (
                <p className="text-[10px]">
                  {((completedCount * 100) / todoList.length).toFixed(0)}%
                </p>
              )}
            />
          </div>
        ) : (
          <div className="h-full flex items-center justify-center flex-col">
            <Lottie
              loop
              animationData={lottieJson}
              play
              style={{ width: 250, height: 250 }}
            />
            <p className="text-sm text-gray-500">Let's create a new one!</p>
          </div>
        )}

        {todoList.map((item: ITodoItem, index: number) => (
          <div
            key={item.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className="cursor-move transition-all duration-300"
          >
            <TodoItem
              todo={item}
              onUpdateTodoItemStatus={onUpdateTodoItemStatus}
              onRemoveTodoItem={onRemoveTodoItem}
              onUpdateTodoItemLabel={onUpdateTodoItemLabel}
              onUpdateDoingTodoItemStatus={onUpdateDoingTodoItemStatus}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-4 mt-2 bg-white">
        <input
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:border-gray-300 focus:outline-none"
          value={input}
          placeholder="Enter your task"
          onChange={(e) => onChangeInput(e)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onAddTodoItem();
            }
          }}
        />
        <button
          type="button"
          className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white"
          onClick={onAddTodoItem}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default TodoList;
