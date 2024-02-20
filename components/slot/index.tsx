import React, { useState } from "react";
import Tooltip from "../tooltip";

interface SlotProps {
  option: string;
  backgroundColor: string;
  borderColor: string;
  onChange: (value: string) => void;
}

const Slot: React.FC<SlotProps> = ({
  option,
  backgroundColor,
  borderColor,
  onChange,
}) => {
  const [hovered, setHovered] = useState<string | null>(null);
  const colorName = `${option}`;

  return (
    <div
      key={option}
      className={`w-6 h-6 rounded-full border cursor-pointer ${borderColor} relative`}
      style={{ backgroundColor }}
      onMouseEnter={() => setHovered(option)}
      onMouseLeave={() => setHovered(null)}
      onClick={() => onChange(option)}
    >
      {hovered === option && <Tooltip text={colorName} />}
    </div>
  );
};

export default Slot;
