import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { hash } from "bcryptjs";

async function main() {
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
  });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  // ==================== ADMIN USER ====================
  const adminEmail = "admin@lummy.com";
  const adminPassword = "admin123";

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await hash(adminPassword, 12);
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: "Admin Lummy",
        password: hashedPassword,
        role: "ADMIN",
      },
    });
    console.log(`Admin creado: ${adminEmail} / ${adminPassword}`);
  } else {
    console.log("Admin ya existe");
  }

  // ==================== DEMO CUSTOMERS ====================
  const demoCustomers = [
    { email: "maria@demo.com", name: "María González", phone: "+54 11 2345-6789", city: "Buenos Aires", province: "CABA" },
    { email: "lucas@demo.com", name: "Lucas Fernández", phone: "+54 11 3456-7890", city: "La Plata", province: "Buenos Aires" },
    { email: "camila@demo.com", name: "Camila López", phone: "+54 351 4567-8901", city: "Córdoba", province: "Córdoba" },
  ];

  for (const c of demoCustomers) {
    const exists = await prisma.user.findUnique({ where: { email: c.email } });
    if (!exists) {
      await prisma.user.create({
        data: { ...c, password: await hash("demo123", 12), role: "CUSTOMER" },
      });
    }
  }
  console.log("Customers demo creados");

  // ==================== CATEGORIES ====================
  const categoriesData = [
    { name: "Remeras", slug: "remeras", description: "Remeras y camisetas para todos los estilos", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800" },
    { name: "Buzos & Hoodies", slug: "buzos-hoodies", description: "Buzos, hoodies y sweaters para el frío", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800" },
    { name: "Pantalones", slug: "pantalones", description: "Jeans, joggers y pantalones de todo tipo", image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800" },
    { name: "Camperas", slug: "camperas", description: "Camperas y abrigos para cada temporada", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800" },
    { name: "Accesorios", slug: "accesorios", description: "Gorras, bolsos, cinturones y más", image: "https://images.unsplash.com/photo-1523779105320-d1cd346ff52b?w=800" },
    { name: "Vintage", slug: "vintage", description: "Prendas únicas de segunda mano seleccionadas", image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800" },
  ];

  const categories: Record<string, string> = {};
  for (const cat of categoriesData) {
    const existing = await prisma.category.findUnique({ where: { slug: cat.slug } });
    if (existing) {
      categories[cat.slug] = existing.id;
    } else {
      const created = await prisma.category.create({ data: cat });
      categories[cat.slug] = created.id;
    }
  }
  console.log("Categorías creadas");

  // ==================== PRODUCTS ====================
  const productsData = [
    // REMERAS
    {
      name: "Remera Oversize Essential",
      slug: "remera-oversize-essential",
      description: "Remera oversize de algodón premium 100%. Corte relajado y cómodo, perfecta para el día a día. Tela suave al tacto con acabado pre-lavado para mayor durabilidad.",
      price: 18500,
      categorySlug: "remeras",
      featured: true,
      images: [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
        "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800",
      ],
      variants: [
        { size: "S", color: "Negro", stock: 15, sku: "REM-OVR-S-NEG" },
        { size: "M", color: "Negro", stock: 20, sku: "REM-OVR-M-NEG" },
        { size: "L", color: "Negro", stock: 18, sku: "REM-OVR-L-NEG" },
        { size: "XL", color: "Negro", stock: 10, sku: "REM-OVR-XL-NEG" },
        { size: "S", color: "Blanco", stock: 12, sku: "REM-OVR-S-BLA" },
        { size: "M", color: "Blanco", stock: 25, sku: "REM-OVR-M-BLA" },
        { size: "L", color: "Blanco", stock: 14, sku: "REM-OVR-L-BLA" },
      ],
    },
    {
      name: "Remera Graphic Print \"Urban\"",
      slug: "remera-graphic-urban",
      description: "Remera con estampa exclusiva de diseño urbano. Algodón peinado 24/1, estampa en serigrafía de alta definición que no se desgasta con los lavados.",
      price: 22000,
      categorySlug: "remeras",
      featured: true,
      images: [
        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800",
        "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800",
      ],
      variants: [
        { size: "S", color: "Negro", stock: 8, sku: "REM-GRF-S-NEG" },
        { size: "M", color: "Negro", stock: 15, sku: "REM-GRF-M-NEG" },
        { size: "L", color: "Negro", stock: 12, sku: "REM-GRF-L-NEG" },
        { size: "XL", color: "Negro", stock: 5, sku: "REM-GRF-XL-NEG" },
      ],
    },
    {
      name: "Remera Básica Slim Fit",
      slug: "remera-basica-slim",
      description: "El básico que no puede faltar. Corte slim fit que se adapta al cuerpo sin apretar. Algodón con elastano para mayor comodidad y movimiento.",
      price: 14900,
      categorySlug: "remeras",
      featured: false,
      images: [
        "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800",
      ],
      variants: [
        { size: "S", color: "Negro", stock: 30, sku: "REM-BAS-S-NEG" },
        { size: "M", color: "Negro", stock: 35, sku: "REM-BAS-M-NEG" },
        { size: "L", color: "Negro", stock: 28, sku: "REM-BAS-L-NEG" },
        { size: "S", color: "Blanco", stock: 25, sku: "REM-BAS-S-BLA" },
        { size: "M", color: "Blanco", stock: 30, sku: "REM-BAS-M-BLA" },
        { size: "L", color: "Blanco", stock: 22, sku: "REM-BAS-L-BLA" },
        { size: "M", color: "Gris", stock: 20, sku: "REM-BAS-M-GRI" },
        { size: "L", color: "Gris", stock: 18, sku: "REM-BAS-L-GRI" },
      ],
    },
    // BUZOS & HOODIES
    {
      name: "Hoodie Oversize Premium",
      slug: "hoodie-oversize-premium",
      description: "Hoodie oversize de frisa premium. Interior afelpado ultra suave, capucha con cordón ajustable y bolsillo canguro. El hoodie más cómodo que vas a tener.",
      price: 38500,
      categorySlug: "buzos-hoodies",
      featured: true,
      images: [
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800",
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800",
      ],
      variants: [
        { size: "M", color: "Negro", stock: 12, sku: "HOO-OVR-M-NEG" },
        { size: "L", color: "Negro", stock: 15, sku: "HOO-OVR-L-NEG" },
        { size: "XL", color: "Negro", stock: 8, sku: "HOO-OVR-XL-NEG" },
        { size: "M", color: "Gris Melange", stock: 10, sku: "HOO-OVR-M-GRI" },
        { size: "L", color: "Gris Melange", stock: 14, sku: "HOO-OVR-L-GRI" },
      ],
    },
    {
      name: "Buzo Cuello Redondo Classic",
      slug: "buzo-cuello-redondo-classic",
      description: "Buzo clásico de cuello redondo. Frisa liviana ideal para entretiempo. Costuras reforzadas y puños con ribete elástico que mantiene su forma.",
      price: 29900,
      categorySlug: "buzos-hoodies",
      featured: false,
      images: [
        "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800",
      ],
      variants: [
        { size: "S", color: "Negro", stock: 10, sku: "BUZ-CLA-S-NEG" },
        { size: "M", color: "Negro", stock: 18, sku: "BUZ-CLA-M-NEG" },
        { size: "L", color: "Negro", stock: 14, sku: "BUZ-CLA-L-NEG" },
        { size: "M", color: "Beige", stock: 8, sku: "BUZ-CLA-M-BEI" },
        { size: "L", color: "Beige", stock: 6, sku: "BUZ-CLA-L-BEI" },
      ],
    },
    {
      name: "Hoodie Zip-Up Deportivo",
      slug: "hoodie-zip-up-deportivo",
      description: "Hoodie con cierre completo, ideal para entrenar o salir. Tela técnica que combina comodidad y estilo. Bolsillos laterales con cierre invisible.",
      price: 42000,
      categorySlug: "buzos-hoodies",
      featured: true,
      images: [
        "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=800",
      ],
      variants: [
        { size: "M", color: "Negro", stock: 7, sku: "HOO-ZIP-M-NEG" },
        { size: "L", color: "Negro", stock: 9, sku: "HOO-ZIP-L-NEG" },
        { size: "XL", color: "Negro", stock: 5, sku: "HOO-ZIP-XL-NEG" },
      ],
    },
    // PANTALONES
    {
      name: "Jean Relaxed Fit Negro",
      slug: "jean-relaxed-negro",
      description: "Jean relaxed fit de denim premium. Tiro alto, pierna recta con leve caída. Costuras en tono para un look minimal y limpio.",
      price: 35900,
      categorySlug: "pantalones",
      featured: true,
      images: [
        "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800",
        "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800",
      ],
      variants: [
        { size: "28", color: "Negro", stock: 8, sku: "JEA-RLX-28-NEG" },
        { size: "30", color: "Negro", stock: 12, sku: "JEA-RLX-30-NEG" },
        { size: "32", color: "Negro", stock: 15, sku: "JEA-RLX-32-NEG" },
        { size: "34", color: "Negro", stock: 10, sku: "JEA-RLX-34-NEG" },
        { size: "36", color: "Negro", stock: 6, sku: "JEA-RLX-36-NEG" },
      ],
    },
    {
      name: "Jogger Cargo Streetwear",
      slug: "jogger-cargo-streetwear",
      description: "Jogger cargo con bolsillos laterales funcionales. Cintura elástica con cordón, puños ajustados. El pantalón perfecto para un look urbano relajado.",
      price: 28500,
      categorySlug: "pantalones",
      featured: false,
      images: [
        "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800",
      ],
      variants: [
        { size: "S", color: "Negro", stock: 10, sku: "JOG-CRG-S-NEG" },
        { size: "M", color: "Negro", stock: 14, sku: "JOG-CRG-M-NEG" },
        { size: "L", color: "Negro", stock: 11, sku: "JOG-CRG-L-NEG" },
        { size: "M", color: "Verde Militar", stock: 8, sku: "JOG-CRG-M-VER" },
        { size: "L", color: "Verde Militar", stock: 6, sku: "JOG-CRG-L-VER" },
      ],
    },
    // CAMPERAS
    {
      name: "Campera Puffer Cropped",
      slug: "campera-puffer-cropped",
      description: "Campera puffer corta con relleno térmico. Cierre frontal y cuello alto que protege del viento. Diseño cropped que combina con todo.",
      price: 52000,
      categorySlug: "camperas",
      featured: true,
      images: [
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800",
      ],
      variants: [
        { size: "S", color: "Negro", stock: 5, sku: "CAM-PUF-S-NEG" },
        { size: "M", color: "Negro", stock: 8, sku: "CAM-PUF-M-NEG" },
        { size: "L", color: "Negro", stock: 6, sku: "CAM-PUF-L-NEG" },
      ],
    },
    {
      name: "Jacket Denim Vintage",
      slug: "jacket-denim-vintage",
      description: "Campera de jean con lavado vintage auténtico. Cada pieza tiene un desgaste único. Botones metálicos y bolsillos clásicos de pecho.",
      price: 45000,
      categorySlug: "camperas",
      featured: false,
      images: [
        "https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?w=800",
      ],
      variants: [
        { size: "M", color: "Azul Lavado", stock: 4, sku: "JAC-DEN-M-AZU" },
        { size: "L", color: "Azul Lavado", stock: 3, sku: "JAC-DEN-L-AZU" },
        { size: "XL", color: "Azul Lavado", stock: 2, sku: "JAC-DEN-XL-AZU" },
      ],
    },
    // ACCESORIOS
    {
      name: "Gorra Dad Hat Bordada",
      slug: "gorra-dad-hat-bordada",
      description: "Gorra dad hat con logo Lummy bordado en el frente. Cierre ajustable de metal en la parte trasera. Algodón lavado para un look casual.",
      price: 12500,
      categorySlug: "accesorios",
      featured: true,
      images: [
        "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800",
      ],
      variants: [
        { size: "Único", color: "Negro", stock: 25, sku: "GOR-DAD-U-NEG" },
        { size: "Único", color: "Beige", stock: 15, sku: "GOR-DAD-U-BEI" },
      ],
    },
    {
      name: "Bolso Tote Bag Canvas",
      slug: "bolso-tote-bag-canvas",
      description: "Tote bag de lona resistente con estampa exclusiva Lummy. Doble asa reforzada, bolsillo interior con cierre. Perfecto para el día a día.",
      price: 15900,
      categorySlug: "accesorios",
      featured: false,
      images: [
        "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800",
      ],
      variants: [
        { size: "Único", color: "Natural", stock: 20, sku: "BOL-TOT-U-NAT" },
        { size: "Único", color: "Negro", stock: 18, sku: "BOL-TOT-U-NEG" },
      ],
    },
    // VINTAGE
    {
      name: "Camisa Hawaiana Vintage 90s",
      slug: "camisa-hawaiana-vintage",
      description: "Pieza vintage original de los 90s. Camisa hawaiana con estampado floral en excelente estado. Cada pieza es única e irrepetible.",
      price: 19500,
      categorySlug: "vintage",
      featured: true,
      images: [
        "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800",
      ],
      variants: [
        { size: "M", color: "Multicolor", stock: 1, sku: "VIN-HAW-M-MUL" },
        { size: "L", color: "Multicolor", stock: 1, sku: "VIN-HAW-L-MUL" },
      ],
    },
    {
      name: "Buzo Deportivo Retro",
      slug: "buzo-deportivo-retro",
      description: "Buzo deportivo vintage con franjas laterales. Pieza seleccionada en excelente estado. El retro nunca pasa de moda.",
      price: 24000,
      categorySlug: "vintage",
      featured: false,
      images: [
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800",
      ],
      variants: [
        { size: "L", color: "Azul/Rojo", stock: 1, sku: "VIN-DEP-L-AZR" },
      ],
    },
    {
      name: "Remera Band Tee Vintage",
      slug: "remera-band-tee-vintage",
      description: "Remera de banda vintage con estampa desgastada original. Algodón suave con ese tacto único que solo el tiempo le da. Pieza de colección.",
      price: 21000,
      categorySlug: "vintage",
      featured: false,
      images: [
        "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800",
      ],
      variants: [
        { size: "M", color: "Negro Lavado", stock: 1, sku: "VIN-BND-M-NEG" },
        { size: "L", color: "Negro Lavado", stock: 1, sku: "VIN-BND-L-NEG" },
      ],
    },
  ];

  for (const p of productsData) {
    const exists = await prisma.product.findUnique({ where: { slug: p.slug } });
    if (exists) continue;

    await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        images: p.images,
        featured: p.featured,
        active: true,
        categoryId: categories[p.categorySlug],
        variants: {
          create: p.variants.map((v) => ({
            size: v.size,
            color: v.color,
            stock: v.stock,
            sku: v.sku,
          })),
        },
      },
    });
  }
  console.log(`${productsData.length} productos creados`);

  // ==================== DEMO ORDERS ====================
  const customer = await prisma.user.findUnique({ where: { email: "maria@demo.com" } });
  const someProducts = await prisma.product.findMany({
    take: 4,
    include: { variants: true },
  });

  if (customer && someProducts.length > 0) {
    const existingOrders = await prisma.order.count({ where: { userId: customer.id } });
    if (existingOrders === 0) {
      // Order 1: DELIVERED
      const order1 = await prisma.order.create({
        data: {
          userId: customer.id,
          status: "DELIVERED",
          subtotal: someProducts[0].price * 2,
          total: someProducts[0].price * 2,
          shippingCity: "Buenos Aires",
          shippingProvince: "CABA",
          shippingZipCode: "1425",
          items: {
            create: {
              variantId: someProducts[0].variants[0].id,
              quantity: 2,
              unitPrice: someProducts[0].price,
            },
          },
        },
      });
      await prisma.payment.create({
        data: {
          orderId: order1.id,
          mpPaymentId: "MP-DEMO-001",
          mpStatus: "approved",
          mpDetail: "accredited",
          amount: order1.total,
          method: "credit_card",
        },
      });

      // Order 2: PAID
      if (someProducts[1]) {
        const order2 = await prisma.order.create({
          data: {
            userId: customer.id,
            status: "PAID",
            subtotal: someProducts[1].price + (someProducts[2]?.price || 0),
            total: someProducts[1].price + (someProducts[2]?.price || 0),
            shippingCity: "Buenos Aires",
            shippingProvince: "CABA",
            items: {
              create: [
                {
                  variantId: someProducts[1].variants[0].id,
                  quantity: 1,
                  unitPrice: someProducts[1].price,
                },
                ...(someProducts[2]
                  ? [
                      {
                        variantId: someProducts[2].variants[0].id,
                        quantity: 1,
                        unitPrice: someProducts[2].price,
                      },
                    ]
                  : []),
              ],
            },
          },
        });
        await prisma.payment.create({
          data: {
            orderId: order2.id,
            mpPaymentId: "MP-DEMO-002",
            mpStatus: "approved",
            mpDetail: "accredited",
            amount: order2.total,
            method: "debit_card",
          },
        });
      }

      // Order 3: PENDING
      if (someProducts[3]) {
        await prisma.order.create({
          data: {
            userId: customer.id,
            status: "PENDING",
            subtotal: someProducts[3].price,
            total: someProducts[3].price,
            items: {
              create: {
                variantId: someProducts[3].variants[0].id,
                quantity: 1,
                unitPrice: someProducts[3].price,
              },
            },
          },
        });
      }
      console.log("Órdenes demo creadas");
    } else {
      console.log("Órdenes demo ya existen");
    }
  }

  await pool.end();
  console.log("Seed completado!");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
