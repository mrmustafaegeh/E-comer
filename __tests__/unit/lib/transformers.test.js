import { describe, it, expect } from "vitest";
import { transformProduct, transformProducts, transformOrder } from "@/lib/transformers";

describe("Transformers Utility", () => {
  describe("transformProduct", () => {
    it("should transform a valid DB product", () => {
      const dbProduct = {
        _id: "123",
        title: "Test Product",
        price: 100,
        salePrice: 80,
        category: "Electronics",
        createdAt: "2023-01-01T00:00:00Z"
      };

      const result = transformProduct(dbProduct);

      expect(result.id).toBe("123");
      expect(result.name).toBe("Test Product");
      expect(result.formattedPrice).toBe("$100.00");
      expect(result.formattedSalePrice).toBe("$80.00");
      expect(result.isOnSale).toBe(true);
      expect(result.discount).toBe("-20%"); // Calculated
    });

    it("should handle missing fields gracefully", () => {
      const dbProduct = {
        _id: "456",
        // missing title
        price: "invalid" 
      };

      const result = transformProduct(dbProduct);
      
      expect(result.id).toBe("456");
      expect(result.name).toBe("Untitled Product");
      expect(result.price).toBe(0);
    });

    it("should return null for null input", () => {
      expect(transformProduct(null)).toBe(null);
    });
  });

  describe("transformProducts", () => {
    it("should transform array of products", () => {
      const list = [{ _id: "1", title: "A" }, { _id: "2", title: "B" }];
      const result = transformProducts(list);
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe("1");
    });
    
    it("should return empty array for invalid input", () => {
      expect(transformProducts(null)).toEqual([]);
    });
  });

  describe("transformOrder", () => {
    it("should transform order with items", () => {
      const dbOrder = {
        _id: "order1",
        totalAmount: 50,
        createdAt: "2023-01-01T00:00:00Z",
        items: [
          { name: "Item 1", price: 20 },
          { name: "Item 2", price: 30 }
        ]
      };

      const result = transformOrder(dbOrder);
      
      expect(result.id).toBe("order1");
      expect(result.formattedTotal).toBe("$50.00");
      expect(result.items[0].formattedPrice).toBe("$20.00");
    });
  });
});
