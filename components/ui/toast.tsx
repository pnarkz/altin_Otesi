import { useEffect, type ReactNode } from "react";
import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from "lucide-react";
import { ToastTone } from "@/types";

const toneMap: Record<
  ToastTone,
  { className: string; icon: ReactNode }
> = {
  success: {
    className: "border-success-500/20 bg-success-100 text-success-500",
    icon: <CheckCircle2 className="h-4 w-4" />
  },
  error: {
    className: "border-danger-500/20 bg-danger-100 text-danger-500",
    icon: <AlertCircle className="h-4 w-4" />
  },
  warning: {
    className: "border-warning-500/20 bg-warning-100 text-warning-500",
    icon: <TriangleAlert className="h-4 w-4" />
  },
  info: {
    className: "border-info-500/20 bg-info-100 text-info-500",
    icon: <Info className="h-4 w-4" />
  }
};

export function Toast({
  open,
  title,
  description,
  tone = "info",
  onClose
}: {
  open: boolean;
  title: string;
  description?: string;
  tone?: ToastTone;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(onClose, 2600);
    return () => window.clearTimeout(timer);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm animate-[fadeIn_0.2s_ease]">
      <div className={`rounded-2xl border px-4 py-3 shadow-card ${toneMap[tone].className}`}>
        <div className="flex items-start gap-3">
          <div className="mt-0.5">{toneMap[tone].icon}</div>
          <div className="flex-1">
            <p className="text-sm font-medium">{title}</p>
            {description ? <p className="mt-1 text-sm opacity-90">{description}</p> : null}
          </div>
          <button type="button" onClick={onClose} className="opacity-70 transition hover:opacity-100">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
