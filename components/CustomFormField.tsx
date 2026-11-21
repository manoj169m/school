import React, { useState, ReactNode } from "react";
import Image from "next/image";
import ReactDatePicker from "react-datepicker";
import {
  Control,
  FieldValues,
  Path,
  ControllerRenderProps,
} from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import { E164Number } from "libphonenumber-js/core";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Check, Eye, EyeOff } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import 'react-phone-number-input/style.css';
import "react-datepicker/dist/react-datepicker.css";

export enum FormFieldType {
  INPUT = "input",
  PASSWORD = "password",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
  EDITOR = "editor",
  RADIO = "radio",
  NUMBER="number",
  TIME = "time",
  DEFAULTSELECT = "defaultSelect"
}

interface CustomProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label?: string;
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
  disabled?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  children?: ReactNode;
  renderSkeleton?: (
    field: ControllerRenderProps<TFieldValues, Path<TFieldValues>>
  ) => ReactNode;
  fieldType: FormFieldType;
  onChange?: (value: string ) => void;
  mandatory?: boolean;
  onClick?: () => void;
  type?: "radio" | "checkbox" | "text" | "textarea";
  options?: Array<{ label: string; value: string | number }>;
  searchPlaceholder?: string;
  defaultValue?: string;
}

interface RenderInputProps<TFieldValues extends FieldValues> {
  field: ControllerRenderProps<TFieldValues, Path<TFieldValues>>;
  props: CustomProps<TFieldValues>;
}

interface RadioOption {
  "data-value": string;
  "data-label": string;
  value: string;
  label: string;
}

const RenderInput = <TFieldValues extends FieldValues>({
  field,
  props,
}: RenderInputProps<TFieldValues>) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const getMandatoryStyles = () => {
    return {
      placeholderClass: "", // Removed mandatory placeholder styling
      borderClass: "border-custom-red-600", // Removed conditional border color
      textClass: "" // Removed additional text classes
    };
  };

  interface CustomCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    checked?: boolean;
  }

  const CustomCheckbox = React.forwardRef<HTMLInputElement, CustomCheckboxProps>((props, ref) => {
    return (
      <div className="relative flex items-center">
        <div
          className={`h-5 w-5 rounded border border-gray-300 transition-colors duration-200 
            ${props.checked 
              ? 'bg-pink-300 border-pink-300' 
              : 'bg-white hover:bg-pink-50'
            }`}
        >
          {props.checked && (
            <Check className="absolute top-0.5 left-0.5 h-4 w-4 text-white stroke-[3]" />
          )}
        </div>
        <input
          type="checkbox"
          className="absolute opacity-0 h-5 w-5 cursor-pointer"
          ref={ref}
          {...props}
        />
      </div>
    );
  });
  
  CustomCheckbox.displayName = 'CustomCheckbox';

  switch (props.fieldType) {
    case FormFieldType.INPUT:
      return (
        <div className="flex rounded-md border border-custom-red-600 bg-light-600">
          {props.iconSrc && (
            <Image
              src={props.iconSrc}
              height={24}
              width={24}
              alt={props.iconAlt || "icon"}
              className="ml-2"
            />
          )}
          <FormControl>
            <Input
              placeholder={props.placeholder}
              {...field}
              className={`shad-input border-0 ${
                getMandatoryStyles().placeholderClass
              }`}
              disabled={props.disabled}
              onClick={props.onClick}
            />
          </FormControl>
        </div>
      );

    case FormFieldType.PASSWORD:
      return (
        <div className="relative flex rounded-md border border-custom-red-600 bg-light-600">
          {props.iconSrc && (
            <Image
              src={props.iconSrc}
              height={24}
              width={24}
              alt={props.iconAlt || "icon"}
              className="ml-2"
            />
          )}
          <FormControl>
            <Input
              placeholder={props.placeholder}
              {...field}
              type={isPasswordVisible ? "text" : "password"}
              className="shad-input border-0 pr-10"
              disabled={props.disabled}
            />
          </FormControl>
          <button
            type="button"
            onClick={togglePasswordVisibility}
            tabIndex={-1}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {isPasswordVisible ? (
              <EyeOff className="h-5 w-5 text-gray-500" />
            ) : (
              <Eye className="h-5 w-5 text-gray-500" />
            )}
          </button>
        </div>
      );

    case FormFieldType.RADIO:
      return (
        <FormControl>
          <RadioGroup
            value={field.value || "NONE"}
            onValueChange={(value) => field.onChange(value)}
            className=""
          >
            {Array.isArray(props.options) && props.options.length > 0
              ? props.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={option.value.toString()}
                      id={option.value.toString()}
                      className=""
                    />
                    <label
                      htmlFor={option.value.toString()}
                      className="text-sm"
                    >
                      {option.label}
                    </label>
                  </div>
                ))
              : props.children &&
                React.Children.map(
                  props.children,
                  (child: ReactNode, index) => {
                    if (React.isValidElement<RadioOption>(child)) {
                      const value = child.props["data-value"];
                      const label = child.props["data-label"];
                      return (
                        <div
                          key={index}
                          className="flex items-center space-x-4"
                        >
                          <RadioGroupItem
                            value={value}
                            id={value}
                            className=""
                          />
                          <label htmlFor={value} className="text-sm">
                            {label}
                          </label>
                        </div>
                      );
                    }
                    return null;
                  }
                )}
          </RadioGroup>
        </FormControl>
      );

    case FormFieldType.TEXTAREA:
      return (
        <div className="flex rounded-md border border-custom-red-600 bg-light-600">
          <FormControl>
            <Textarea
              placeholder={props.placeholder}
              {...field}
              className="shad-input border-0"
              disabled={props.disabled}
              onClick={props.onClick}
            />
          </FormControl>
        </div>
      );

    case FormFieldType.TIME:
      return (
        <div className="relative flex items-center rounded-md border border-custom-red-600 bg-light-600">
          <Image
            src="/assets/icons/clock.svg"
            height={24}
            width={24}
            alt="clock"
            className={`ml-2 ${props.disabled ? "opacity-50" : ""}`}
          />
          <FormControl>
            <Input
              type="time"
              placeholder={props.placeholder}
              {...field}
              value={
                field.value
                  ? typeof field.value === "string"
                    ? field.value
                    : field.value &&
                      typeof field.value === "object" &&
                      "toLocaleTimeString" in (field.value as object)
                    ? (field.value as Date)
                        .toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })
                        .slice(0, 5)
                    : ""
                  : "" // Keep this as empty string for undefined
              }
              readOnly={props.disabled}
              className={`shad-input border-0 ${
                props.disabled ? "bg-gray-100 text-gray-600" : ""
              }`}
              onChange={(e) => {
                // Only allow change if not disabled
                if (!props.disabled) {
                  // Handle different scenarios
                  const timeValue = e.target.value;

                  // If timeValue is empty, set to null or undefined
                  const processedValue = timeValue
                    ? timeValue
                    : props.mandatory
                    ? new Date() // If mandatory, default to current time
                    : null; // If optional, set to null

                  field.onChange(processedValue);

                  if (props.onChange) {
                    props.onChange(timeValue);
                  }
                }
              }}
            />
          </FormControl>
        </div>
      );

    case FormFieldType.PHONE_INPUT:
      // Function to format phone number to E.164
      const formatToE164 = (
        phone: string | undefined
      ): E164Number | undefined => {
        if (!phone) return undefined;

        // If already in E.164 format, return as is
        if (phone.startsWith("+")) return phone as E164Number;

        // Default to Indian number (+91) if no country code
        return `+91${phone.replace(/\D/g, "")}` as E164Number;
      };

      return (
        <FormControl>
          <PhoneInput
            defaultCountry="IN"
            placeholder={props.placeholder}
            international
            withCountryCallingCode
            value={formatToE164(field.value?.toString())}
            onChange={(value) => {
              field.onChange(value);
              if (props.onChange) {
                props.onChange(value || "");
              }
            }}
            className="input-phone"
            inputprops={{
              className: "",
            }}
          />
        </FormControl>
      );

    case FormFieldType.CHECKBOX:
      return (
        <FormControl>
          <div className="flex items-center gap-3">
            <CustomCheckbox
              id={props.name}
              checked={Boolean(field.value)}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                field.onChange(e.target.checked);
              }}
            />
            <label
              htmlFor={props.name}
              className="text-sm font-medium text-gray-700 select-none cursor-pointer"
            >
              {props.label}
            </label>
          </div>
        </FormControl>
      );

    case FormFieldType.DATE_PICKER:
      return (
        <div className="relative flex items-center rounded-md border border-custom-red-600 bg-light-600">
          <Image
            src="/assets/icons/calendar.svg"
            height={24}
            width={24}
            alt="calendar"
            className={`ml-2 ${props.disabled ? "opacity-50" : ""}`}
          />
          <FormControl className="w-full">
            <ReactDatePicker
              showTimeSelect={props.showTimeSelect ?? false}
              selected={field.value ? new Date(field.value) : null}
              onChange={(date: Date | null) => field.onChange(date)}
              timeInputLabel="Time:"
              placeholderText={props.placeholder || "DD/MM/YYY"}
              className={`bg-transparent w-full text-sm p-2 focus:outline-none focus:ring-0 ${
                props.disabled ? "cursor-not-allowed text-gray-500" : ""
              }`}
              dateFormat={props.dateFormat ?? "MM/dd/yyyy"}
              wrapperClassName="date-picker w-full"
              popperClassName="z-50"
              // Disable functionality
              disabled={props.disabled}
            />
          </FormControl>
        </div>
      );

    case FormFieldType.DEFAULTSELECT:
      const getSelectValue = () => {
        return field.value;
      };

      return (
        <FormControl>
          <Select
            key={field.value}
            value={getSelectValue()}
            onValueChange={field.onChange}
          >
            <SelectTrigger className="rounded-lg border border-gray-200 bg-white">
              <SelectValue defaultValue={field.value} />
            </SelectTrigger>
            <SelectContent>{props.children}</SelectContent>
          </Select>
        </FormControl>
      );

    case FormFieldType.SELECT:
      return (
        <FormControl>
          <Select
            defaultValue={field.value}
            onValueChange={(value) => {
              field.onChange(value);
              if (props.onChange) {
                props.onChange(value);
              }
            }}
          >
            <SelectTrigger className="rounded-lg border border-gray-200 bg-white hover:border-pink-300 focus:border-pink-300 focus:ring-1 focus:ring-pink-300">
              <SelectValue placeholder={props.placeholder} />
            </SelectTrigger>
            <SelectContent className="border border-gray-200 shadow-lg rounded-lg">
              {props.children}
            </SelectContent>
          </Select>
        </FormControl>
      );

    case FormFieldType.NUMBER:
      return (
        <div className="flex rounded-md border border-custom-red-600 bg-light-600">
          <FormControl>
            <Input
              type="number"
              placeholder={props.placeholder}
              {...field}
              className="shad-input border-0"
              disabled={props.disabled}
              onClick={props.onClick}
              onChange={(e) => {
                const value = e.target.value;
                const numericValue = value !== "" ? parseFloat(value) : null;
                field.onChange(numericValue);
                if (props.onChange) {
                  props.onChange(
                    numericValue !== null ? numericValue.toString() : ""
                  );
                }
              }}
            />
          </FormControl>
        </div>
      );

    case FormFieldType.SKELETON:
      return props.renderSkeleton ? props.renderSkeleton(field) : null;

    default:
      return null;
  }
};

const CustomFormField = <TFieldValues extends FieldValues>(
  props: CustomProps<TFieldValues>
) => {
  const { control, name, label, mandatory } = props;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">
          {props.fieldType !== FormFieldType.CHECKBOX && label && (
            <FormLabel className={`text-sm font-medium mb-1.5 ${
              mandatory ? 'text-blue-700' : 'text-gray-700'
            }`}>
              {label}
              {mandatory && (
                <span className="text-red-600 ml-1">*</span>
              )}
            </FormLabel>
          )}
          <RenderInput field={field} props={props} />
          <FormMessage className="text-red-600 text-sm mt-1" />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;