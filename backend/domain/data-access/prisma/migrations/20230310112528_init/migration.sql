/*
  Warnings:

  - You are about to drop the column `blogPostPostID` on the `BlogComment` table. All the data in the column will be lost.
  - Added the required column `postID` to the `BlogComment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BlogComment" DROP CONSTRAINT "BlogComment_blogPostPostID_fkey";

-- AlterTable
ALTER TABLE "BlogComment" DROP COLUMN "blogPostPostID",
ADD COLUMN     "postID" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "BlogComment" ADD CONSTRAINT "BlogComment_postID_fkey" FOREIGN KEY ("postID") REFERENCES "BlogPost"("postID") ON DELETE RESTRICT ON UPDATE CASCADE;
