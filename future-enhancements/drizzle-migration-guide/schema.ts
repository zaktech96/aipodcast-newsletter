// import { pgTable, serial, timestamp, varchar, text } from 'drizzle-orm/pg-core';
// import { relations } from 'drizzle-orm';

// /**
//  * User model
//  * Corresponds to the Prisma 'user' model
//  */
// export const users = pgTable('user', {
//   id: serial('id').primaryKey(),
//   createdTime: timestamp('created_time').defaultNow(),
//   email: varchar('email').notNull().unique(),
//   firstName: varchar('first_name'),
//   lastName: varchar('last_name'),
//   gender: varchar('gender'),
//   profileImageUrl: varchar('profile_image_url'),
//   userId: varchar('user_id').notNull().unique(),
//   subscription: varchar('subscription'),
// });

// /**
//  * Payments model
//  * Corresponds to the Prisma 'payments' model
//  */
// export const payments = pgTable('payments', {
//   id: serial('id').primaryKey(),
//   createdTime: timestamp('created_time').defaultNow(),
//   stripeId: varchar('stripe_id').notNull(),
//   email: varchar('email').notNull(),
//   amount: varchar('amount').notNull(),
//   paymentTime: varchar('payment_time').notNull(),
//   paymentDate: varchar('payment_date').notNull(),
//   currency: varchar('currency').notNull(),
//   userId: varchar('user_id').notNull(),
//   customerDetails: varchar('customer_details').notNull(),
//   paymentIntent: varchar('payment_intent').notNull(),
// });

// /**
//  * Subscriptions model
//  * Corresponds to the Prisma 'subscriptions' model
//  */
// export const subscriptions = pgTable('subscriptions', {
//   id: serial('id').primaryKey(),
//   createdTime: timestamp('created_time').defaultNow(),
//   subscriptionId: varchar('subscription_id').notNull(),
//   stripeUserId: varchar('stripe_user_id').notNull(),
//   status: varchar('status').notNull(),
//   startDate: varchar('start_date').notNull(),
//   endDate: varchar('end_date'),
//   planId: varchar('plan_id').notNull(),
//   defaultPaymentMethodId: varchar('default_payment_method_id'),
//   email: varchar('email').notNull(),
//   userId: varchar('user_id').notNull(),
// });

// /**
//  * Subscription plans model
//  * Corresponds to the Prisma 'subscriptions_plans' model
//  */
// export const subscriptionPlans = pgTable('subscriptions_plans', {
//   id: serial('id').primaryKey(),
//   createdTime: timestamp('created_time').defaultNow(),
//   planId: varchar('plan_id').notNull(),
//   name: varchar('name').notNull(),
//   description: varchar('description').notNull(),
//   amount: varchar('amount').notNull(),
//   currency: varchar('currency').notNull(),
//   interval: varchar('interval').notNull(),
// });

// /**
//  * Invoices model
//  * Corresponds to the Prisma 'invoices' model
//  */
// export const invoices = pgTable('invoices', {
//   id: serial('id').primaryKey(),
//   createdTime: timestamp('created_time').defaultNow(),
//   invoiceId: varchar('invoice_id').notNull(),
//   subscriptionId: varchar('subscription_id').notNull(),
//   amountPaid: varchar('amount_paid').notNull(),
//   amountDue: varchar('amount_due'),
//   currency: varchar('currency').notNull(),
//   status: varchar('status').notNull(),
//   email: varchar('email').notNull(),
//   userId: varchar('user_id'),
// });

// /**
//  * Relations setup
//  * This expands on Prisma by explicitly defining relationships between tables
//  */

// // Users to subscriptions: one-to-many
// export const usersRelations = relations(users, ({ many }) => ({
//   subscriptions: many(subscriptions),
// }));

// // Subscriptions to users: many-to-one
// export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
//   user: one(users, {
//     fields: [subscriptions.userId],
//     references: [users.userId],
//   }),
//   plan: one(subscriptionPlans, {
//     fields: [subscriptions.planId],
//     references: [subscriptionPlans.planId],
//   }),
// }));

// // Subscription plans to subscriptions: one-to-many
// export const subscriptionPlansRelations = relations(subscriptionPlans, ({ many }) => ({
//   subscriptions: many(subscriptions),
// }));

// // Payments to users: many-to-one
// export const paymentsRelations = relations(payments, ({ one }) => ({
//   user: one(users, {
//     fields: [payments.userId],
//     references: [users.userId],
//   }),
// }));

// // Invoices to subscriptions: many-to-one
// export const invoicesRelations = relations(invoices, ({ one }) => ({
//   subscription: one(subscriptions, {
//     fields: [invoices.subscriptionId],
//     references: [subscriptions.subscriptionId],
//   }),
//   user: one(users, {
//     fields: [invoices.userId],
//     references: [users.userId],
//   }),
// })); 