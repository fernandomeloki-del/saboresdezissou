import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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

    // Verificar senha (temporariamente aceitar tanto hash quanto texto simples)
    const isValidPassword = 
      adminUser.password_hash === password || // Senha em texto simples (temporário)
      adminUser.password_hash === btoa(password); // Base64 básico

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