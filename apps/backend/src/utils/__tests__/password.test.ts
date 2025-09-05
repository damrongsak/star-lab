import bcrypt from "bcryptjs";
import { hashPassword, comparePassword } from "../password";

describe("password utils", () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  describe("hashPassword", () => {
    it("hashes with 12 salt rounds and returns a bcrypt hash", async () => {
      const spy = jest.spyOn(bcrypt, "hash");

      const password = "Str0ngP@ssw0rd!";
      const hashed = await hashPassword(password);

      expect(typeof hashed).toBe("string");
      expect(hashed).not.toEqual(password);

      // bcrypt hash format: $2[aby]$12$...
      expect(hashed.startsWith("$2a$12$") || hashed.startsWith("$2b$12$") || hashed.startsWith("$2y$12$")).toBe(
        true,
      );

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(password, 12);
    });

    it("produces different hashes for the same input (salted)", async () => {
      const password = "repeatable";
      const h1 = await hashPassword(password);
      const h2 = await hashPassword(password);

      expect(h1).not.toEqual(h2);
      await expect(comparePassword(password, h1)).resolves.toBe(true);
      await expect(comparePassword(password, h2)).resolves.toBe(true);
    });

    it("handles empty and unicode passwords", async () => {
      const empty = await hashPassword("");
      const unicode = await hashPassword("päss🚀✅");

      expect(empty).toMatch(/^\$2[aby]\$12\$/);
      expect(unicode).toMatch(/^\$2[aby]\$12\$/);

      await expect(comparePassword("", empty)).resolves.toBe(true);
      await expect(comparePassword("päss🚀✅", unicode)).resolves.toBe(true);
    });

    it("propagates hashing errors from bcrypt", async () => {
      const err = new Error("hash failed");
      const spy = jest.spyOn(bcrypt as any, "hash") as unknown as jest.SpyInstance<
        Promise<string>,
        [string, number]
      >;
      spy.mockRejectedValueOnce(err);
      await expect(hashPassword("oops")).rejects.toThrow("hash failed");
    });
  });

  describe("comparePassword", () => {
    it("returns true for correct password and false for wrong password", async () => {
      const password = "correct-horse-battery-staple";
      const hashed = await hashPassword(password);

      await expect(comparePassword(password, hashed)).resolves.toBe(true);
      await expect(comparePassword("wrong-password", hashed)).resolves.toBe(
        false,
      );
    });

    it("returns false when provided an invalid hash string", async () => {
      await expect(comparePassword("any", "not-a-bcrypt-hash")).resolves.toBe(
        false,
      );
    });

    it("propagates compare errors from bcrypt", async () => {
      const err = new Error("compare failed");
      const spy = jest.spyOn(bcrypt as any, "compare") as unknown as jest.SpyInstance<
        Promise<boolean>,
        [string, string]
      >;
      spy.mockRejectedValueOnce(err);
      await expect(
        comparePassword("a", "$2a$12$invalid.invalid.invalid.invalid.invalidinvalid"),
      ).rejects.toThrow("compare failed");
    });
  });
});
