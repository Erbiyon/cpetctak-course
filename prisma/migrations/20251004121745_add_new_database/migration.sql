-- CreateTable
CREATE TABLE "Subject" (
    "id" SERIAL NOT NULL,
    "courseType" TEXT NOT NULL DEFAULT 'bachelor',
    "groupName" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "credits" INTEGER NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubjectDetail" (
    "id" SERIAL NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "theoryHours" INTEGER,
    "practicalHours" INTEGER,
    "selfStudyHours" INTEGER,
    "englishTitle" TEXT,
    "originalCode" TEXT,
    "originalTitle" TEXT,
    "description" TEXT,

    CONSTRAINT "SubjectDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubjectPrereq" (
    "id" SERIAL NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "prereqId" INTEGER NOT NULL,

    CONSTRAINT "SubjectPrereq_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subject_code_key" ON "Subject"("code");

-- CreateIndex
CREATE UNIQUE INDEX "SubjectDetail_subjectId_key" ON "SubjectDetail"("subjectId");

-- CreateIndex
CREATE UNIQUE INDEX "SubjectPrereq_subjectId_prereqId_key" ON "SubjectPrereq"("subjectId", "prereqId");

-- AddForeignKey
ALTER TABLE "SubjectDetail" ADD CONSTRAINT "SubjectDetail_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectPrereq" ADD CONSTRAINT "SubjectPrereq_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectPrereq" ADD CONSTRAINT "SubjectPrereq_prereqId_fkey" FOREIGN KEY ("prereqId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
