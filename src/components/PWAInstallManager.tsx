'use client';

import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import { Download, Smartphone, CheckCircle } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const PWAInstallManager: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    // Verificar se já está instalado
    const checkStandalone = () => {
      const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
      const isIOSStandalone = (window.navigator as any).standalone === true;
      setIsStandalone(isStandaloneMode || isIOSStandalone);
    };

    checkStandalone();

    // Capturar evento de instalação
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const event = e as BeforeInstallPromptEvent;
      setDeferredPrompt(event);
      setCanInstall(true);
    };

    // Detectar para iOS Safari
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    
    if (isIOS && isSafari && !isStandalone) {
      setCanInstall(true);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Detectar quando o app foi instalado
    window.addEventListener('appinstalled', () => {
      setDeferredPrompt(null);
      setIsStandalone(true);
      setCanInstall(false);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [isStandalone]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Chrome/Edge
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setCanInstall(false);
      }
    } else {
      // iOS Safari - mostrar instruções
      alert('Para instalar:\n1. Toque no botão de compartilhamento\n2. Selecione "Adicionar à Tela de Início"');
    }
  };

  // Se já está instalado, mostrar status
  if (isStandalone) {
    return (
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm font-medium">App Instalado</span>
        </div>
      </div>
    );
  }

  // Se pode instalar, mostrar botão
  if (canInstall) {
    return (
      <div className="text-center mb-4">
        <Button 
          onClick={handleInstallClick}
          variant="outline"
          size="lg"
          className="bg-blue-50 hover:bg-blue-100 border-blue-300 text-blue-700 hover:text-blue-800"
        >
          <Download className="w-5 h-5 mr-2" />
          Instalar App
        </Button>
        <p className="text-xs text-blue-600 mt-2">
          Acesso rápido e notificações offline
        </p>
      </div>
    );
  }

  return null;
};

export default PWAInstallManager;