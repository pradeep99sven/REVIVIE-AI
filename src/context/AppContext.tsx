import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  WasteOrder,
  DroneCapture,
  CollectionItem,
  InspectionRecord,
  RecoveryOrder,
  ReportItem,
  CollectionWorker,
  AppNotification,
  OEMDocument,
  OrderStatus,
} from '../types';
import {
  INITIAL_ORDERS,
  INITIAL_DRONE_CAPTURES,
  INITIAL_COLLECTIONS,
  INITIAL_INSPECTIONS,
  INITIAL_RECOVERY_ORDERS,
  INITIAL_REPORTS,
  INITIAL_WORKERS,
  INITIAL_NOTIFICATIONS,
  INITIAL_DOCUMENTS,
} from '../data/mockData';

export type AdminView =
  | 'dashboard'
  | 'drone_captures'
  | 'map'
  | 'received_orders'
  | 'collection'
  | 'inspection'
  | 'recovery'
  | 'reports'
  | 'settings';

interface AppSettings {
  repairIntelligenceEnabled: boolean;
  modelVersion: string;
  confidenceThreshold: number;
  showStepByStepGuide: boolean;
  includePartsCompatibility: boolean;
  allowAlternativeMethods: boolean;
  maxSuggestionsPerItem: number;
  analysisDepth: 'Standard' | 'Detailed';
  decisionTimeEnabled: boolean;
  orderApprovalTimeMinutes: number;
  collectionAssignmentTimeMinutes: number;
  recoveryConfirmationTimeMinutes: number;
  autoCancelPendingOrders: boolean;
  notifyManagerEmail: boolean;
  sendReminderBeforeTimeout: boolean;
  language: string;
}

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentView: AdminView;
  setCurrentView: (view: AdminView) => void;
  isLandingPage: boolean;
  setIsLandingPage: (val: boolean) => void;
  orders: WasteOrder[];
  droneCaptures: DroneCapture[];
  collections: CollectionItem[];
  inspections: InspectionRecord[];
  recoveryOrders: RecoveryOrder[];
  reports: ReportItem[];
  workers: CollectionWorker[];
  notifications: AppNotification[];
  documents: OEMDocument[];
  settings: AppSettings;
  systemOnline: boolean;
  setSystemOnline: (val: boolean) => void;

  // Actions
  addNewOrder: (order: Partial<WasteOrder>) => WasteOrder;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  assignWorkerToOrder: (orderId: string, workerId: string) => void;
  markRecoveryCompleted: (id: string) => void;
  addNewInspection: (record: Partial<InspectionRecord>) => void;
  addNewDroneCapture: (capture: Partial<DroneCapture>) => void;
  addOEMDocument: (doc: Partial<OEMDocument>) => void;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  markNotificationAsRead: (id: string) => void;
}

const DEFAULT_SETTINGS: AppSettings = {
  repairIntelligenceEnabled: true,
  modelVersion: 'ReVive-R1 (Recommended)',
  confidenceThreshold: 75,
  showStepByStepGuide: true,
  includePartsCompatibility: true,
  allowAlternativeMethods: true,
  maxSuggestionsPerItem: 5,
  analysisDepth: 'Detailed',
  decisionTimeEnabled: true,
  orderApprovalTimeMinutes: 30,
  collectionAssignmentTimeMinutes: 60,
  recoveryConfirmationTimeMinutes: 90,
  autoCancelPendingOrders: true,
  notifyManagerEmail: true,
  sendReminderBeforeTimeout: true,
  language: 'English',
};

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('admin');
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');
  const [isLandingPage, setIsLandingPage] = useState<boolean>(false);
  const [systemOnline, setSystemOnline] = useState<boolean>(true);

  // Data collections with local storage persistence
  const [orders, setOrders] = useState<WasteOrder[]>(() => {
    const saved = localStorage.getItem('revive_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [droneCaptures, setDroneCaptures] = useState<DroneCapture[]>(() => {
    const saved = localStorage.getItem('revive_drone_captures');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as DroneCapture[];
        return parsed.map((item) => {
          const defaultMatch = INITIAL_DRONE_CAPTURES.find((d) => d.id === item.id);
          if (defaultMatch) {
            return {
              ...item,
              imageUrl: defaultMatch.imageUrl,
              hasBakedDetections: defaultMatch.hasBakedDetections,
            };
          }
          return item;
        });
      } catch {
        return INITIAL_DRONE_CAPTURES;
      }
    }
    return INITIAL_DRONE_CAPTURES;
  });

  const [collections, setCollections] = useState<CollectionItem[]>(() => {
    const saved = localStorage.getItem('revive_collections');
    return saved ? JSON.parse(saved) : INITIAL_COLLECTIONS;
  });

  const [inspections, setInspections] = useState<InspectionRecord[]>(() => {
    const saved = localStorage.getItem('revive_inspections');
    return saved ? JSON.parse(saved) : INITIAL_INSPECTIONS;
  });

  const [recoveryOrders, setRecoveryOrders] = useState<RecoveryOrder[]>(() => {
    const saved = localStorage.getItem('revive_recovery');
    return saved ? JSON.parse(saved) : INITIAL_RECOVERY_ORDERS;
  });

  const [reports, setReports] = useState<ReportItem[]>(() => {
    const saved = localStorage.getItem('revive_reports');
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  const [workers, setWorkers] = useState<CollectionWorker[]>(() => {
    const saved = localStorage.getItem('revive_workers');
    return saved ? JSON.parse(saved) : INITIAL_WORKERS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('revive_notifs');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [documents, setDocuments] = useState<OEMDocument[]>(() => {
    const saved = localStorage.getItem('revive_oem_docs');
    return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('revive_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('revive_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('revive_drone_captures', JSON.stringify(droneCaptures));
  }, [droneCaptures]);

  useEffect(() => {
    localStorage.setItem('revive_collections', JSON.stringify(collections));
  }, [collections]);

  useEffect(() => {
    localStorage.setItem('revive_inspections', JSON.stringify(inspections));
  }, [inspections]);

  useEffect(() => {
    localStorage.setItem('revive_recovery', JSON.stringify(recoveryOrders));
  }, [recoveryOrders]);

  useEffect(() => {
    localStorage.setItem('revive_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('revive_workers', JSON.stringify(workers));
  }, [workers]);

  useEffect(() => {
    localStorage.setItem('revive_notifs', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('revive_oem_docs', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('revive_settings', JSON.stringify(settings));
  }, [settings]);

  // Actions
  const addNewOrder = (data: Partial<WasteOrder>): WasteOrder => {
    const newId = `ORD-00${orders.length + 1}`;
    const newOrder: WasteOrder = {
      id: newId,
      trackingNumber: newId,
      type: data.type || 'citizen',
      title: data.title || 'Reported Electronic Waste',
      requestedBy: data.requestedBy || 'Citizen Contributor',
      userType: 'Citizen Request',
      contact: data.contact || '+91 98765 00000',
      location: data.location || 'Central Sector, City Zone',
      zone: data.zone || 'Central Zone',
      lat: data.lat || 8.5241,
      lng: data.lng || 76.9366,
      date: 'Just Now',
      status: 'Pending',
      imageUrl: data.imageUrl || '/assets/aistudio/WhatsApp_Image_2026-10-31_at_1.09.02_PM_1__74fa3367.jpeg',
      imageCount: data.imageCount || 1,
      description: data.description || 'Electronic gadgets submitted for recycling.',
      estimatedWeightKg: data.estimatedWeightKg || 30,
      itemsDetected: data.itemsDetected || [],
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Add alert notification
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'New Citizen Request',
      message: `${newOrder.requestedBy} submitted ${newOrder.id} (${newOrder.location}).`,
      time: 'Just now',
      read: false,
      type: 'order',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return newOrder;
  };

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === id ? { ...ord, status } : ord))
    );
  };

  const assignWorkerToOrder = (orderId: string, workerId: string) => {
    const worker = workers.find((w) => w.id === workerId);
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? {
              ...ord,
              status: 'Assigned',
              assignedWorkerId: workerId,
              assignedWorkerName: worker ? worker.name : workerId,
            }
          : ord
      )
    );

    setWorkers((prev) =>
      prev.map((w) =>
        w.id === workerId
          ? { ...w, status: 'On Mission', currentActiveOrderId: orderId }
          : w
      )
    );

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Collection Worker Assigned',
      message: `${worker?.name || workerId} assigned to ${orderId}.`,
      time: 'Just now',
      read: false,
      type: 'order',
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const markRecoveryCompleted = (id: string) => {
    setRecoveryOrders((prev) =>
      prev.map((rec) =>
        rec.id === id
          ? { ...rec, status: 'Recovered', recoveredOn: 'Just now' }
          : rec
      )
    );
  };

  const addNewInspection = (record: Partial<InspectionRecord>) => {
    const newId = `INSP-00${inspections.length + 1}`;
    const newInsp: InspectionRecord = {
      id: newId,
      collectionId: record.collectionId || 'COL-001',
      location: record.location || 'Processing Facility',
      date: 'Just now',
      status: record.status || 'Durable',
      resultDescription: record.resultDescription || 'Material inspected and approved.',
      imageUrl: record.imageUrl || '/assets/aistudio/ReVive_AI_Inspection_Dashboard_df6b18c3.png',
      summary: record.summary || {
        metalScrapKg: 60,
        plasticKg: 40,
        aluminiumKg: 20,
        cardboardKg: 10,
        ewasteKg: 30,
      },
      inspectorNotes: record.inspectorNotes || 'Standard triage passed.',
      inspectorName: record.inspectorName || 'Facility Officer',
    };
    setInspections((prev) => [newInsp, ...prev]);
  };

  const addNewDroneCapture = (capture: Partial<DroneCapture>) => {
    const newId = `D-00${droneCaptures.length + 1}`;
    const newCap: DroneCapture = {
      id: newId,
      droneName: capture.droneName || 'Drone Survey 1',
      locationName: capture.locationName || 'Dump Site Sector',
      sector: capture.sector || 'North-West Sector',
      lat: capture.lat || 8.7392,
      lng: capture.lng || 77.7412,
      captureTime: 'Just now',
      resolution: capture.resolution || '3840 × 2160',
      altitude: capture.altitude || 40,
      direction: capture.direction || 'North-West',
      fileSize: capture.fileSize || '2.9 MB',
      imageUrl: capture.imageUrl || '/assets/aistudio/drone_1_photo_exact.jpeg',
      notes: capture.notes || 'Automated aerial survey detected electronic debris.',
      isVerified: true,
      detections: capture.detections || [],
    };
    setDroneCaptures((prev) => [newCap, ...prev]);
  };

  const addOEMDocument = (doc: Partial<OEMDocument>) => {
    const newId = `DOC-00${documents.length + 1}`;
    const newDoc: OEMDocument = {
      id: newId,
      title: doc.title || 'Technical Spec',
      brand: doc.brand || 'Generic',
      model: doc.model || 'Universal',
      category: doc.category || 'Manuals',
      fileSize: doc.fileSize || '2.4 MB',
      uploadedAt: 'Today',
      downloadUrl: doc.downloadUrl,
    };
    setDocuments((prev) => [newDoc, ...prev]);
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        currentView,
        setCurrentView,
        isLandingPage,
        setIsLandingPage,
        orders,
        droneCaptures,
        collections,
        inspections,
        recoveryOrders,
        reports,
        workers,
        notifications,
        documents,
        settings,
        systemOnline,
        setSystemOnline,
        addNewOrder,
        updateOrderStatus,
        assignWorkerToOrder,
        markRecoveryCompleted,
        addNewInspection,
        addNewDroneCapture,
        addOEMDocument,
        updateSettings,
        markNotificationAsRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
