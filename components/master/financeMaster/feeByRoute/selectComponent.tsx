'use client';
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Sheet, 
  SheetClose, 
  SheetContent, 
  SheetFooter, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { EditIcon, UserPen } from "lucide-react";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { toast } from "@/hooks/use-toast";
import { SelectItem } from "@/components/ui/select";
import { AcademicYearOption } from "@/constant/data";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastAction } from "@/components/ui/toast";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Define interfaces for the data
interface Stop {
  id: number;
  stopName: string;
  stopNumber: number;
  distance: string;
  landMark: string;
}

interface Account {
  id: number;
  accountName: string;
  applicableFor: string;
  accountType: string;
}

interface StopWithFees extends Stop {
  fees: { [key: number]: number }; // Fees for each term
}

// Zod schema for fee update
const transportFeeSchema = z.object({
  term1Fee: z.string().refine((val) => !isNaN(Number(val)), { message: "Fee must be a number" }),
  term2Fee: z.string().refine((val) => !isNaN(Number(val)), { message: "Fee must be a number" }),
  term3Fee: z.string().refine((val) => !isNaN(Number(val)), { message: "Fee must be a number" }),
  accountId: z.string().min(1, "Account is required"),
});

type TransportFeeFormValues = z.infer<typeof transportFeeSchema>;

// UpdateTransportFeeSheet Component
const UpdateTransportFeeSheet: React.FC<{   
  stop: StopWithFees;   
  academicYearId: number;   
  routeId: number;   
  accounts: Account[]; 
}> = ({ stop, academicYearId, routeId, accounts }) => {
  const methods = useForm<TransportFeeFormValues>({
    resolver: zodResolver(transportFeeSchema),
    defaultValues: {
      term1Fee: stop.fees[1]?.toString() || '',
      term2Fee: stop.fees[2]?.toString() || '',
      term3Fee: stop.fees[3]?.toString() || '',
      accountId: '',
    },
  });
  
  const onSubmit = async (values: TransportFeeFormValues) => {
    try {
      // Validate that new fees are not less than existing fees
      const validateFeeIncrease = (existingFee: number | undefined, newFee: string) => {
        const parsedNewFee = Number(newFee);
        if (existingFee !== undefined && parsedNewFee < existingFee) {
          throw new Error(`Fee cannot be decreased. Existing fee: ${existingFee}, New fee: ${parsedNewFee}`);
        }
        return parsedNewFee;
      };

      const feesToSubmit = [
        {
          term: 1,
          feeAmount: validateFeeIncrease(stop.fees[1], values.term1Fee),
          stopId: stop.id,
          routeId,
          academicYearId,
          accountId: Number(values.accountId)
        },
        {
          term: 2,
          feeAmount: validateFeeIncrease(stop.fees[2], values.term2Fee),
          stopId: stop.id,
          routeId,
          academicYearId,
          accountId: Number(values.accountId)
        },
        {
          term: 3,
          feeAmount: validateFeeIncrease(stop.fees[3], values.term3Fee),
          stopId: stop.id,
          routeId,
          academicYearId,
          accountId: Number(values.accountId)
        }
      ];
      
      const response = await fetch("/api/transportFees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feesToSubmit),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        toast({
          title: "🎉 Success!",
          description: "Transport fees updated successfully",
          variant: "default",
        });
      } else {
        toast({
          title: "❌ Error",
          description: result.error || "Failed to update transport fees",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "🚨 Error",
        description: error instanceof Error ? error.message : "Error processing request",
        variant: "destructive",
      });
    }
  };



  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" 
         className="bg-white shadow-md text-custom-red-600 font-semibold border border-custom-pink-300 hover:bg-custom-red-600 hover:text-white "
        size="icon" >
          <EditIcon className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-white sheet-content mx-auto mr-5 my-4 p-6 max-w-xl max-h-[95vh] rounded-md overflow-y-auto">
      <SheetHeader>
  <SheetTitle>
    <VisuallyHidden>Update Transport Fee</VisuallyHidden>
  </SheetTitle>
  <div className="flex flex-col items-start space-y-2">
    <div className="flex items-center space-x-2">
      <UserPen className="w-5 h-5 text-custom-red-600" />
      <h2 className="text-custom-red-600 font-semibold text-xl rounded">
        Update Transport Fee
      </h2>
    </div>
    <p className="text-sm">
      Update fees for {stop.stopName} - Stop #{stop.stopNumber}
    </p>
  </div>
</SheetHeader>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            {/* Account Selection */}
            <div>
              <Label>Account</Label>
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={methods.control}
                name="accountId"
                placeholder="Select Account"
                mandatory={true}
              >
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id.toString()}>
                    {account.accountName}
                  </SelectItem>
                ))}
              </CustomFormField>
            </div>

            {/* Term Fees */}
            <div className="space-y-2">
              <div>
                <Label>Term 1 Fee</Label>
                <Input 
                  type="number" 
                  step="0.01" 
                  {...methods.register('term1Fee')}
                  placeholder="Enter Term 1 Fee" 
                  className="border border-custom-red-600"

                />
                {methods.formState.errors.term1Fee && (
                  <p className="text-red-500 text-sm">
                    {methods.formState.errors.term1Fee.message}
                  </p>
                )}
              </div>
              <div>
                <Label>Term 2 Fee</Label>
                <Input 
                  type="number" 
                  step="0.01" 
                  {...methods.register('term2Fee')}
                  placeholder="Enter Term 2 Fee" 
                  className="border border-custom-red-600"
                />
                {methods.formState.errors.term2Fee && (
                  <p className="text-red-500 text-sm">
                    {methods.formState.errors.term2Fee.message}
                  </p>
                )}
              </div>
              <div>
                <Label>Term 3 Fee</Label>
                <Input 
                  type="number" 
                  step="0.01" 
                  {...methods.register('term3Fee')}
                  placeholder="Enter Term 3 Fee" 
                  className="border border-custom-red-600"

                />
                {methods.formState.errors.term3Fee && (
                  <p className="text-red-500 text-sm">
                    {methods.formState.errors.term3Fee.message}
                  </p>
                )}
              </div>
            </div>

            <SheetFooter>
              <SheetClose asChild>
                <Button type="button" 
                variant="outline"
                className="bg-custom-pink-300 text-white">
                  Cancel
                  </Button>
              </SheetClose>
              <Button 
              type="submit"
              className="bg-custom-pink-300 text-white">
                Update Fees
                </Button>
            </SheetFooter>
          </form>
        </FormProvider>
      </SheetContent>
    </Sheet>
  );
};

const feeByRouteSchema = z.object({
  academicYearId: z.string().min(1, "Academic Year is required"),
  routeId: z.string().min(1, "Route is required"),
});

type FeeByRouteFormValues = z.infer<typeof feeByRouteSchema>;

// Main FeeByRouteManagement Component
const FeeByRouteManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [stopsWithFees, setStopsWithFees] = useState<StopWithFees[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYearOption[]>([]);
  const [routes, setRoutes] = useState<{ id: string; routeName: string }[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState<number | null>(null);
  const [selectedRouteId, setSelectedRouteId] = useState<number | null>(null);

  const methods = useForm<FeeByRouteFormValues>({
    resolver: zodResolver(feeByRouteSchema),
    defaultValues: {
      academicYearId: "",
      routeId: "",
    },
  });

  // Data fetching effects
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [yearResponse, routeResponse, accountResponse] = await Promise.all([
          fetch("/api/academicYears"),
          fetch("/api/routes"),
          fetch("/api/accounts")
        ]);

        const years = await yearResponse.json();
        const routeData = await routeResponse.json();
        const accountData = await accountResponse.json();

        // Filter accounts for transport
        const filteredAccounts = accountData.filter(
          (account: Account) => 
            account.applicableFor === "TRANSPORT" && 
            account.accountType === "INCOME"
        );

        setAcademicYears(years);
        setRoutes(routeData);
        setAccounts(filteredAccounts);
      } catch (error) {
        toast({
          title: "🚨 Network Error",
          description: "Error processing request",
          variant: "destructive",
        });
        console.log(error);
        
      }
    };

    fetchInitialData();
  }, []);

  const onSubmit = async (values: FeeByRouteFormValues) => {
    setIsLoading(true);
    setSelectedAcademicYearId(Number(values.academicYearId));
    setSelectedRouteId(Number(values.routeId));

    try {
      const response = await fetch("/api/transportFees/stops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          academicYearId: Number(values.academicYearId),
          routeId: Number(values.routeId),
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "🎉 Success!",
          description: "Stops and fees retrieved successfully",
          variant: "default",
        });

        setStopsWithFees(result);
      } else {
        toast({
          title: "❌ Error",
          description: result.error || "Failed to fetch stops and fees",
          variant: "destructive",
          action: (
            <ToastAction 
              altText="Try again" 
              onClick={() => onSubmit(values)}
            >
              Retry
            </ToastAction>
          )
        });
      }
    } catch (error) {
      toast({
        title: "🚨 Network Error",
        description: "Error processing request",
        variant: "destructive",
        action: (
          <ToastAction 
            altText="Try again" 
            onClick={() => onSubmit(values)}
          >
            Retry
          </ToastAction>
        )
      });
      console.log(error);
      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg p-6">
  <FormProvider {...methods}>
    <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
      {/* Center the fields */}
      <div className="flex flex-col items-center gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-lg">
          {/* Academic Year Dropdown */}
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={methods.control}
            name="academicYearId"
            label="Academic Year"
            placeholder="Select"
            mandatory={true}
          >
            {academicYears.map((year) => (
              <SelectItem key={year.id} value={year.id.toString()}>
                {year.label}
              </SelectItem>
            ))}
          </CustomFormField>

          {/* Routes Dropdown */}
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={methods.control}
            name="routeId"
            label="Route"
            placeholder="Select"
            mandatory={true}
          >
            {routes.map((route) => (
              <SelectItem key={route.id} value={route.id.toString()}>
                {route.routeName}
              </SelectItem>
            ))}
          </CustomFormField>
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-custom-pink-300 hover:bg-custom-red-600 text-white"
        >
          {isLoading ? "Processing..." : "Generate Fees"}
        </Button>
      </div>
    </form>
  </FormProvider>
</div>


      {/* Stops and Fees Table */}
      {stopsWithFees.length > 0 && selectedAcademicYearId && selectedRouteId && (
      <Card className="w-full border border-custom-pink-100 p-2 mt-6">
      <CardHeader>
        <div className="flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
          <div className="pb-2">
            <CardTitle className="text-2xl font-bold text-custom-red-600">
              Transport Fee Details <span className="text-slate-700">{stopsWithFees.length}</span>
            </CardTitle>
            <p className="text-muted-foreground text-sm mt-1">
              View and update transport fees for all stops in the current route.
            </p>
          </div>
          {/* You can add a DataTableToolbar or any additional components if needed */}
        </div>
      </CardHeader>
    
      <CardContent className="">
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-custom-pink-300">
              <TableRow>
                <TableHead className="text-white">Stop Number</TableHead>
                <TableHead className="text-white">Stop Name</TableHead>
                <TableHead className="text-white">Landmark</TableHead>
                <TableHead className="text-white">Distance</TableHead>
                <TableHead className="text-white">Term 1 Fee</TableHead>
                <TableHead className="text-white">Term 2 Fee</TableHead>
                <TableHead className="text-white">Term 3 Fee</TableHead>
                <TableHead className="text-white">Actions</TableHead>
              </TableRow>
            </TableHeader>
    
            <TableBody>
              {stopsWithFees.map((stop) => (
                <TableRow key={stop.id} className="hover:bg-custom-pink-200">
                  <TableCell>{stop.stopNumber}</TableCell>
                  <TableCell>{stop.stopName}</TableCell>
                  <TableCell>{stop.landMark}</TableCell>
                  <TableCell>{stop.distance}</TableCell>
                  <TableCell>
                    {stop.fees[1] !== undefined ? `₹ ${stop.fees[1].toFixed(2)}` : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {stop.fees[2] !== undefined ? `₹ ${stop.fees[2].toFixed(2)}` : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {stop.fees[3] !== undefined ? `₹ ${stop.fees[3].toFixed(2)}` : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <UpdateTransportFeeSheet
                      stop={stop}
                      academicYearId={selectedAcademicYearId}
                      routeId={selectedRouteId}
                      accounts={accounts}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    
      <div className="p-4">
        {/* DataTablePagination can be added if pagination is required */}
      </div>
    </Card>
    
      
      )}
    </div>
  );
};

export default FeeByRouteManagement;