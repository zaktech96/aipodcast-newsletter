'use server';

import { auth } from '@clerk/nextjs/server';
import { createServerActionClient } from '@/lib/supabase';

export async function actionTemplate() {
  const { userId } = auth();

  if (!userId) {
    return 'You must be signed in';
  }

  try {
    const supabase = await createServerActionClient();
    let { data: user, error } = await supabase.from('user').select('*');

    if (user) return user;
    if (error) return error;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
