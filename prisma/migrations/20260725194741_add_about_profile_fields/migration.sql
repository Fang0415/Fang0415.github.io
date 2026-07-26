-- AlterTable
ALTER TABLE "SiteProfile" ADD COLUMN     "aboutIntro" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "background" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "focus" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "now" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "tools" TEXT[] DEFAULT ARRAY[]::TEXT[];
