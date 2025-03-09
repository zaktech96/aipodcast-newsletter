'use server';

import { auth } from '@clerk/nextjs/server';
import { createDirectClient } from '@/lib/drizzle';
import { users } from '@/db/schema/users';

export async function actionTemplate() {
  const { userId } = auth();

  if (!userId) {
    return 'You must be signed in';
  }

  try {
    const db = createDirectClient();
    const userRecords = await db.select().from(users);

    return userRecords;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
