import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // ---- Categories ----
  const categories = await Promise.all([
    prisma.category.create({ data: { name: "Phones & Accessories", slug: "phones-accessories" } }),
    prisma.category.create({ data: { name: "Headphones & Audio", slug: "headphones-audio" } }),
    prisma.category.create({ data: { name: "Laptops & Accessories", slug: "laptops-accessories" } }),
    prisma.category.create({ data: { name: "Chargers & Cables", slug: "chargers-cables" } }),
  ]);

  const [phones, audio, laptops, chargers] = categories;

  // ---- Products ---- (price in cents)
  const products = [
    // Phones & Accessories
    { name: "Slimline Phone Case - Clear", slug: "slimline-phone-case-clear", description: "Ultra-thin protective case with raised edges for screen protection.", price: 1499, stock: 40, imageUrl: "/images/products/phone-case-clear.jpg", categoryId: phones.id },
    { name: "Tempered Glass Screen Protector", slug: "tempered-glass-screen-protector", description: "9H hardness tempered glass with anti-fingerprint coating.", price: 999, stock: 60, imageUrl: "/images/products/screen-protector.jpg", categoryId: phones.id },
    { name: "MagSafe-Compatible Wallet", slug: "magsafe-wallet", description: "Magnetic card holder wallet, compatible with MagSafe phones.", price: 2999, stock: 25, imageUrl: "/images/products/magsafe-wallet.jpg", categoryId: phones.id },
    { name: "Phone Ring Holder Stand", slug: "phone-ring-holder-stand", description: "360-degree rotating ring holder with built-in kickstand.", price: 799, stock: 0, imageUrl: "/images/products/ring-holder.jpg", categoryId: phones.id },
    { name: "Rugged Armor Case - Black", slug: "rugged-armor-case-black", description: "Military-grade drop protection with reinforced corners.", price: 2499, stock: 35, imageUrl: "/images/products/rugged-case.jpg", categoryId: phones.id },

    // Headphones & Audio
    { name: "Wireless Over-Ear Headphones", slug: "wireless-over-ear-headphones", description: "Active noise cancellation with 30-hour battery life.", price: 12999, stock: 20, imageUrl: "/images/products/over-ear-headphones.jpg", categoryId: audio.id },
    { name: "True Wireless Earbuds", slug: "true-wireless-earbuds", description: "Compact earbuds with charging case, 24-hour total playtime.", price: 8999, stock: 30, imageUrl: "/images/products/earbuds.jpg", categoryId: audio.id },
    { name: "Portable Bluetooth Speaker", slug: "portable-bluetooth-speaker", description: "Waterproof speaker with 360-degree sound and 12-hour battery.", price: 5999, stock: 15, imageUrl: "/images/products/bluetooth-speaker.jpg", categoryId: audio.id },
    { name: "Wired Gaming Headset", slug: "wired-gaming-headset", description: "Surround sound headset with detachable noise-cancelling mic.", price: 7499, stock: 0, imageUrl: "/images/products/gaming-headset.jpg", categoryId: audio.id },
    { name: "On-Ear Foldable Headphones", slug: "on-ear-foldable-headphones", description: "Lightweight foldable design, ideal for travel.", price: 4499, stock: 22, imageUrl: "/images/products/on-ear-headphones.jpg", categoryId: audio.id },

    // Laptops & Accessories
    { name: "Laptop Sleeve 13-inch", slug: "laptop-sleeve-13-inch", description: "Padded neoprene sleeve with water-resistant exterior.", price: 1999, stock: 45, imageUrl: "/images/products/laptop-sleeve.jpg", categoryId: laptops.id },
    { name: "USB-C Docking Station", slug: "usb-c-docking-station", description: "11-in-1 hub with HDMI, USB-A, SD card, and Ethernet ports.", price: 4999, stock: 18, imageUrl: "/images/products/docking-station.jpg", categoryId: laptops.id },
    { name: "Wireless Ergonomic Mouse", slug: "wireless-ergonomic-mouse", description: "Vertical design mouse to reduce wrist strain.", price: 2999, stock: 33, imageUrl: "/images/products/ergonomic-mouse.jpg", categoryId: laptops.id },
    { name: "Laptop Stand - Adjustable", slug: "laptop-stand-adjustable", description: "Aluminum stand with adjustable height and angle.", price: 3499, stock: 0, imageUrl: "/images/products/laptop-stand.jpg", categoryId: laptops.id },
    { name: "Mechanical Keyboard - Compact", slug: "mechanical-keyboard-compact", description: "75% layout mechanical keyboard with hot-swappable switches.", price: 8999, stock: 12, imageUrl: "/images/products/mechanical-keyboard.jpg", categoryId: laptops.id },

    // Chargers & Cables
    { name: "65W USB-C Fast Charger", slug: "65w-usb-c-fast-charger", description: "GaN technology charger, compact and travel-friendly.", price: 2499, stock: 50, imageUrl: "/images/products/usb-c-charger.jpg", categoryId: chargers.id },
    { name: "Braided USB-C Cable 2m", slug: "braided-usb-c-cable-2m", description: "Durable braided cable rated for 10,000+ bend cycles.", price: 1299, stock: 70, imageUrl: "/images/products/usb-c-cable.jpg", categoryId: chargers.id },
    { name: "Wireless Charging Pad", slug: "wireless-charging-pad", description: "15W fast wireless charging pad, Qi-compatible.", price: 2999, stock: 28, imageUrl: "/images/products/charging-pad.jpg", categoryId: chargers.id },
    { name: "Car Charger Dual Port", slug: "car-charger-dual-port", description: "Dual USB-C car charger with 40W total output.", price: 1799, stock: 0, imageUrl: "/images/products/car-charger.jpg", categoryId: chargers.id },
    { name: "Power Bank 10000mAh", slug: "power-bank-10000mah", description: "Slim power bank with USB-C and USB-A output ports.", price: 3999, stock: 24, imageUrl: "/images/products/power-bank.jpg", categoryId: chargers.id },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  // ---- Users ----
  const adminPassword = await bcrypt.hash("Admin123!", 10);
  const customerPassword = await bcrypt.hash("Customer123!", 10);

  await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@electrostore.test",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  await prisma.user.create({
    data: {
      name: "Test Customer",
      email: "customer@electrostore.test",
      password: customerPassword,
      role: "CUSTOMER",
    },
  });

  console.log("Seed complete: 4 categories, 20 products, 2 users created.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });