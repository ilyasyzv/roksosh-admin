const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
  // Create a store
  const store = await database.store.create({
    data: {
      name: "Sample Store",
      userId: "user123",
    },
  });

  // Create a billboard associated with the store
  const billboard = await database.billboard.create({
    data: {
      storeId: store.id,
      label: "Winter Sale",
      imageUrl: "https://example.com/image.png",
    },
  });

  // Create a category associated with the store and billboard
  const category = await database.category.create({
    data: {
      name: "Clothing",
      storeId: store.id,
      billboardId: billboard.id,
    },
  });

  // Create size and color options
  const size = await database.size.create({
    data: {
      storeId: store.id,
      name: "Large",
      value: "L",
    },
  });

  const color = await database.color.create({
    data: {
      storeId: store.id,
      name: "Red",
      value: "#FF0000",
    },
  });

  // Create a product with images
  const product = await database.product.create({
    data: {
      storeId: store.id,
      categoryId: category.id,
      name: "Red Jacket",
      description: "A warm red jacket for winter",
      price: 79.99,
      sizeId: size.id,
      colorId: color.id,
      images: {
        create: [
          { url: "https://example.com/jacket1.png" },
          { url: "https://example.com/jacket2.png" },
        ],
      },
    },
  });

  // Create an order with an order item
  const order = await database.order.create({
    data: {
      storeId: store.id,
      isPaid: true,
      phone: "123-456-7890",
      address: "123 Example St, Sample City",
      orderItems: {
        create: [
          {
            productId: product.id,
          },
        ],
      },
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await database.$disconnect();
  });
