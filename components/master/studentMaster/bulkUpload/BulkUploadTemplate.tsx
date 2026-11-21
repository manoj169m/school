'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Download, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';

const columnMapping = {
    // Personal Information
    firstName: { display: "First Name*", sample: "John" },
    lastName: { display: "Last Name*", sample: "Doe" },
    gender: { display: "Gender* (MALE/FEMALE/OTHER)", sample: "MALE" },
    dateOfBirth: { display: "Date of Birth*", sample: "2000-01-01" },
    community: { display: "Community", sample: "General" },
    caste: { display: "Caste", sample: "General" },
    bloodGroup: { display: "Blood Group", sample: "O+" },
    motherTongue: { display: "Mother Tongue", sample: "English" },
    religion: { display: "Religion", sample: "Christian" },

    // Identification
    aadharNo: { display: "Aadhar Number", sample: "123456789012" },
    emisNo: { display: "EMIS Number", sample: "EMIS123" },
    placeOfBirth: { display: "Place of Birth", sample: "Chennai" },

    // Location
    country: { display: "Country*", sample: "India" },
    state: { display: "State*", sample: "Tamil Nadu" },
    cityTownVillage: { display: "City/Town/Village*", sample: "Chennai" },
    address: { display: "Address*", sample: "123 Main St" },

    // Contact
    communicationNo: { display: "Communication Number*", sample: "9876543210" },
    phoneNo: { display: "Phone Number*", sample: "9876543210" },
    email: { display: "Email", sample: "john.doe@example.com" },

    // Guardian Information
    relationName1: { display: "Primary Guardian Name*", sample: "Jane Doe" },
    relationType1: { display: "Primary Guardian Relation*", sample: "Mother" },
    relationNo1: { display: "Primary Guardian Number*", sample: "9876543211" },
    relationName2: { display: "Secondary Guardian Name", sample: "James Doe" },
    relationType2: { display: "Secondary Guardian Relation", sample: "Father" },
    relationNo2: { display: "Secondary Guardian Number", sample: "9876543212" },

    // Academic Information
    academicYear: { display: "Academic Year*", sample: "2024" },
    branch: { display: "Branch*", sample: "1" },
    joinYear: { display: "Join Year*", sample: "2024" },
    dateOfJoin: { display: "Date of Join*", sample: "2024-06-01" },
    classJoin: { display: "Class Join*", sample: "6" },
    class: { display: "Class*", sample: "6" },
    section: { display: "Section*", sample: "A" },

    // Admission Details
    admissionNo: { display: "Admission Number*", sample: "ADM2024001" },
    applicationNo: { display: "Application Number", sample: "APP2024001" },
    rollNo: { display: "Roll Number", sample: "R2024001" },

    // Facilities
    feeCategory: { display: "Fee Category*", sample: "1" },
    transport: { display: "Transport* (Using/NotUsing)", sample: "Using" },
    hostel: { display: "Hostel* (Using/NotUsing)", sample: "NotUsing" },
    routeName: { display: "Route Name", sample: "1" },
    stopName: { display: "Stop Name", sample: "1" },
    hostelName: { display: "Hostel Name", sample: "" },
    floorName: { display: "Floor/Room Name", sample: "" }
};

export const BulkUploadTemplate = () => {
    const handleDownloadTemplate = () => {
        // Create sample data with DB column names
        const sampleData = Object.fromEntries(
            Object.entries(columnMapping).map(([dbColumn, { sample }]) => [dbColumn, sample])
        );

        // Create worksheet
        const ws = XLSX.utils.json_to_sheet([sampleData], {
            header: Object.keys(columnMapping)
        });

        // Create workbook and add worksheet
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Template");

        // Generate Excel file
        XLSX.writeFile(wb, "student_upload_template.xlsx");
    };

    return (
        <Card className="mt-4 shadow-lg rounded-lg border border-custom-pink-300">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center text-custom-pink-300">
                    <FileSpreadsheet className="mr-2 text-custom-pink-300" />
                    Excel Upload Format Guidelines
                </CardTitle>
                <Button
                    onClick={handleDownloadTemplate}
                    className="flex items-center gap-2 bg-custom-pink-300 hover:bg-custom-pink-200"
                >
                    <Download className="h-4 w-4" />
                    Download Template
                </Button>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[400px] w-full rounded-md border">
                    <Table>
                        <TableHeader className='bg-custom-pink-300 text-white font-semibold'>
                            <TableRow>
                                <TableHead className='text-white'>DB Column Name</TableHead>
                                <TableHead className='text-white'>Display Name</TableHead>
                                <TableHead className='text-white'>Sample Value</TableHead>
                                <TableHead className='text-white'>Description</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Object.entries(columnMapping).map(([dbColumn, { display, sample }]) => (
                                <TableRow key={dbColumn}>
                                    <TableCell className="font-medium font-mono">
                                        {dbColumn}
                                    </TableCell>
                                    <TableCell>
                                        {display}
                                    </TableCell>
                                    <TableCell>{sample}</TableCell>
                                    <TableCell>
                                        {display.includes('*') ? 'Required field' : 'Optional field'}
                                        {display.includes('MALE/FEMALE/OTHER') && ' - Must be one of: MALE, FEMALE, OTHER'}
                                        {dbColumn.includes('date') && ' - Date format must be YYYY-MM-DD'}
                                        {display.includes('Using/NotUsing') && ' - Must be either Using or NotUsing'}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </CardContent>
        </Card>
    );
};

export default BulkUploadTemplate;