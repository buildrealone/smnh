import classNames from "../../libs/client/classNames";

// interface ButtonProps {
//   large?: boolean;
//   text: string;
//   [key: string]: any;
// }

export default function Button({
  large = false,
  onClick,
  text,
  ...rest
}) {
  return (
    <button
      {...rest}
      className={classNames(
        "w-full text-base bg-green-500 hover:bg-green-600 text-white px-4 py-2 border border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:outline-none",
        large ? "py-3" : ""
      )}
    >
      {text}
    </button>
  );
}