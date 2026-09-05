export type ModuleDatasetFile = {
  href: string;
  filename: string;
  label: string;
};

const EXCEL_FILES = {
  practice_basics: {
    href: "/excel/practice_basics.csv",
    filename: "practice_basics.csv",
    label: "Practice sales (10 rows)",
  },
  products: {
    href: "/excel/products.csv",
    filename: "products.csv",
    label: "Product catalogue",
  },
  customers: {
    href: "/excel/customers.csv",
    filename: "customers.csv",
    label: "Customers",
  },
  regions: {
    href: "/excel/regions.csv",
    filename: "regions.csv",
    label: "Regions",
  },
  sales: {
    href: "/excel/sales.csv",
    filename: "sales.csv",
    label: "Sales transactions (180 rows)",
  },
  quarterly_targets: {
    href: "/excel/quarterly_targets.csv",
    filename: "quarterly_targets.csv",
    label: "Quarterly targets (HLOOKUP)",
  },
  dirty_staff: {
    href: "/excel/dirty_staff.csv",
    filename: "dirty_staff.csv",
    label: "Messy staff import",
  },
} as const;

type ExcelFileId = keyof typeof EXCEL_FILES;

const EXCEL_MODULE_FILES: Record<string, ExcelFileId[]> = {
  module1: ["practice_basics", "products"],
  module2: ["practice_basics", "products", "quarterly_targets"],
  module3: ["sales", "products", "customers", "regions"],
  module4: ["dirty_staff"],
  module5: ["practice_basics", "sales"],
  module6: ["practice_basics", "sales", "products"],
  module7: ["practice_basics"],
  module8: ["products", "regions", "customers", "practice_basics"],
  module9: ["practice_basics", "sales"],
};

const COURSE_MODULE_FILES: Record<string, Record<string, ExcelFileId[]>> = {
  "excel-training": EXCEL_MODULE_FILES,
};

export function getModuleDatasets(
  courseSlug: string,
  moduleSlug: string,
): ModuleDatasetFile[] {
  const ids = COURSE_MODULE_FILES[courseSlug]?.[moduleSlug] ?? [];
  return ids.map((id) => EXCEL_FILES[id]);
}
