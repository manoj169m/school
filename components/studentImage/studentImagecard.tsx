import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { StudentCardProps } from "@/types/image/image";
import Image from "next/image";

export const StudentCard = ({ student, onImageUpdate }: StudentCardProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
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

      const response = await fetch("/api/image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Upload failed");
      }

      onImageUpdate(student.id, data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <Card className="relative overflow-hidden bg-white dark:bg-gray-800">
        <CardContent className="relative pt-6 px-4 pb-4">
          <div className="flex flex-col items-center">
            <div className="relative group mb-4">
              <div className="w-32 h-32 rounded-lg overflow-hidden ring-2 ring-gray-200 dark:ring-gray-700">
                {student.imageUrl ? (
                  <Image
                    src={student.imageUrl}
                    alt={`${student.firstName} ${student.lastName}`}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
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

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-red-500 text-sm mb-2 text-center"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {student.firstName} {student.lastName}
            </h3>

            <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              {student.admissionNo} · Roll No: {student.rollNo}
            </div>

            <div className="w-full space-y-2 text-sm">
              <div className="flex justify-between px-3 py-1.5 bg-gray-50 dark:bg-gray-700/50 rounded">
                <span className="text-gray-600 dark:text-gray-400">Class</span>
                <span className="font-medium">{student.className}</span>
              </div>
              <div className="flex justify-between px-3 py-1.5 bg-gray-50 dark:bg-gray-700/50 rounded">
                <span className="text-gray-600 dark:text-gray-400">
                  Section
                </span>
                <span className="font-medium">{student.sectionName}</span>
              </div>
              <div className="flex justify-between px-3 py-1.5 bg-gray-50 dark:bg-gray-700/50 rounded">
                <span className="text-gray-600 dark:text-gray-400">Branch</span>
                <span className="font-medium">{student.branchName}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
