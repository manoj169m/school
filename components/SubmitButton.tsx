import Image from "next/image";
import { Button } from "./ui/button";

interface ButtonProps {
  isLoading: boolean;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void; 
}

const SubmitButton = ({
  isLoading,
  disabled,
  className,
  children,
  onClick,
}: ButtonProps) => {
  return (
    <Button
      type="button" // Change to button type
      disabled={isLoading || disabled} // Disable if loading or if disabled prop is true
      className={
        className ?? "bg-custom-pink-300 hover:bg-custom-red-600 mr-4 mt-3"
      }
      onClick={onClick} 
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
