import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

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

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Carregar configurações atuais (incluindo credenciais dinâmicas)
    let config: AppConfig;
    try {
      const configData = await readFile(CONFIG_FILE, 'utf-8');
      config = JSON.parse(configData);
    } catch {
      // Fallback para env vars se arquivo não existir
      config = {
        webhookUrl: '',
        adminEmail: process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@sabores.com',
        adminPassword: process.env.ADMIN_PASSWORD || 'admin123',
        siteLogo: '/icon-192x192.png',
        appIcon: '/icon-512x512.png',
        companyName: 'Sabores de Zissou',
        whatsapp: '5511981047422',
        pix: '11981047422'
      };
    }

    // Verificar credenciais usando configurações dinâmicas
    const adminEmail = config.adminEmail;
    const adminPassword = config.adminPassword;

    if (email === adminEmail && password === adminPassword) {
      return NextResponse.json(
        { success: true, message: 'Login realizado com sucesso' },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Erro na autenticação:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}