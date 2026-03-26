"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type AlertType = "price" | "volume" | "headline";

type PriceAlertDialogProps = {
  symbol?: string;
};

export function PriceAlertDialog({ symbol: initialSymbol }: PriceAlertDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const [alertType, setAlertType] = useState<AlertType>("price");
  const [symbol, setSymbol] = useState(initialSymbol ?? "");
  const [targetPrice, setTargetPrice] = useState("");
  const [volumeThreshold, setVolumeThreshold] = useState("");
  const [keyword, setKeyword] = useState("");
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    setSymbol(initialSymbol ?? "");
  }, [initialSymbol]);

  const resetForm = useCallback(() => {
    setAlertType("price");
    setSymbol(initialSymbol ?? "");
    setTargetPrice("");
    setVolumeThreshold("");
    setKeyword("");
    setSaving(false);
    setValidationError(null);
    setFeedback(null);
  }, [initialSymbol]);

  const openDialog = () => {
    resetForm();
    dialogRef.current?.showModal();
    setTimeout(() => firstInputRef.current?.focus(), 0);
  };

  const closeDialog = () => {
    dialogRef.current?.close();
    triggerRef.current?.focus();
  };

  const validate = (): boolean => {
    if (!symbol.trim()) {
      setValidationError("Symbol is required.");
      return false;
    }

    if (alertType === "price") {
      const num = Number(targetPrice);
      if (!targetPrice.trim() || isNaN(num) || num <= 0) {
        setValidationError("Enter a valid target price greater than 0.");
        return false;
      }
    }

    if (alertType === "volume") {
      const num = Number(volumeThreshold);
      if (!volumeThreshold.trim() || isNaN(num) || num <= 0 || !Number.isInteger(num)) {
        setValidationError("Enter a valid whole-number volume threshold greater than 0.");
        return false;
      }
    }

    if (alertType === "headline") {
      if (!keyword.trim()) {
        setValidationError("Enter at least one keyword.");
        return false;
      }
    }

    setValidationError(null);
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setSaving(true);
    setFeedback(null);

    const body: Record<string, string | number> = {
      symbol: symbol.trim().toUpperCase(),
      type: alertType,
    };

    if (alertType === "price") body.targetPrice = Number(targetPrice);
    if (alertType === "volume") body.volumeThreshold = Number(volumeThreshold);
    if (alertType === "headline") body.keyword = keyword.trim();

    try {
      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? `Request failed (${res.status})`);
      }

      setFeedback({ type: "success", message: "Alert saved successfully." });
      setTimeout(() => closeDialog(), 1200);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save alert.";
      setFeedback({ type: "error", message });
      setSaving(false);
    }
  };

  const alertTypeLabel: Record<AlertType, string> = {
    price: "Price crosses",
    volume: "Volume spike",
    headline: "Headline keyword",
  };

  return (
    <div>
      <button
        ref={triggerRef}
        type="button"
        className="text-sm font-medium text-neutral-900"
        onClick={openDialog}
      >
        New alert
      </button>

      <dialog
        ref={dialogRef}
        className="w-full max-w-md rounded-lg border border-neutral-200 bg-white p-0 shadow-lg backdrop:bg-black/40"
        onClose={resetForm}
      >
        <div className="p-4 text-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-neutral-900">Create alert</h2>
            <button
              type="button"
              className="text-xs text-neutral-500 hover:text-neutral-900"
              onClick={closeDialog}
              aria-label="Close"
            >
              &#x2715;
            </button>
          </div>

          <fieldset className="mt-3" disabled={saving}>
            <label className="block text-neutral-700">
              Symbol
              <input
                ref={firstInputRef}
                type="text"
                value={symbol}
                onChange={(e) => { setSymbol(e.target.value); setValidationError(null); }}
                placeholder="e.g. AAPL"
                className="mt-1 w-full rounded border px-2 py-1 uppercase"
              />
            </label>

            <label className="mt-3 block text-neutral-700">
              Alert type
              <select
                value={alertType}
                onChange={(e) => { setAlertType(e.target.value as AlertType); setValidationError(null); }}
                className="mt-1 w-full rounded border px-2 py-1"
              >
                {(Object.keys(alertTypeLabel) as AlertType[]).map((key) => (
                  <option key={key} value={key}>{alertTypeLabel[key]}</option>
                ))}
              </select>
            </label>

            {alertType === "price" && (
              <label className="mt-3 block text-neutral-700">
                Target price
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={targetPrice}
                  onChange={(e) => { setTargetPrice(e.target.value); setValidationError(null); }}
                  placeholder="0.00"
                  className="mt-1 w-full rounded border px-2 py-1"
                />
              </label>
            )}

            {alertType === "volume" && (
              <label className="mt-3 block text-neutral-700">
                Volume threshold
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={volumeThreshold}
                  onChange={(e) => { setVolumeThreshold(e.target.value); setValidationError(null); }}
                  placeholder="e.g. 1000000"
                  className="mt-1 w-full rounded border px-2 py-1"
                />
              </label>
            )}

            {alertType === "headline" && (
              <label className="mt-3 block text-neutral-700">
                Keyword
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => { setKeyword(e.target.value); setValidationError(null); }}
                  placeholder="e.g. earnings"
                  className="mt-1 w-full rounded border px-2 py-1"
                />
              </label>
            )}
          </fieldset>

          {validationError && (
            <p className="mt-2 text-xs text-red-600" role="alert">{validationError}</p>
          )}

          {feedback && (
            <p
              className={`mt-2 text-xs ${feedback.type === "success" ? "text-emerald-600" : "text-red-600"}`}
              role="status"
            >
              {feedback.message}
            </p>
          )}

          <div className="mt-4 flex items-center justify-end gap-2">
            <button
              type="button"
              className="text-xs text-neutral-500 hover:text-neutral-900"
              onClick={closeDialog}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded bg-neutral-900 px-3 py-1 text-xs text-white hover:bg-neutral-800 disabled:opacity-50"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving\u2026" : "Save"}
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
