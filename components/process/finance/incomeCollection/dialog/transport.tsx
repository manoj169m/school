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
import { TransportSchema } from "@/lib/validation/incomeCollectionValidtion";
import { SelectItem } from "@/components/ui/select";
import { RouteNameTypes, StopNameTypes, TransportTypes } from "@/constant/data";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { Bus, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TransportDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

type TransportFormValues = z.infer<typeof TransportSchema>;

export function TransportDialog({ isOpen, onClose }: TransportDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [transport, setTransport] = useState<string>("");
  const [RouteName, setRouteName] = useState<string>("");

  const form = useForm<TransportFormValues>({
    resolver: zodResolver(TransportSchema),
    defaultValues: {
      transport: "",
      RouteName: "",
      StopName: "",
    },
  });

  const onSubmit = async (values: TransportFormValues) => {
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

  const handleTransportChange = (value: string | string[]) => {
    if (typeof value === "string") {
      setTransport(value);
    }
  };

  const handleRouteChange = (value: string | string[]) => {
    if (typeof value === "string") {
      setRouteName(value);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 rounded-xl shadow-2xl bg-white">
        {/* Dialog header with gradient background */}
        <div className="bg-gradient-to-r from-custom-pink-300 to-custom-pink-200 p-6 rounded-t-xl">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <Bus className="w-8 h-8 text-white" />
              <DialogTitle className="text-2xl font-semibold text-white">
                Edit Transport Profile
              </DialogTitle>
            </div>
            <DialogDescription className="text-custom-sandle-100">
              Make changes to your transport details here. Click save when
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
                  name="transport"
                  label="Transport"
                  placeholder="Select Transport"
                  mandatory={true}
                  onChange={handleTransportChange}
                >
                  {TransportTypes.map((type, i) => (
                    <SelectItem key={type + i} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </CustomFormField>

                {transport === "Using" && (
                  <CustomFormField
                    fieldType={FormFieldType.SELECT}
                    control={form.control}
                    name="RouteName"
                    label="Route Name"
                    placeholder="Select Route"
                    onChange={handleRouteChange}
                  >
                    {RouteNameTypes.map((type, i) => (
                      <SelectItem key={type + i} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </CustomFormField>
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {(RouteName === "Chathram To Market" ||
                  RouteName === "Palakarai to junction") && (
                  <div className="p-5 bg-custom-sandle-100 rounded-lg border border-custom-pink-100">
                    <div className="flex items-center gap-2 text-custom-pink-400 font-medium mb-4">
                      <MapPin className="w-4 h-4" />
                      <h3>Stop Details</h3>
                    </div>
                    <CustomFormField
                      fieldType={FormFieldType.SELECT}
                      control={form.control}
                      name="StopName"
                      label="Stop Name"
                      placeholder="Select stop"
                    >
                      {StopNameTypes.map((type, i) => (
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

export default TransportDialog;
