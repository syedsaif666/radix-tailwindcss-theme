"use client";

import Navbar from "@/components/navbar";
import SelectMenu from "@/components/select-menu";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";
import { MdContentCopy } from "react-icons/md";
import { TiTick } from "react-icons/ti";

interface ColorsData {
  color: {
    [key: string]: {
      [key: string]: {
        value: string;
        type: string;
      };
    };
  };
}

const colorsData: ColorsData = require("@/public/radix-colors.json");

interface Theme {
  primary: string;
  secondary: string;
  success: string;
  alert: string;
  warning: string;
  info: string;
  neutral: string;
}

const themeColors: Partial<Record<keyof Theme, string[]>> = {
  alert: ["red", "ruby", "tomato", "crimson"],
  success: ["green", "teal", "jade", "grass", "mint"],
  warning: ["yellow", "amber", "orange"],
  info: ["blue", "indigo", "sky", "cyan"],
};

const ThemeGenerator: React.FC = () => {
  const [theme, setTheme] = useState<Theme>({
    neutral: "gray",
    primary: "blue",
    secondary: "gray",
    success: "green",
    alert: "red",
    warning: "yellow",
    info: "blue",
  });
  const [tailwindConfig, setTailwindConfig] = useState("");
  const [themeCSS, setThemeCSS] = useState<string>("");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [copied, setCopied] = useState<{ [key: string]: boolean }>({
    themeCSS: false,
    tailwindConfig: false,
  });
  const { setTheme: setAppTheme } = useTheme();
  const [tailwindConfigVariables, setTailwindConfigVariables] = useState<
    string[]
  >([]);

  const handleChange = (themeKey: keyof Theme, newValue: string) => {
    setTheme((prevTheme) => ({ ...prevTheme, [themeKey]: newValue }));
  };

  const generateTheme = (): string => {
    const themeVariables: string[] = [];
    const configVariables: string[] = [];

    const modeSuffix = isDarkMode ? "Dark" : ""; // Suffix for dark mode

    Object.entries(theme).forEach(([name, color]) => {
      const colorName = `${color}${modeSuffix}`; // Append mode suffix
      const colorData = colorsData.color[colorName] as Record<
        string,
        { value: string; type: string }
      >;

      const shadeNames = [
        "base",
        "bg-subtle",
        "bg",
        "bg-hover",
        "bg-active",
        "line",
        "border",
        "border-hover",
        "solid",
        "solid-hover",
        "text",
        "text-contrast",
      ];

      shadeNames.forEach((shadeName, i) => {
        const key = `${name}-${shadeName}`;
        const value = colorData[(i + 1) * 100].value;
        themeVariables.push(`\t--${key}: ${value};`);
        configVariables.push(`\t"${key}": "var(--${key})",`);
      });

      themeVariables.push("\n");
      configVariables.push("\n");
    });

    if (themeVariables.length) themeVariables.pop();
    if (configVariables.length) configVariables.pop();

    setTailwindConfigVariables(configVariables);

    return `${isDarkMode ? ".dark" : ":root"} {\n${themeVariables.join(
      "\n"
    )}\n}`;
  };

  const handleCopy = (text: string, key: "themeCSS" | "tailwindConfig") => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied((prevStatus) => ({ ...prevStatus, [key]: true }));
        setTimeout(
          () => setCopied((prevStatus) => ({ ...prevStatus, [key]: false })),
          1000
        );
      })
      .catch(() => {
        setCopied((prevStatus) => ({ ...prevStatus, [key]: false }));
      });
  };

  const getOptionsForThemeKey = (themeKey: keyof Theme): string[] => {
    return (
      themeColors[themeKey] ||
      Object.keys(colorsData.color).filter((color) => !color.endsWith("Dark"))
    );
  };

  useEffect(() => {
    const generatedTheme = generateTheme();
    setThemeCSS(generatedTheme);
    setAppTheme(isDarkMode ? "dark" : "light");
  }, [theme, isDarkMode]);

  useEffect(() => {
    const generatedConfig = `colors: {\n${tailwindConfigVariables.join(
      "\n"
    )}\n}`;
    setTailwindConfig(generatedConfig);
  }, [tailwindConfigVariables]);

  return (
    <>
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      <div className="flex justify-between px-4 py-[26px] min-h-[calc(100dvh-8.85rem)]">
        <div className="flex flex-col gap-2.5">
          <h2 className="text-primary-text-contrast font-semibold">Theme</h2>
          <div className="flex flex-col gap-6 bg-primary-bg rounded-sm p-5">
            <div className="flex gap-2 text-primary-text-contrast ">
              <button
                type="button"
                title="light theme"
                onClick={() => setIsDarkMode(false)}
                className={`rounded-md px-3 border border-primary-border flex items-center justify-center gap-1 h-8 w-full text-sm ${
                  !isDarkMode && "border-primary-solid"
                }`}
              >
                <FiSun className="text-primary-text" />
                Light
              </button>
              <button
                type="button"
                title="dark theme"
                onClick={() => setIsDarkMode(true)}
                className={`rounded-md px-3 border border-primary-border flex items-center justify-center gap-1 h-8 w-full text-sm ${
                  isDarkMode && "border-primary-solid"
                }`}
              >
                <FiMoon className="text-primary-text" />
                Dark
              </button>
            </div>
            {Object.keys(theme).map((themeKey) => (
              <div key={themeKey} className="flex flex-col gap-1">
                <label
                  htmlFor={themeKey}
                  className="text-primary-text-contrast"
                >
                  {themeKey.charAt(0).toUpperCase() + themeKey.slice(1)}
                </label>
                <SelectMenu
                  options={getOptionsForThemeKey(themeKey as keyof Theme)}
                  selectedValue={theme[themeKey as keyof Theme]}
                  onChange={(newValue: string) =>
                    handleChange(themeKey as keyof Theme, newValue)
                  }
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex flex-col justify-start items-start rounded-sm gap-2.5 h-full">
            <h2 className="text-primary-text-contrast font-semibold">
              main.css
            </h2>
            <div className="h-full relative">
              <button
                onClick={() => handleCopy(themeCSS, "themeCSS")}
                type="button"
                title="copy"
                className="absolute right-0 p-[10px]"
              >
                {copied.themeCSS ? (
                  <TiTick className="text-primary-text text-xl" />
                ) : (
                  <MdContentCopy className="text-primary-text text-xl" />
                )}
              </button>
              <textarea
                title="theme"
                placeholder="theme"
                rows={10}
                cols={50}
                value={themeCSS}
                className="text-primary-text-contrast text-sm h-full bg-primary-bg outline-none focus:outline-none p-5 pt-[30px] resize-none"
                readOnly
              ></textarea>
            </div>
          </div>
          <div className="flex flex-col justify-start items-start rounded-sm gap-2.5 h-full">
            <h2 className="text-primary-text-contrast font-semibold">
              tailwind.config.js
            </h2>
            <div className="h-full relative">
              <button
                onClick={() => handleCopy(tailwindConfig, "tailwindConfig")}
                type="button"
                title="copy"
                className="absolute right-0 p-[10px]"
              >
                {copied.tailwindConfig ? (
                  <TiTick className="text-primary-text text-xl" />
                ) : (
                  <MdContentCopy className="text-primary-text text-xl" />
                )}
              </button>
              <textarea
                title="theme"
                placeholder="theme"
                rows={10}
                cols={50}
                value={tailwindConfig}
                className="text-primary-text-contrast text-sm h-full bg-primary-bg outline-none focus:outline-none p-5 pt-[30px] resize-none"
                readOnly
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ThemeGenerator;
