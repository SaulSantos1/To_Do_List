import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import Logo from '../ui/Logo';

const Layout = ({ toggleTheme, theme }) => {
  const { user, logout } = useAuth();

  console.log('Current user:', user);
  const navigate = useNavigate();
  const API_BASE_URL = 'http://localhost:8000';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Logo />
            <span className="text-xl font-bold">To-Do List</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
            >
              {theme === 'light' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="hover:underline">
                  <div className="flex items-center space-x-2">
                    {user.foto_perfil ? (
                      <img 
                        src={`${API_BASE_URL}${user.foto_perfil}`} 
                        alt="Profile" 
                        className="w-8 h-8 rounded-full object-cover border-1 border-white shadow-md"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-1xl font-bold border-4 border-white shadow-md">
                        {user.email.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span>{user.email}</span>
                  </div>
                </Link>
                <Button variant="light" onClick={handleLogout}>
                  Sair
                </Button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link to="/login">
                  <Button>Entrar</Button>
                </Link>
                <Link to="/register">
                  <Button>Registrar</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <nav className="bg-white dark:bg-slate-700 shadow-sm">
        <div className="container mx-auto px-4 py-2">
          <ul className="flex space-x-6">
            {user && (
              <>
                <li>
                  <Link 
                    to="/tasks" 
                    className="py-2 px-3 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
                  >
                    Minhas Tarefas
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/profile" 
                    className="py-2 px-3 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
                  >
                    Meu Perfil
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>

      <main className="flex-grow container mx-auto px-4 py-6">
        <Outlet />
      </main>

      <footer className="bg-gray-100 dark:bg-slate-800 py-6">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-300">
          <p>© {new Date().getFullYear()} To-Do List - Gerenciador de Tarefas</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;