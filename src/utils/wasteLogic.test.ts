import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateDistanceKm,
  rankWorkersForOrder,
  evaluateRecoverability,
  aggregateRecoveryStats,
  formatCoordinates,
} from './wasteLogic';
import { WasteOrder, CollectionWorker } from '../types';

test('calculateDistanceKm returns accurate distance between points', () => {
  // Distance between Trivandrum center (~8.5241, 76.9366) and Tirunelveli (~8.7342, 77.7431) is ~91km
  const dist = calculateDistanceKm(8.5241, 76.9366, 8.7342, 77.7431);
  assert.ok(dist > 80 && dist < 110, `Expected around 90-100km, got ${dist}`);
});

test('rankWorkersForOrder prioritizes available workers with sufficient capacity', () => {
  const dummyOrder: WasteOrder = {
    id: 'ORD-001',
    trackingNumber: 'ORD-001',
    type: 'citizen',
    title: 'Discarded Electronics',
    requestedBy: 'User #4587',
    userType: 'Citizen',
    contact: '+91 98765 43210',
    location: 'North Zone, Trivandrum',
    zone: 'North Zone',
    lat: 8.52,
    lng: 76.94,
    date: 'Apr 26, 2025',
    status: 'Pending',
    imageUrl: '',
    imageCount: 1,
    description: 'Pile of waste',
    estimatedWeightKg: 80,
  };

  const workers: CollectionWorker[] = [
    {
      id: 'COL-101',
      name: 'Team Alpha',
      phone: '+91 98765 11111',
      status: 'Available',
      vehicleType: 'Electric Van',
      vehicleCapacityKg: 200,
      currentLat: 8.53, // very close ~1.5km
      currentLng: 76.95,
    },
    {
      id: 'COL-102',
      name: 'Team Beta',
      phone: '+91 98765 22222',
      status: 'On Mission', // unavailable
      vehicleType: 'Truck',
      vehicleCapacityKg: 500,
      currentLat: 8.521, // closest geographically, but busy!
      currentLng: 76.941,
    },
    {
      id: 'COL-103',
      name: 'Team Gamma',
      phone: '+91 98765 33333',
      status: 'Available',
      vehicleType: 'Motorbike Cart',
      vehicleCapacityKg: 40, // capacity too low for 80kg order
      currentLat: 8.525,
      currentLng: 76.945,
    },
  ];

  const ranked = rankWorkersForOrder(dummyOrder, workers);
  // Team Alpha should be top ranked because it is available and has capacity
  assert.equal(ranked[0].worker.id, 'COL-101');
  assert.equal(ranked[0].eligible, true);
  // Team Beta and Gamma should have penalties
  assert.equal(ranked.find((r) => r.worker.id === 'COL-102')?.eligible, false);
  assert.equal(ranked.find((r) => r.worker.id === 'COL-103')?.eligible, false);
});

test('evaluateRecoverability returns proper circular score and recommendation', () => {
  const durableResult = evaluateRecoverability('Durable', [
    { id: '1', category: 'laptop', label: 'laptop', confidence: 0.94, x: 10, y: 10, width: 20, height: 20 },
  ]);
  assert.equal(durableResult.circularValueScore, 95);
  assert.equal(durableResult.suitableForRefurbish, true);

  const hazardousResult = evaluateRecoverability('Hazardous', []);
  assert.equal(hazardousResult.suitableForRefurbish, false);
  assert.ok(hazardousResult.recommendation.includes('hazardous'));
});

test('aggregateRecoveryStats correctly calculates totals and percentages', () => {
  const recoveryRecords = [
    { itemsRecoveredKg: 20, breakdown: { metalKg: 10, plasticKg: 6, ewasteKg: 4 } },
    { itemsRecoveredKg: 30, breakdown: { metalKg: 15, plasticKg: 10, ewasteKg: 5 } },
  ];

  const stats = aggregateRecoveryStats(recoveryRecords);
  assert.equal(stats.totalKg, 50);
  assert.equal(stats.metalKg, 25);
  assert.equal(stats.plasticKg, 16);
  assert.equal(stats.ewasteKg, 9);
});

test('formatCoordinates returns formatted string with direction indicators', () => {
  const formatted = formatCoordinates(8.7342, 77.7431);
  assert.equal(formatted, '8.7342° N, 77.7431° E');
});
