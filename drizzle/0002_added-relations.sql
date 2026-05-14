ALTER TABLE "products" ALTER COLUMN "categoryId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "brandId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "brand";