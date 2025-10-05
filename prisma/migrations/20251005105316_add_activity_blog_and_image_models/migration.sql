-- CreateTable
CREATE TABLE "ActivityBlog" (
    "id" SERIAL NOT NULL,
    "activityId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ActivityBlog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityImage" (
    "id" SERIAL NOT NULL,
    "activityBlogId" INTEGER NOT NULL,
    "filename" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimetype" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ActivityBlog" ADD CONSTRAINT "ActivityBlog_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityImage" ADD CONSTRAINT "ActivityImage_activityBlogId_fkey" FOREIGN KEY ("activityBlogId") REFERENCES "ActivityBlog"("id") ON DELETE CASCADE ON UPDATE CASCADE;
