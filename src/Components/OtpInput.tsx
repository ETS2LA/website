import { useRef } from "react";

/** 6-digit OTP entry, mirroring the app's segmented input. */
export function OtpInput({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.padEnd(6, " ").slice(0, 6).split("");

  const commit = (next: string) => onChange(next.trimEnd());

  const handleInput = (index: number, raw: string) => {
    const digit = raw.replace(/\D/g, "").slice(-1);
    const chars = value.padEnd(6, " ").slice(0, 6).split("");

    if (digit) {
      chars[index] = digit;
      commit(chars.join(""));
      refs.current[Math.min(index + 1, 5)]?.focus();
    } else {
      chars[index] = " ";
      commit(chars.join(""));
    }
  };

  const handleKeyDown = (index: number, key: string) => {
    if (key === "Backspace" && !value[index]?.trim() && index > 0) {
      refs.current[index - 1]?.focus();
    }
    if (key === "ArrowLeft") refs.current[index - 1]?.focus();
    if (key === "ArrowRight") refs.current[index + 1]?.focus();
  };

  const handlePaste = (text: string) => {
    const pasted = text.replace(/\D/g, "").slice(0, 6);
    if (pasted) commit(pasted);
  };

  return (
    <div className="flex items-center gap-2">
      {digits.map((digit, index) => (
        <div key={index} className="flex items-center gap-2">
          {index === 3 && <span className="text-description">-</span>}
          <input
            ref={(el) => {
              refs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={1}
            disabled={disabled}
            value={digit.trim()}
            onChange={(e) => handleInput(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e.key)}
            onPaste={(e) => {
              e.preventDefault();
              handlePaste(e.clipboardData.getData("text"));
            }}
            className="size-10 rounded-sm border border-bg-darker bg-control-bg-dark text-center font-mono text-lg text-text-h outline-none transition-colors focus:border-accent-dark disabled:opacity-50"
          />
        </div>
      ))}
    </div>
  );
}
