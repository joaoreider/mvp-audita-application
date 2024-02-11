import { FaUpload } from "react-icons/fa6";
import { Input } from "./ui/input";
import FileItem from "./file-item";
export default function Uploader() {
  return (
    <div className="container">
      <div className="wrapper">
        <form
          action="#"
          className="relative flex flex-col items-center justify-center  p-2 w-full"
        >
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-64 cursor-pointer"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <FaUpload size={42} color="white" className="mb-4" />
              <span className="text-gray-400">
                Clique para carregar (máx 5MB)
              </span>
            </div>
            <input id="dropzone-file" type="file" className="hidden" />
          </label>
        </form>
      </div>
      <div className="files">
        <FileItem />
        <FileItem />
        <FileItem />
        <FileItem />
        <FileItem />
      </div>
    </div>
  );
}

{
  /* <FaUpload size={42} color="white" />
<Input
  type="file"
  id="file"
  className=""
  name="file"
  required
  hidden
  accept=".xls,.xlsx"
/>
<span className="text-gray-400">Clique para carregar (máx 5MB)</span> */
}
