import { Request, Response } from "express";
import { SettingsService } from "../services/SettingsService";
import logger from "../utils/logger";

const settingsService = new SettingsService();

export class SettingsController {
  async getSettings(req: Request, res: Response): Promise<void> {
    try {
      const settings = await settingsService.getAllSettings();
      // Convert array to object for frontend convenience: { key: value }
      const settingsMap = settings.reduce(
        (acc, curr) => {
          acc[curr.key] = curr.value;
          return acc;
        },
        {} as Record<string, any>,
      );

      res.json({ success: true, data: settingsMap });
    } catch (error) {
      logger.error(`Controller error getting settings: ${error}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async updateSettings(req: Request, res: Response): Promise<void> {
    try {
      const settingsToUpdate = req.body; // Expecting { key: value, ... }

      // Transform object to array
      const settingsArray = Object.entries(settingsToUpdate).map(
        ([key, value]) => ({
          key,
          value: String(value),
          category: this.inferCategory(key),
        }),
      );

      await settingsService.updateSettings(settingsArray);
      res.json({ success: true, message: "Settings updated successfully" });
    } catch (error) {
      logger.error(`Controller error updating settings: ${error}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  private inferCategory(key: string): string {
    if (key.startsWith("company")) return "GENERAL";
    if (key.startsWith("smtp") || key.includes("Email")) return "EMAIL";
    if (
      key.startsWith("lab") ||
      key.includes("Turnaround") ||
      key.includes("Samples") ||
      key.includes("Doctor")
    )
      return "LAB";
    return "GENERAL";
  }
}
