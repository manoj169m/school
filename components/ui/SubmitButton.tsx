import Image from "next/image";
import { Button } from "./button";

interface ButtonProps {
  isLoading: boolean;
  className?: string;
  children: React.ReactNode;
}

const SubmitButton = ({ isLoading, className, children }: ButtonProps) => {
  return (
    <Button
      type="submit"
      disabled={isLoading}
      className={`w-full mt-3 text-white text-base cursor-pointer rounded-md py-4 px-4 transition-colors duration-300 ${
        className ?? "bg-gradient-to-r from-custom-pink-300 to-custom-pink-300 text-white"
      } hover:bg-gradient-to-l hover:from-custom-red-600 hover:to-custom-red-600 transition-colors duration-300`}
    >
      {isLoading ? (
        <div className="flex items-center gap-4">
          <Image
            src="/assets/icons/loader.svg"
            alt="loader"
            width={24}
            height={24}
            className="animate-spin"
          />
          Loading...
        </div>
      ) : (
        children
      )}
    </Button>
  );
};

export default SubmitButton;
