// Central domain constants for the Shipping & Logistics system.
// Enums are stored as strings in the DB; these are the canonical values.

export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  OPERATIONS: "OPERATIONS",
  ACCOUNTS: "ACCOUNTS",
  SALES: "SALES",
  CUSTOMER_SUPPORT: "CUSTOMER_SUPPORT",
  READ_ONLY: "READ_ONLY",
} as const;
export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: "Super Admin",
  OPERATIONS: "Operations",
  ACCOUNTS: "Accounts",
  SALES: "Sales",
  CUSTOMER_SUPPORT: "Customer Support",
  READ_ONLY: "Read Only",
};

// -----------------------------------------------
// Shipment types
// -----------------------------------------------
export const SHIPMENT_TYPES = [
  "Vehicle",
  "Truck",
  "Container",
  "Household Goods",
  "Personal Effects",
  "Machinery",
  "Spare Parts",
  "General Cargo",
  "Custom",
] as const;

// -----------------------------------------------
// Shipment status pipeline (in visual order)
// -----------------------------------------------
export const STATUS_PIPELINE = [
  "ENQUIRY",
  "QUOTED",
  "BOOKED",
  "AWAITING_COLLECTION",
  "COLLECTED",
  "AT_WAREHOUSE",
  "READY_FOR_LOADING",
  "LOADED",
  "DEPARTED",
  "IN_TRANSIT",
  "ARRIVED_AT_PORT",
  "CUSTOMS_PROCESSING",
  "CUSTOMS_CLEARED",
  "READY_FOR_COLLECTION",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
] as const;

export const STATUS_TERMINAL = ["ON_HOLD", "CANCELLED"] as const;

export const ALL_STATUSES = [...STATUS_PIPELINE, ...STATUS_TERMINAL] as const;
export type ShipmentStatus = (typeof ALL_STATUSES)[number];

export const STATUS_LABELS: Record<ShipmentStatus, string> = {
  ENQUIRY: "Enquiry",
  QUOTED: "Quoted",
  BOOKED: "Booked",
  AWAITING_COLLECTION: "Awaiting Collection",
  COLLECTED: "Collected",
  AT_WAREHOUSE: "At Warehouse",
  READY_FOR_LOADING: "Ready for Loading",
  LOADED: "Loaded",
  DEPARTED: "Departed",
  IN_TRANSIT: "In Transit",
  ARRIVED_AT_PORT: "Arrived at Port",
  CUSTOMS_PROCESSING: "Customs Processing",
  CUSTOMS_CLEARED: "Customs Cleared",
  READY_FOR_COLLECTION: "Ready for Collection",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  ON_HOLD: "On Hold",
  CANCELLED: "Cancelled",
};

export const ACTIVE_NON_DELIVERED = [
  "ENQUIRY",
  "QUOTED",
  "BOOKED",
  "AWAITING_COLLECTION",
  "COLLECTED",
  "AT_WAREHOUSE",
  "READY_FOR_LOADING",
  "LOADED",
  "DEPARTED",
  "IN_TRANSIT",
  "ARRIVED_AT_PORT",
  "CUSTOMS_PROCESSING",
  "CUSTOMS_CLEARED",
  "READY_FOR_COLLECTION",
  "OUT_FOR_DELIVERY",
] as const;

export const IN_TRANSIT_STATUSES = [
  "DEPARTED",
  "IN_TRANSIT",
  "ARRIVED_AT_PORT",
  "CUSTOMS_PROCESSING",
] as const;

export const AWAITING_PAYMENT_STATUSES = ["UNPAID", "PARTIALLY_PAID"] as const;
export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  UNPAID: "Unpaid",
  PARTIALLY_PAID: "Partially Paid",
  PAID: "Paid",
};

// -----------------------------------------------
// Quote statuses
// -----------------------------------------------
export const QUOTE_STATUSES = [
  "DRAFT",
  "SENT",
  "VIEWED",
  "ACCEPTED",
  "REJECTED",
  "EXPIRED",
  "CONVERTED",
] as const;

// -----------------------------------------------
// Invoice statuses
// -----------------------------------------------
export const INVOICE_STATUSES = [
  "DRAFT",
  "SENT",
  "PARTIALLY_PAID",
  "PAID",
  "OVERDUE",
  "CANCELLED",
] as const;

// -----------------------------------------------
// Payment methods
// -----------------------------------------------
export const PAYMENT_METHODS = [
  "CASH",
  "BANK_TRANSFER",
  "ECOCASH",
  "CARD",
  "OTHER",
] as const;

// -----------------------------------------------
// Expense categories
// -----------------------------------------------
export const EXPENSE_CATEGORIES = [
  "FREIGHT",
  "COLLECTION",
  "PORT_CHARGES",
  "CUSTOMS",
  "CLEARING",
  "TRANSPORT",
  "FUEL",
  "STORAGE",
  "INSPECTION",
  "MECHANIC",
  "TOWING",
  "DRIVER",
  "ACCOMMODATION",
  "DOCUMENTATION",
  "OTHER",
] as const;

export const EXPENSE_CATEGORY_LABELS: Record<string, string> = {
  FREIGHT: "Freight",
  COLLECTION: "Collection",
  PORT_CHARGES: "Port Charges",
  CUSTOMS: "Customs",
  CLEARING: "Clearing",
  TRANSPORT: "Transport",
  FUEL: "Fuel",
  STORAGE: "Storage",
  INSPECTION: "Inspection",
  MECHANIC: "Mechanic",
  TOWING: "Towing",
  DRIVER: "Driver",
  ACCOMMODATION: "Accommodation",
  DOCUMENTATION: "Documentation",
  OTHER: "Other",
};

// -----------------------------------------------
// Document types
// -----------------------------------------------
export const DOCUMENT_TYPES = [
  "BILL_OF_LADING",
  "INVOICE",
  "PACKING_LIST",
  "EXPORT_DOCUMENTS",
  "CUSTOMS_DOCUMENTS",
  "INSPECTION_CERTIFICATE",
  "VEHICLE_DOCUMENTS",
  "PROOF_OF_PAYMENT",
  "PHOTOS",
  "OTHER",
] as const;

// -----------------------------------------------
// Customer types
// -----------------------------------------------
export const CUSTOMER_TYPES = [
  "INDIVIDUAL",
  "BUSINESS",
  "FREIGHT_FORWARDER",
  "NGO",
  "GOVERNMENT",
  "CHURCH",
  "ASSOCIATION",
] as const;

// -----------------------------------------------
// Activity actions
// -----------------------------------------------
export const ACTIVITY_ACTIONS = [
  "SHIPMENT_CREATED",
  "QUOTE_SENT",
  "QUOTE_ACCEPTED",
  "PAYMENT_RECORDED",
  "DOCUMENT_UPLOADED",
  "STATUS_UPDATED",
  "INVOICE_CREATED",
  "SHIPMENT_DELIVERED",
  "PORTAL_LOGIN",
  "CUSTOMER_CREATED",
  "EXPENSE_ADDED",
  "QUOTE_CREATED",
  "NOTE_ADDED",
] as const;

// -----------------------------------------------
// Notification types
// -----------------------------------------------
export const NOTIFICATION_TYPES = [
  "SHIPMENT_DEPARTED",
  "SHIPMENT_ARRIVED",
  "PAYMENT_RECEIVED",
  "BALANCE_REMINDER",
  "DOCUMENT_UPLOADED",
  "SHIPMENT_DELIVERED",
] as const;

// -----------------------------------------------
// Currencies
// -----------------------------------------------
export const CURRENCIES = ["USD", "GBP", "ZAR"] as const;
