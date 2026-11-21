import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { HostelSchema } from "@/lib/validation/incomeCollectionValidtion";
import { SelectItem } from "@/components/ui/select";
import { HostelNameTypes, HostelTypes, RoomTypes } from "@/constant/data";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { Building } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HostelDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

type HostelFormValues = z.infer<typeof HostelSchema>;

export function HostelDialog({ isOpen, onClose }: HostelDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [hostel, setHostel] = useState<string>("");
  const [hostelName, setHostelName] = useState<string>("");

  const form = useForm<HostelFormValues>({
    resolver: zodResolver(HostelSchema),
    defaultValues: {
      hostel: "",
      hostelName: "",
      floorName: "",
    },
  });

  const onSubmit = async (values: HostelFormValues) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/branches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();
      console.log(result);
      onClose();
    } catch (error) {
      console.error("Failed to create category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHostelChange = (value: string | string[]) => {
    if (typeof value === "string") {
      setHostel(value);
    }
  };

  const handleHostelNameChange = (value: string | string[]) => {
    if (typeof value === "string") {
      setHostelName(value);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 rounded-xl shadow-2xl bg-white">
        {/* Dialog header with gradient background */}
        <div className="bg-gradient-to-r from-custom-pink-300 to-custom-pink-200 p-6 rounded-t-xl">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <Building className="w-8 h-8 text-white" />
              <DialogTitle className="text-2xl font-semibold text-white">
                Edit Hostel Profile
              </DialogTitle>
            </div>
            <DialogDescription className="text-custom-sandle-100">
              Make changes to your hostel profile here. Click save when
              you&apos;re done.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Form content */}
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
              {/* Left Column */}
              <div className="space-y-6">
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="hostel"
                  label="Hostel"
                  placeholder="Select"
                  mandatory={true}
                  onChange={handleHostelChange}
                >
                  {HostelTypes.map((type, i) => (
                    <SelectItem key={type + i} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </CustomFormField>

                {hostel === "Using" && (
                  <CustomFormField
                    fieldType={FormFieldType.SELECT}
                    control={form.control}
                    name="hostelName"
                    label="Hostel Name"
                    placeholder="Select Route"
                    onChange={handleHostelNameChange}
                  >
                    {HostelNameTypes.map((type, i) => (
                      <SelectItem key={type + i} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </CustomFormField>
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {(hostelName === "Boys Hostel" ||
                  hostelName === "Girls Hostel") && (
                  <div className="p-5 bg-custom-sandle-100 rounded-lg border border-custom-pink-100">
                    <h3 className="text-custom-pink-400 font-medium mb-4">
                      Floor Settings
                    </h3>
                    <CustomFormField
                      fieldType={FormFieldType.SELECT}
                      control={form.control}
                      name="floorName"
                      label="Floor"
                      placeholder="Select"
                    >
                      {RoomTypes.map((type, i) => (
                        <SelectItem key={type + i} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </CustomFormField>
                  </div>
                )}
              </div>
            </div>

            {/* Form buttons */}
            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="px-6 border-custom-pink-300 text-custom-pink-300 hover:bg-custom-pink-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-custom-pink-300 hover:bg-custom-pink-400 text-white px-8"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    Processing...
                  </span>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

export default HostelDialog;
