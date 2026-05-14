CREATE TABLE "brands" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "brands_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"imageUrl" varchar(255),
	CONSTRAINT "brands_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "categories_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "products_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"categoryId" integer,
	"gender" varchar(255) NOT NULL,
	"brand" varchar(255) NOT NULL,
	"description" varchar(255),
	"priceInCents" integer DEFAULT 0 NOT NULL,
	"imageUrl" varchar(255),
	"stock" integer DEFAULT 0 NOT NULL,
	"isPublished" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3),
	CONSTRAINT "products_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "password" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "resetToken" varchar(255);--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "age";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_resetToken_unique" UNIQUE("resetToken");