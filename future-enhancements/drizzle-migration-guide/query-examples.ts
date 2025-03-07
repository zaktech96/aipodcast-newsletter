// /**
//  * PRISMA VS DRIZZLE QUERY EXAMPLES
//  * 
//  * This file demonstrates how to convert common Prisma queries to Drizzle
//  */

// // Import statements that would be needed in your actual code
// // import { db } from '@/lib/db';
// // import { users, subscriptions, payments, invoices, subscriptionPlans } from '@/drizzle/schema';
// // import { eq, and, or, like, desc, sql, gt, lt, isNull, isNotNull } from 'drizzle-orm';

// /**
//  * Basic CRUD Operations
//  */

// // 1. FIND A SINGLE RECORD
// {
//   // PRISMA
//   const findUser = async (userId: string) => {
//     const user = await prisma.user.findUnique({
//       where: { userId: userId }
//     });
//     return user;
//   };

//   // DRIZZLE
//   const findUser = async (userId: string) => {
//     const user = await db.query.users.findFirst({
//       where: eq(users.userId, userId)
//     });
//     return user;
//   };
// }

// // 2. FIND MANY RECORDS
// {
//   // PRISMA
//   const findUsers = async () => {
//     const allUsers = await prisma.user.findMany({
//       where: { 
//         subscription: 'premium'
//       }
//     });
//     return allUsers;
//   };

//   // DRIZZLE
//   const findUsers = async () => {
//     const allUsers = await db.select()
//       .from(users)
//       .where(eq(users.subscription, 'premium'));
//     return allUsers;
//   };
// }

// // 3. CREATE A RECORD
// {
//   // PRISMA
//   const createUser = async (data: any) => {
//     const newUser = await prisma.user.create({
//       data: {
//         email: data.email,
//         userId: data.userId,
//         firstName: data.firstName,
//         lastName: data.lastName
//       }
//     });
//     return newUser;
//   };

//   // DRIZZLE
//   const createUser = async (data: any) => {
//     const newUser = await db.insert(users)
//       .values({
//         email: data.email,
//         userId: data.userId,
//         firstName: data.firstName,
//         lastName: data.lastName
//       })
//       .returning();
//     return newUser[0]; // Drizzle returns an array, so we get the first item
//   };
// }

// // 4. UPDATE A RECORD
// {
//   // PRISMA
//   const updateUser = async (userId: string, data: any) => {
//     const updatedUser = await prisma.user.update({
//       where: { userId: userId },
//       data: { firstName: data.firstName }
//     });
//     return updatedUser;
//   };

//   // DRIZZLE
//   const updateUser = async (userId: string, data: any) => {
//     const updatedUser = await db.update(users)
//       .set({ firstName: data.firstName })
//       .where(eq(users.userId, userId))
//       .returning();
//     return updatedUser[0]; // Drizzle returns an array
//   };
// }

// // 5. DELETE A RECORD
// {
//   // PRISMA
//   const deleteUser = async (userId: string) => {
//     await prisma.user.delete({
//       where: { userId: userId }
//     });
//   };

//   // DRIZZLE
//   const deleteUser = async (userId: string) => {
//     await db.delete(users)
//       .where(eq(users.userId, userId));
//   };
// }

// /**
//  * Complex Queries
//  */

// // 6. RELATIONS AND INCLUDES
// {
//   // PRISMA
//   const getUserWithSubscriptions = async (userId: string) => {
//     const user = await prisma.user.findUnique({
//       where: { userId: userId },
//       include: { subscriptions: true }
//     });
//     return user;
//   };

//   // DRIZZLE
//   const getUserWithSubscriptions = async (userId: string) => {
//     // Using the relational queries API (requires prepare statements)
//     const user = await db.query.users.findFirst({
//       where: eq(users.userId, userId),
//       with: {
//         subscriptions: true
//       }
//     });
//     return user;
//   };
// }

// // 7. FILTERING WITH MULTIPLE CONDITIONS
// {
//   // PRISMA
//   const findActiveSubscriptions = async () => {
//     const subs = await prisma.subscriptions.findMany({
//       where: {
//         AND: [
//           { status: 'active' },
//           { endDate: { gte: new Date().toISOString() } }
//         ]
//       }
//     });
//     return subs;
//   };

//   // DRIZZLE
//   const findActiveSubscriptions = async () => {
//     const today = new Date().toISOString();
//     const subs = await db.select()
//       .from(subscriptions)
//       .where(
//         and(
//           eq(subscriptions.status, 'active'),
//           gt(subscriptions.endDate, today)
//         )
//       );
//     return subs;
//   };
// }

// // 8. SORTING AND PAGINATION
// {
//   // PRISMA
//   const getRecentPayments = async (page = 1, limit = 10) => {
//     const skip = (page - 1) * limit;
//     const payments = await prisma.payments.findMany({
//       orderBy: { createdTime: 'desc' },
//       skip: skip,
//       take: limit
//     });
//     return payments;
//   };

//   // DRIZZLE
//   const getRecentPayments = async (page = 1, limit = 10) => {
//     const offset = (page - 1) * limit;
//     const paymentsResult = await db.select()
//       .from(payments)
//       .orderBy(desc(payments.createdTime))
//       .limit(limit)
//       .offset(offset);
//     return paymentsResult;
//   };
// }

// // 9. AGGREGATIONS
// {
//   // PRISMA
//   const getTotalPayments = async (userId: string) => {
//     const result = await prisma.payments.aggregate({
//       where: { userId: userId },
//       _sum: { amount: true },
//       _count: true
//     });
//     return {
//       totalAmount: result._sum.amount,
//       count: result._count
//     };
//   };

//   // DRIZZLE
//   const getTotalPayments = async (userId: string) => {
//     // Using SQL for aggregation
//     const result = await db.execute(
//       sql`SELECT 
//             COUNT(*) as count, 
//             SUM(CAST(${payments.amount} AS NUMERIC)) as total_amount
//           FROM ${payments}
//           WHERE ${payments.userId} = ${userId}`
//     );
//     return {
//       totalAmount: result[0]?.total_amount,
//       count: result[0]?.count
//     };
//   };
// }

// // 10. TRANSACTIONS
// {
//   // PRISMA
//   const createSubscriptionWithPayment = async (data: any) => {
//     const result = await prisma.$transaction(async (tx) => {
//       const sub = await tx.subscriptions.create({
//         data: {
//           subscriptionId: data.subscriptionId,
//           stripeUserId: data.stripeUserId,
//           status: 'active',
//           startDate: new Date().toISOString(),
//           planId: data.planId,
//           email: data.email,
//           userId: data.userId
//         }
//       });
      
//       const payment = await tx.payments.create({
//         data: {
//           stripeId: data.stripeId,
//           email: data.email,
//           amount: data.amount,
//           paymentTime: new Date().toISOString(),
//           paymentDate: new Date().toDateString(),
//           currency: 'USD',
//           userId: data.userId,
//           customerDetails: data.customerDetails,
//           paymentIntent: data.paymentIntent
//         }
//       });
      
//       return { subscription: sub, payment };
//     });
    
//     return result;
//   };

//   // DRIZZLE
//   const createSubscriptionWithPayment = async (data: any) => {
//     return await db.transaction(async (tx) => {
//       const now = new Date();
      
//       const sub = await tx.insert(subscriptions)
//         .values({
//           subscriptionId: data.subscriptionId,
//           stripeUserId: data.stripeUserId,
//           status: 'active',
//           startDate: now.toISOString(),
//           planId: data.planId,
//           email: data.email,
//           userId: data.userId
//         })
//         .returning();
      
//       const payment = await tx.insert(payments)
//         .values({
//           stripeId: data.stripeId,
//           email: data.email,
//           amount: data.amount,
//           paymentTime: now.toISOString(),
//           paymentDate: now.toDateString(),
//           currency: 'USD',
//           userId: data.userId,
//           customerDetails: data.customerDetails,
//           paymentIntent: data.paymentIntent
//         })
//         .returning();
      
//       return { 
//         subscription: sub[0],
//         payment: payment[0]
//       };
//     });
//   };
// }

// // 11. RAW QUERIES
// {
//   // PRISMA
//   const complexReport = async () => {
//     const results = await prisma.$queryRaw`
//       SELECT 
//         u.email, 
//         COUNT(s.id) as subscription_count,
//         MAX(s.created_time) as latest_subscription
//       FROM "user" u
//       LEFT JOIN subscriptions s ON u.user_id = s.user_id
//       GROUP BY u.email
//       HAVING COUNT(s.id) > 0
//       ORDER BY latest_subscription DESC
//       LIMIT 10
//     `;
//     return results;
//   };

//   // DRIZZLE
//   const complexReport = async () => {
//     const results = await db.execute(
//       sql`SELECT 
//             u.email, 
//             COUNT(s.id) as subscription_count,
//             MAX(s.created_time) as latest_subscription
//           FROM ${users} u
//           LEFT JOIN ${subscriptions} s ON u.user_id = s.user_id
//           GROUP BY u.email
//           HAVING COUNT(s.id) > 0
//           ORDER BY latest_subscription DESC
//           LIMIT 10`
//     );
//     return results;
//   };
// } 