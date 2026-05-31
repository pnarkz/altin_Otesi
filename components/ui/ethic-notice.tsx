import { ShieldCheck } from "lucide-react";

export function EthicNotice({ children }: { children: string }) {
  return (
    <div className="rounded-2xl border border-ivory-200 bg-white px-5 py-4">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ivory-100 text-burgundy">
          <ShieldCheck className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-medium text-ink-900">Etik Uyarı</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-500">{children}</p>
        </div>
      </div>
    </div>
  );
}
