import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import type { OrderFormData } from '@/types';

interface OrderRequest extends OrderFormData {
  product_id: string;
  product_name: string;
  product_image?: string;
  product_price?: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: OrderRequest = await request.json();
    
    // Validar dados obrigatórios
    if (!body.product_id || !body.customer_name || !body.customer_address || !body.customer_whatsapp) {
      return NextResponse.json(
        { error: 'Dados obrigatórios não fornecidos' },
        { status: 400 }
      );
    }

    // Salvar pedido no Supabase
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        product_id: body.product_id,
        customer_name: body.customer_name,
        customer_address: body.customer_address,
        customer_whatsapp: body.customer_whatsapp,
        delivery_date: body.delivery_date || null,
        payment_method: body.payment_method || 'pix',
      } as any)
      .select()
      .single();

    if (orderError) {
      console.error('Erro ao salvar pedido:', orderError);
      return NextResponse.json(
        { error: 'Erro ao salvar pedido' },
        { status: 500 }
      );
    }

    // Preparar mensagem para WhatsApp
    const message = formatWhatsAppMessage(body);
    
    // Enviar para webhook do WhatsApp
    const webhookUrl = process.env.NEXT_PUBLIC_WHATSAPP_WEBHOOK_URL;
    
    if (webhookUrl) {
      try {
        const webhookResponse = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phone: body.customer_whatsapp,
            message: message,
            image: body.product_image,
          }),
        });

        if (!webhookResponse.ok) {
          console.error('Erro no webhook:', await webhookResponse.text());
        }
      } catch (webhookError) {
        console.error('Erro ao enviar webhook:', webhookError);
        // Não falhar a requisição se o webhook falhar
      }
    }

    return NextResponse.json(
      { 
        success: true, 
        order_id: (order as any)?.id,
        message: 'Pedido enviado com sucesso!' 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Erro na API de pedidos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

function formatWhatsAppMessage(data: OrderRequest): string {
  const deliveryInfo = data.delivery_date 
    ? `\n📅 *Data para entrega:* ${new Date(data.delivery_date).toLocaleDateString('pt-BR')}`
    : '';

  const priceInfo = data.product_price 
    ? `\n💰 *Preço:* R$ ${data.product_price.toFixed(2).replace('.', ',')}`
    : '';

  const paymentInfo = data.payment_method === 'pix' 
    ? '\n💳 *Pagamento:* PIX (Chave: 11981047422)'
    : '\n💳 *Pagamento:* Cartão (Levaremos a máquina)';

  return `🍰 *Novo Pedido - Sabores de Zissou*

🛍️ *Produto:* ${data.product_name}${priceInfo}

👤 *Cliente:* ${data.customer_name}
📱 *WhatsApp:* ${data.customer_whatsapp}
📍 *Endereço:* ${data.customer_address}${deliveryInfo}${paymentInfo}

⏰ *Pedido realizado em:* ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}

---
_Pedido realizado através do app Sabores de Zissou_`;
}