import { Standard } from "../types/hostel";


export function getGradientColor(index: number): string {
  const colors = [
    "from-red-500 to-red-700",
    "from-blue-500 to-blue-700",
    "from-green-500 to-green-700",
    "from-purple-500 to-purple-700",
    "from-pink-500 to-pink-700",
    "from-indigo-500 to-indigo-700",
    "from-cyan-500 to-cyan-700",
    "from-teal-500 to-teal-700",
    "from-orange-500 to-orange-700",
    "from-rose-500 to-rose-700",
    "from-emerald-500 to-emerald-700",
  ];
  return colors[index % colors.length];
}

export function getOrdinalSuffix(i: number): string {
  const j = i % 10;
  const k = i % 100;
  if (j === 1 && k !== 11) return 'st';
  if (j === 2 && k !== 12) return 'nd';
  if (j === 3 && k !== 13) return 'rd';
  return 'th';
}

export function getStandards(): Standard[] {
  return Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: `${i + 1}${getOrdinalSuffix(i + 1)} Standard`,
    color: getGradientColor(i)
  }));
}