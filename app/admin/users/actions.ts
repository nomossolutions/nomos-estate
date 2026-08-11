'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function toggleUserRole(userId: string, currentRole: string) {
  const supabase = await createClient();

  // Verify admin status
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (!roleData || roleData.role !== 'admin') {
    throw new Error('Not authorized');
  }

  const newRole = currentRole === 'admin' ? 'user' : 'admin';

  const { error } = await supabase
    .from('user_roles')
    .update({ role: newRole })
    .eq('user_id', userId);

  if (error) {
    console.error('Error updating role:', error);
    throw new Error('Failed to update role');
  }

  revalidatePath('/admin/users');
}

export async function createUserRole(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (!roleData || roleData.role !== 'admin') {
    throw new Error('Not authorized');
  }

  const email = formData.get('email') as string;
  const role = formData.get('role') as 'admin' | 'user';

  if (!email || !role) {
    throw new Error('Email and role are required');
  }

  // Look up the user by email using the RPC
  const { data: allUsers } = await supabase.rpc('get_admin_users');
  const existingUser = allUsers?.find((u) => u.email === email);

  if (!existingUser) {
    throw new Error(
      'No se encontró un usuario con ese email. El usuario debe existir en Supabase Auth primero.',
    );
  }

  // Check if user_roles entry already exists
  const { data: existingRole } = await supabase
    .from('user_roles')
    .select('id')
    .eq('user_id', existingUser.id)
    .single();

  if (existingRole) {
    // Update existing role
    const { error } = await supabase
      .from('user_roles')
      .update({ role })
      .eq('user_id', existingUser.id);

    if (error) throw new Error('Error al actualizar el rol');
  } else {
    // Insert new role
    const { error } = await supabase.from('user_roles').insert({
      user_id: existingUser.id,
      role,
    });

    if (error) throw new Error('Error al asignar el rol');
  }

  revalidatePath('/admin/users');
}
