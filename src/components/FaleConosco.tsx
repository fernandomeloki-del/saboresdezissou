'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { MessageCircle, Phone, MapPin } from 'lucide-react';

const FaleConosco: React.FC = () => {
  const whatsappNumber = '5511981047422';
  const whatsappMessage = encodeURIComponent('Olá! Gostaria de tirar uma dúvida sobre os produtos da Sabores de Zissou.');

  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`, '_blank');
  };

  return (
    <section className="mb-12">
      <h2 className="font-display text-3xl font-bold text-center text-primary-800 mb-8">
        Fale Conosco
      </h2>
      
      <div className="max-w-2xl mx-auto">
        <Card className="bg-gradient-to-br from-pastel-cream to-pastel-blush">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-primary-800">
              Tem alguma dúvida?
            </CardTitle>
            <p className="text-primary-600 mt-2">
              Entre em contato conosco pelo WhatsApp!
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center">
              <Button 
                onClick={handleWhatsAppClick}
                size="lg"
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Falar no WhatsApp
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
              <div className="flex flex-col items-center p-4 bg-white/50 rounded-lg">
                <Phone className="w-6 h-6 text-primary-500 mb-2" />
                <span className="text-sm font-medium text-primary-700">Telefone</span>
                <span className="text-primary-600">(11) 98104-7422</span>
              </div>
              
              <div className="flex flex-col items-center p-4 bg-white/50 rounded-lg">
                <MapPin className="w-6 h-6 text-primary-500 mb-2" />
                <span className="text-sm font-medium text-primary-700">Localização</span>
                <span className="text-primary-600">São Paulo, SP</span>
              </div>
            </div>
            
            <div className="text-center text-sm text-primary-600">
              <p>Horário de atendimento:</p>
              <p>Segunda a Sexta: 8h às 18h</p>
              <p>Sábado: 8h às 14h</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default FaleConosco;