import {
  QrCode,
  MessageSquare,
  Calendar,
  MapPin,
  UserCheck,
} from "lucide-react";

export const cardsData = [
  {
    title: "QR Enrolled",
    icon: QrCode,
    color: "bg-green-100",
    gradient: "from-green-200 to-green-50",
    borderColor: "border-green-400",
    count: 120,
  },
  {
    title: "Enquired",
    icon: MessageSquare,
    color: "bg-gray-200",
    gradient: "from-gray-200 to-gray-100",
    borderColor: "border-pink-400",
    count: 62,
  },
  {
    title: "Exam Schedule",
    icon: Calendar,
    color: "bg-purple-100",
    gradient: "from-purple-200 to-purple-50",
    borderColor: "border-purple-400",
    count: 29,
  },
  {
    title: "In Campus",
    icon: MapPin,
    color: "bg-yellow-100",
    gradient: "from-yellow-200 to-yellow-50",
    borderColor: "border-yellow-400",
    count: 14,
  },
  {
    title: "Admitted",
    icon: UserCheck,
    color: "bg-blue-100",
    gradient: "from-blue-200 to-blue-50",
    borderColor: "border-blue-400",
    count: 15,
  },
];
