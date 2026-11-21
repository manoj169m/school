'use client';
import React, { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import ImageForm from "./studentImageUpload";
import ImageHome from "../imageHome";
import { formatQueryParams } from "@/lib/utils";
import { FormValues, Student } from "@/types/image/image";

const ImageTracker = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [students, setStudents] = useState<Student[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const simulateProgress = () => {
    setLoadingProgress(0);
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + 10;
      });
    }, 200);
    return () => clearInterval(interval);
  };

  const handleFormSubmit = async (formData: FormValues) => {
    setIsLoading(true);
    const cleanup = simulateProgress();

    try {
      const queryParams = formatQueryParams({
        academicYearId: formData.academicYearId,
        branchIds: formData.branchIds,
        classIds: formData.classIds,
        sectionIds: formData.sectionIds,
      });

      const response = await fetch(`/api/models/studentList?${queryParams}`);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch students: ${errorText}`);
      }

      const fetchedStudents: Student[] = await response.json();
      setStudents(fetchedStudents);

    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch data.",
      });
    } finally {
      cleanup();
      setLoadingProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        setLoadingProgress(0);
      }, 500);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="mx-auto px-4 py-8 space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Student Image Upload</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageForm onSubmit={handleFormSubmit} isLoading={isLoading} />

          {isLoading && (
            <div className="mt-4 space-y-2">
              <Progress value={loadingProgress} className="w-full" />
              <p className="text-sm text-gray-500 text-center">
                {loadingProgress < 100 ? "Processing..." : "Almost done..."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {students.length > 0 && (
        <ImageHome initialStudents={students} />
      )}
    </div>
  );
};

export default ImageTracker;