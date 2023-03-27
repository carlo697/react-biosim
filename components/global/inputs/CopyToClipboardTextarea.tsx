import classNames from "classnames";
import { PropsWithChildren, useRef } from "react";
import { FaClipboard } from "react-icons/fa";
import TextareaAutosize, {
  TextareaAutosizeProps,
} from "react-textarea-autosize";

interface Props
  extends PropsWithChildren,
    TextareaAutosizeProps,
    React.RefAttributes<HTMLTextAreaElement> {}

export default function CopyToClipboardTextarea({ children, ...rest }: Props) {
  const textarea = useRef<HTMLTextAreaElement>(null);

  const handleClick = () => {
    if (textarea.current) {
      // Select the text field
      textarea.current.select();

      // Copy the text inside the text field
      navigator.clipboard.writeText(textarea.current.value);
    }
  };

  return (
    <div className="relative">
      <TextareaAutosize
        className="word-spacing-md w-full resize-none bg-grey-mid p-3 text-xs"
        readOnly
        ref={textarea}
        {...rest}
      >
        {children}
      </TextareaAutosize>
      <button
        className={classNames(
          "m-1 aspect-square rounded-md bg-blue px-2 leading-none text-white",
          "absolute right-0 top-0",
          "hover:brightness-75"
        )}
        onClick={handleClick}
      >
        <FaClipboard className="inline-block" />
      </button>
    </div>
  );
}
