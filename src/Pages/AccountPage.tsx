import { useState } from "react";
import { useAuth } from "../Components/useAuth";
import { OtpInput } from "../Components/OtpInput";

/** `2026-10-26T19:53:00Z` -> `26.10.2026 19:53` */
function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be blocked; the text is visible to copy manually.
    }
  };

  return (
    <button type="button" onClick={copy} className="button button-small">
      {copied ? "Copied!" : label}
    </button>
  );
}

function LoginFlow() {
  const { login, loginWithToken, busy } = useAuth();
  const [mode, setMode] = useState<"login" | "token">("login");
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setError(null);
    setOtp("");
  };

  const submitLogin = async () => {
    reset();
    if (!username.trim()) return setError("Please enter a username.");
    if (otp.length < 6) return setError("Please enter the 6-digit OTP code.");
    setError(await login(username.trim(), otp));
  };

  const submitToken = async () => {
    reset();
    setError(await loginWithToken(token));
  };

  const tab = (id: typeof mode, label: string) => (
    <button
      type="button"
      onClick={() => {
        setMode(id);
        setError(null);
      }}
      className={`rounded-sm border px-3 py-1.5 text-[12px] transition-all ${
        mode === id
          ? "border-accent-dark text-text-h"
          : "border-bg-darker text-text-l hover:border-accent-dark"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="w-full max-w-lg rounded-sm border border-bg-darker bg-control-bg-dark p-5">
      <div className="flex flex-wrap items-center gap-2">
        {tab("login", "Log in")}
        {tab("token", "Use app token")}
      </div>

      {mode === "login" && (
        <>
          <p className="description mt-4">
            Enter the OTP code from your authenticator app. ETS2LA never asks
            for a password, and accounts are registered inside the app.
          </p>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="mt-3 w-full rounded-sm border border-bg-darker bg-control-bg px-3 py-2 text-sm outline-none transition-colors placeholder:text-description focus:border-accent-dark"
          />
          <p className="description mt-3">One Time Password</p>
          <div className="mt-2">
            <OtpInput value={otp} onChange={setOtp} disabled={busy} />
          </div>
          <button
            type="button"
            onClick={submitLogin}
            disabled={busy}
            className="button button-accent mt-4 disabled:opacity-50"
          >
            {busy ? "Logging in…" : "Log in"}
          </button>
        </>
      )}

      {mode === "token" && (
        <>
          <p className="description mt-4">
            In ETS2LA, open <span className="text-text-l">Settings → Account</span>{" "}
            and press <span className="text-text-l">Display JWT Token</span>, then
            paste it here.
          </p>
          <textarea
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="eyJhbGciOi..."
            rows={4}
            className="mt-3 w-full resize-y rounded-sm border border-bg-darker bg-control-bg px-3 py-2 font-mono text-xs outline-none transition-colors placeholder:text-description focus:border-accent-dark"
          />
          <button
            type="button"
            onClick={submitToken}
            disabled={busy}
            className="button button-accent mt-4 disabled:opacity-50"
          >
            {busy ? "Checking…" : "Use this token"}
          </button>
        </>
      )}

      {error && (
        <p className="mt-3 rounded-sm border border-danger/60 bg-danger-bg px-3 py-2 text-sm">
          {error}
        </p>
      )}
    </div>
  );
}

function AccountDetails() {
  const { account, logout, removeAccount, busy } = useAuth();
  const [showToken, setShowToken] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!account) return null;

  return (
    <div className="w-full max-w-lg rounded-sm border border-bg-darker bg-control-bg-dark p-5">
      <p className="description">
        You are currently logged in as{" "}
        <span className="font-semibold text-text-l">{account.username}</span>. [
        {account.role}]
      </p>
      <p className="description mt-2">
        Your token will expire on{" "}
        <span className="text-text-l">{formatDate(account.expiry)}</span>,{" "}
        {account.method === "token"
          ? "you'll be asked to paste a new one then."
          : "you'll be asked to log in again then."}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setShowToken((value) => !value)}
          className="button"
        >
          {showToken ? "Hide JWT Token" : "Display JWT Token"}
        </button>
        <button type="button" onClick={logout} className="button">
          {account.method === "token" ? "Forget token" : "Log out"}
        </button>
        <button
          type="button"
          onClick={() => setConfirmRemove(true)}
          className="button"
        >
          Remove account
        </button>
      </div>

      {showToken && (
        <>
          <p className="description mt-4">
            Some third party sites may ask for your token. Only copy it to sites
            you trust.
          </p>
          <p className="description mt-1 text-text-accent">
            This token can do ANYTHING on your behalf.
          </p>
          <div className="mt-2 flex items-start gap-2">
            <textarea
              readOnly
              value={account.token}
              rows={3}
              className="w-full resize-y rounded-sm border border-bg-darker bg-control-bg px-3 py-2 font-mono text-xs outline-none"
            />
            <CopyButton text={account.token} label="Copy" />
          </div>
        </>
      )}

      {confirmRemove && (
        <div className="mt-4 rounded-sm border border-danger/60 bg-danger-bg p-3">
          <p className="text-sm">
            Removing your account will delete all your data from our servers.
            This action cannot be undone.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={async () => {
                const message = await removeAccount();
                setError(message);
                if (!message) setConfirmRemove(false);
              }}
              className="button button-small disabled:opacity-50"
            >
              Confirm account removal
            </button>
            <button
              type="button"
              onClick={() => setConfirmRemove(false)}
              className="button button-small"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-3 rounded-sm border border-danger/60 bg-danger-bg px-3 py-2 text-sm">
          {error}
        </p>
      )}
    </div>
  );
}

export function AccountPage() {
  const { account } = useAuth();

  return (
    <>
      <section className="w-full h-[40vh] bg-bg">
        <div className="mx-auto flex flex-col gap-2 h-full max-w-5xl items-start justify-end p-4 py-8">
          <h1 className="text-4xl!">Account</h1>
          <p className="max-w-2xl">
            Log in to use the server-side features of ETS2LA, or manage the
            account you're already signed in with.
          </p>
        </div>
      </section>

      <div className="mx-auto w-full max-w-5xl px-4 pt-10">
        {account ? <AccountDetails /> : <LoginFlow />}
      </div>
    </>
  );
}
