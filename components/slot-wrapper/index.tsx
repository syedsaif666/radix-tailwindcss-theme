import React from "react";
import Slot from "../slot";

interface SlotProps {
  options: string[];
  selectedValue: string;
  onChange: (value: string) => void;
}

const colorsData = require("@/public/radix-colors.json");

const SlotWrapper: React.FC<SlotProps> = ({
  options,
  selectedValue,
  onChange,
}) => {
  return (
    <div className="grid grid-cols-10 w-[279px] gap-2">
      {options.map((option) => {
        const backgroundColor = colorsData.color[option]["900"].value;
        if (option === "blackAlpha" || option === "whiteAlpha") return null;
        const borderColor =
          option === selectedValue ? "border-fg-default" : "border-transparent";

        return (
          <Slot
            key={option}
            option={option}
            backgroundColor={backgroundColor}
            borderColor={borderColor}
            onChange={onChange}
          />
        );
      })}
    </div>
  );
};

export default SlotWrapper;
