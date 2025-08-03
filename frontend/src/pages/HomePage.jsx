import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 dark:text-white">
          Gerencie suas tarefas com <span className="text-primary">To-Do List</span>
        </h1>
        
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Uma maneira simples e eficiente de organizar seu trabalho e aumentar sua produtividade.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          {user ? (
            <Link to="/tasks">
              <Button size="lg">Minhas Tarefas</Button>
            </Link>
          ) : (
            <>
              <Link to="/register">
                <Button size="lg">Comece Agora</Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg">
                  Entrar
                </Button>
              </Link>
            </>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="text-primary mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 dark:text-white">Organização Simples</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Mantenha todas as suas tarefas em um só lugar com nossa interface intuitiva.
            </p>
          </Card>
          
          <Card className="p-6">
            <div className="text-primary mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 dark:text-white">Prazos Claros</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Defina prazos e prioridades para nunca mais perder um compromisso.
            </p>
          </Card>
          
          <Card className="p-6">
            <div className="text-primary mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 dark:text-white">Segurança</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Seus dados estão seguros com nossa plataforma confiável e protegida.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomePage;