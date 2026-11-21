import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownRight, ArrowUpRight, UserX2, Users, Activity, TrendingUp, Box } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

// Define the type for the data of each stat
interface StatData {
  boys: number;
  girls: number;
}

// Define the type for each stat object
export interface Stat {
  title: string;
  value: string | number;
  change: string;
  trend: "up" | "down"; // Only allow "up" or "down"
  data?: Record<string, StatData>; // Data for the details modal
}

interface StatsProps {
  stats: Stat[];
}

export const StudentStats: React.FC<StatsProps> = ({ stats }) => {
  const [selectedStat, setSelectedStat] = useState<Stat | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [animationClass, setAnimationClass] = useState("");

  const handleCardClick = (stat: Stat) => {
    setSelectedStat(stat);
    setIsModalOpen(true);
    setAnimationClass("animate-in");
    console.log(stat);
    
  };

  console.log(animationClass);

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStat(null);
  };

  const getCardColor = (index: number) => {
    const colors = [
      'from-cyan-500 via-blue-500 to-purple-500',
      'from-emerald-500 via-teal-500 to-cyan-500',
      'from-fuchsia-500 via-rose-500 to-orange-500',
      'from-amber-500 via-orange-500 to-red-500',
      'from-violet-500 via-purple-500 to-fuchsia-500'
    ];
    return colors[index % colors.length];
  };

  const getIcon = (title: string, index: number) => {
    const icons = [
      <Users key="users" className="h-6 w-6 text-white" />,
      <TrendingUp key="trending-up" className="h-6 w-6 text-white" />,
      <Activity key="activity" className="h-6 w-6 text-white" />,  
      <Box key="box" className="h-6 w-6 text-white" />,
      <UserX2 key="user-x2" className="h-6 w-6 text-white" />
    ];
    return icons[index % icons.length];
  };
  

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-6 bg-gray-50">
      {stats.map((stat, index) => (
        <Card
          key={index} // Key added for each Card component
          className="group relative overflow-hidden rounded-xl hover:scale-105 transition-all duration-500 cursor-pointer bg-white"
          onClick={() => handleCardClick(stat)}
        >
          {/* Animated background gradient */}
          <div 
            className={`absolute inset-0 bg-gradient-to-br ${getCardColor(index)} opacity-10 
            group-hover:opacity-20 transition-opacity duration-500`}
          />
          
          {/* Floating circles decoration */}
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-white/10 to-white/5 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
          <div className="absolute -left-4 -bottom-4 w-20 h-20 bg-gradient-to-br from-white/10 to-white/5 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />

          <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
            <CardTitle className="text-sm font-medium flex items-center gap-3">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${getCardColor(index)} shadow-lg 
                group-hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-1`}>
                {getIcon(stat.title, index)}
              </div>
              <span className="font-bold text-gray-800 text-lg">{stat.title}</span>
            </CardTitle>
            <div className="transform transition-all duration-500 group-hover:scale-125">
              {stat.trend === "up" ? (
                <ArrowUpRight className="h-6 w-6 text-green-500" />
              ) : (
                <ArrowDownRight className="h-6 w-6 text-rose-500" />
              )}
            </div>
          </CardHeader>
          
          <CardContent className="relative z-10">
            <div className="text-4xl font-bold text-gray-800 mb-2 transform transition-all duration-500 group-hover:translate-x-2">
              {stat.value}
            </div>
            <p className="text-sm text-gray-600 flex items-center gap-2 font-medium">
              <span className={`inline-block w-2 h-2 rounded-full ${
                stat.trend === "up" ? "bg-green-500" : "bg-rose-500"
              }`} />
              {stat.change}
            </p>
          </CardContent>
        </Card>
      ))}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl overflow-hidden rounded-2xl p-0 bg-white shadow-2xl">
          {/* Animated gradient header */}
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-transparent opacity-20 animate-pulse" />
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse" />
            <DialogHeader className="relative z-10">
              <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-white">
                <span className="flex gap-2 items-center">
                  <span className="inline-block w-3 h-3 rounded-full bg-white animate-ping" />
                  <span className="inline-block w-3 h-3 rounded-full bg-white/80" />
                </span>
                {selectedStat?.title} Details
              </DialogTitle>
            </DialogHeader>
          </div>

          {selectedStat && selectedStat.data && (
            <div className="p-8">
              <div className="mt-2 max-h-96 overflow-y-auto rounded-xl border shadow-xl bg-white/50 backdrop-blur-sm">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-purple-50 to-pink-50">
                      <TableHead className="text-base font-bold text-gray-800 py-4">Class</TableHead>
                      <TableHead className="text-base font-bold text-gray-800 py-4">Boys</TableHead>
                      <TableHead className="text-base font-bold text-gray-800 py-4">Girls</TableHead>
                      <TableHead className="text-base font-bold text-gray-800 py-4">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(selectedStat.data).map(([className, data]: [string, StatData]) => {
                      const total = data.boys + data.girls;
                      return (
                        <TableRow 
                          key={className} // Key added here to resolve the error
                          className="hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-pink-50/50 
                          transition-colors duration-300 group/row"
                        >
                          <TableCell className="font-semibold text-gray-700 group-hover/row:text-gray-900 transition-colors duration-300">
                            {className}
                          </TableCell>
                          <TableCell className="group-hover/row:scale-105 transition-transform duration-300">
                            {data.boys}
                          </TableCell>
                          <TableCell className="group-hover/row:scale-105 transition-transform duration-300">
                            {data.girls}
                          </TableCell>
                          <TableCell className="font-bold text-gray-800 group-hover/row:scale-105 transition-transform duration-300">
                            {total}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              
              <div className="mt-8 flex justify-end">
                <Button 
                  onClick={closeModal}
                  className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
                  hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 
                  text-white px-8 py-3 rounded-xl text-lg font-semibold
                  transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
