import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';

// Interface para configurações
interface AppConfig {
  webhookUrl: string;
  adminEmail: string;
  adminPassword: string;
  siteLogo: string;
  appIcon: string;
  companyName: string;
  whatsapp: string;
  pix: string;
}

const CONFIG_FILE = join(process.cwd(), 'app-config.json');
const MANIFEST_FILE = join(process.cwd(), 'public', 'manifest.json');

// GET - Buscar configurações atuais
export async function GET() {
  try {
    let config: AppConfig;
    
    try {
      const configData = await readFile(CONFIG_FILE, 'utf-8');
      config = JSON.parse(configData);
    } catch {
      // Se não existir arquivo, usar valores padrão
      config = {
        webhookUrl: process.env.NEXT_PUBLIC_WHATSAPP_WEBHOOK_URL || '',
        adminEmail: process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@sabores.com',
        adminPassword: '', // Nunca retornar senha
        siteLogo: '/icon-192x192.png',
        appIcon: '/icon-512x512.png',
        companyName: 'Sabores de Zissou',
        whatsapp: '5511981047422',
        pix: '11981047422'
      };
    }

    // Não incluir senha na resposta
    const { adminPassword, ...publicConfig } = config;

    return NextResponse.json({ 
      success: true, 
      config: publicConfig 
    });
    
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST - Salvar configurações
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      webhookUrl, 
      adminEmail, 
      adminPassword, 
      siteLogo, 
      appIcon,
      companyName,
      whatsapp,
      pix
    } = body;

    // Validações básicas
    if (adminEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminEmail)) {
      return NextResponse.json(
        { success: false, error: 'Email inválido' },
        { status: 400 }
      );
    }

    if (webhookUrl && !/^https?:\/\/.+/.test(webhookUrl)) {
      return NextResponse.json(
        { success: false, error: 'URL do webhook inválida' },
        { status: 400 }
      );
    }

    // Carregar configuração atual
    let currentConfig: AppConfig;
    try {
      const configData = await readFile(CONFIG_FILE, 'utf-8');
      currentConfig = JSON.parse(configData);
    } catch {
      currentConfig = {
        webhookUrl: '',
        adminEmail: 'admin@sabores.com',
        adminPassword: process.env.ADMIN_PASSWORD || 'admin123',
        siteLogo: '/icon-192x192.png',
        appIcon: '/icon-512x512.png',
        companyName: 'Sabores de Zissou',
        whatsapp: '5511981047422',
        pix: '11981047422'
      };
    }

    // Atualizar apenas campos fornecidos
    const newConfig: AppConfig = {
      ...currentConfig,
      webhookUrl: webhookUrl ?? currentConfig.webhookUrl,
      adminEmail: adminEmail ?? currentConfig.adminEmail,
      adminPassword: adminPassword || currentConfig.adminPassword,
      siteLogo: siteLogo ?? currentConfig.siteLogo,
      appIcon: appIcon ?? currentConfig.appIcon,
      companyName: companyName ?? currentConfig.companyName,
      whatsapp: whatsapp ?? currentConfig.whatsapp,
      pix: pix ?? currentConfig.pix
    };

    // Salvar configurações
    await writeFile(CONFIG_FILE, JSON.stringify(newConfig, null, 2));

    // Atualizar manifest.json se o ícone mudou
    if (appIcon && appIcon !== currentConfig.appIcon) {
      await updateManifest(newConfig);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Configurações salvas com sucesso!' 
    });

  } catch (error) {
    console.error('Erro ao salvar configurações:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// Função para atualizar o manifest.json
async function updateManifest(config: AppConfig) {
  try {
    const manifest = {
      name: config.companyName,
      short_name: config.companyName,
      description: `${config.companyName} - Confeitaria PWA`,
      start_url: "/",
      display: "standalone",
      background_color: "#FDF2E9",
      theme_color: "#E9C46A",
      icons: [
        {
          src: config.appIcon,
          sizes: "192x192",
          type: "image/png",
          purpose: "any"
        },
        {
          src: config.appIcon,
          sizes: "512x512", 
          type: "image/png",
          purpose: "maskable"
        }
      ]
    };

    await writeFile(MANIFEST_FILE, JSON.stringify(manifest, null, 2));
    console.log('Manifest.json atualizado com sucesso');
    
  } catch (error) {
    console.error('Erro ao atualizar manifest:', error);
  }
}

// POST para testar webhook
export async function PUT(request: NextRequest) {
  try {
    const { webhookUrl } = await request.json();

    if (!webhookUrl) {
      return NextResponse.json(
        { success: false, error: 'URL do webhook é obrigatória' },
        { status: 400 }
      );
    }

    const testMessage = {
      text: `🧪 *Teste do Webhook - Sabores de Zissou*\n\n✅ Se você recebeu esta mensagem, o webhook está funcionando corretamente!\n\n📅 Data/Hora: ${new Date().toLocaleString('pt-BR')}`
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testMessage)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Teste enviado com sucesso! Verifique o WhatsApp.' 
    });

  } catch (error) {
    console.error('Erro no teste do webhook:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: `Erro ao testar webhook: ${error instanceof Error ? error.message : 'Erro desconhecido'}` 
      },
      { status: 500 }
    );
  }
}