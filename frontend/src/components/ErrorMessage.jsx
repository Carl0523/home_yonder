import { GrCircleAlert } from "react-icons/gr";

export default function ErrorMessage({ errorMessage, customCss = "" }) {
  return (
    <div
      className={`flex flex-col gap-2 items-center lg:w-4/6 w-5/6 p-3 text-center bg-alertContainer m-2 rounded-md shadow-xl sm:text-base text-sm ${customCss}`}
    >
      <GrCircleAlert className="text-alertFont sm:text-2xl text-xl" />
      <p className="text-alertFont">{errorMessage}</p>
    </div>
  );
}
