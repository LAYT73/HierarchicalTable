import { Moon, Sun } from "lucide-react";
import styles from "./Header.module.scss";

interface HeaderProps {
  theme: "light" | "dark";
  onThemeChange: (theme: "light" | "dark") => void;
}

export function Header({ theme, onThemeChange }: HeaderProps) {
  const handleThemeToggle = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    onThemeChange(newTheme);
  };

  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>Иерархическая таблица</h1>
          <p className={styles.subtitle}>
            Управление данными с фильтрацией и сортировкой
          </p>
        </div>

        <button
          className={styles.themeToggle}
          onClick={handleThemeToggle}
          aria-label="Toggle theme"
          title={theme === "light" ? "Темная тема" : "Светлая тема"}
        >
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>
    </header>
  );
}
