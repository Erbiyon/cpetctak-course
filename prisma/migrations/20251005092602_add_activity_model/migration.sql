/*
  Warnings:

  - You are about to drop the `ActivityCourse` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."ActivityCourse";

-- CreateTable
CREATE TABLE "Activity" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "publishDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);
