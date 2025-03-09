/**
 * Test script for Drizzle data operations
 */

import { createDirectClient } from '@/lib/drizzle';
import { users } from '@/db/schema/users';
import { eq } from 'drizzle-orm';
import * as dotenv from 'dotenv';

dotenv.config();

async function testDrizzleDataOperations() {
  console.log('🧪 Testing Drizzle Data Operations');
  console.log('---------------------------------');
  
  try {
    // Get direct database client
    const db = createDirectClient();
    
    // Insert test data
    console.log('\n📝 Inserting test user...');
    const email = `test-${Date.now()}@example.com`;
    
    const insertedUser = await db.insert(users).values({
      email,
      firstName: 'Test',
      lastName: 'User'
    }).returning();
    
    console.log('✅ User inserted successfully:');
    console.log(insertedUser[0]);
    
    // Query the user back
    console.log('\n🔍 Querying user by email...');
    const userQuery = await db.select().from(users).where(eq(users.email, email));
    
    console.log('✅ User query successful:');
    console.log(userQuery[0]);
    
    // Update the user
    console.log('\n📝 Updating user...');
    const updatedUser = await db
      .update(users)
      .set({ firstName: 'Updated' })
      .where(eq(users.email, email))
      .returning();
    
    console.log('✅ User updated successfully:');
    console.log(updatedUser[0]);
    
    // Delete the test user
    console.log('\n🗑️ Cleaning up test data...');
    const deletedUser = await db
      .delete(users)
      .where(eq(users.email, email))
      .returning();
    
    console.log('✅ Test user deleted successfully');
    
    console.log('\n🎉 Drizzle data operations test completed successfully');
  } catch (error) {
    console.error('\n❌ Test failed');
    console.error(error);
  }
}

testDrizzleDataOperations(); 