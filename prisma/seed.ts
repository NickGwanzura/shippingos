// Seed script for the Spiritus Shipping & Logistics demo.
// Financial relationships are deterministic: quote → shipment → invoice →
// payments → balance/expenses/profit are all derived from confirmed figures.
// Run: npm run db:seed

import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import { daysAgo, daysFromNow } from "./seed-helpers";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Resetting shipping schema demo data...");
  await prisma.$transaction([
    prisma.notification.deleteMany(),
    prisma.activityLog.deleteMany(),
    prisma.document.deleteMany(),
    prisma.supportNote.deleteMany(),
    prisma.expense.deleteMany(),
    prisma.payment.deleteMany(),
    prisma.invoice.deleteMany(),
    prisma.portalUser.deleteMany(),
    prisma.shipment.deleteMany(),
    prisma.quote.deleteMany(),
    prisma.customer.deleteMany(),
    prisma.user.deleteMany(),
    prisma.companySettings.deleteMany(),
  ]);

  const PASSWORD = "#Shipping2026!";

  // ============================================================
  // STAFF (6)
  // ============================================================
  const staffDefs: Array<[string, string, UserRole, string, string]> = [
    ["Tapiwa Chirwa", "admin@horizonfreight.co.zw", UserRole.SUPER_ADMIN, "Chief Operating Officer", "+263 77 123 4001"],
    ["Nomsa Dube", "ops@horizonfreight.co.zw", UserRole.OPERATIONS, "Operations Manager", "+263 77 123 4002"],
    ["Farai Ncube", "accounts@horizonfreight.co.zw", UserRole.ACCOUNTS, "Accounts Manager", "+263 77 123 4003"],
    ["Ruvarashe Moyo", "sales@horizonfreight.co.zw", UserRole.SALES, "Sales Lead", "+263 77 123 4004"],
    ["Chiedza Chikuni", "support@horizonfreight.co.zw", UserRole.CUSTOMER_SUPPORT, "Customer Support", "+263 77 123 4005"],
    ["Blessing Nyathi", "readonly@horizonfreight.co.zw", UserRole.READ_ONLY, "Operations Analyst", "+263 77 123 4006"],
  ];
  const staff: any[] = [];
  for (const [name, email, role, title, phone] of staffDefs) {
    staff.push(
      await prisma.user.create({
        data: {
          name,
          email,
          role,
          title,
          phone,
          passwordHash: bcrypt.hashSync(PASSWORD, 10),
          active: true,
        },
      }),
    );
  }
  const [admin, ops, acct, sales, cs, analyst] = staff;

  // ============================================================
  // COMPANY SETTINGS
  // ============================================================
  await prisma.companySettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      companyName: "Horizon Freight & Logistics",
      tagline: "Moving Business Forward",
      currency: "USD",
      primaryColor: "#0B3B8C",
      supportPhone: "+44 20 7946 0958",
      supportEmail: "hello@horizonfreight.co.zw",
      whatsappNumber: "+27 82 555 0134",
      salesWhatsapp: "+27 82 555 0134",
      website: "https://horizonfreight.example",
      modules: "dashboard,customers,quotes,shipments,invoices,payments,expenses,documents,reports,portal",
      presentationMode: false,
    },
  });

  // ============================================================
  // CUSTOMERS (20)
  // ============================================================
  const customerDefs: Array<Array<string | null>> = [
    ["Tendai Moyo", null, "+263 77 456 1001", "+263 77 456 1001", "tendai.moyo@gmail.com", "Harare, Zimbabwe", "Zimbabwe"],
    ["Rudo & Simba Makoni", "Makoni Family Trust", "+263 78 456 1002", "+263 78 456 1002", "makonitr@gmail.com", "Borrowdale, Harare", "Zimbabwe"],
    ["Tatenda Banda", null, "+263 71 456 1003", null, "tatenda.banda@outlook.com", "Msasa, Harare", "Zimbabwe"],
    ["Farai Gumbo", null, "+27 82 456 1004", "+27 82 456 1004", "farai.gumbo@icloud.com", "Johannesburg, RSA", "South Africa"],
    ["Nyasha Chikore", "Chikore Construction", "+263 77 456 1005", "+263 77 456 1005", "nyasha@chikoreconstruct.co.zw", "Belvedere, Harare", "Zimbabwe"],
    ["Vimbai Tagwirei", "African Galleries Trust", "+263 78 456 1006", null, "vimbai@africangalleries.co.zw", "Chisipite, Harare", "Zimbabwe"],
    ["Munyaradzi Sithole", "Sithole & Sons (Pvt) Ltd", "+263 71 456 1007", "+263 71 456 1007", "munya@sitholesons.co.zw", "Mbare, Harare", "Zimbabwe"],
    ["Rumbidzai Chikowore", "Helping Hands Zimbabwe (NGO)", "+234 81 456 1008", null, "rumbidzai@helpinghands.ngo", "Bulawayo, Zimbabwe", "Zimbabwe"],
    ["Knowledge Mhlanga", null, "+263 77 456 1009", "+263 77 456 1009", "knowledge.mhlanga@gmail.com", "Bulawayo, Zimbabwe", "Zimbabwe"],
    ["Chipo Zvomuya", "Zvomuya Farms", "+263 78 456 1010", null, "chipo@zvomuyafarms.co.zw", "Mazowe, Zimbabwe", "Zimbabwe"],
    ["Tonderai Masuku", "Kingdom Harvest Church", "+263 71 456 1011", "+263 71 456 1011", "tonderai@kingdomharvest.org", "Gweru, Zimbabwe", "Zimbabwe"],
    ["Linda Muchenje", null, "+44 20 456 1012", "+44 7700 900 012", "linda.muchenje@yahoo.co.uk", "Birmingham, United Kingdom", "United Kingdom"],
    ["Panashe Njanji", "Njanji Logistics (Forwarder)", "+263 77 456 1013", "+263 77 456 1013", "panashe@njanjilogistics.co.zw", "Msasa, Harare", "Zimbabwe"],
    ["Rutendo Zhou", null, "+27 71 456 1014", null, "rutendo.zhou@gmail.com", "Cape Town, RSA", "South Africa"],
    ["Simbarashe Madzima", "Madzima Milling", "+263 78 456 1015", "+263 78 456 1015", "simba@madzimamilling.co.zw", "Kwekwe, Zimbabwe", "Zimbabwe"],
    ["Gwinyai Chikwanda", null, "+263 71 456 1016", null, "gwinyai.chikwanda@yahoo.com", "Luton, United Kingdom", "United Kingdom"],
    ["Tinotenda Hungwe", null, "+263 77 456 1017", "+263 77 456 1017", "tinotenda.hungwe@gmail.com", "Avondale, Harare", "Zimbabwe"],
    ["Faith Nyoni", "Nyoni Freight Solutions", "+263 78 456 1018", null, "faith@nyonifreight.co.zw", "Mutare, Zimbabwe", "Zimbabwe"],
    ["Edmore Chivaka", null, "+44 7811 456 019", "+44 7811 456 019", "edmore.chivaka@gmail.com", "Manchester, United Kingdom", "United Kingdom"],
    ["Anna Maposa", "Maposa Medical Supplies", "+263 71 456 1020", "+263 71 456 1020", "anna@maposamedical.co.zw", "Causeway, Harare", "Zimbabwe"],
  ];
  const cTypes = [
    "INDIVIDUAL", "INDIVIDUAL", "INDIVIDUAL", "INDIVIDUAL", "BUSINESS",
    "BUSINESS", "BUSINESS", "NGO", "INDIVIDUAL", "BUSINESS",
    "CHURCH", "INDIVIDUAL", "FREIGHT_FORWARDER", "INDIVIDUAL", "BUSINESS",
    "INDIVIDUAL", "INDIVIDUAL", "FREIGHT_FORWARDER", "INDIVIDUAL", "BUSINESS",
  ];
  const customers: any[] = [];
  for (const [fullName, businessName, phone, whatsapp, email, address, country] of customerDefs) {
    customers.push(
      await prisma.customer.create({
        data: {
          fullName,
          businessName,
          phone,
          whatsapp,
          email,
          address,
          country,
          customerType: cTypes[customers.length] as any,
          notes:
            customers.length === 0
              ? "Primary demo account — shipping a 2018 Toyota Hilux from Birmingham to Harare."
              : null,
        },
      }),
    );
  }
  const c = (idx: number) => customers[idx];

  // ============================================================
  // QUOTES (8)
  // ============================================================
  type QOpt = {
    ci: number; type: string; origin: string; dest: string; cargo: string;
    freight: number; collection: number; clearing: number; insurance: number;
    delivery: number; storage: number; other: number; discount: number;
    deposit: number; status: string; daysAgo: number;
  };
  async function makeQuote(o: QOpt, n: number): Promise<any> {
    const total = o.freight + o.collection + o.clearing + o.insurance + o.delivery + o.storage + o.other - o.discount;
    return prisma.quote.create({
      data: {
        quoteNumber: `QT-2026-${1001 + n}`,
        customerId: c(o.ci).id,
        shipmentType: o.type,
        origin: o.origin,
        destination: o.dest,
        cargoDescription: o.cargo,
        freightCharge: o.freight,
        collectionFee: o.collection,
        clearingFee: o.clearing,
        insurance: o.insurance,
        deliveryFee: o.delivery,
        storage: o.storage,
        otherCharges: o.other,
        discount: o.discount,
        total,
        depositRequired: o.deposit,
        currency: "USD",
        status: o.status as any,
        expiryDate: daysFromNow(21),
        issuedById: sales.id,
        createdAt: daysAgo(o.daysAgo),
      },
    });
  }
  const quoteDefs: QOpt[] = [
    { ci: 0, type: "Vehicle", origin: "Birmingham, UK", dest: "Harare, Zimbabwe", cargo: "2018 Toyota Hilux 2.8 GD-6 D/C", freight: 1250, collection: 120, clearing: 250, insurance: 90, delivery: 90, storage: 0, other: 0, discount: 0, deposit: 500, status: "ACCEPTED", daysAgo: 32 },
    { ci: 1, type: "Household Goods", origin: "Manchester, UK", dest: "Harare, Zimbabwe", cargo: "Household effects — 150 cu ft family consol", freight: 2100, collection: 180, clearing: 320, insurance: 150, delivery: 140, storage: 60, other: 0, discount: 100, deposit: 700, status: "SENT", daysAgo: 6 },
    { ci: 2, type: "Personal Effects", origin: "London, UK", dest: "Msasa, Harare", cargo: "Personal effects — 60 cu ft student relocation", freight: 850, collection: 90, clearing: 180, insurance: 60, delivery: 70, storage: 0, other: 0, discount: 0, deposit: 300, status: "VIEWED", daysAgo: 3 },
    { ci: 3, type: "Vehicle", origin: "Johannesburg, RSA", dest: "Harare, Zimbabwe", cargo: "2016 Ford Ranger 3.2 XLT", freight: 900, collection: 60, clearing: 220, insurance: 70, delivery: 80, storage: 0, other: 0, discount: 50, deposit: 350, status: "ACCEPTED", daysAgo: 20 },
    { ci: 6, type: "Machinery", origin: "Grimsby, UK", dest: "Mbare, Harare", cargo: "Tractor spares & small machinery load", freight: 3200, collection: 250, clearing: 480, insurance: 230, delivery: 190, storage: 120, other: 0, discount: 0, deposit: 1000, status: "SENT", daysAgo: 9 },
    { ci: 7, type: "Container", origin: "Southampton, UK", dest: "Bulawayo, Zimbabwe", cargo: "20ft container — school & medical supplies (NGO)", freight: 1800, collection: 150, clearing: 300, insurance: 140, delivery: 120, storage: 0, other: 0, discount: 380, deposit: 600, status: "DRAFT", daysAgo: 1 },
    { ci: 10, type: "Vehicle", origin: "Birmingham, UK", dest: "Gweru, Zimbabwe", cargo: "2019 Toyota Land Cruiser Prado", freight: 2200, collection: 130, clearing: 280, insurance: 160, delivery: 100, storage: 0, other: 0, discount: 0, deposit: 800, status: "REJECTED", daysAgo: 15 },
    { ci: 13, type: "General Cargo", origin: "Cape Town, RSA", dest: "Harare, Zimbabwe", cargo: "Mixed general cargo — consolidations", freight: 1450, collection: 110, clearing: 260, insurance: 90, delivery: 95, storage: 40, other: 0, discount: 0, deposit: 500, status: "EXPIRED", daysAgo: 45 },
  ];
  const quotes: any[] = [];
  for (let i = 0; i < quoteDefs.length; i++) {
    quotes.push(await makeQuote(quoteDefs[i], i));
  }

  // ============================================================
  // SHIPMENTS (30)
  // ============================================================
  type S = {
    ci: number; type: string; status: string; origin: string; dest: string;
    vehicleReg?: string; vin?: string; make?: string; model?: string; year?: number;
    container?: string; vessel?: string; carrier?: string; tracking?: string;
    dep: number; arr: number; weight?: number; volume?: number;
    invoiceTotal: number; invoiceDaysAgo: number; paid: number;
    expenses: Array<[string, number, number]>;
    notes?: string; staffIdx: number; demo?: boolean;
  };
  const shipmentDefs: S[] = [
    // --- HERO RECORD: Tendai Moyo / 2018 Toyota Hilux ---
    {
      ci: 0, type: "Vehicle", status: "IN_TRANSIT", origin: "Birmingham, UK", dest: "Harare, Zimbabwe",
      vehicleReg: "PK68 GDH", vin: "MR0FZ29G101234567", make: "Toyota", model: "Hilux 2.8 GD-6", year: 2018,
      vessel: "MV Dar Es Salaam Express", carrier: "Grindrod Shipping", tracking: "GRD-BHM-88231", container: "MSKU 8421193",
      dep: -14, arr: 12, weight: 2450, volume: 12,
      invoiceTotal: 1800, invoiceDaysAgo: 28, paid: 500,
      expenses: [
        ["COLLECTION", 120, 28], ["PORT_CHARGES", 180, 20], ["FREIGHT", 620, 22],
        ["CUSTOMS", 90, 6], ["CLEARING", 90, 4], ["DOCUMENTATION", 40, 26], ["FUEL", 10, 2],
      ],
      notes: "Hero demo shipment — deposit collected, vehicle in transit, documentation complete.",
      staffIdx: 1, demo: true,
    },
    {
      ci: 0, type: "General Cargo", status: "DELIVERED", origin: "London, UK", dest: "Harare, Zimbabwe",
      tracking: "GRD-LON-10021", carrier: "Hapag-Lloyd", container: "MAEU 7712345",
      dep: -120, arr: -96, invoiceTotal: 1650, invoiceDaysAgo: 150, paid: 1650,
      expenses: [
        ["COLLECTION", 110, 120], ["FREIGHT", 880, 114], ["PORT_CHARGES", 150, 104],
        ["CUSTOMS", 80, 100], ["CLEARING", 80, 98], ["STORAGE", 60, 110], ["DOCUMENTATION", 40, 118],
      ],
      notes: "Delivered and fully paid. Repeat customer.", staffIdx: 1,
    },
    {
      ci: 0, type: "Spare Parts", status: "ARRIVED_AT_PORT", origin: "Coventry, UK", dest: "Harare, Zimbabwe",
      tracking: "GRD-COV-88410", carrier: "Maersk", container: "MRKU 5112987",
      dep: -40, arr: 3, invoiceTotal: 980, invoiceDaysAgo: 50, paid: 500,
      expenses: [["COLLECTION", 60, 40], ["FREIGHT", 520, 36], ["PORT_CHARGES", 90, 30], ["CLEARING", 60, 12]],
      staffIdx: 1,
    },
    {
      ci: 1, type: "Household Goods", status: "READY_FOR_LOADING", origin: "Manchester, UK", dest: "Harare, Zimbabwe",
      tracking: "HLW-MAN-55120", carrier: "Grindrod Shipping", container: "MSKU 6391022",
      dep: 2, arr: 34, invoiceTotal: 2410, invoiceDaysAgo: 8, paid: 700,
      expenses: [["COLLECTION", 180, 10], ["DOCUMENTATION", 60, 7]],
      notes: "20ft consolidation of family effects.", staffIdx: 1,
    },
    {
      ci: 2, type: "Personal Effects", status: "COLLECTED", origin: "London, UK", dest: "Msasa, Harare",
      tracking: "GRD-LON-83991", carrier: "CMA CGM",
      dep: -3, arr: 22, invoiceTotal: 0, invoiceDaysAgo: 3, paid: 0,
      expenses: [["COLLECTION", 90, 2]],
      notes: "Invoice pending once final weight known.", staffIdx: 2,
    },
    {
      ci: 3, type: "Vehicle", status: "IN_TRANSIT", origin: "Johannesburg, RSA", dest: "Harare, Zimbabwe",
      vehicleReg: "FXJ 742 GP", vin: "MNAUMFF50GW541289", make: "Ford", model: "Ranger 3.2 XLT", year: 2016,
      carrier: "Cross-Border Direct", tracking: "CBD-JHB-102", weight: 2150, volume: 11,
      dep: -9, arr: 8, invoiceTotal: 2210, invoiceDaysAgo: 22, paid: 1200,
      expenses: [["COLLECTION", 60, 9], ["FREIGHT", 900, 8], ["TRANSPORT", 240, 4], ["CLEARING", 140, 3]],
      staffIdx: 2,
    },
    {
      ci: 4, type: "Container", status: "CUSTOMS_CLEARED", origin: "Liverpool, UK", dest: "Belvedere, Harare",
      container: "TGHU 9091234", carrier: "Maersk", tracking: "MSK-LIV-33402",
      dep: -46, arr: -2, invoiceTotal: 5200, invoiceDaysAgo: 60, paid: 3200,
      expenses: [
        ["FREIGHT", 3000, 44], ["COLLECTION", 200, 46], ["PORT_CHARGES", 350, 36],
        ["CUSTOMS", 180, 10], ["CLEARING", 160, 6], ["STORAGE", 90, 30], ["TRANSPORT", 220, 4],
      ],
      notes: "Construction equipment 20ft container.", staffIdx: 2,
    },
    {
      ci: 5, type: "Household Goods", status: "IN_TRANSIT", origin: "London, UK", dest: "Chisipite, Harare",
      container: "MSKU 1028374", carrier: "Grindrod", tracking: "GRD-LON-90022", vessel: "MV Mozambique Star",
      dep: -18, arr: 20, invoiceTotal: 3350, invoiceDaysAgo: 22, paid: 1400,
      expenses: [["COLLECTION", 150, 18], ["FREIGHT", 1900, 16], ["PORT_CHARGES", 240, 10], ["CLEARING", 170, 2]],
      notes: "Antiques and gallery artwork — crate handling.", staffIdx: 0,
    },
    {
      ci: 6, type: "Machinery", status: "ENQUIRY", origin: "Grimsby, UK", dest: "Mbare, Harare",
      notes: "Tractor spares haul — awaiting client confirmation.",
      dep: 25, arr: 75, invoiceTotal: 0, invoiceDaysAgo: 0, paid: 0, expenses: [], staffIdx: 1,
    },
    {
      ci: 6, type: "General Cargo", status: "CANCELLED", origin: "London, UK", dest: "Harare, Zimbabwe",
      tracking: "GRD-LON-41100",
      dep: -30, arr: -60, invoiceTotal: 0, invoiceDaysAgo: 0, paid: 0,
      expenses: [["DOCUMENTATION", 50, 31]],
      notes: "Cancelled by customer — no invoice raised.", staffIdx: 1,
    },
    {
      ci: 7, type: "Container", status: "AT_WAREHOUSE", origin: "Southampton, UK", dest: "Bulawayo, Zimbabwe",
      container: "TCLU 5501820", carrier: "Maersk", tracking: "MSK-SOT-77891",
      dep: -5, arr: 32, invoiceTotal: 3850, invoiceDaysAgo: 12, paid: 600,
      expenses: [["COLLECTION", 150, 5], ["FREIGHT", 1800, 4], ["DOCUMENTATION", 90, 3], ["STORAGE", 120, 1]],
      notes: "NGO relief goods — 20ft container.", staffIdx: 3,
    },
    {
      ci: 8, type: "Vehicle", status: "DELIVERED", origin: "Birmingham, UK", dest: "Bulawayo, Zimbabwe",
      vehicleReg: "LK59 AXT", vin: "JTEBU11J817123456", make: "Toyota", model: "Land Cruiser", year: 2019,
      carrier: "Grindrod", tracking: "GRD-BHM-44002", vessel: "MV Beira Trader", weight: 2650, volume: 12,
      dep: -95, arr: -68, invoiceTotal: 2600, invoiceDaysAgo: 110, paid: 2600,
      expenses: [
        ["COLLECTION", 130, 95], ["FREIGHT", 1750, 88], ["PORT_CHARGES", 180, 80],
        ["CUSTOMS", 110, 72], ["CLEARING", 110, 70], ["TRANSPORT", 100, 68], ["INSPECTION", 60, 92],
      ],
      notes: "Fully paid, delivered. High-value repeat client.", staffIdx: 2,
    },
    {
      ci: 9, type: "Machinery", status: "DEPARTED", origin: "Northampton, UK", dest: "Mazowe, Zimbabwe",
      container: "MRKU 8829451", carrier: "Hapag-Lloyd", tracking: "HPL-NHP-99300", weight: 5800, volume: 28,
      dep: -2, arr: 30, invoiceTotal: 4100, invoiceDaysAgo: 15, paid: 1600,
      expenses: [["COLLECTION", 220, 3], ["FREIGHT", 2600, 1]],
      staffIdx: 1,
    },
    {
      ci: 10, type: "Vehicle", status: "ON_HOLD", origin: "Birmingham, UK", dest: "Gweru, Zimbabwe",
      vehicleReg: "PJ18 TXT", vin: "JTMHV05J804022227", make: "Toyota", model: "Land Cruiser Prado", year: 2019,
      carrier: "Grindrod", tracking: "GRD-BHM-90511", weight: 2500, volume: 12,
      dep: -21, arr: 25, invoiceTotal: 1650, invoiceDaysAgo: 18, paid: 0,
      expenses: [["COLLECTION", 130, 21], ["STORAGE", 130, 8]],
      notes: "On hold — awaiting export licence documents.", staffIdx: 3,
    },
    {
      ci: 11, type: "Vehicle", status: "LOADED", origin: "Manchester, UK", dest: "Harare, Zimbabwe",
      vehicleReg: "VN63 OOD", vin: "WVWZZZ3KZFW123456", make: "Volkswagen", model: "Golf 1.4 TSI", year: 2013,
      carrier: "CMA CGM", tracking: "CMA-MAN-66123", vessel: "MV African Queen", weight: 1400, volume: 9,
      dep: -1, arr: 28, invoiceTotal: 1900, invoiceDaysAgo: 10, paid: 750,
      expenses: [["COLLECTION", 120, 2], ["FREIGHT", 1200, 1], ["DOCUMENTATION", 45, 1]],
      staffIdx: 1,
    },
    {
      ci: 12, type: "Container", status: "CUSTOMS_PROCESSING", origin: "Felixstowe, UK", dest: "Msasa, Harare",
      container: "OOLU 7023491", carrier: "Maersk", tracking: "MSK-FEL-21408",
      dep: -30, arr: 10, invoiceTotal: 4800, invoiceDaysAgo: 38, paid: 1900,
      expenses: [
        ["FREIGHT", 3100, 29], ["COLLECTION", 180, 30], ["PORT_CHARGES", 300, 22],
        ["CUSTOMS", 150, 4], ["CLEARING", 170, 2], ["DOCUMENTATION", 80, 28],
      ],
      notes: "Freight forwarder consolidation — 40ft container.", staffIdx: 2,
    },
    {
      ci: 13, type: "General Cargo", status: "IN_TRANSIT", origin: "Cape Town, RSA", dest: "Harare, Zimbabwe",
      carrier: "Cross-Border Direct", tracking: "CBD-CPT-455",
      dep: -6, arr: 6, invoiceTotal: 1490, invoiceDaysAgo: 9, paid: 500,
      expenses: [["COLLECTION", 110, 6], ["FREIGHT", 820, 5], ["TRANSPORT", 260, 2], ["FUEL", 180, 1]],
      staffIdx: 0,
    },
    {
      ci: 14, type: "Machinery", status: "DELIVERED", origin: "Peterborough, UK", dest: "Kwekwe, Zimbabwe",
      container: "TGHU 5500912", carrier: "Grindrod", tracking: "GRD-PBO-38100",
      dep: -70, arr: -42, invoiceTotal: 6900, invoiceDaysAgo: 78, paid: 6900,
      expenses: [
        ["COLLECTION", 250, 70], ["FREIGHT", 4600, 62], ["PORT_CHARGES", 380, 52],
        ["CLEARING", 220, 46], ["CUSTOMS", 180, 45], ["TRANSPORT", 300, 42], ["INSPECTION", 140, 66],
      ],
      notes: "Milling plant spares — fully paid, delivered.", staffIdx: 1,
    },
    {
      ci: 15, type: "Household Goods", status: "ENQUIRY", origin: "Luton, UK", dest: "Harare, Zimbabwe",
      notes: "New enquiry — family relocation. Awaiting survey.",
      dep: 30, arr: 90, invoiceTotal: 0, invoiceDaysAgo: 0, paid: 0, expenses: [], staffIdx: 3,
    },
    {
      ci: 16, type: "Vehicle", status: "READY_FOR_COLLECTION", origin: "London, UK", dest: "Avondale, Harare",
      vehicleReg: "KY56 DXW", vin: "WVWZZZ1KZ8W987654", make: "Volkswagen", model: "Passat", year: 2006,
      carrier: "CMA CGM", tracking: "CMA-LON-55600", vessel: "MV Maputo Express", weight: 1550, volume: 10,
      dep: -40, arr: -2, invoiceTotal: 1750, invoiceDaysAgo: 48, paid: 1750,
      expenses: [
        ["COLLECTION", 100, 40], ["FREIGHT", 1100, 36], ["PORT_CHARGES", 140, 26],
        ["CUSTOMS", 80, 6], ["CLEARING", 90, 4], ["STORAGE", 60, 20], ["INSPECTION", 60, 38],
      ],
      notes: "Paid in full, customs cleared, ready for collection.", staffIdx: 1,
    },
    {
      ci: 17, type: "Container", status: "DEPARTED", origin: "Southampton, UK", dest: "Mutare, Zimbabwe",
      container: "MSKU 3321904", carrier: "Maersk", tracking: "MSK-SOT-90213",
      dep: -2, arr: 30, invoiceTotal: 4300, invoiceDaysAgo: 8, paid: 1300,
      expenses: [["COLLECTION", 160, 3], ["FREIGHT", 2500, 1], ["DOCUMENTATION", 70, 1]],
      staffIdx: 2,
    },
    {
      ci: 18, type: "Vehicle", status: "IN_TRANSIT", origin: "Manchester, UK", dest: "Harare, Zimbabwe",
      vehicleReg: "LK18 WRV", vin: "WF0FXXGAWF8R12345", make: "Ford", model: "Focus ST", year: 2018,
      carrier: "Grindrod", tracking: "GRD-MAN-55671", vessel: "MV Zambezi Star", weight: 1600, volume: 10,
      dep: -10, arr: 15, invoiceTotal: 2400, invoiceDaysAgo: 20, paid: 1000,
      expenses: [["COLLECTION", 120, 10], ["FREIGHT", 1550, 8], ["PORT_CHARGES", 160, 4], ["CLEARING", 140, 1]],
      staffIdx: 1,
    },
    {
      ci: 19, type: "Container", status: "BOOKED", origin: "London, UK", dest: "Causeway, Harare",
      notes: "Medical supplies 40ft — booking confirmed, awaiting goods.",
      dep: 7, arr: 45, invoiceTotal: 3150, invoiceDaysAgo: 3, paid: 900,
      expenses: [["DOCUMENTATION", 70, 2], ["COLLECTION", 150, 1]],
      staffIdx: 4,
    },
    {
      ci: 4, type: "General Cargo", status: "DELIVERED", origin: "London, UK", dest: "Harare, Zimbabwe",
      carrier: "Grindrod", tracking: "GRD-LON-20144",
      dep: -140, arr: -112, invoiceTotal: 1250, invoiceDaysAgo: 150, paid: 1250,
      expenses: [["COLLECTION", 80, 140], ["FREIGHT", 700, 132], ["CLEARING", 70, 114], ["STORAGE", 40, 130]],
      staffIdx: 2,
    },
    {
      ci: 11, type: "Household Goods", status: "DELIVERED", origin: "Birmingham, UK", dest: "Harare, Zimbabwe",
      carrier: "Grindrod", tracking: "GRD-BHM-22190",
      dep: -130, arr: -100, invoiceTotal: 2850, invoiceDaysAgo: 140, paid: 2850,
      expenses: [
        ["COLLECTION", 120, 130], ["FREIGHT", 1800, 122], ["PORT_CHARGES", 190, 112],
        ["CLEARING", 140, 102], ["STORAGE", 60, 120],
      ],
      staffIdx: 1,
    },
    {
      ci: 0, type: "Vehicle", status: "DELIVERED", origin: "Birmingham, UK", dest: "Harare, Zimbabwe",
      vehicleReg: "BJ63 XKP", vin: "WVWZZZ1JZBW234567", make: "Volkswagen", model: "Tiguan 2.0 TDI", year: 2013,
      carrier: "Grindrod", tracking: "GRD-BHM-31002", vessel: "MV Mombasa Trader", weight: 1700, volume: 10,
      dep: -160, arr: -130, invoiceTotal: 2050, invoiceDaysAgo: 168, paid: 2050,
      expenses: [
        ["COLLECTION", 110, 160], ["FREIGHT", 1400, 152], ["PORT_CHARGES", 150, 142],
        ["CUSTOMS", 90, 134], ["CLEARING", 90, 132], ["INSPECTION", 60, 158],
      ],
      staffIdx: 2,
    },
    {
      ci: 7, type: "General Cargo", status: "OUT_FOR_DELIVERY", origin: "Beira, Mozambique", dest: "Causeway, Harare",
      carrier: "Cross-Border Direct", tracking: "CBD-BR-889",
      dep: -3, arr: 1, invoiceTotal: 880, invoiceDaysAgo: 5, paid: 880,
      expenses: [["FREIGHT", 460, 3], ["CLEARING", 90, 1], ["TRANSPORT", 260, 1], ["FUEL", 70, 0]],
      notes: "Beira corridor customs cleared; final mile delivery.", staffIdx: 3,
    },
    {
      ci: 18, type: "Container", status: "AT_WAREHOUSE", origin: "Felixstowe, UK", dest: "Harare, Zimbabwe",
      container: "OOLU 2201880", carrier: "Maersk", tracking: "MSK-FEL-55402",
      dep: -4, arr: 28, invoiceTotal: 2200, invoiceDaysAgo: 6, paid: 800,
      expenses: [["COLLECTION", 140, 4], ["FREIGHT", 1300, 3], ["STORAGE", 90, 1]],
      staffIdx: 2,
    },
    {
      ci: 9, type: "General Cargo", status: "QUOTED", origin: "London, UK", dest: "Mazowe, Zimbabwe",
      notes: "Quote accepted, awaiting deposit to book.",
      dep: 15, arr: 55, invoiceTotal: 0, invoiceDaysAgo: 0, paid: 0, expenses: [], staffIdx: 3,
    },
    {
      ci: 17, type: "General Cargo", status: "IN_TRANSIT", origin: "Durbaan, South Africa", dest: "Mutare, Zimbabwe",
      carrier: "Cross-Border Direct", tracking: "CBD-DBN-512",
      dep: -8, arr: 5, invoiceTotal: 1150, invoiceDaysAgo: 11, paid: 1150,
      expenses: [["FREIGHT", 620, 8], ["COLLECTION", 70, 9], ["CLEARING", 90, 3], ["TRANSPORT", 210, 2], ["FUEL", 90, 1]],
      notes: "Consolidated general cargo — paid in full, in transit via Beira corridor.",
      staffIdx: 2,
    },
  ];

  // ============================================================
  // Create shipments + invoices + payments + expenses
  // ============================================================
  const shipmentRecords: any[] = [];
  let seq = 0;
  for (const s of shipmentDefs) {
    seq += 1;
    const invoiceTotal = s.invoiceTotal;
    const amountPaid = s.paid;
    const outstanding = invoiceTotal - amountPaid;
    // Recognized revenue = confirmed invoice total (NOT unpaid invoices counted
    // as cash). Payment status/balance track actual cash collected separately.
    const revenue = invoiceTotal;
    const expensesTotal = s.expenses.reduce((sum, [, amt]) => sum + amt, 0);
    const profit = revenue - expensesTotal;
    const profitMargin = revenue <= 0 ? 0 : (profit / revenue) * 100;
    const paidStatus =
      invoiceTotal === 0
        ? "UNPAID"
        : amountPaid >= invoiceTotal
          ? "PAID"
          : amountPaid > 0
            ? "PARTIALLY_PAID"
            : "UNPAID";

    const ship = await prisma.shipment.create({
      data: {
        shipmentNumber: `SHIP-2026-${1000 + seq}`,
        customerId: c(s.ci).id,
        shipmentType: s.type,
        status: s.status,
        paymentStatus: paidStatus,
        origin: s.origin,
        destination: s.dest,
        collectionAddress: `${s.origin} (collection)`,
        deliveryAddress: `${s.dest} (delivery)`,
        departureDate: daysAgo(-s.dep),
        expectedArrival: daysFromNow(s.arr),
        actualArrival: s.status === "DELIVERED" ? daysAgo(s.arr < 0 ? -s.arr : 30) : null,
        vehicleRegistration: s.vehicleReg,
        vin: s.vin,
        make: s.make,
        model: s.model,
        year: s.year,
        containerNumber: s.container,
        vessel: s.vessel,
        carrier: s.carrier,
        trackingReference: s.tracking,
        weight: s.weight,
        volume: s.volume,
        notes: s.notes,
        assignedStaffId: staff[s.staffIdx].id,
        invoiceTotal,
        amountPaid,
        outstanding,
        revenue,
        expensesTotal,
        profit,
        profitMargin,
        bookedAt: s.dep < 0 ? daysAgo(-s.dep + 14) : null,
        deliveredAt: s.status === "DELIVERED" ? daysAgo(s.arr < 0 ? -s.arr : 30) : null,
        createdAt: daysAgo(Math.max(s.invoiceDaysAgo, 1)),
        isDemo: !!s.demo,
      },
    });
    shipmentRecords.push(ship);

    // Invoice (skip for ENQUIRY/QUOTED/CANCELLED with no total)
    if (invoiceTotal > 0) {
      const invStatus =
        paidStatus === "PAID"
          ? "PAID"
          : amountPaid > 0
            ? "PARTIALLY_PAID"
            : "OVERDUE";
      await prisma.invoice.create({
        data: {
          invoiceNumber: `INV-2026-${2000 + seq}`,
          customerId: c(s.ci).id,
          shipmentId: ship.id,
          invoiceDate: daysAgo(s.invoiceDaysAgo),
          dueDate: daysAgo(Math.max(s.invoiceDaysAgo - 14, 0)),
          total: invoiceTotal,
          amountPaid,
          balance: outstanding,
          currency: "USD",
          status: invStatus as any,
          isDemo: !!s.demo,
        },
      });
    }

    // Payments
    if (amountPaid > 0) {
      const ref = `PAY-2026-${3000 + seq}`;
      const payAmt = amountPaid;
      await prisma.payment.create({
        data: {
          customerId: c(s.ci).id,
          shipmentId: ship.id,
          amount: payAmt,
          currency: "USD",
          method: "BANK_TRANSFER",
          reference: ref,
          date: daysAgo(s.invoiceDaysAgo ? Math.floor(s.invoiceDaysAgo * 0.4) : 1),
          receivedById: acct.id,
          receiptNumber: `RCT-2026-${4000 + seq}`,
          isDemo: !!s.demo,
        },
      });
    }

    // Expenses
    for (const [cat, amt, dag] of s.expenses) {
      await prisma.expense.create({
        data: {
          shipmentId: ship.id,
          supplier: "Supplier / Invoice #" + (1000 + seq),
          amount: amt,
          currency: "USD",
          date: daysAgo(dag),
          category: cat,
          isDemo: !!s.demo,
        },
      });
    }

    // Activity log
    await prisma.activityLog.create({
      data: {
        actorId: staff[s.staffIdx].id,
        action: s.status === "IN_TRANSIT" ? "STATUS_UPDATED" : s.status === "DELIVERED" ? "SHIPMENT_DELIVERED" : "SHIPMENT_CREATED",
        description: `Shipment ${ship.shipmentNumber} created/updated (${s.status}).`,
        customerId: c(s.ci).id,
        shipmentId: ship.id,
        createdAt: daysAgo(Math.max(s.invoiceDaysAgo, 1)),
      },
    });
  }

  const heroShipment = shipmentRecords[0];

  // ============================================================
  // DOCUMENTS (10) — linked to hero + others
  // ============================================================
  const docDefs: Array<[number, string, string, string]> = [
    [heroShipment.id, "Bill of Lading", "BILL_OF_LADING", "admin@horizonfreight.co.zw"],
    [heroShipment.id, "Invoice INV-2026-2001.pdf", "INVOICE", "accounts@horizonfreight.co.zw"],
    [heroShipment.id, "Payment Receipt RCT-2026-4001.pdf", "PROOF_OF_PAYMENT", "accounts@horizonfreight.co.zw"],
    [heroShipment.id, "Collection Document (PK68 GDH).pdf", "VEHICLE_DOCUMENTS", "ops@horizonfreight.co.zw"],
    [heroShipment.id, "V5 Certificate.pdf", "VEHICLE_DOCUMENTS", "support@horizonfreight.co.zw"],
    [shipmentRecords[1].id, "Customs Export Declaration.pdf", "EXPORT_DOCUMENTS", "ops@horizonfreight.co.zw"],
    [shipmentRecords[6].id, "Container Packing List.pdf", "PACKING_LIST", "ops@horizonfreight.co.zw"],
    [shipmentRecords[11].id, "Inspection Certificate.pdf", "INSPECTION_CERTIFICATE", "ops@horizonfreight.co.zw"],
    [shipmentRecords[3].id, "Household Inventory.xlsx", "PACKING_LIST", "support@horizonfreight.co.zw"],
    [shipmentRecords[20].id, "Vehicle Inspection Photos.zip", "PHOTOS", "ops@horizonfreight.co.zw"],
  ];
  for (const [shipId, fileName, type, uploaderEmail] of docDefs) {
    await prisma.document.create({
      data: {
        shipmentId: shipId as any,
        fileName,
        type: type as any,
        mimeType: "application/pdf",
        sizeBytes: 120_000 + Math.floor(Math.random() * 900_000),
        url: `/api/documents/${(shipId as any)?.toString?.() ?? "demo"}-${fileName}`,
        uploadedById: staff.find((u) => u.email === uploaderEmail)?.id ?? admin.id,
        isDemo: shipId === heroShipment.id,
      },
    });
  }

  // ============================================================
  // PORTAL USERS (5)
  // ============================================================
  const portalCreds: Array<[number, string]> = [
    [0, "TENDAI2026"],
    [1, "MAKONI2026"],
    [3, "GUMBO2026"],
    [8, "MHLANGA2026"],
    [11, "MUCHENJE2026"],
  ];
  for (const [ciIdx, code] of portalCreds) {
    const cust = c(ciIdx);
    await prisma.portalUser.create({
      data: {
        customerId: cust.id,
        email: cust.email!,
        passwordHash: bcrypt.hashSync(code, 10),
      },
    });
    await prisma.customer.update({
      where: { id: cust.id },
      data: { portalEnabled: true },
    });
  }

  // ============================================================
  // SUPPORT NOTES (8)
  // ============================================================
  const noteDefs: Array<[number, number | null, string, boolean, string]> = [
    [0, heroShipment.id, "Vehicle to be loaded on MV Dar Es Salaam Express this week. Client notified of departure.", false, admin.email],
    [0, heroShipment.id, "Collection complete in Birmingham. VIN verified against V5.", true, ops.email],
    [1, shipmentRecords[3].id, "Client asked for delivery to Borrowdale residence after clearing.", false, cs.email],
    [4, null, "New business enquiry for household relocation to Harare.", true, sales.email],
    [8, null, "Machinery client requested a 40ft quote and site delivery pricing.", true, sales.email],
    [11, shipmentRecords[11].id, "NGO consignment flagged for customs priority clearance.", true, ops.email],
    [12, shipmentRecords[12].id, "Export licence still pending from DVLA — shipment on hold.", false, ops.email],
    [16, shipmentRecords[16].id, "Ready for collection — client informed of warehouse hours.", false, cs.email],
  ];
  for (const [ciIdx, shipId, note, isInternal, actorEmail] of noteDefs) {
    await prisma.supportNote.create({
      data: {
        customerId: c(ciIdx).id,
        shipmentId: shipId as any,
        note,
        isInternal,
        createdById: staff.find((u) => u.email === actorEmail)?.id ?? admin.id,
      },
    });
  }

  // ============================================================
  // NOTIFICATIONS (demo sample)
  // ============================================================
  const notifDefs: Array<[string, string, string, string]> = [
    ["SHIPMENT_DEPARTED", "EMAIL", "tendai.moyo@gmail.com", "Your Toyota Hilux (SHIP-2026-1001) has departed Birmingham."],
    ["PAYMENT_RECEIVED", "EMAIL", "tendai.moyo@gmail.com", "We received your $500 deposit — receipt RCT-2026-4001."],
    ["DOCUMENT_UPLOADED", "EMAIL", "tendai.moyo@gmail.com", "Bill of Lading has been uploaded to your shipment."],
    ["SHIPMENT_ARRIVED", "INTERNAL", "ops@horizonfreight.co.zw", "SHIP-2026-1003 arrived at Beira — customs processing."],
    ["BALANCE_REMINDER", "EMAIL", "nyasha@chikoreconstruct.co.zw", "Balance of $2,000 outstanding on INV-2026-2007."],
    ["SHIPMENT_DELIVERED", "EMAIL", "knowledge.mhlanga@gmail.com", "Your Land Cruiser (SHIP-2026-1012) was delivered in Bulawayo."],
  ];
  for (const [type, channel, recipient, body] of notifDefs) {
    await prisma.notification.create({
      data: { type, channel: channel as any, recipient, body, status: "SENT", sentAt: daysAgo(1) },
    });
  }

  // ============================================================
  // ACTIVITY LOG (recent, for dashboard "Recent Activity")
  // ============================================================
  const activityDefs: Array<[string, string, string, number | null, number]> = [
    ["STATUS_UPDATED", "SHIP-2026-1003 marked Arrived at Port.", "Tendai Moyo", 0, 1],
    ["PAYMENT_RECORDED", "Deposit of $500 recorded for SHIP-2026-1001.", "Tendai Moyo", 0, 1],
    ["DOCUMENT_UPLOADED", "Bill of Lading uploaded to SHIP-2026-1001.", "Tendai Moyo", 0, 1],
    ["QUOTE_SENT", "Quote QT-2026-1002 sent to Makoni Family Trust.", "Makoni Family Trust", 1, 2],
    ["SHIPMENT_CREATED", "New shipment SHIP-2026-1004 raised for household goods.", "Makoni Family Trust", 1, 3],
    ["INVOICE_CREATED", "Invoice INV-2026-2006 raised for Chikore Construction.", "Chikore Construction", 4, 4],
    ["EXPENSE_ADDED", "Port charges recorded against SHIP-2026-1007.", "Nyasha Chikore", 4, 5],
    ["STATUS_UPDATED", "SHIP-2026-1017 customs processing.", "Njanji Logistics", 12, 6],
    ["SHIPMENT_DELIVERED", "SHIP-2026-1012 delivered in Bulawayo.", "Knowledge Mhlanga", 8, 7],
    ["SHIPMENT_CREATED", "Medical supplies container booked for Maposa Medical.", "Maposa Medical Supplies", 19, 8],
  ];
  for (const [action, desc, , ciIdx, day] of activityDefs) {
    await prisma.activityLog.create({
      data: {
        actorId: acct.id,
        action: action as any,
        description: desc,
        customerId: c(ciIdx).id,
        createdAt: daysAgo(day),
      },
    });
  }

  console.log("✅ Seed complete.");
  console.log("   Staff login:", staff.map((s) => s.email).join(", "), "| password:", PASSWORD);
  console.log("   Portal logins: TENDAI2026 / MAKONI2026 / GUMBO2026 / MHLANGA2026 / MUCHENJE2026");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
