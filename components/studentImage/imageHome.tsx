import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Student } from "@/types/image/image";

interface ImageHomeProps {
  initialStudents: Student[];
}

const StudentCard = ({ student, onImageUpdate }: { 
  student: Student; 
  onImageUpdate: (studentId: number, imageUrl: string) => void;
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError(null);

      if (!file.type.startsWith("image/")) {
        throw new Error("Please upload an image file");
      }

      if (file.size > 10 * 1024 * 1024) {
        throw new Error("File size must be less than 10MB");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("studentId", student.id.toString());
      formData.append("enrollmentId", student.enrollmentId.toString());

      const response = await fetch("/api/image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Upload failed");
      }

      onImageUpdate(student.id, data.url);
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : "Upload failed",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}  
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex flex-col items-center">
            <div className="relative group mb-4">
              <div className="w-32 h-32 rounded-lg overflow-hidden ring-2 ring-gray-200 dark:ring-gray-700">
                {student.imageUrl ? (
                  <motion.img
                    src={student.imageUrl}
                    alt={`${student.firstName} ${student.lastName}`}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <Upload className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-white" />
                  </div>
                )}
              </div>
              
              <label className="absolute inset-0 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={isUploading}
                />
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/70 text-white hover:bg-black/80"
                >
                  {student.imageUrl ? "Change" : "Upload"}
                </Button>
              </label>
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center mb-2">{error}</p>
            )}

            <h3 className="text-lg font-semibold mb-1">
              {student.firstName} {student.lastName}
            </h3>
            
            <p className="text-sm text-gray-500 mb-2">
              {student.admissionNo} · Roll No: {student.rollNo}
            </p>

            <div className="w-full space-y-1.5 text-sm">
              <div className="flex justify-between px-3 py-1 bg-gray-50 dark:bg-gray-800 rounded">
                <span className="text-gray-600 dark:text-gray-400">Class</span>
                <span>{student.className}</span>
              </div>
              <div className="flex justify-between px-3 py-1 bg-gray-50 dark:bg-gray-800 rounded">
                <span className="text-gray-600 dark:text-gray-400">Section</span>
                <span>{student.sectionName}</span>
              </div>
              <div className="flex justify-between px-3 py-1 bg-gray-50 dark:bg-gray-800 rounded">
                <span className="text-gray-600 dark:text-gray-400">Branch</span>
                <span>{student.branchName}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function ImageHome({ initialStudents }: ImageHomeProps) {
  const [students, setStudents] = useState<Student[]>(initialStudents);

  const handleImageUpdate = (studentId: number, imageUrl: string) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === studentId ? { ...student, imageUrl } : student
      )
    );
  };

  return (
    <div className="mt-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 text-center"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Student Directory
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {students.length} students found
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {students.map((student) => (
          <StudentCard
            key={student.id}
            student={student}
            onImageUpdate={handleImageUpdate}
          />
        ))}
      </div>

      {students.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No students found. Please select different criteria.
        </div>
      )}
    </div>
  );
}