import { useState, useEffect } from "react";

type ThemeType = "light" | "dark";

export const useTheme = () => {
  const [theme, setTheme] = useState<ThemeType>(() => {
    // Получить сохранённую тему из localStorage или использовать light по умолчанию
    const savedTheme = localStorage.getItem("theme");
    return (savedTheme as ThemeType) || "light";
  });

  // Применить тему при загрузке и изменении
  useEffect(() => {
    const htmlElement = document.documentElement;
    if (theme === "dark") {
      htmlElement.setAttribute("data-theme", "dark");
    } else {
      htmlElement.removeAttribute("data-theme");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleThemeChange = (newTheme: ThemeType) => {
    setTheme(newTheme);
  };

  return { theme, handleThemeChange };
};
