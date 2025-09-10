import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import * as bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Buscar usuário admin no Supabase
    const { data: adminUser, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !adminUser) {
      return NextResponse.json(
        { success: false, error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    // Verificar senha (para compatibilidade, aceitar tanto hash quanto texto simples)
    const isValidPassword = 
      adminUser.password_hash === password || // Temporário: senha em texto simples
      (adminUser.password_hash.startsWith('$2a$') && await bcrypt.compare(password, adminUser.password_hash)); // Hash bcrypt

    if (isValidPassword) {
      return NextResponse.json(
        { 
          success: true, 
          message: 'Login realizado com sucesso',
          user: {
            id: adminUser.id,
            email: adminUser.email,
            name: adminUser.name
          }
        },
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