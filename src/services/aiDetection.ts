import { BoundingBox } from '../types';

export interface DetectionResult {
  items: BoundingBox[];
  totalCount: number;
  categories: { name: string; count: number }[];
  summary: string;
  confidenceAverage: number;
  suggestedAction: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  laptop: '#2563eb', // blue
  phones: '#16a34a', // green
  cable: '#16a34a', // green
  keyboard: '#dc2626', // red
  circuit_board: '#9333ea', // purple
  monitor: '#3b82f6', // blue
  printer: '#ea580c', // orange
  battery: '#eab308', // yellow
  mixed_ewaste: '#059669', // emerald
};

export async function detectEWasteInImage(
  imageSource: string | File
): Promise<DetectionResult> {
  // Simulate computer vision latency (800ms) for realistic UX
  await new Promise((resolve) => setTimeout(resolve, 800));

  // If Gemini API is available on server/client:
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (apiKey && typeof imageSource !== 'string') {
      // Optional Gemini call could go here
    }
  } catch {
    // fallback gracefully
  }

  // Heuristic / Simulated Computer Vision analysis tailored to e-waste
  // If the image is one of the drone captures or ram or scrap, provide realistic labels
  const detectedItems: BoundingBox[] = [
    {
      id: 'det-1',
      category: 'laptop',
      label: 'laptop',
      confidence: 0.94,
      x: 38,
      y: 28,
      width: 18,
      height: 16,
      color: CATEGORY_COLORS.laptop,
    },
    {
      id: 'det-2',
      category: 'cable',
      label: 'cable bundle',
      confidence: 0.89,
      x: 58,
      y: 35,
      width: 16,
      height: 15,
      color: CATEGORY_COLORS.cable,
    },
    {
      id: 'det-3',
      category: 'keyboard',
      label: 'keyboard',
      confidence: 0.91,
      x: 42,
      y: 52,
      width: 22,
      height: 12,
      color: CATEGORY_COLORS.keyboard,
    },
    {
      id: 'det-4',
      category: 'circuit_board',
      label: 'circuit_board',
      confidence: 0.96,
      x: 62,
      y: 58,
      width: 20,
      height: 16,
      color: CATEGORY_COLORS.circuit_board,
    },
    {
      id: 'det-5',
      category: 'phones',
      label: 'mobile device',
      confidence: 0.88,
      x: 24,
      y: 48,
      width: 14,
      height: 14,
      color: CATEGORY_COLORS.phones,
    },
  ];

  const categoryMap = new Map<string, number>();
  let totalConf = 0;

  detectedItems.forEach((item) => {
    categoryMap.set(item.category, (categoryMap.get(item.category) || 0) + 1);
    totalConf += item.confidence;
  });

  const categories = Array.from(categoryMap.entries()).map(([name, count]) => ({
    name,
    count,
  }));

  return {
    items: detectedItems,
    totalCount: detectedItems.length,
    categories,
    summary: `Identified ${detectedItems.length} electronic components with high confidence. High concentration of recyclable circuit boards and recoverable metals.`,
    confidenceAverage: Math.round((totalConf / detectedItems.length) * 100),
    suggestedAction: 'Route to Sector North Collection Depot for component salvage.',
  };
}
