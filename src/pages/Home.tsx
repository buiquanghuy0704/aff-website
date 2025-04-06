import React from "react";
import Confetti from "react-confetti";
import TodoList from "../components/todo/TodoList";
import Timer from "../components/timer/Timer";

const Home = () => {
  const [isExploding, setIsExploding] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (isExploding) {
      setTimeout(() => {
        setIsExploding(false);
      }, 10000);
    }
  }, [isExploding]);

  return (
    <div className="relative flex gap-3 h-full p-4">
      {isExploding && <Confetti width={window.innerWidth} />}
      <div className="flex-[2]">
        <Timer />
      </div>
      <div className="flex-1">
        <TodoList setIsExploding={setIsExploding} />
      </div>
    </div>
  );
};

export default Home;
