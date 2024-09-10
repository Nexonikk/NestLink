const Loader = () => {
  return (
    <div className="flex items-center justify-center mx-auto">
      <div class="flex flex-row gap-2">
        <div class="w-3 h-3 rounded-full bg-[#3b82f6] animate-bounce [animation-delay:-.3s]"></div>
        <div class="w-3 h-3 rounded-full bg-[#3b82f6] animate-bounce"></div>
        <div class="w-3 h-3 rounded-full bg-[#3b82f6] animate-bounce [animation-delay:-.5s]"></div>
      </div>
    </div>
  );
};

export default Loader;
