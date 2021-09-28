import {
  ChangeEventHandler,
  createRef,
  FC,
  KeyboardEventHandler,
  useEffect,
  useState,
} from "react";

type Props = {
  command: (cmd: string) => Promise<string>;
};

const defaultHistory = `
Welcome to Postgres Playground!
`;

const Terminal: FC<Props> = (props) => {
  const [history, setHistory] = useState<string>(defaultHistory);
  const [textareaContent, setTextareaContent] = useState<string>("");
  const [textareaRows, setTextareaRows] = useState<number>(1);

  const textareaRef = createRef<HTMLTextAreaElement>();

  useEffect(() => textareaRef.current?.scrollIntoView(), [textareaRef, textareaRows]);

  const addHistory = (line: string) => {
    setHistory(history + line);
  };

  const handleChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setTextareaContent(e.currentTarget.value);
  };

  const handleKeyPress: KeyboardEventHandler<HTMLTextAreaElement> = async (
    e
  ) => {
    switch (e.key) {
      case "Enter":
        if (textareaContent.trimEnd().endsWith(";")) {
          e.preventDefault();

          const res = await props.command(textareaContent);
          addHistory(`> ${textareaContent}\n${res}\n`);

          setTextareaContent("");
        } else {
          setTextareaRows(textareaRows + 1);
        }
        break;
      default:
        break;
    }

    textareaRef.current?.scrollIntoView();
  };

  return (
    <>
      <div className="flex flex-col w-full h-full bg-black text-green-500">
        <pre>{history}</pre>
        <div className="flex w-full">
          <pre className="flex-initial">{"> "}</pre>
          <textarea
            className="flex-auto outline-none bg-black text-green-500"
            rows={textareaRows}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            value={textareaContent}
            ref={textareaRef}
          />
        </div>
      </div>
    </>
  );
};

export default Terminal;
