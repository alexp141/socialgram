import { useFormStatus } from "react-dom";

export default function SubmitButton({
  children,
  buttonStyle,
}: {
  children: React.ReactNode;
  buttonStyle: string;
}) {
  const { pending, data, method, action } = useFormStatus();

  return (
    <button type="submit" className={buttonStyle} disabled={pending}>
      {pending ? <span>Loading...</span> : children}
    </button>
  );
}
