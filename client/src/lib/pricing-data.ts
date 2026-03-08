export type EngineKey = "STD_6" | "STD_8" | "S63_AMG";

export interface EngineOption {
  key: EngineKey;
  label: string;
  shortLabel: string;
}

export const engines: EngineOption[] = [
  { key: "STD_6", label: "S-Class Standard 6-Cylinder", shortLabel: "6 سلندر" },
  { key: "STD_8", label: "S-Class Standard 8-Cylinder", shortLabel: "8 سلندر" },
  { key: "S63_AMG", label: "S63 AMG", shortLabel: "S63 AMG" },
];

export const mileageStops = [15000, 30000, 45000, 60000, 75000, 90000, 105000, 120000, 150000] as const;
export type Mileage = (typeof mileageStops)[number];

export function getServiceType(mileage: Mileage): "A" | "B" {
  const map: Record<Mileage, "A" | "B"> = {
    15000: "A",
    30000: "B",
    45000: "A",
    60000: "B",
    75000: "A",
    90000: "B",
    105000: "A",
    120000: "B",
    150000: "B",
  };
  return map[mileage];
}

export interface PeriodicPricing {
  serviceA: number;
  serviceB: number;
}

export const periodicPrices: Record<EngineKey, PeriodicPricing> = {
  STD_6: { serviceA: 3060, serviceB: 4340 },
  STD_8: { serviceA: 3320, serviceB: 4590 },
  S63_AMG: { serviceA: 5990, serviceB: 7000 },
};

export interface MajorMilestone {
  mileage: number;
  price: number;
  isPreliminary?: boolean;
  isUnpriced?: boolean;
}

export const majorMilestones: Record<EngineKey, MajorMilestone[]> = {
  STD_6: [
    { mileage: 60000, price: 9070 },
    { mileage: 90000, price: 6870 },
    { mileage: 120000, price: 0, isUnpriced: true },
    { mileage: 150000, price: 6720, isPreliminary: true },
  ],
  STD_8: [
    { mileage: 60000, price: 9160 },
    { mileage: 90000, price: 7310 },
    { mileage: 120000, price: 0, isUnpriced: true },
    { mileage: 150000, price: 6820, isPreliminary: true },
  ],
  S63_AMG: [
    { mileage: 45000, price: 8910 },
    { mileage: 60000, price: 11880 },
    { mileage: 90000, price: 10350 },
    { mileage: 120000, price: 0, isUnpriced: true },
    { mileage: 150000, price: 7310, isPreliminary: true },
  ],
};

export const majorClassificationMilestones: Record<EngineKey, number[]> = {
  STD_6: [60000, 90000, 120000, 150000],
  STD_8: [60000, 90000, 120000, 150000],
  S63_AMG: [45000, 60000, 90000, 120000, 150000],
};

export function isMajorMilestone(engine: EngineKey, mileage: Mileage): boolean {
  return majorClassificationMilestones[engine].includes(mileage);
}

export function getMajorPrice(engine: EngineKey, mileage: Mileage): MajorMilestone | undefined {
  return majorMilestones[engine].find((m) => m.mileage === mileage);
}

export function getPeriodicPrice(engine: EngineKey, mileage: Mileage): number {
  const serviceType = getServiceType(mileage);
  const prices = periodicPrices[engine];
  return serviceType === "A" ? prices.serviceA : prices.serviceB;
}

export interface AgencyPrice {
  mileage: number;
  price: number;
}

export const agencyPrices: Record<EngineKey, AgencyPrice[]> = {
  STD_6: [
    { mileage: 15000, price: 3600 },
    { mileage: 30000, price: 5100 },
    { mileage: 45000, price: 6600 },
    { mileage: 60000, price: 10300 },
    { mileage: 90000, price: 7800 },
    { mileage: 105000, price: 3600 },
  ],
  STD_8: [
    { mileage: 15000, price: 3900 },
    { mileage: 30000, price: 5400 },
    { mileage: 45000, price: 6950 },
    { mileage: 60000, price: 10400 },
    { mileage: 90000, price: 8300 },
    { mileage: 105000, price: 3900 },
  ],
  S63_AMG: [
    { mileage: 15000, price: 6800 },
    { mileage: 30000, price: 7950 },
    { mileage: 45000, price: 9900 },
    { mileage: 60000, price: 13200 },
    { mileage: 90000, price: 11500 },
    { mileage: 105000, price: 6800 },
  ],
};

export function getAgencyPrice(engine: EngineKey, mileage: Mileage): number | undefined {
  const found = agencyPrices[engine].find((a) => a.mileage === mileage);
  return found?.price;
}

export function formatPrice(price: number): string {
  return price.toLocaleString("ar-SA");
}

export function formatMileage(mileage: number): string {
  return mileage.toLocaleString("ar-SA");
}

export function buildBookingUrl(params: {
  engine: EngineKey;
  mileage: Mileage;
  serviceType: "A" | "B";
  packageType: "PERIODIC" | "MAJOR";
  price: number;
}): string {
  const base = "https://book.lezof.com";
  const query = new URLSearchParams({
    model: "S-Class",
    years: "2020-2025",
    engine: params.engine,
    mileage: String(params.mileage),
    serviceType: params.serviceType,
    package: params.packageType === "PERIODIC" ? "Periodic" : "Major",
    price: String(params.price),
  });
  return `${base}?${query.toString()}`;
}

export type DueStatus = "included" | "vin_check" | "milestone_due" | "not_included";

export interface DueTableRow {
  km: string;
  ab: "A" | "B";
  cabinFilter: DueStatus;
  brakeFluid: DueStatus;
  sparkPlugs: DueStatus;
  gearboxOil: DueStatus;
  differential: DueStatus;
  coolant: DueStatus;
  classification: string;
}

const S = {
  i: "included" as DueStatus,
  v: "vin_check" as DueStatus,
  m: "milestone_due" as DueStatus,
  n: "not_included" as DueStatus,
};

export const dueTableData: Record<EngineKey, DueTableRow[]> = {
  STD_6: [
    { km: "15K", ab: "A", cabinFilter: S.n, brakeFluid: S.n, sparkPlugs: S.n, gearboxOil: S.n, differential: S.n, coolant: S.n, classification: "دوري" },
    { km: "30K", ab: "B", cabinFilter: S.i, brakeFluid: S.v, sparkPlugs: S.n, gearboxOil: S.n, differential: S.n, coolant: S.n, classification: "دوري" },
    { km: "45K", ab: "A", cabinFilter: S.n, brakeFluid: S.n, sparkPlugs: S.n, gearboxOil: S.n, differential: S.n, coolant: S.n, classification: "دوري" },
    { km: "60K", ab: "B", cabinFilter: S.i, brakeFluid: S.v, sparkPlugs: S.i, gearboxOil: S.i, differential: S.v, coolant: S.n, classification: "شاملة" },
    { km: "75K", ab: "A", cabinFilter: S.n, brakeFluid: S.n, sparkPlugs: S.n, gearboxOil: S.n, differential: S.n, coolant: S.n, classification: "دوري" },
    { km: "90K", ab: "B", cabinFilter: S.i, brakeFluid: S.v, sparkPlugs: S.n, gearboxOil: S.n, differential: S.v, coolant: S.n, classification: "شاملة" },
    { km: "105K", ab: "A", cabinFilter: S.n, brakeFluid: S.n, sparkPlugs: S.n, gearboxOil: S.n, differential: S.n, coolant: S.n, classification: "دوري" },
    { km: "120K", ab: "B", cabinFilter: S.i, brakeFluid: S.v, sparkPlugs: S.i, gearboxOil: S.i, differential: S.v, coolant: S.n, classification: "شاملة" },
    { km: "150K", ab: "B", cabinFilter: S.i, brakeFluid: S.v, sparkPlugs: S.n, gearboxOil: S.n, differential: S.v, coolant: S.m, classification: "شاملة" },
  ],
  STD_8: [
    { km: "15K", ab: "A", cabinFilter: S.n, brakeFluid: S.n, sparkPlugs: S.n, gearboxOil: S.n, differential: S.n, coolant: S.n, classification: "دوري" },
    { km: "30K", ab: "B", cabinFilter: S.i, brakeFluid: S.v, sparkPlugs: S.n, gearboxOil: S.n, differential: S.n, coolant: S.n, classification: "دوري" },
    { km: "45K", ab: "A", cabinFilter: S.n, brakeFluid: S.n, sparkPlugs: S.n, gearboxOil: S.n, differential: S.n, coolant: S.n, classification: "دوري" },
    { km: "60K", ab: "B", cabinFilter: S.i, brakeFluid: S.v, sparkPlugs: S.i, gearboxOil: S.i, differential: S.v, coolant: S.n, classification: "شاملة" },
    { km: "75K", ab: "A", cabinFilter: S.n, brakeFluid: S.n, sparkPlugs: S.n, gearboxOil: S.n, differential: S.n, coolant: S.n, classification: "دوري" },
    { km: "90K", ab: "B", cabinFilter: S.i, brakeFluid: S.v, sparkPlugs: S.n, gearboxOil: S.n, differential: S.v, coolant: S.n, classification: "شاملة" },
    { km: "105K", ab: "A", cabinFilter: S.n, brakeFluid: S.n, sparkPlugs: S.n, gearboxOil: S.n, differential: S.n, coolant: S.n, classification: "دوري" },
    { km: "120K", ab: "B", cabinFilter: S.i, brakeFluid: S.v, sparkPlugs: S.i, gearboxOil: S.i, differential: S.v, coolant: S.n, classification: "شاملة" },
    { km: "150K", ab: "B", cabinFilter: S.i, brakeFluid: S.v, sparkPlugs: S.n, gearboxOil: S.n, differential: S.v, coolant: S.m, classification: "شاملة" },
  ],
  S63_AMG: [
    { km: "15K", ab: "A", cabinFilter: S.n, brakeFluid: S.n, sparkPlugs: S.n, gearboxOil: S.n, differential: S.n, coolant: S.n, classification: "دوري" },
    { km: "30K", ab: "B", cabinFilter: S.i, brakeFluid: S.v, sparkPlugs: S.n, gearboxOil: S.n, differential: S.n, coolant: S.n, classification: "دوري" },
    { km: "45K", ab: "A", cabinFilter: S.v, brakeFluid: S.v, sparkPlugs: S.v, gearboxOil: S.v, differential: S.v, coolant: S.v, classification: "شاملة AMG" },
    { km: "60K", ab: "B", cabinFilter: S.i, brakeFluid: S.v, sparkPlugs: S.i, gearboxOil: S.i, differential: S.v, coolant: S.n, classification: "شاملة" },
    { km: "90K", ab: "B", cabinFilter: S.i, brakeFluid: S.v, sparkPlugs: S.v, gearboxOil: S.v, differential: S.v, coolant: S.v, classification: "شاملة" },
    { km: "120K", ab: "B", cabinFilter: S.i, brakeFluid: S.v, sparkPlugs: S.i, gearboxOil: S.i, differential: S.v, coolant: S.v, classification: "شاملة" },
    { km: "150K", ab: "B", cabinFilter: S.i, brakeFluid: S.v, sparkPlugs: S.v, gearboxOil: S.v, differential: S.v, coolant: S.m, classification: "شاملة" },
  ],
};

export function renderDueStatus(status: DueStatus): { text: string; color: string } {
  switch (status) {
    case "included":
      return { text: "مشمول", color: "#22c55e" };
    case "vin_check":
      return { text: "ضمن B عند الاستحقاق", color: "var(--lz-chrome-2)" };
    case "milestone_due":
      return { text: "عند الاستحقاق", color: "#f59e0b" };
    case "not_included":
      return { text: "—", color: "var(--lz-text-3)" };
  }
}