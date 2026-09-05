/**
 * Deterministic Pramanicus Mart CSVs for Advanced Excel.
 * Run: node scripts/generate-excel-datasets.mjs
 */
import { mkdirSync, writeFileSync } from "fs";
import path from "path";

const outDir = path.join(process.cwd(), "public", "excel");
mkdirSync(outDir, { recursive: true });

function csvEscape(value) {
  const s = String(value);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function toCsv(headers, rows) {
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((h) => csvEscape(row[h])).join(","));
  }
  return `${lines.join("\n")}\n`;
}

function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const regions = [
  { RegionID: "N", RegionName: "North", Country: "India", Manager: "Meera Nair" },
  { RegionID: "S", RegionName: "South", Country: "India", Manager: "Arjun Rao" },
  { RegionID: "E", RegionName: "East", Country: "India", Manager: "Priya Sen" },
  { RegionID: "W", RegionName: "West", Country: "India", Manager: "Kabir Khan" },
];

const products = [
  { ProductID: "P001", ProductName: "NovaPhone 12", Category: "Electronics", Subcategory: "Mobiles", Brand: "Nova", UnitPrice: 24999, Cost: 18000 },
  { ProductID: "P002", ProductName: "NovaPhone SE", Category: "Electronics", Subcategory: "Mobiles", Brand: "Nova", UnitPrice: 14999, Cost: 10500 },
  { ProductID: "P003", ProductName: "PulseBuds Pro", Category: "Electronics", Subcategory: "Audio", Brand: "Pulse", UnitPrice: 3999, Cost: 2200 },
  { ProductID: "P004", ProductName: "Pulse Speaker", Category: "Electronics", Subcategory: "Audio", Brand: "Pulse", UnitPrice: 5999, Cost: 3100 },
  { ProductID: "P005", ProductName: "HomeBlend Mixer", Category: "Home & Kitchen", Subcategory: "Appliances", Brand: "Homely", UnitPrice: 2499, Cost: 1400 },
  { ProductID: "P006", ProductName: "HomeBlend Kettle", Category: "Home & Kitchen", Subcategory: "Appliances", Brand: "Homely", UnitPrice: 1299, Cost: 650 },
  { ProductID: "P007", ProductName: "CottonTee Classic", Category: "Fashion", Subcategory: "Apparel", Brand: "ThreadCo", UnitPrice: 799, Cost: 280 },
  { ProductID: "P008", ProductName: "DenimFit Jeans", Category: "Fashion", Subcategory: "Apparel", Brand: "ThreadCo", UnitPrice: 1899, Cost: 720 },
  { ProductID: "P009", ProductName: "KitchenPro Pan", Category: "Home & Kitchen", Subcategory: "Cookware", Brand: "Homely", UnitPrice: 1599, Cost: 800 },
  { ProductID: "P010", ProductName: "NovaTab 10", Category: "Electronics", Subcategory: "Tablets", Brand: "Nova", UnitPrice: 18999, Cost: 13200 },
  { ProductID: "P011", ProductName: "StreetSneak", Category: "Fashion", Subcategory: "Footwear", Brand: "ThreadCo", UnitPrice: 2499, Cost: 980 },
  { ProductID: "P012", ProductName: "ChefKnife Set", Category: "Home & Kitchen", Subcategory: "Cookware", Brand: "Homely", UnitPrice: 2199, Cost: 1100 },
];

const customers = [
  { CustomerID: "C001", CustomerName: "Ananya Sharma", Segment: "Consumer", City: "Delhi", RegionID: "N" },
  { CustomerID: "C002", CustomerName: "Rohan Gupta", Segment: "Consumer", City: "Jaipur", RegionID: "N" },
  { CustomerID: "C003", CustomerName: "Vikram Iyer", Segment: "Corporate", City: "Bengaluru", RegionID: "S" },
  { CustomerID: "C004", CustomerName: "Lakshmi Reddy", Segment: "Consumer", City: "Hyderabad", RegionID: "S" },
  { CustomerID: "C005", CustomerName: "Amit Banerjee", Segment: "Corporate", City: "Kolkata", RegionID: "E" },
  { CustomerID: "C006", CustomerName: "Sneha Das", Segment: "Consumer", City: "Bhubaneswar", RegionID: "E" },
  { CustomerID: "C007", CustomerName: "Farhan Qureshi", Segment: "Consumer", City: "Mumbai", RegionID: "W" },
  { CustomerID: "C008", CustomerName: "Neha Patel", Segment: "Corporate", City: "Ahmedabad", RegionID: "W" },
  { CustomerID: "C009", CustomerName: "Karan Malhotra", Segment: "Home Office", City: "Chandigarh", RegionID: "N" },
  { CustomerID: "C010", CustomerName: "Divya Nair", Segment: "Consumer", City: "Kochi", RegionID: "S" },
  { CustomerID: "C011", CustomerName: "Rahul Bose", Segment: "Home Office", City: "Guwahati", RegionID: "E" },
  { CustomerID: "C012", CustomerName: "Pooja Shah", Segment: "Consumer", City: "Pune", RegionID: "W" },
  { CustomerID: "C013", CustomerName: "Imran Khan", Segment: "Corporate", City: "Lucknow", RegionID: "N" },
  { CustomerID: "C014", CustomerName: "Meera Krishnan", Segment: "Consumer", City: "Chennai", RegionID: "S" },
  { CustomerID: "C015", CustomerName: "Sanjay Dutta", Segment: "Corporate", City: "Patna", RegionID: "E" },
  { CustomerID: "C016", CustomerName: "Aisha Merchant", Segment: "Home Office", City: "Surat", RegionID: "W" },
];

const practiceBasics = [
  { SalesID: 1001, Date: "2024-01-05", ProductID: "P001", Quantity: 2, UnitPrice: 24999, Discount: 0.1, Amount: 44998.2 },
  { SalesID: 1002, Date: "2024-01-06", ProductID: "P007", Quantity: 5, UnitPrice: 799, Discount: 0, Amount: 3995 },
  { SalesID: 1003, Date: "2024-01-08", ProductID: "P003", Quantity: 3, UnitPrice: 3999, Discount: 0.05, Amount: 11397.15 },
  { SalesID: 1004, Date: "2024-01-09", ProductID: "P008", Quantity: 2, UnitPrice: 1899, Discount: 0, Amount: 3798 },
  { SalesID: 1005, Date: "2024-01-12", ProductID: "P005", Quantity: 1, UnitPrice: 2499, Discount: 0, Amount: 2499 },
  { SalesID: 1006, Date: "2024-01-15", ProductID: "P002", Quantity: 1, UnitPrice: 14999, Discount: 0.08, Amount: 13799.08 },
  { SalesID: 1007, Date: "2024-01-18", ProductID: "P011", Quantity: 4, UnitPrice: 2499, Discount: 0.1, Amount: 8996.4 },
  { SalesID: 1008, Date: "2024-01-20", ProductID: "P006", Quantity: 2, UnitPrice: 1299, Discount: 0, Amount: 2598 },
  { SalesID: 1009, Date: "2024-01-22", ProductID: "P010", Quantity: 1, UnitPrice: 18999, Discount: 0.12, Amount: 16719.12 },
  { SalesID: 1010, Date: "2024-01-25", ProductID: "P004", Quantity: 2, UnitPrice: 5999, Discount: 0, Amount: 11998 },
];

const quarterlyTargets = products.map((p, i) => {
  const base = Math.round(p.UnitPrice * (8 + (i % 5)));
  return {
    ProductID: p.ProductID,
    Q1: base,
    Q2: Math.round(base * 1.1),
    Q3: Math.round(base * 0.95),
    Q4: Math.round(base * 1.25),
  };
});

const dirtyStaff = [
  { StaffID: "ST-01", FullName: "  ananya sharma  ", Department: "sales", Phone: "91-9876543210", JoinDate: "12/03/2022", City: "Delhi", CityDup: "Delhi" },
  { StaffID: "ST-02", FullName: "ROHAN GUPTA", Department: "Sales", Phone: "09876543210", JoinDate: "2021-07-19", City: "Jaipur", CityDup: "Jaipur" },
  { StaffID: "ST-03", FullName: "Vikram Iyer", Department: "IT", Phone: "919876543210", JoinDate: "19-Nov-2020", City: "Bengaluru", CityDup: "Bengaluru" },
  { StaffID: "ST-03", FullName: "Vikram Iyer", Department: "IT", Phone: "919876543210", JoinDate: "19-Nov-2020", City: "Bengaluru", CityDup: "Bengaluru" },
  { StaffID: "ST-04", FullName: "lakshmi  reddy", Department: "hr", Phone: "98765 43210", JoinDate: "03/15/2023", City: "Hyderabad", CityDup: "Hyderabad" },
  { StaffID: "ST-05", FullName: "Amit Banerjee", Department: "Finance", Phone: "+91 9123456780", JoinDate: "2020/01/08", City: "Kolkata", CityDup: "Kolkata" },
  { StaffID: "ST-06", FullName: "sneha das", Department: "SALES", Phone: "9123456780", JoinDate: "8 Jan 2024", City: "Bhubaneswar", CityDup: "Bhubaneswar" },
  { StaffID: "ST-07", FullName: "Farhan Qureshi", Department: "Warehouse", Phone: "91.9000011111", JoinDate: "15-02-2019", City: "Mumbai", CityDup: "Mumbai" },
  { StaffID: "ST-07", FullName: "Farhan Qureshi", Department: "Warehouse", Phone: "91.9000011111", JoinDate: "15-02-2019", City: "Mumbai", CityDup: "Mumbai" },
  { StaffID: "ST-08", FullName: "Neha Patel ", Department: "finance", Phone: "9000022222", JoinDate: "2022.06.01", City: "Ahmedabad", CityDup: "Ahmedabad" },
];

const rand = mulberry32(20260905);
const productById = Object.fromEntries(products.map((p) => [p.ProductID, p]));
const sales = [];

for (let i = 0; i < 180; i++) {
  const product = products[Math.floor(rand() * products.length)];
  const customer = customers[Math.floor(rand() * customers.length)];
  const qty = 1 + Math.floor(rand() * 5);
  const discountChoices = [0, 0, 0, 0.05, 0.08, 0.1, 0.12];
  const discount = discountChoices[Math.floor(rand() * discountChoices.length)];
  const day = 1 + Math.floor(rand() * 28);
  const month = 1 + Math.floor(rand() * 12);
  const year = rand() < 0.55 ? 2024 : 2025;
  const date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const amount = Math.round(qty * product.UnitPrice * (1 - discount) * 100) / 100;
  sales.push({
    SalesID: 2001 + i,
    Date: date,
    ProductID: product.ProductID,
    CustomerID: customer.CustomerID,
    RegionID: customer.RegionID,
    Quantity: qty,
    UnitPrice: product.UnitPrice,
    Discount: discount,
    Amount: amount,
  });
}

function write(name, headers, rows) {
  const file = path.join(outDir, name);
  writeFileSync(file, toCsv(headers, rows), "utf8");
  console.log(`Wrote ${name} (${rows.length} rows)`);
}

write("regions.csv", ["RegionID", "RegionName", "Country", "Manager"], regions);
write("products.csv", ["ProductID", "ProductName", "Category", "Subcategory", "Brand", "UnitPrice", "Cost"], products);
write("customers.csv", ["CustomerID", "CustomerName", "Segment", "City", "RegionID"], customers);
write("practice_basics.csv", ["SalesID", "Date", "ProductID", "Quantity", "UnitPrice", "Discount", "Amount"], practiceBasics);
write("quarterly_targets.csv", ["ProductID", "Q1", "Q2", "Q3", "Q4"], quarterlyTargets);
write("dirty_staff.csv", ["StaffID", "FullName", "Department", "Phone", "JoinDate", "City", "CityDup"], dirtyStaff);
write(
  "sales.csv",
  ["SalesID", "Date", "ProductID", "CustomerID", "RegionID", "Quantity", "UnitPrice", "Discount", "Amount"],
  sales,
);

const sumAmount = practiceBasics.reduce((s, r) => s + r.Amount, 0);
const avgAmount = sumAmount / practiceBasics.length;
const minAmount = Math.min(...practiceBasics.map((r) => r.Amount));
const maxAmount = Math.max(...practiceBasics.map((r) => r.Amount));
const p001 = productById.P001;

console.log("\npractice_basics checks:");
console.log("SUM Amount", sumAmount.toFixed(2));
console.log("AVERAGE Amount", avgAmount.toFixed(2));
console.log("MIN Amount", minAmount);
console.log("MAX Amount", maxAmount);
console.log("COUNTIF Quantity>=3", practiceBasics.filter((r) => r.Quantity >= 3).length);
console.log("P001 UnitPrice", p001.UnitPrice);
console.log("sales Amount total", sales.reduce((s, r) => s + r.Amount, 0).toFixed(2));
