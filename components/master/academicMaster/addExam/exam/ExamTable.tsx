  import React, { useState } from 'react';
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
  import { Filter, PlusCircle, FilePenLine, Trash2 ,Eye} from 'lucide-react';
  import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
  import { Button } from '@/components/ui/button';
  import { ExamUpdateSheetModal } from './UpdateSheetModel';
  import { ExamViewDialog } from './ExamViewDialoug';
  import { Exam } from './types';
  import { ExamCreationFormValues } from './types';


  interface ExamTableProps {
    exams: Exam[];
    onAddExam: () => void;
    onEditExam?: (examId: number) => void;
    onDeleteExam?: (examId: number) => void;
  }

  const ExamTable: React.FC<ExamTableProps> = ({ 
    exams, 
    onAddExam,
    onEditExam,
    onDeleteExam 
  }) => {
    const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    };

    const handleEditClick = (exam: Exam) => {
      setSelectedExam(exam);
      setIsUpdateModalOpen(true);
      console.log(exam);
      
    };

    const handleUpdateClose = () => {
      setIsUpdateModalOpen(false);
      setSelectedExam(null);
    };

    const handleExamUpdated = async (updatedExam: ExamCreationFormValues) => {
      if (onEditExam && selectedExam) {
        await onEditExam(selectedExam.id);
      }
      handleUpdateClose();
      console.log(updatedExam);
      
    };

    return (
      <>
        <Card className="mt-6 bg-white shadow-md rounded-lg overflow-hidden">
          <CardHeader className="bg-custom-blue-500 rounded-tl-lg rounded-tr-lg">
            <div className='flex justify-between'>
              <div>
                <CardTitle className="text-xl font-semibold text-custom-red-600">
                  Exam List: <span className="text-lg text-black">{exams.length}</span>
                </CardTitle>
                <p className="text-muted-foreground text-sm mt-1">Total exams listed</p>
              </div>
              <div>
                <Button
                  onClick={onAddExam}
                  className="bg-custom-pink-500 text-white bg-custom-pink-300 hover:bg-custom-red-600"
                >
                  <PlusCircle className="h-5 w-5 mr-2" />
                  Add Exam
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="px-6 py-4">
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader className="bg-custom-pink-300">
                  <TableRow>
                    <TableHead className="text-white">S.No</TableHead>
                    <TableHead className="text-white">Exam Name</TableHead>
                    <TableHead className="text-white">Branch</TableHead>
                    <TableHead className="text-white">Class</TableHead>
                    <TableHead className="text-white">Section</TableHead>
                    <TableHead className="text-white">Start Date</TableHead>
                    <TableHead className="text-white">End Date</TableHead>
                    <TableHead className="text-white">Subjects</TableHead>
                    <TableHead className="text-white">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {exams.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2 text-gray-500">
                          <Filter className="h-8 w-8" />
                          <p>No exams found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    exams.map((exam, index) => (
                      <TableRow key={exam.id} className="hover:bg-gray-50 transition-all duration-300">
                        <TableCell className="py-3">{index + 1}</TableCell>
                        <TableCell className="py-3">{exam.name}</TableCell>
                        <TableCell className="py-3">{exam.branch.name}</TableCell>
                        <TableCell className="py-3">{exam.class.name}</TableCell>
                        <TableCell className="py-3">{exam.section.name}</TableCell>
                        <TableCell className="py-3">{formatDate(exam.startDate)}</TableCell>
                        <TableCell className="py-3">{formatDate(exam.endDate)}</TableCell>
                        <TableCell className="py-3">
                          {exam.subjects.map(subject => subject.name).join(', ')}
                        </TableCell>
                        <TableCell className="py-3">
                          <div className="flex gap-2">
                            {/* update button */}
                            <button 
                              className="p-2 rounded-full hover:bg-blue-50 transition-all duration-300"
                              onClick={() => handleEditClick(exam)}
                              
                            >
                              <FilePenLine className="h-4 w-4 text-blue-600" />
                            </button>
                            <button 
                              className="p-2 rounded-full hover:bg-red-50 transition-all duration-300"
                              onClick={() => onDeleteExam?.(exam.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </button>
                            
                            <button 
                              className="p-2 rounded-full hover:bg-red-50 transition-all duration-300"
                              onClick={() => {
                                setSelectedExam(exam);
                                setIsViewModalOpen(true);
                              }}
                              
                            >
                              <Eye className="h-4 w-4 text-red-600" />
                            </button>
                            
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Update Modal */}
        <ExamUpdateSheetModal
          isOpen={isUpdateModalOpen}
          onClose={handleUpdateClose}
          examData={selectedExam}
          onExamUpdated={handleExamUpdated}
        />

  <ExamViewDialog
    isOpen={isViewModalOpen}
    onClose={() => {
      setIsViewModalOpen(false);
      setSelectedExam(null);
    }}
    examData={selectedExam}
  />
      </>
    );
  };

  export default ExamTable;