-- Replace the project lifecycle with the four public-facing states. Visibility
-- is separate so an old archived project can stay hidden without inventing a
-- fifth lifecycle state.
ALTER TABLE "Project"
  ADD COLUMN "featured" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "visible" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "highlights" JSONB NOT NULL DEFAULT '{"zh":[],"en":[]}'::jsonb;

UPDATE "Project"
SET "visible" = false
WHERE "status"::text = 'ARCHIVED';

CREATE TYPE "ProjectStatus_new" AS ENUM ('PLANNING', 'IN_PROGRESS', 'COMPLETED', 'PUBLISHED');

ALTER TABLE "Project" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Project"
  ALTER COLUMN "status" TYPE "ProjectStatus_new"
  USING (
    CASE "status"::text
      WHEN 'BUILDING' THEN 'IN_PROGRESS'
      WHEN 'ACTIVE' THEN 'IN_PROGRESS'
      WHEN 'SHIPPED' THEN 'COMPLETED'
      WHEN 'ARCHIVED' THEN 'COMPLETED'
      ELSE 'PLANNING'
    END
  )::"ProjectStatus_new";

DROP TYPE "ProjectStatus";
ALTER TYPE "ProjectStatus_new" RENAME TO "ProjectStatus";
ALTER TABLE "Project" ALTER COLUMN "status" SET DEFAULT 'PLANNING';

-- Preserve existing list-style highlights before converting Markdown content
-- into a bilingual JSON object.
UPDATE "Project" AS project
SET "highlights" = jsonb_build_object(
  'zh', COALESCE((
    SELECT jsonb_agg(regexp_replace(line, '^-[[:space:]]+', ''))
    FROM regexp_split_to_table(COALESCE(project."content", ''), E'\n') AS line
    WHERE line ~ '^-[[:space:]]+'
  ), '[]'::jsonb),
  'en', COALESCE((
    SELECT jsonb_agg(regexp_replace(line, '^-[[:space:]]+', ''))
    FROM regexp_split_to_table(COALESCE(project."content", ''), E'\n') AS line
    WHERE line ~ '^-[[:space:]]+'
  ), '[]'::jsonb)
);

ALTER TABLE "Project"
  ALTER COLUMN "title" TYPE JSONB USING jsonb_build_object('zh', "title", 'en', "title"),
  ALTER COLUMN "summary" TYPE JSONB USING jsonb_build_object('zh', "summary", 'en', "summary"),
  ALTER COLUMN "content" TYPE JSONB USING (
    CASE
      WHEN "content" IS NULL THEN NULL
      ELSE jsonb_build_object('zh', "content", 'en', "content")
    END
  );

ALTER TABLE "Project" RENAME COLUMN "stack" TO "tags";
ALTER TABLE "Project" RENAME COLUMN "repoUrl" TO "githubUrl";

DROP INDEX IF EXISTS "Project_status_sortOrder_idx";
CREATE INDEX "Project_visible_featured_sortOrder_idx" ON "Project"("visible", "featured", "sortOrder");
CREATE INDEX "Project_status_sortOrder_idx" ON "Project"("status", "sortOrder");
