import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import SubmitButton from "@/components/ui/SubmitButton";
import { useToast } from "@/hooks/use-toast";
import styles from "@/public/assets/styles/toast.module.css";
import { ToastAction } from "@/components/ui/toast";
import { AccountsTypes } from "@/constant/data";
import { SelectItem } from "@/components/ui/select";
import { AccountValidation } from "@/lib/validation/TableValidations";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { UserPen } from "lucide-react";
import { ApplicabilityTypes } from "./SheetModel";

interface AccountUpdateSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountId?: number; // Optional ID for existing account
  initialData?: AccountInput;
}
type AccountInput = z.infer<typeof AccountValidation>;

export function AccountUpdateSheetModal({
  isOpen,
  onClose,
  accountId,
  initialData,
}: AccountUpdateSheetModalProps) {
  const methods = useForm<AccountInput>({
    resolver: zodResolver(AccountValidation),
    defaultValues: initialData || {
      accountName: "",
      accountType: "ASSET",
      description: "",
      openingBalance: 0,
      applicableFor: "NONE",

    },
  });

  const { handleSubmit, reset, control } = methods;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();

  console.log(setErrorMessage);

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [isOpen]);

  const handleUpdate = async (data: AccountInput) => {
    if (!accountId) {
      toast({
        variant: "destructive",
        title: "😥 Error",
        description: "No account ID provided for update.",
        className: styles.error,
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/accounts/${accountId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update account");

      // const result = await response.json();

      toast({
        title: "🙂 Success!",
        description: "Account updated successfully.",
        className: styles.success,
      });

      reset();
      onClose();
    } catch (error) {
      console.error("Failed to update account:", error);
      toast({
        variant: "destructive",
        title: "😥 Uh oh! Something went wrong.",
        description: "There was a problem updating the account.",
        className: styles.error,
        action: (
          <ToastAction altText="Try again" onClick={() => handleUpdate(data)}>
            Try again
          </ToastAction>
        ),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit: SubmitHandler<AccountInput> = (data) => {
    handleUpdate(data);
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="bg-white sheet-content mx-auto mr-5 my-4 p-6 max-w-xl max-h-[95vh] rounded-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            <VisuallyHidden>Update Account</VisuallyHidden>
          </SheetTitle>
          <div className="flex flex-col items-start space-y-2">
            <div className="flex items-center space-x-2">
              <UserPen className="w-5 h-5 text-custom-red-600" />
              <h2 className="text-custom-red-600 font-semibold text-xl rounded">
                Update Account
              </h2>
            </div>
            <p className="text-sm">Edit Existing Account</p>
          </div>
        </SheetHeader>

        <div className="mt-6 mb-6">
          <hr className="flex-grow border-red-600" />
        </div>

        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={control}
                  name="accountName"
                  label="Account Name"
                />
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={control}
                  name="accountType"
                  label="Account Type"
                  placeholder="Select Account Type"
                  mandatory={true}
                >
                  {AccountsTypes.map((type, i) => (
                    <SelectItem key={type + i} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </CustomFormField>
                <CustomFormField
                  fieldType={FormFieldType.TEXTAREA}
                  control={control}
                  name="description"
                  label="Description"
                />
                <CustomFormField
                  fieldType={FormFieldType.RADIO}
                  control={control}
                  name="applicableFor"
                  label="Applicable For"
                  mandatory={true}
                  options={ApplicabilityTypes}
                />
                <CustomFormField
                  fieldType={FormFieldType.NUMBER}
                  control={control}
                  name="openingBalance"
                  label="Opening Balance"
                />
                <SubmitButton isLoading={isLoading}>
                  Update Account
                </SubmitButton>
              </form>
            </FormProvider>
            {error && <div className="text-red-500">{error}</div>}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
