'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { PropertyInsert } from '@/types/property';

async function getAdminClient() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('No autenticado');

  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (!roleData || roleData.role !== 'admin') {
    throw new Error('No autorizado');
  }

  return supabase;
}

export async function createProperty(data: PropertyInsert) {
  const supabase = await getAdminClient();

  const { error } = await supabase.from('properties').insert([data]);

  if (error) throw new Error(error.message);

  revalidatePath('/admin/properties');
  revalidatePath('/properties');
}

export async function updateProperty(id: string, data: PropertyInsert) {
  const supabase = await getAdminClient();

  const { error } = await supabase
    .from('properties')
    .update(data)
    .eq('id', id);

  if (error) throw new Error(error.message);

  revalidatePath('/admin/properties');
  revalidatePath('/properties');
}
