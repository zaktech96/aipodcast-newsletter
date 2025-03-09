CREATE TABLE "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_time" timestamp DEFAULT now(),
	"email" varchar NOT NULL,
	"first_name" text,
	"last_name" text,
	"gender" text,
	"profile_image_url" text,
	"user_id" varchar NOT NULL,
	"subscription" text,
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_time" timestamp DEFAULT now(),
	"stripe_id" varchar NOT NULL,
	"email" varchar NOT NULL,
	"amount" varchar NOT NULL,
	"payment_time" varchar NOT NULL,
	"payment_date" varchar NOT NULL,
	"currency" varchar NOT NULL,
	"user_id" varchar NOT NULL,
	"customer_details" text NOT NULL,
	"payment_intent" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_time" timestamp DEFAULT now(),
	"subscription_id" varchar NOT NULL,
	"stripe_user_id" varchar NOT NULL,
	"status" varchar NOT NULL,
	"start_date" varchar NOT NULL,
	"end_date" varchar,
	"plan_id" varchar NOT NULL,
	"default_payment_method_id" varchar,
	"email" varchar NOT NULL,
	"user_id" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscriptions_plans" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_time" timestamp DEFAULT now(),
	"plan_id" varchar NOT NULL,
	"name" varchar NOT NULL,
	"description" text NOT NULL,
	"amount" varchar NOT NULL,
	"currency" varchar NOT NULL,
	"interval" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_time" timestamp DEFAULT now(),
	"invoice_id" varchar NOT NULL,
	"subscription_id" varchar NOT NULL,
	"amount_paid" varchar NOT NULL,
	"amount_due" varchar,
	"currency" varchar NOT NULL,
	"status" varchar NOT NULL,
	"email" varchar NOT NULL,
	"user_id" varchar
);
