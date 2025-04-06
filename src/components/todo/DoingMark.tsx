const DoingMark = () => {
  return (
    <span className="absolute flex size-3 top-[-4px] right-[-2px]">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
      <span className="relative inline-flex size-3 rounded-full bg-sky-500"></span>
    </span>
  );
};

export default DoingMark;
