import { Button } from "./ui/button";

export default function SubmitButton({ ...rest }) {
  return (
    <div className="flex items-stretch">
      <div className="self-center flex-1 text-center">
        <Button
          {...rest}
          className=" shadow-xl text-white font-semibold rounded-md px-4  py-6 w-48"
        >
          ANALISAR
        </Button>
      </div>
    </div>
  );
}
