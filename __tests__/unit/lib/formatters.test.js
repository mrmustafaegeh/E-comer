import { describe, it, expect } from "vitest";
import { formatMoney, formatDate, formatPercentage, formatDateTime } from "@/lib/formatters";

describe("Formatters Utility", () => {
  describe("formatMoney", () => {
    it("should format numbers as USD currency", () => {
      expect(formatMoney(10)).toBe("$10.00");
      expect(formatMoney(10.5)).toBe("$10.50");
      expect(formatMoney(1000)).toBe("$1,000.00");
    });

    it("should handle zero", () => {
      expect(formatMoney(0)).toBe("$0.00");
    });

    it("should handle null/undefined", () => {
      expect(formatMoney(null)).toBe("$0.00");
      expect(formatMoney(undefined)).toBe("$0.00");
    });
  });

  describe("formatDate", () => {
    it("should format valid date strings", () => {
      const date = "2023-01-01T12:00:00Z";
      // Exact output depends on locale/timezone in test env, 
      // but usually defaults to US format in Node unless specific.
      // We check if it contains the month and year at least.
      const formatted = formatDate(date);
      expect(formatted).toContain("Jan");
      expect(formatted).toContain("2023");
    });

    it("should handle empty values", () => {
      expect(formatDate(null)).toBe("");
      expect(formatDate("")).toBe("");
    });
  });

  describe("formatPercentage", () => {
    it("should format decimals as percentage", () => {
      expect(formatPercentage(0.1)).toBe("10%");
      expect(formatPercentage(0.156)).toBe("16%"); // Rounds
      expect(formatPercentage(1)).toBe("100%");
    });
    
    it("should handle zero/null", () => {
      expect(formatPercentage(0)).toBe("0%");
      expect(formatPercentage(null)).toBe("0%");
    });
  });
});
