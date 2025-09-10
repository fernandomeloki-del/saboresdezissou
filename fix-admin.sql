-- SCRIPT PARA CORRIGIR ADMIN - EXECUTE NO SUPABASE SQL EDITOR

-- 1. Deletar o usuário admin existente se houver
DELETE FROM admin_users WHERE email = 'admin@sabores.com';

-- 2. Recriar o usuário admin com as credenciais corretas
INSERT INTO admin_users (email, password_hash, name) 
VALUES (
  'admin@sabores.com', 
  'admin123',
  'Administrador Principal'
);

-- 3. Verificar se foi criado
SELECT * FROM admin_users WHERE email = 'admin@sabores.com';

-- 4. Verificar as políticas RLS
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'admin_users';