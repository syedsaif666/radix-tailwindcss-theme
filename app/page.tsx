"use client";

import Navbar from "@/components/navbar";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";
import { Copy, Tick } from "@/components/icons";
import SlotWrapper from "@/components/slot-wrapper";

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
  warning: string;
  alert: string;
  info: string;
  canvas: string;
  overlay: string;
}

const themeColors: Partial<Record<keyof Theme, string[]>> = {
  success: ["green", "teal", "jade", "grass", "mint"],
  warning: ["yellow", "amber", "orange"],
  alert: ["red", "ruby", "tomato", "crimson"],
  info: ["blue", "indigo", "sky", "cyan"],
};

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

const ThemeGenerator: React.FC = () => {
  const [theme, setTheme] = useState<Theme>({
    canvas: "gray",
    primary: "blue",
    secondary: "gray",
    success: "green",
    warning: "yellow",
    alert: "red",
    info: "blue",
    overlay: "whiteAlpha",
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

  useEffect(() => {
    const themeDisplayArea = document.getElementById("themeDisplayArea");
    if (themeDisplayArea) {
      const modeSuffix = isDarkMode ? "Dark" : "";
      const newClassName = `${theme.canvas}${modeSuffix}`;
      themeDisplayArea.className = "";

      themeDisplayArea.classList.add(newClassName);
    }
  }, [theme, isDarkMode]);

  const handleChange = (themeKey: keyof Theme, newValue: string) => {
    setTheme((prevTheme) => ({ ...prevTheme, [themeKey]: newValue }));
  };

  const generateTheme = (): string => {
    const themeVariables: string[] = [];
    const configVariables: string[] = [];
    const overlayVariables: string[] = [];

    const modeSuffix = isDarkMode ? "Dark" : "";

    Object.entries(theme).forEach(([name, color]) => {
      const colorName = `${color}${modeSuffix}`;
      const colorData = colorsData.color[colorName] as Record<
        string,
        { value: string; type: string }
      >;

      if (name === "canvas") {
        const defaultBg = isDarkMode ? "#000" : "#fff";
        themeVariables.push(`\t--bg-default: ${defaultBg};`);
        configVariables.push(`\t"bg-default": "var(--bg-default)",`);
      }

      shadeNames.forEach((shadeName, i) => {
        const key = `${name}-${shadeName}`;
        if (name === "overlay") {
          const overlayValue = isDarkMode
            ? colorsData.color["blackAlpha"][(i + 1) * 100]?.value
            : colorsData.color["whiteAlpha"][(i + 1) * 100]?.value;

          overlayVariables.push(`\t--${key}: ${overlayValue};`);
          configVariables.push(`\t"${key}": "var(--${key})",`);
        } else {
          const value = colorData[(i + 1) * 100].value;

          if (name === "canvas") {
            if (key.search("bg") > -1 || key.search("base") > -1) {
              themeVariables.push(`\t--bg-${shadeName}: ${value};`);
              configVariables.push(
                `\t"bg-${shadeName}": "var(--bg-${shadeName})",`
              );
            } else {
              themeVariables.push(`\t--fg-${shadeName}: ${value};`);
              configVariables.push(
                `\t"fg-${shadeName}": "var(--fg-${shadeName})",`
              );
            }
          } else {
            themeVariables.push(`\t--${key}: ${value};`);
            configVariables.push(`\t"${key}": "var(--${key})",`);
          }
        }
      });
      if (name === "canvas") {
        const defaultFg = isDarkMode ? "#fff" : "#000";
        themeVariables.push(`\t--fg-default: ${defaultFg};`);
        configVariables.push(`\t"fg-default": "var(--fg-default)",`);
      }

      themeVariables.push("\n");
      configVariables.push("\n");
    });

    if (themeVariables.length) themeVariables.pop();
    if (configVariables.length) configVariables.pop();

    setTailwindConfigVariables(configVariables);

    return `:root {\n${themeVariables.join("\n")}\n${overlayVariables.join(
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
          <h2 className="text-fg-text-contrast font-semibold">Theme</h2>
          <div className="flex flex-col gap-6 bg-bg-bg rounded-sm p-5">
            <div className="flex gap-2 text-fg-text-contrast ">
              <button
                type="button"
                title="light theme"
                onClick={() => setIsDarkMode(false)}
                className={`rounded-md px-3 border border-fg-border flex items-center justify-center gap-1 h-8 w-full text-sm ${
                  !isDarkMode && "border-fg-solid"
                }`}
              >
                <FiSun className="text-fg-text" />
                Light
              </button>
              <button
                type="button"
                title="dark theme"
                onClick={() => setIsDarkMode(true)}
                className={`rounded-md px-3 border border-fg-border flex items-center justify-center gap-1 h-8 w-full text-sm ${
                  isDarkMode && "border-fg-solid"
                }`}
              >
                <FiMoon className="text-fg-text" />
                Dark
              </button>
            </div>
            {Object.keys(theme)
              .filter((themeKey) => themeKey !== "overlay")
              .map((themeKey) => (
                <div key={themeKey} className="flex flex-col gap-1">
                  <label htmlFor={themeKey} className="text-fg-text-contrast">
                    {themeKey.charAt(0).toUpperCase() + themeKey.slice(1)}
                  </label>
                  <SlotWrapper
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
          <div className="flex flex-col justify-start items-start rounded-sm gap-2.5 h-full text-fg-text-contrast">
            <h2 className="font-semibold">main.css</h2>
            <div className="h-full relative">
              <button
                onClick={() => handleCopy(themeCSS, "themeCSS")}
                type="button"
                title="copy"
                className="absolute right-0 p-[10px]"
              >
                {copied.themeCSS ? (
                  <Tick className="text-fg-text text-xl" />
                ) : (
                  <Copy className="text-fg-text text-xl" />
                )}
              </button>
              <textarea
                title="themeCSS"
                placeholder="themeCSS"
                rows={10}
                cols={50}
                value={themeCSS}
                className="text-fg-text-contrast text-sm h-full bg-bg-bg outline-none focus:outline-none p-5 pt-[30px] resize-none lg:min-w-[440px]"
                readOnly
              ></textarea>
            </div>
          </div>
          <div className="flex flex-col justify-start items-start rounded-sm gap-2.5 h-full text-fg-text-contrast ">
            <h2 className="font-semibold">tailwind.config</h2>
            <div className="h-full relative">
              <button
                onClick={() => handleCopy(tailwindConfig, "tailwindConfig")}
                type="button"
                title="copy"
                className="absolute right-0 p-[10px]"
              >
                {copied.tailwindConfig ? (
                  <Tick className="text-fg-text text-xl" />
                ) : (
                  <Copy className="text-fg-text text-xl" />
                )}
              </button>
              <textarea
                title="tailwind config"
                placeholder="tailwind.config"
                rows={10}
                cols={50}
                value={tailwindConfig}
                className="text-fg-text-contrast text-sm h-full bg-bg-bg outline-none focus:outline-none p-5 pt-[30px] resize-none lg:min-w-[440px]"
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
