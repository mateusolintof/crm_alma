-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tenant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "domain" TEXT NOT NULL DEFAULT 'alma.agency',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "logoDarkHorizontalUrl" TEXT,
    "logoDarkVerticalUrl" TEXT,
    "logoLightHorizontalUrl" TEXT,
    "logoLightVerticalUrl" TEXT,
    "primaryColor" TEXT NOT NULL DEFAULT '#000000',
    "backgroundDark" TEXT NOT NULL DEFAULT '#000000',
    "backgroundLight" TEXT NOT NULL DEFAULT '#FFFFFF',
    "accentColor" TEXT NOT NULL DEFAULT '#FFFFFF',
    "textOnDark" TEXT NOT NULL DEFAULT '#FFFFFF',
    "textOnLight" TEXT NOT NULL DEFAULT '#111111'
);
INSERT INTO "new_Tenant" ("accentColor", "backgroundDark", "backgroundLight", "createdAt", "id", "logoDarkHorizontalUrl", "logoDarkVerticalUrl", "logoLightHorizontalUrl", "logoLightVerticalUrl", "name", "primaryColor", "textOnDark", "textOnLight", "updatedAt") SELECT "accentColor", "backgroundDark", "backgroundLight", "createdAt", "id", "logoDarkHorizontalUrl", "logoDarkVerticalUrl", "logoLightHorizontalUrl", "logoLightVerticalUrl", "name", "primaryColor", "textOnDark", "textOnLight", "updatedAt" FROM "Tenant";
DROP TABLE "Tenant";
ALTER TABLE "new_Tenant" RENAME TO "Tenant";
CREATE UNIQUE INDEX "Tenant_domain_key" ON "Tenant"("domain");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
