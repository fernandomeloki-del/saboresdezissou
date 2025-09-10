'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, Plus, Package, ShoppingBag, BarChart3, Settings } from 'lucide-react';
import ProductManager from '@/components/ProductManager';
import SystemSettings from '@/components/SystemSettings';
import DynamicLogo from '@/components/DynamicLogo';
import { supabase } from '@/lib/supabase';
import type { Product, Order } from '@/types';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'settings'>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { logout } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Buscar produtos
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (productsError) {
        console.error('Erro ao buscar produtos:', productsError);
      } else {
        setProducts(productsData || []);
      }

      // Buscar pedidos
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('Erro ao buscar pedidos:', ordersError);
      } else {
        setOrders(ordersData || []);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const tabs = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: BarChart3 },
    { id: 'products' as const, label: 'Produtos', icon: Package },
    { id: 'orders' as const, label: 'Pedidos', icon: ShoppingBag },
    { id: 'settings' as const, label: 'Configurações', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-pastel-vanilla">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <DynamicLogo size={32} className="mr-3" />
              <h1 className="font-display text-xl font-bold text-primary-800">
                Admin - Sabores de Zissou
              </h1>
            </div>
            
            <Button onClick={handleLogout} variant="ghost" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-600 hover:text-primary-600 hover:bg-pastel-cream'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Package className="w-5 h-5 mr-2 text-primary-500" />
                    Total de Produtos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary-800">
                    {products.length}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {products.filter(p => p.is_daily_product).length} produtos do dia
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <ShoppingBag className="w-5 h-5 mr-2 text-primary-500" />
                    Pedidos Pendentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary-800">
                    {orders.filter(o => o.status === 'pending').length}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Aguardando processamento
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-primary-500" />
                    Total de Pedidos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary-800">
                    {orders.length}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Todos os tempos
                  </p>
                </CardContent>
              </Card>
            </div>
            
            {/* Lista rápida de produtos */}
            <div>
              <h3 className="font-display text-xl font-bold text-primary-800 mb-4">
                Produtos Recentes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.slice(0, 6).map((product) => (
                  <Card key={product.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-primary-800 mb-1 line-clamp-1">
                        {product.name}
                      </h4>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                        {product.description || 'Sem descrição'}
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="flex gap-1">
                          {product.is_daily_product && (
                            <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                              Dia
                            </span>
                          )}
                          {product.is_custom_product && (
                            <span className="px-2 py-1 bg-pastel-mint text-primary-700 text-xs rounded-full">
                              Encomenda
                            </span>
                          )}
                        </div>
                        {product.show_price && product.price && (
                          <span className="text-sm font-semibold text-primary-600">
                            R$ {product.price.toFixed(2).replace('.', ',')}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <ProductManager 
            products={products} 
            onProductsChange={(newProducts) => {
              setProducts(newProducts);
              // Recarregar dados para manter sincronizado
              loadData();
            }}
            loading={loading}
          />
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-display text-2xl font-bold text-primary-800">
                Pedidos
              </h2>
            </div>

            {loading ? (
              <Card className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Carregando pedidos...</p>
              </Card>
            ) : orders.length === 0 ? (
              <Card className="p-8 text-center">
                <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Nenhum pedido encontrado</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-primary-800">
                            Pedido #{order.id.slice(0, 8)}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {new Date(order.created_at).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {order.status === 'pending' ? 'Pendente' :
                           order.status === 'sent' ? 'Enviado' : 'Entregue'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p><strong>Cliente:</strong> {order.customer_name}</p>
                          <p><strong>WhatsApp:</strong> {order.customer_whatsapp}</p>
                        </div>
                        <div>
                          <p><strong>Endereço:</strong> {order.customer_address}</p>
                          {order.delivery_date && (
                            <p><strong>Data de entrega:</strong> {new Date(order.delivery_date).toLocaleDateString('pt-BR')}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <SystemSettings />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;