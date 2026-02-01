import { describe, it, expect, vi, beforeEach } from "vitest";
import { getProducts, createProduct } from "@/services/productService";

// Define mocks that need to be hoisted
const { mockCollection, mockDb, mockClient } = vi.hoisted(() => {
  const collection = {
    find: vi.fn().mockReturnThis(),
    sort: vi.fn().mockReturnThis(),
    skip: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    toArray: vi.fn(),
    countDocuments: vi.fn(),
    findOne: vi.fn(),
    insertOne: vi.fn(),
  };

  const db = {
    collection: vi.fn().mockReturnValue(collection),
  };

  const client = {
    db: vi.fn().mockReturnValue(db),
  };

  return { mockCollection: collection, mockDb: db, mockClient: client };
});

// Mock @/lib/mongodb
vi.mock("@/lib/mongodb", () => ({
  default: Promise.resolve(mockClient),
}));

describe("ProductService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default chain returns
    mockCollection.toArray.mockResolvedValue([]);
    mockCollection.countDocuments.mockResolvedValue(0);
  });

  describe("getProducts", () => {
    it("should build correct filter for search", async () => {
      await getProducts({ search: "phone" });

      // Verify collection was queried
      expect(mockDb.collection).toHaveBeenCalledWith("products");
      
      // Check the first argument of the first call to find
      const findArgs = mockCollection.find.mock.calls[0][0];
      expect(findArgs).toEqual({
        $text: { $search: "phone" }
      });
    });

    it("should build correct filter for categories", async () => {
      await getProducts({ category: "Electronics" });
      
      const findArgs = mockCollection.find.mock.calls[0][0];
      expect(findArgs).toEqual({
        category: "electronics" // Lowercase enforced
      });
    });

    it("should build correct filter for price range", async () => {
      await getProducts({ minPrice: "10", maxPrice: "100" });
      
      const findArgs = mockCollection.find.mock.calls[0][0];
      // The complex $or logic we built
      expect(findArgs.$or).toBeDefined();
      expect(findArgs.$or[0].price.$gte).toBe(10);
      expect(findArgs.$or[0].price.$lte).toBe(100);
    });

    it("should transform returned products", async () => {
      const rawProducts = [
        { _id: "1", title: "P1", price: 100, createdAt: new Date().toISOString() }
      ];
      mockCollection.toArray.mockResolvedValue(rawProducts);
      mockCollection.countDocuments.mockResolvedValue(1);

      const result = await getProducts({});
      
      expect(result.products).toHaveLength(1);
      expect(result.products[0].formattedPrice).toBe("$100.00"); // Transformer applied
      expect(result.total).toBe(1);
    });
  });

  describe("createProduct", () => {
    it("should create a product with generated slug", async () => {
      const input = { name: "Test Product", price: 50, category: "Test" };
      mockCollection.insertOne.mockResolvedValue({ insertedId: "new_id" });
      mockCollection.findOne.mockResolvedValue(null); // No duplicate

      const result = await createProduct(input);

      expect(result.slug).toBe("test-product");
      expect(result.category).toBe("test");
      expect(mockCollection.insertOne).toHaveBeenCalled();
    });

    it("should throw error if slug exists", async () => {
       const input = { name: "Duplicate", price: 10, category: "Test" };
       mockCollection.findOne.mockResolvedValue({ _id: "existing" }); // Exists

       await expect(createProduct(input)).rejects.toThrow("slug already exists");
    });
  });
});
