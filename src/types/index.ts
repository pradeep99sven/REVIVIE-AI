export type UserRole = 'admin' | 'citizen' | 'collector' | 'drone_operator';

export type WasteCategory =
  | 'laptop'
  | 'mobile_phone'
  | 'desktop_pc'
  | 'circuit_board'
  | 'cable'
  | 'keyboard'
  | 'monitor'
  | 'printer'
  | 'battery'
  | 'mixed_ewaste'
  | 'large_appliance';

export type OrderStatus =
  | 'Pending'
  | 'Accepted'
  | 'Assigned'
  | 'Collecting'
  | 'Collected'
  | 'Completed'
  | 'Cancelled';

export type DurabilityStatus = 'Durable' | 'Repairable' | 'Recyclable' | 'Hazardous' | 'Pending';

export interface BoundingBox {
  id: string;
  category: WasteCategory | string;
  label: string;
  confidence: number;
  x: number; // percentage 0-100
  y: number;
  width: number;
  height: number;
  color?: string;
}

export interface WasteOrder {
  id: string;
  trackingNumber: string;
  type: 'citizen' | 'dump_site';
  title: string;
  requestedBy: string;
  userType: string;
  contact: string;
  location: string;
  zone: string;
  lat: number;
  lng: number;
  date: string;
  status: OrderStatus;
  imageUrl: string;
  imageCount: number;
  description: string;
  estimatedWeightKg?: number;
  assignedWorkerId?: string;
  assignedWorkerName?: string;
  itemsDetected?: BoundingBox[];
}

export interface DroneCapture {
  id: string;
  droneName: string;
  locationName: string;
  sector: string;
  lat: number;
  lng: number;
  captureTime: string;
  resolution: string;
  altitude: number; // in meters
  direction: string;
  imageUrl: string;
  fileSize: string;
  detections: BoundingBox[];
  notes: string;
  isVerified?: boolean;
  hasBakedDetections?: boolean;
}

export interface CollectionItem {
  id: string;
  title: string;
  location: string;
  date: string;
  status: 'Collected' | 'In Progress' | 'Scheduled';
  type: string;
  weightKg: number;
  collectedBy: string;
  notes: string;
  imageUrl: string;
  partsList?: { item: string; partNumber: string; quantity: number }[];
  technicalSheetUrl?: string;
}

export interface InspectionRecord {
  id: string;
  collectionId: string;
  location: string;
  date: string;
  status: DurabilityStatus;
  resultDescription: string;
  imageUrl: string;
  summary: {
    metalScrapKg: number;
    plasticKg: number;
    aluminiumKg: number;
    cardboardKg: number;
    ewasteKg?: number;
  };
  inspectorNotes: string;
  inspectorName: string;
}

export interface RecoveryOrder {
  id: string;
  location: string;
  recoveredOn: string;
  recoveredBy: string;
  status: 'Recovered' | 'Pending' | 'In Transit';
  lat: number;
  lng: number;
  distanceKm: number;
  estMinutes: number;
  imageUrl: string;
  itemsRecoveredKg: number;
  breakdown: {
    metalKg: number;
    plasticKg: number;
    ewasteKg: number;
    otherKg?: number;
  };
}

export interface ReportItem {
  id: string;
  orderId: string;
  requestType: string;
  requestedBy: string;
  userEmail: string;
  location: string;
  date: string;
  status: 'Completed' | 'In Progress' | 'Under Review';
  imageUrl: string;
  reportDetails: {
    status: string;
    notes: string;
    pickupNotes: string;
    summary: string;
  };
}

export interface CollectionWorker {
  id: string;
  name: string;
  phone: string;
  status: 'Available' | 'On Mission' | 'Offline';
  vehicleType: string;
  vehicleCapacityKg: number;
  currentLat: number;
  currentLng: number;
  currentActiveOrderId?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'order' | 'drone' | 'inspection' | 'recovery';
}

export interface OEMDocument {
  id: string;
  title: string;
  brand: string;
  model: string;
  category: 'Manuals' | 'Guides' | 'Specifications' | 'Other';
  fileSize: string;
  uploadedAt: string;
  downloadUrl?: string;
}
