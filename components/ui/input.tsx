import type { InputHTMLAttributes } from "react";

export function Input({
  label,
  helper,
  error,
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  helper?: string;
  error?: string;
}) {
  return (
    <label className="block">
      {label ? <span className="mb-2 block text-sm font-medium text-ink-800">{label}</span> : null}
      <input
        {...props}
        className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm text-ink-900 outline-none transition placeholder:text-muted-400 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 ${
          error ? "border-danger-500" : "border-ivory-200"
        } ${className}`}
      />
      {error ? <span className="mt-2 block text-sm text-danger-500">{error}</span> : helper ? <span className="mt-2 block text-sm text-muted-500">{helper}</span> : null}
    </label>
  );
}
