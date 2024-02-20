import React from "react";

interface TooltipProps {
  text: string;
}

const Tooltip: React.FC<TooltipProps> = ({ text }) => {
  return (
    <div className="relative flex flex-col items-center group">
      <div className="absolute bottom-0 flex flex-col items-center mb-1 group-hover:flex">
        <span className="relative z-10 p-2 text-xs leading-none text-bg-default whitespace-no-wrap bg-fg-default shadow-lg rounded-md">
          {text}
        </span>
        <div className="w-3 h-3 -mt-2 rotate-45 bg-fg-default"></div>
      </div>
    </div>
  );
};

export default Tooltip;
