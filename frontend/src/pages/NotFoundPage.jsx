import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="text-center p-8 max-w-md w-full">
        <div className="text-6xl font-bold text-primary mb-4">404</div>
        <h1 className="text-2xl font-bold mb-4 dark:text-white">Página não encontrada</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          A página que você está procurando não existe ou foi movida.
        </p>
        <Link to="/">
          <Button>Voltar para a página inicial</Button>
        </Link>
      </Card>
    </div>
  );
};

export default NotFoundPage;