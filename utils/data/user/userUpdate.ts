'server only';
import { userUpdateProps } from '@/utils/types';
import { createServerActionClient } from '@/lib/supabase';

export const userUpdate = async ({
  email,
  first_name,
  last_name,
  profile_image_url,
  user_id,
}: userUpdateProps) => {
  try {
    const supabase = await createServerActionClient();
    const { data, error } = await supabase
      .from('user')
      .update([
        {
          email,
          first_name,
          last_name,
          profile_image_url,
          user_id,
        },
      ])
      .eq('email', email)
      .select();

    if (data) return data;
    if (error) return error;
  } catch (error: any) {
    console.error('Failed to update user:', error);
    return { error: error.message };
  }
};
