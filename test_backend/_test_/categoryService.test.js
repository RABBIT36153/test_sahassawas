// categoryService.test.js
const { create } = require("../services/categoryService");
const { connectDB } = require("../utils/db");
const { createCategoryDoc } = require("../models/categoryModel");

// Mock dependencies
jest.mock("../utils/db");
jest.mock("../models/categoryModel");

describe("Category Service - create", () => {
    let mockClient;
    let mockInsertOne;

    beforeEach(() => {
        // Reset mocks before each test
        jest.clearAllMocks();

        mockInsertOne = jest.fn().mockResolvedValue({ insertedId: "1234567890abcdef" });
        mockClient = {
            db: jest.fn().mockReturnValue({
                collection: jest.fn().mockReturnValue({
                    insertOne: mockInsertOne
                })
            })
        };

        connectDB.mockResolvedValue(mockClient);
    });

    it("should create a category and return the created document", async () => {
        const mockData = { name: "Electronics", description: "All electronic items" };
        const mockDoc = { ...mockData, createdAt: new Date(), updatedAt: new Date() };

        createCategoryDoc.mockReturnValue(mockDoc);

        const result = await create(mockData);

        // Assertions
        expect(connectDB).toHaveBeenCalledTimes(1);
        expect(createCategoryDoc).toHaveBeenCalledWith(mockData);
        expect(mockInsertOne).toHaveBeenCalledWith(mockDoc);
        expect(result).toEqual(mockDoc);
        //expect(result).not.toBeNull();
    });

    it("should throw if insertOne fails", async () => {
        mockInsertOne.mockRejectedValue(new Error("Insert failed"));
        const mockData = { name: "Books", description: "All books" };

        createCategoryDoc.mockReturnValue(null);
        const result = await create(mockData);
        expect(result).not.toBeNull(); // จะ fail เพราะ result = null

        await expect(create(mockData)).rejects.toThrow("Insert failed");
    });
});
