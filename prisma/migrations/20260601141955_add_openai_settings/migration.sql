-- CreateTable
CREATE TABLE "OpenAISettings" (
    "id" TEXT NOT NULL,
    "adminApiKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "workspaceId" TEXT NOT NULL,

    CONSTRAINT "OpenAISettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OpenAISettings_workspaceId_key" ON "OpenAISettings"("workspaceId");

-- AddForeignKey
ALTER TABLE "OpenAISettings" ADD CONSTRAINT "OpenAISettings_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
