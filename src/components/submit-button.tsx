import { Button } from "./ui/button";

interface SubmitButtonProps {
  onClick: () => void;
  className: string;
  text: string;
  variant?: "default" | "secondary" | "outline";
}

export default function SubmitButton({
  onClick,
  className,
  text,
  variant = "default",
}: SubmitButtonProps) {
  return (
    <div className="flex items-stretch">
      <div className="self-center flex-1 text-center">
        <Button onClick={onClick} className={className} variant={variant}>
          {text}
        </Button>
      </div>
    </div>
  );
}
