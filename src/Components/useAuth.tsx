import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

/** API hosts, tried in order (`.com`, then the mainland `.cn` mirror). */
export const API_HOSTS = ["https://api.ets2la.com", "https://api.ets2la.cn"];

export type UserRole = "User" | "Admin" | "Developer";

export type Account = {
  id: string;
  username: string;
  role: UserRole;
  token: string;
  /** ISO timestamp, derived from the JWT `exp` claim or the login response. */
  expiry: string;
  /**
   * How this session was established. Tokens pasted from the ETS2LA app belong
   * to that app's session, so signing out here must not revoke them server-side.
   */
  method: "otp" | "token";
};

type ApiUserInfo = { id: string; username: string; role: UserRole };

const STORAGE_KEY = "ets2la.account";

/** Decodes a JWT payload without verifying it (we only read `exp`). */
function decodeJwt(token: string): { exp?: number } | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json) as { exp?: number };
  } catch {
    return null;
  }
}

function loadStored(): Account | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const account = JSON.parse(raw) as Account;
    // Drop tokens we know have expired.
    if (!account.token || new Date(account.expiry).getTime() <= Date.now()) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return account;
  } catch {
    return null;
  }
}

type PostResult<T> =
  | { ok: true; status: number; data: T }
  | { ok: false; status: number };

/** Posts JSON to the first API host that responds, falling through on 5xx. */
async function postJson<T>(
  path: string,
  body: unknown,
  token?: string,
): Promise<PostResult<T>> {
  let lastStatus = 0;
  for (const host of API_HOSTS) {
    try {
      const res = await fetch(`${host}/api/v1${path}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
      if (res.status >= 500) {
        lastStatus = res.status;
        continue;
      }
      const text = await res.text();
      return {
        ok: res.ok,
        status: res.status,
        data: text ? (JSON.parse(text) as T) : ({} as T),
      };
    } catch {
      lastStatus = 0; // network error, try the next host
    }
  }
  return { ok: false, status: lastStatus };
}

/** Resolves the account behind a token, trying each API host. */
async function fetchUserInfo(token: string): Promise<ApiUserInfo | null> {
  for (const host of API_HOSTS) {
    try {
      const res = await fetch(`${host}/api/v1/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) return (await res.json()) as ApiUserInfo;
      if (res.status === 401) return null;
    } catch {
      // try the next host
    }
  }
  return null;
}

type AuthValue = {
  account: Account | null;
  busy: boolean;
  login: (username: string, otp: string) => Promise<string | null>;
  loginWithToken: (token: string) => Promise<string | null>;
  logout: () => Promise<void>;
  removeAccount: () => Promise<string | null>;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<Account | null>(loadStored);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (account) localStorage.setItem(STORAGE_KEY, JSON.stringify(account));
    else localStorage.removeItem(STORAGE_KEY);
  }, [account]);

  // Stay in sync when the token changes in another tab.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) setAccount(loadStored());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = useCallback(
    async (username: string, otp: string): Promise<string | null> => {
      setBusy(true);
      try {
        const res = await postJson<{ token?: string; expiry?: string }>(
          "/users/login",
          { username, otpcode: otp },
        );
        if (!res.ok || !res.data.token) {
          if (res.status === 429) {
            return "Too many requests. Please wait a moment and try again.";
          }
          return "Login failed. Check your username and OTP code.";
        }

        const info = await fetchUserInfo(res.data.token);
        if (!info) return "Logged in, but the server rejected the token.";

        const exp = decodeJwt(res.data.token)?.exp;
        setAccount({
          id: info.id,
          username: info.username,
          role: info.role,
          token: res.data.token,
          expiry:
            res.data.expiry ??
            (exp ? new Date(exp * 1000).toISOString() : new Date().toISOString()),
          method: "otp",
        });
        return null;
      } finally {
        setBusy(false);
      }
    },
    [],
  );

  /** Accepts a JWT copied out of the ETS2LA app. */
  const loginWithToken = useCallback(
    async (token: string): Promise<string | null> => {
      const trimmed = token.trim();
      if (!trimmed) return "Paste a token first.";

      setBusy(true);
      try {
        const info = await fetchUserInfo(trimmed);
        if (!info) return "That token was rejected. Make sure it's still valid.";

        const exp = decodeJwt(trimmed)?.exp;
        if (exp && exp * 1000 <= Date.now()) {
          return "That token has already expired. Copy a fresh one from ETS2LA.";
        }

        setAccount({
          id: info.id,
          username: info.username,
          role: info.role,
          token: trimmed,
          expiry: new Date((exp ?? Date.now() / 1000 + 86400) * 1000).toISOString(),
          method: "token",
        });
        return null;
      } finally {
        setBusy(false);
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    const token = account?.token;
    // A pasted token belongs to the ETS2LA app's session, so only forget it
    // here rather than ending that session on the server.
    const revoke = account?.method === "otp";
    setAccount(null);
    if (revoke && token) {
      await postJson("/users/logout", undefined, token).catch(() => {});
    }
  }, [account]);

  const removeAccount = useCallback(async (): Promise<string | null> => {
    if (!account) return "You're not logged in.";
    setBusy(true);
    try {
      const res = await postJson("/users/remove", undefined, account.token);
      if (!res.ok) return "Failed to remove the account. Please try again.";
      setAccount(null);
      return null;
    } finally {
      setBusy(false);
    }
  }, [account]);

  return (
    <AuthContext.Provider
      value={{
        account,
        busy,
        login,
        loginWithToken,
        logout,
        removeAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside an AuthProvider");
  return value;
}
