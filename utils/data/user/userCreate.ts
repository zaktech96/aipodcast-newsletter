'server only';

import { userCreateProps } from '@/utils/types';
import { createServerActionClient } from '@/lib/supabase';

export const userCreate = async ({
  email,
  first_name,
  last_name,
  profile_image_url,
  user_id,
}: userCreateProps) => {
  try {
    const supabase = await createServerActionClient();
    const { data, error } = await supabase
      .from('user')
      .insert([
        {
          email,
          first_name,
          last_name,
          profile_image_url,
          user_id,
        },
      ])
      .select();

    console.log('data', data);
    console.log('error', error);

    if (error?.code) return error;
    return data;
  } catch (error: any) {
    console.error('Failed to create user:', error);
    return { error: error.message };
  }
};
