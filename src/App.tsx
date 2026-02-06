import { useState, useEffect } from "react";
import { Header } from "./components/Header/Header";
import { Table } from "./components/Table/Table";
import { fetchTableData } from "./api/mockApi";
import type { DataItem } from "./types";
import { useTheme } from "./hooks/useTheme";
import styles from "./App.module.scss";

function App() {
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme, handleThemeChange } = useTheme();

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const result = await fetchTableData();
        setData(result);
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className={styles.app}>
      <div className={styles.container}>
        <Header theme={theme} onThemeChange={handleThemeChange} />

        <main className={styles.content}>
          <Table data={data} loading={loading} itemsPerPage={10} />
        </main>
      </div>
    </div>
  );
}

export default App;
