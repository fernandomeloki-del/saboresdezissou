'use client';

import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-cream via-pastel-vanilla to-pastel-blush flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="text-8xl font-bold text-primary-300 mb-4">404</div>
          <h1 className="font-display text-3xl font-bold text-primary-800 mb-2">
            Página não encontrada
          </h1>
          <p className="text-primary-600">
            Oops! A página que você está procurando não existe ou foi movida.
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/">
            <Button className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Voltar ao Início
            </Button>
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="w-full flex items-center justify-center px-4 py-2 text-primary-600 hover:text-primary-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar à página anterior
          </button>
        </div>

        <div className="mt-8 text-sm text-primary-500">
          <p>Se você acredita que isso é um erro, entre em contato conosco.</p>
        </div>
      </div>
    </div>
  );
}