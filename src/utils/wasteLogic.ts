import { WasteOrder, CollectionWorker, DurabilityStatus, BoundingBox } from '../types';

/**
 * Calculate geographical distance in kilometers using the Haversine formula
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Score and rank candidate collection workers for smart dispatch
 * Considers availability, vehicle capacity versus waste weight, and distance
 */
export function rankWorkersForOrder(
  order: WasteOrder,
  workers: CollectionWorker[]
): { worker: CollectionWorker; distanceKm: number; score: number; eligible: boolean }[] {
  const estimatedWeight = order.estimatedWeightKg || 50;

  return workers
    .map((worker) => {
      const distance = calculateDistanceKm(
        order.lat,
        order.lng,
        worker.currentLat,
        worker.currentLng
      );

      const hasCapacity = worker.vehicleCapacityKg >= estimatedWeight;
      const isAvailable = worker.status === 'Available';
      const eligible = isAvailable && hasCapacity;

      // Lower score is better (priority ranking)
      // Base score is distance, penalized if not available or under capacity
      let score = distance;
      if (!isAvailable) score += 1000;
      if (!hasCapacity) score += 500;

      return {
        worker,
        distanceKm: distance,
        score,
        eligible,
      };
    })
    .sort((a, b) => a.score - b.score);
}

/**
 * Evaluate material recoverability based on inspection results
 */
export function evaluateRecoverability(
  status: DurabilityStatus,
  detectedItems: BoundingBox[] = []
): { recommendation: string; circularValueScore: number; suitableForRefurbish: boolean } {
  const containsHighValue = detectedItems.some(
    (item) => item.category === 'laptop' || item.category === 'circuit_board' || item.category === 'mobile_phone'
  );

  switch (status) {
    case 'Durable':
      return {
        recommendation: containsHighValue
          ? 'Route to component harvesting and circuit testing for direct reuse'
          : 'Clean and sort for industrial re-melting and raw material extraction',
        circularValueScore: containsHighValue ? 95 : 82,
        suitableForRefurbish: containsHighValue,
      };
    case 'Repairable':
      return {
        recommendation: 'Send to certified OEM refurbishing bench for diagnostic testing',
        circularValueScore: 88,
        suitableForRefurbish: true,
      };
    case 'Recyclable':
      return {
        recommendation: 'Shred and segregate into ferrous, copper, and polymer streams',
        circularValueScore: 68,
        suitableForRefurbish: false,
      };
    case 'Hazardous':
      return {
        recommendation: 'Requires specialized hazardous neutralisation protocol (batteries/mercury)',
        circularValueScore: 35,
        suitableForRefurbish: false,
      };
    case 'Pending':
    default:
      return {
        recommendation: 'Under primary intake triage. Awaiting manual bench verification.',
        circularValueScore: 50,
        suitableForRefurbish: false,
      };
  }
}

/**
 * Aggregate recovery weight summaries
 */
export function aggregateRecoveryStats(items: { itemsRecoveredKg: number; breakdown: { metalKg: number; plasticKg: number; ewasteKg: number } }[]) {
  const totals = items.reduce(
    (acc, cur) => {
      acc.totalKg += cur.itemsRecoveredKg;
      acc.metalKg += cur.breakdown.metalKg;
      acc.plasticKg += cur.breakdown.plasticKg;
      acc.ewasteKg += cur.breakdown.ewasteKg;
      return acc;
    },
    { totalKg: 0, metalKg: 0, plasticKg: 0, ewasteKg: 0 }
  );

  const recoveryRate = totals.totalKg > 0 ? 78 : 0; // standard recovery efficiency benchmark

  return {
    ...totals,
    recoveryRate,
    percentages: {
      ewaste: totals.totalKg > 0 ? Math.round((totals.ewasteKg / totals.totalKg) * 100) : 45,
      plastic: totals.totalKg > 0 ? Math.round((totals.plasticKg / totals.totalKg) * 100) : 35,
      metal: totals.totalKg > 0 ? Math.round((totals.metalKg / totals.totalKg) * 100) : 20,
    },
  };
}

/**
 * Formats coordinates for high precision display matching screenshot
 */
export function formatCoordinates(lat: number, lng: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lng).toFixed(4)}° ${lngDir}`;
}
