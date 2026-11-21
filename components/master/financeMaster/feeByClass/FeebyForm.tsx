'use client';

import { useState, useEffect } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent} from '@/components/ui/card';
import { MultiSelectCombobox } from '@/components/ui/combobox';
import AddFeeDialog, { FeeFormValues } from './AddFeeDialog';
import DataTable from './table/data-table';
import { CreditCard, Loader2, } from "lucide-react";
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

// Types remain the same...
interface AcademicYear {
    id: number;
    label: string;
}

interface Branch {
    id: number;
    name: string;
}

interface Class {
    id: number;
    name: string;
}

interface Section {
    id: number;
    name: string;
}

interface FeeCategory {
    id: number;
    category: string;
}

interface FormValues {
    academicYearId: string;
    branchId: string;
    classId: string[];
    sectionId: string[];
    feeCategoryId: string;
}

const FeeByClass = () => {
    // Existing state declarations...
    const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [classes, setClasses] = useState<Class[]>([]);
    const [sections, setSections] = useState<Section[]>([]);
    const [feeCategories, setFeeCategories] = useState<FeeCategory[]>([]);
    const [formValues, setFormValues] = useState<FormValues>({
        academicYearId: '',
        branchId: '',
        classId: [],
        sectionId: [],
        feeCategoryId: '',
    });

    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [dataLoading, setDataLoading] = useState(false);

    // Initial data fetch effect remains the same...
    useEffect(() => {
        async function fetchInitialData() {
            setDataLoading(true);
            try {
                const [academicYearsRes, feeCategoriesRes] = await Promise.all([
                    fetch('/api/models/cascading-selects'),
                    fetch('/api/feeCategory')
                ]);

                if (!academicYearsRes.ok || !feeCategoriesRes.ok) {
                    throw new Error('Failed to fetch initial data');
                }

                const [academicYearsData, feeCategoriesData] = await Promise.all([
                    academicYearsRes.json(),
                    feeCategoriesRes.json()
                ]);

                setAcademicYears(academicYearsData);
                setFeeCategories(feeCategoriesData);
            } catch (err) {
                console.error('Error fetching initial data:', err);
                setError('Failed to load initial data. Please refresh the page.');
            } finally {
                setDataLoading(false);
            }
        }

        fetchInitialData();
    }, []);

    // Existing handler functions remain the same...
    const handleDropdownChange = (field: string, value: string | string[]) => {
        setFormValues((prev) => ({
            ...prev,
            [field]: value
        }));

        switch (field) {
            case 'academicYearId':
                fetchBranches(value);
                break;
            case 'branchId':
                fetchClasses(value);
                break;
            case 'classId':
                if (Array.isArray(value) && value.length > 0) {
                    fetchSections(value[0]);
                }
                break;
        }
    };

    // Existing fetch functions remain the same...
    const fetchBranches = async (academicYearId: string | string[]) => {
        const yearId = Array.isArray(academicYearId) ? academicYearId[0] : academicYearId;
        
        try {
            const response = await fetch(`/api/models/cascading-selects?academicYearId=${yearId}`);
            if (!response.ok) throw new Error('Failed to fetch branches');
            
            const data = await response.json();
            setBranches(data);
            
            setClasses([]);
            setSections([]);
            setFormValues((prev) => ({
                ...prev,
                branchId: '',
                classId: [],
                sectionId: [],
            }));
        } catch (error) {
            console.error('Error fetching branches:', error);
            setError('Failed to load branches');
        }
    };

    const fetchClasses = async (branchId: string | string[]) => {
        const selectedBranchId = Array.isArray(branchId) ? branchId[0] : branchId;

        try {
            const response = await fetch(
                `/api/models/cascading-selects?academicYearId=${formValues.academicYearId}&branchId=${selectedBranchId}`
            );
            if (!response.ok) throw new Error('Failed to fetch classes');

            const data = await response.json();
            setClasses(data);
            
            setSections([]);
            setFormValues((prev) => ({
                ...prev,
                classId: [],
                sectionId: [],
            }));
        } catch (error) {
            console.error('Error fetching classes:', error);
            setError('Failed to load classes');
        }
    };

    const fetchSections = async (classId: string | string[]) => {
        const selectedClassId = Array.isArray(classId) ? classId[0] : classId;

        try {
            const response = await fetch(
                `/api/models/cascading-selects?academicYearId=${formValues.academicYearId}&branchId=${formValues.branchId}&classId=${selectedClassId}`
            );
            if (!response.ok) throw new Error('Failed to fetch sections');

            const data = await response.json();
            setSections(data);
            setFormValues((prev) => ({
                ...prev,
                sectionId: []
            }));
        } catch (error) {
            console.error('Error fetching sections:', error);
            setError('Failed to load sections');
        }
    };

    const refetchTableData = async () => {
        if (!formSubmitted) return;
        
        setLoading(true);
        const payload = {
            academicYearId: Number(formValues.academicYearId),
            branchId: Number(formValues.branchId),
            classIds: formValues.classId.map(Number),
            sectionIds: formValues.sectionId.map(Number),
            feeCategoryId: Number(formValues.feeCategoryId),
        };

        try {
            const response = await fetch('/api/fees-by-class/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch fee details');
            }

            setFees(data);

        } catch (err) {
            console.error('Error refreshing data:', err);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to refresh fee details.',
                className: 'bg-red-50 border-custom-red-600',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAddFee = async (feeData: FeeFormValues) => {
        try {
            const response = await fetch('/api/fees-by-class', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(feeData),
            });
    
            if (!response.ok) throw new Error('Failed to create fee');
            
            // Refetch table data after successful addition
            await refetchTableData();

            toast({
                title: 'Success',
                description: 'Fee details have been successfully added and table has been updated.',
                className: 'bg-custom-sandle-100 border-custom-pink-300',
            });
    
        } catch (error) {
            console.error('Error adding fee:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to add new fee. Please try again.',
                className: 'bg-red-50 border-custom-red-600',
            });
        }
    };
    
    // Update to FeeByClass.tsx - handleSubmit function
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFormSubmitted(true);

    const payload = {
        academicYearId: Number(formValues.academicYearId),
        branchId: Number(formValues.branchId),
        classIds: formValues.classId.map(Number),
        sectionIds: formValues.sectionId.map(Number),
        feeCategoryId: Number(formValues.feeCategoryId),
    };

    try {
        const response = await fetch('/api/fees-by-class/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch fee details');
        }

        setFees(data);

        // Show appropriate toast based on results
        if (data.length === 0) {
            toast({
                title: 'No Results',
                description: 'No fee records found for the selected criteria.',
                className: 'bg-yellow-50 border-yellow-400',
            });
        } else {
            toast({
                title: 'Search Complete',
                description: `Found ${data.length} fee records.`,
                className: 'bg-custom-sandle-100 border-custom-pink-300',
            });
        }
    } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError('An unexpected error occurred');
        }
        setFees([]);
        
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Failed to fetch fee details. Please try again.',
            className: 'bg-red-50 border-custom-red-600',
        });
    } finally {
        setLoading(false);
    }
};

    if (dataLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-custom-pink-300" />
            </div>
        );
    }

    return (
        <div className="mx-auto p-4 space-y-8">
            <Card className="shadow-lg rounded-md border border-gray-200">
                
                
                <CardContent className="p-6 mt-4">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex flex-wrap gap-4">
                            {/* Academic Year Select */}
                            <div className="flex-1 min-w-[200px]">
                                <Label className="flex items-center gap-2 mb-2">
                                    
                                    Academic Year
                                </Label>
                                <Select
                                    onValueChange={(value) => handleDropdownChange('academicYearId', value)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Year" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {academicYears.map((year) => (
                                            <SelectItem key={year.id} value={year.id.toString()}>
                                                {year.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Branch Select */}
                            <div className="flex-1 min-w-[200px]">
                                <Label className="flex items-center gap-2 mb-2">
                                    
                                    Branch
                                </Label>
                                <Select
                                    onValueChange={(value) => handleDropdownChange('branchId', value)}
                                    disabled={!formValues.academicYearId}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Branch" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {branches.map((branch) => (
                                            <SelectItem key={branch.id} value={branch.id.toString()}>
                                                {branch.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Class Multi-Select */}
                            <div className="flex-1 min-w-[200px]">
                                <Label className="flex items-center gap-2 mb-2">
                                    
                                    Classes
                                </Label>
                                <MultiSelectCombobox
                                    options={classes.map(classItem => ({
                                        value: String(classItem.id),
                                        label: classItem.name
                                    }))}
                                    value={formValues.classId}
                                    onChange={(selectedClasses) => {
                                        handleDropdownChange('classId', selectedClasses);
                                    }}
                                    placeholder="Select Classes"
                                    disabled={!formValues.branchId}
                                />
                            </div>

                            {/* Section Multi-Select */}
                            <div className="flex-1 min-w-[200px]">
                                <Label className="flex items-center gap-2 mb-2">
                                    
                                    Sections
                                </Label>
                                <MultiSelectCombobox
                                    options={sections.map(section => ({
                                        value: String(section.id),
                                        label: section.name
                                    }))}
                                    value={formValues.sectionId}
                                    onChange={(selectedSections) => {
                                        handleDropdownChange('sectionId', selectedSections);
                                    }}
                                    placeholder="Select Sections"
                                    disabled={formValues.classId.length === 0}
                                />
                            </div>

                            {/* Fee Category Select */}
                            <div className="flex-1 min-w-[200px]">
                                <Label className="flex items-center gap-2 mb-2">
                                    
                                    Fee Category
                                </Label>
                                <Select
                                    onValueChange={(value) => handleDropdownChange('feeCategoryId', value)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {feeCategories.map((category) => (
                                            <SelectItem key={category.id} value={category.id.toString()}>
                                                {category.category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex justify-center mt-6">
                            <Button
                                type="submit"
                                className="bg-custom-pink-300 text-white hover:bg-custom-pink-350 px-8 py-2"
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Searching...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <CreditCard className="h-4 w-4" />
                                        Search Fees
                                    </div>
                                )}
                            </Button>
                        </div>

                        {error && (
                            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                                <p className="text-red-600 text-center">{error}</p>
                            </div>
                        )}
                    </form>
                </CardContent>
            </Card>

            {/* Results Card remains the same */}
            {formSubmitted && (
                <Card className="shadow-lg rounded-lg border border-gray-300">
                    <div className="bg-gray-50 flex items-center justify-between p-6 rounded-t-lg border-b">
                        <div>
                            
                            <p className="text-sm text-gray-500 mt-1">
                                 Search and manage class-wise fee structures. You can select multiple classes to view or set fees across different sections.
                            </p>
                        </div>

                        <AddFeeDialog 
                            selectedValues={formValues} 
                            onAddFee={handleAddFee} 
                        />
                    </div>

                    <CardContent className="p-6">
                        <div className="overflow-x-auto">
                            {loading ? (
                                <div className="flex justify-center items-center h-48">
                                    <Loader2 className="h-8 w-8 animate-spin text-custom-pink-300" />
                                </div>
                            ) : (
                                <DataTable 
                                    data={fees}
                                />
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default FeeByClass;