"use client";
import React, { useEffect, useState } from "react";
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

// Assuming colorsData is of type ColorsData
const colorsData: ColorsData = require("@/public/radix-colors.json");

interface Theme {
  primary: string;
  secondary: string;
  success: string;
  alert: string;
  warning: string;
  neutral: string;
}

const themeKeys = [
  "primary",
  "secondary",
  "success",
  "alert",
  "warning",
  "neutral",
];

const ThemeGenerator: React.FC = () => {
  const [theme, setTheme] = useState<Theme>({
    primary: "blue",
    secondary: "gray",
    success: "green",
    alert: "red",
    warning: "yellow",
    neutral: "gray",
  });
  const [themeCSS, setThemeCSS] = useState<string>("");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTheme((prevTheme) => ({ ...prevTheme, [name]: value }));
  };

  const generateTheme = (): string => {
    const themeVariables: string[] = [];

    const modeSuffix = isDarkMode ? "Dark" : ""; // Suffix for dark mode

    const generateShades = (color: string, name: string) => {
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

      for (let i = 0; i < shadeNames.length; i++) {
        themeVariables.push(
          `--${name}-${shadeNames[i]}: ${colorData[(i + 1) * 100].value};`
        );
      }
    };

    generateShades(theme.primary, "primary");
    generateShades(theme.secondary, "secondary");
    generateShades(theme.success, "success");
    generateShades(theme.warning, "warning");
    generateShades(theme.alert, "danger");
    generateShades(theme.neutral, "neutral");

    return themeVariables.join("\n");
  };

  useEffect(() => {
    const generatedTheme = generateTheme();
    setThemeCSS(generatedTheme);
  }, [theme, isDarkMode]);

  const handleCopy = () => {
    navigator.clipboard.writeText(themeCSS).then(() => {
      alert("Theme CSS variables copied to clipboard!");
    });
  };

  const toggleThemeMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <>
      <div className="flex justify-between h-full">
        <div className="flex flex-col justify-center">
          {Object.keys(theme).map((themeKey) => (
            <div key={themeKey}>
              <label htmlFor={themeKey}>
                {themeKey.charAt(0).toUpperCase() + themeKey.slice(1)}:
              </label>
              <select
                name={themeKey}
                value={theme[themeKey as keyof Theme]} // Type assertion here
                className="text-black"
                onChange={handleChange}
              >
                {Object.keys(colorsData.color).map((color) => (
                  <option key={color} className="text-black" value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>
          ))}
          <div>
            <input
              type="checkbox"
              checked={isDarkMode}
              onChange={toggleThemeMode}
            />
            <label>Dark Mode</label>
          </div>
        </div>
        <div className="flex flex-col justify-start items-start h-[100vh]">
          <textarea
            rows={10}
            cols={50}
            value={themeCSS}
            className="text-black h-full"
            readOnly
          ></textarea>
          <button onClick={handleCopy}>Copy CSS Variables</button>
        </div>
      </div>
    </>
  );
};

export default ThemeGenerator;
