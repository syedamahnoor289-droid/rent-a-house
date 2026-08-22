import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PropertyType } from "../lib/generated/prisma/enums";
import bcrypt from "bcryptjs";

const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

const img = (photoId: string) =>
  `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=1200&q=80`;

async function main() {
  await prisma.inquiry.deleteMany();
  await prisma.listing.deleteMany();

  const defaultUser = await prisma.user.upsert({
    where: { email: "host@rentahouse.com" },
    update: {},
    create: {
      email: "host@rentahouse.com",
      name: "Default Host",
      password: await bcrypt.hash("password123", 10),
    },
  });

  const listings = [
    {
      title: "Modern 2-Bed Flat in DHA Phase 6",
      description:
        "Bright two-bedroom flat in the heart of DHA Karachi, close to marinas, malls, and cafes. Great for young families and professionals.",
      price: 85000,
      city: "Karachi",
      address: "Street 19, DHA Phase 6, Block A",
      propertyType: PropertyType.FLAT,
      bedrooms: 2,
      bathrooms: 2,
      amenities: ["wifi", "kitchen", "elevator", "parking"],
      images: [
        img("1522708323590-d24dbb6b0267"),
        img("1505693416388-ac5ce068fe85"),
        img("1556911220-bff31c812dba"),
      ],
      contactName: "Ahmed Raza",
      contactPhone: "+92 300 1234567",
      available: true,
    },
    {
      title: "Spacious Family House in Gulberg",
      description:
        "Four-bedroom family house in Gulberg III with a large garden and secure neighbourhood, minutes from MM Alam Road.",
      price: 150000,
      city: "Lahore",
      address: "11-B, Gulberg III, Main Boulevard",
      propertyType: PropertyType.HOUSE,
      bedrooms: 4,
      bathrooms: 3,
      amenities: ["wifi", "garage", "backyard", "air-conditioning", "pet-friendly"],
      images: [
        img("1568605114967-8130f3a36994"),
        img("1493809842364-78817add7ffb"),
        img("1556911220-bff31c812dba"),
      ],
      contactName: "Fatima Khan",
      contactPhone: "+92 321 9876543",
      available: true,
    },
    {
      title: "Elegant 2-Bed Flat in F-7",
      description:
        "Newly renovated flat in the upscale F-7 sector of Islamabad, walking distance to markets and embassies.",
      price: 90000,
      city: "Islamabad",
      address: "F-7/3, Margalla Road",
      propertyType: PropertyType.FLAT,
      bedrooms: 2,
      bathrooms: 2,
      amenities: ["wifi", "gym", "elevator", "dishwasher"],
      images: [
        img("1502672260266-1c1ef2d93688"),
        img("1560448204-e02f11c3d0e2"),
      ],
      contactName: "Omar Sheikh",
      contactPhone: "+92 333 4567890",
      available: true,
    },
    {
      title: "Luxury 4-Bed House in Bahria Town",
      description:
        "Premium four-bedroom house in Bahria Town Phase 4 with a private garden, servant quarters, and dedicated parking.",
      price: 120000,
      city: "Rawalpindi",
      address: "House 42, Street 8, Bahria Town Phase 4",
      propertyType: PropertyType.HOUSE,
      bedrooms: 4,
      bathrooms: 4,
      amenities: ["pool", "wifi", "air-conditioning", "garage", "garden"],
      images: [
        img("1600585154340-be6161a56a0c"),
        img("1570129477492-45c003edd2be"),
        img("1613977257363-707ba9348227"),
      ],
      contactName: "Hina Malik",
      contactPhone: "+92 345 6789012",
      available: true,
    },
    {
      title: "Cozy 1-Bed Flat in Peoples Colony",
      description:
        "Affordable one-bedroom flat in Peoples Colony No.1, Faisalabad, close to the clock tower and university.",
      price: 30000,
      city: "Faisalabad",
      address: "Flat 7, Peoples Colony No.1, Susan Road",
      propertyType: PropertyType.FLAT,
      bedrooms: 1,
      bathrooms: 1,
      amenities: ["wifi", "kitchen", "parking"],
      images: [
        img("1521747116042-5a810fda9664"),
        img("1552321554-5fefe8c9ef14"),
      ],
      contactName: "Bilal Ahmed",
      contactPhone: "+92 311 2223344",
      available: true,
    },
    {
      title: "Private Room in DHA Phase 5",
      description:
        "Furnished private room in a shared flat in DHA Phase 5, Lahore, ideal for students and young professionals.",
      price: 25000,
      city: "Lahore",
      address: "F-10, DHA Phase 5, Ghazi Road",
      propertyType: PropertyType.ROOM,
      bedrooms: 1,
      bathrooms: 1,
      amenities: ["wifi", "laundry", "shared-kitchen"],
      images: [
        img("1595526114035-0d45ed16cfbf"),
        img("1505693416388-ac5ce068fe85"),
      ],
      contactName: "Sana Yousaf",
      contactPhone: "+92 314 5556677",
      available: false,
    },
  ];

  for (const data of listings) {
    await prisma.listing.create({
      data: {
        ...data,
        amenities: JSON.stringify(data.amenities),
        images: JSON.stringify(data.images),
        hostId: defaultUser.id,
      },
    });
  }

  console.log(`Seeded ${listings.length} listings for ${defaultUser.name}.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());