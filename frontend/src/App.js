import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/common/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import TasksPage from './pages/tasks/TasksPage';
import TaskDetailPage from './pages/tasks/TaskDetailPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import './App.css';

function App() {
  const { user } = useAuth();
  const [theme, setTheme] = useState(() => {
    // Tenta recuperar o tema do localStorage ao iniciar
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  // Salva o tema no localStorage sempre que ele mudar
  useEffect(() => {
    localStorage.setItem('theme', theme);
    // Atualiza a classe no elemento raiz do HTML
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={`app ${theme}`}>
      <Routes>
        <Route 
          path="/" 
          element={<Layout toggleTheme={toggleTheme} theme={theme} />}
        >
          <Route index element={<HomePage />} />
          <Route path="login" element={!user ? <LoginPage /> : <Navigate to="/tasks" />} />
          <Route path="register" element={!user ? <RegisterPage /> : <Navigate to="/tasks" />} />
          <Route path="tasks" element={user ? <TasksPage /> : <Navigate to="/login" />} />
          <Route path="tasks/:id" element={user ? <TaskDetailPage /> : <Navigate to="/login" />} />
          <Route path="profile" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;