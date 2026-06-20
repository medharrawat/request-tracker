type NeedsActionMessageProps = {
  message: string;
};

export function NeedsActionMessage({ message }: NeedsActionMessageProps) {
  return <p className="text-sm text-pill-action-text">{message}</p>;
}
