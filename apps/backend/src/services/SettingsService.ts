import { PrismaClient, SystemSetting } from "@prisma/client";
import logger from "../utils/logger";

const prisma = new PrismaClient();

export class SettingsService {
  async getAllSettings(): Promise<SystemSetting[]> {
    try {
      return await prisma.systemSetting.findMany();
    } catch (error) {
      logger.error(`Error fetching settings: ${error}`);
      throw error;
    }
  }

  async getSettingsByCategory(category: string): Promise<SystemSetting[]> {
    try {
      return await prisma.systemSetting.findMany({
        where: { category },
      });
    } catch (error) {
      logger.error(
        `Error fetching settings for category ${category}: ${error}`,
      );
      throw error;
    }
  }

  async updateSetting(key: string, value: string): Promise<SystemSetting> {
    try {
      return await prisma.systemSetting.upsert({
        where: { key },
        update: { value },
        create: {
          key,
          value,
          category: "GENERAL", // Default category if creating new unknown setting
        },
      });
    } catch (error) {
      logger.error(`Error updating setting ${key}: ${error}`);
      throw error;
    }
  }

  async updateSettings(
    settings: { key: string; value: string; category?: string }[],
  ): Promise<void> {
    try {
      await prisma.$transaction(
        settings.map((setting) =>
          prisma.systemSetting.upsert({
            where: { key: setting.key },
            update: { value: setting.value },
            create: {
              key: setting.key,
              value: setting.value,
              category: setting.category || "GENERAL",
            },
          }),
        ),
      );
    } catch (error) {
      logger.error(`Error updating multiple settings: ${error}`);
      throw error;
    }
  }
}
