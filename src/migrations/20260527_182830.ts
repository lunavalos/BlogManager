import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Drop pages block tables if they still exist (push:true may have already removed them)
  const tablesToDrop = [
    'pages_blocks_hero_locales',
    'pages_blocks_hero',
    'pages_blocks_content_locales',
    'pages_blocks_content',
    'pages_blocks_features_items_locales',
    'pages_blocks_features_items',
    'pages_blocks_features',
    'pages_blocks_cta_locales',
    'pages_blocks_cta',
    'pages_blocks_blog_preview_locales',
    'pages_blocks_blog_preview',
    'pages_locales',
  ]
  for (const table of tablesToDrop) {
    await db.execute(sql.raw(`DROP TABLE IF EXISTS "${table}" CASCADE;`))
  }

  // Drop the enum type if it still exists
  await db.execute(sql`DROP TYPE IF EXISTS "public"."enum_pages_blocks_content_image_position";`)

  // Add newsletter columns to posts (IF NOT EXISTS = safe to re-run)
  await db.execute(sql`ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "email_image_id" integer;`)
  await db.execute(sql`ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "newsletter_sent" boolean DEFAULT false;`)
  await db.execute(sql`ALTER TABLE "posts_locales" ADD COLUMN IF NOT EXISTS "subtitle" varchar;`)
  await db.execute(sql`ALTER TABLE "posts_locales" ADD COLUMN IF NOT EXISTS "relevant_info" jsonb;`)
  await db.execute(sql`ALTER TABLE "posts_locales" ADD COLUMN IF NOT EXISTS "cta_section" jsonb;`)
  await db.execute(sql`ALTER TABLE "_posts_v" ADD COLUMN IF NOT EXISTS "version_email_image_id" integer;`)
  await db.execute(sql`ALTER TABLE "_posts_v" ADD COLUMN IF NOT EXISTS "version_newsletter_sent" boolean DEFAULT false;`)
  await db.execute(sql`ALTER TABLE "_posts_v_locales" ADD COLUMN IF NOT EXISTS "version_subtitle" varchar;`)
  await db.execute(sql`ALTER TABLE "_posts_v_locales" ADD COLUMN IF NOT EXISTS "version_relevant_info" jsonb;`)
  await db.execute(sql`ALTER TABLE "_posts_v_locales" ADD COLUMN IF NOT EXISTS "version_cta_section" jsonb;`)
  await db.execute(sql`ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "title" varchar;`)
  await db.execute(sql`ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "content" jsonb;`)

  // Add foreign key constraints (ignore if already exist)
  await db.execute(sql`
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'posts_email_image_id_media_id_fk'
      ) THEN
        ALTER TABLE "posts" ADD CONSTRAINT "posts_email_image_id_media_id_fk"
          FOREIGN KEY ("email_image_id") REFERENCES "public"."media"("id")
          ON DELETE set null ON UPDATE no action;
      END IF;
    END $$;
  `)
  await db.execute(sql`
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = '_posts_v_version_email_image_id_media_id_fk'
      ) THEN
        ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_email_image_id_media_id_fk"
          FOREIGN KEY ("version_email_image_id") REFERENCES "public"."media"("id")
          ON DELETE set null ON UPDATE no action;
      END IF;
    END $$;
  `)

  // Create indexes (IF NOT EXISTS)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "posts_email_image_idx" ON "posts" USING btree ("email_image_id");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "_posts_v_version_version_email_image_idx" ON "_posts_v" USING btree ("version_email_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_content_image_position" AS ENUM('left', 'right');
  CREATE TABLE "pages_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"cta_link" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_hero_locales" (
  	"title" varchar NOT NULL,
  	"subtitle" varchar,
  	"text" varchar,
  	"cta_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_position" "enum_pages_blocks_content_image_position" DEFAULT 'left',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_content_locales" (
  	"title" varchar,
  	"content" jsonb NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_features_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_features_items_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"button_link" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cta_locales" (
  	"text" varchar NOT NULL,
  	"button_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_blog_preview" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"limit" numeric DEFAULT 3,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_blog_preview_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_locales" (
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "posts" DROP CONSTRAINT "posts_email_image_id_media_id_fk";
  
  ALTER TABLE "_posts_v" DROP CONSTRAINT "_posts_v_version_email_image_id_media_id_fk";
  
  DROP INDEX "posts_email_image_idx";
  DROP INDEX "_posts_v_version_version_email_image_idx";
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_locales" ADD CONSTRAINT "pages_blocks_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_content" ADD CONSTRAINT "pages_blocks_content_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_content" ADD CONSTRAINT "pages_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_content_locales" ADD CONSTRAINT "pages_blocks_content_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_features_items" ADD CONSTRAINT "pages_blocks_features_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_features_items_locales" ADD CONSTRAINT "pages_blocks_features_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_features_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_features" ADD CONSTRAINT "pages_blocks_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_locales" ADD CONSTRAINT "pages_blocks_cta_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_blog_preview" ADD CONSTRAINT "pages_blocks_blog_preview_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_blog_preview_locales" ADD CONSTRAINT "pages_blocks_blog_preview_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_blog_preview"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_hero_order_idx" ON "pages_blocks_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_parent_id_idx" ON "pages_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_path_idx" ON "pages_blocks_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_hero_image_idx" ON "pages_blocks_hero" USING btree ("image_id");
  CREATE UNIQUE INDEX "pages_blocks_hero_locales_locale_parent_id_unique" ON "pages_blocks_hero_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_content_order_idx" ON "pages_blocks_content" USING btree ("_order");
  CREATE INDEX "pages_blocks_content_parent_id_idx" ON "pages_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_content_path_idx" ON "pages_blocks_content" USING btree ("_path");
  CREATE INDEX "pages_blocks_content_image_idx" ON "pages_blocks_content" USING btree ("image_id");
  CREATE UNIQUE INDEX "pages_blocks_content_locales_locale_parent_id_unique" ON "pages_blocks_content_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_features_items_order_idx" ON "pages_blocks_features_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_features_items_parent_id_idx" ON "pages_blocks_features_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_features_items_locales_locale_parent_id_unique" ON "pages_blocks_features_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_features_order_idx" ON "pages_blocks_features" USING btree ("_order");
  CREATE INDEX "pages_blocks_features_parent_id_idx" ON "pages_blocks_features" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_features_path_idx" ON "pages_blocks_features" USING btree ("_path");
  CREATE INDEX "pages_blocks_cta_order_idx" ON "pages_blocks_cta" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_parent_id_idx" ON "pages_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_path_idx" ON "pages_blocks_cta" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_cta_locales_locale_parent_id_unique" ON "pages_blocks_cta_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_blog_preview_order_idx" ON "pages_blocks_blog_preview" USING btree ("_order");
  CREATE INDEX "pages_blocks_blog_preview_parent_id_idx" ON "pages_blocks_blog_preview" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_blog_preview_path_idx" ON "pages_blocks_blog_preview" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_blog_preview_locales_locale_parent_id_unique" ON "pages_blocks_blog_preview_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_locales_locale_parent_id_unique" ON "pages_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "posts" DROP COLUMN "email_image_id";
  ALTER TABLE "posts" DROP COLUMN "newsletter_sent";
  ALTER TABLE "posts_locales" DROP COLUMN "subtitle";
  ALTER TABLE "posts_locales" DROP COLUMN "relevant_info";
  ALTER TABLE "posts_locales" DROP COLUMN "cta_section";
  ALTER TABLE "_posts_v" DROP COLUMN "version_email_image_id";
  ALTER TABLE "_posts_v" DROP COLUMN "version_newsletter_sent";
  ALTER TABLE "_posts_v_locales" DROP COLUMN "version_subtitle";
  ALTER TABLE "_posts_v_locales" DROP COLUMN "version_relevant_info";
  ALTER TABLE "_posts_v_locales" DROP COLUMN "version_cta_section";
  ALTER TABLE "pages" DROP COLUMN "title";
  ALTER TABLE "pages" DROP COLUMN "content";`)
}
