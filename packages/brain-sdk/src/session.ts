export interface Session {
  sessionId: string;
  userId: string;
  startedAt: number;
}

const USER_KEY = "pp_user_id";
const SESSION_KEY = "pp_session";
let cachedSession: Session | null = null;

function generateId() {
  return crypto.randomUUID();
}

/**
 * Get or create persistent user ID
 */
export function getUserId(): string {
  if (typeof window === "undefined") return "server";

  let id = localStorage.getItem(USER_KEY);

  if (!id) {
    id = generateId();
    localStorage.setItem(USER_KEY, id);
  }

  return id;
}

/**
 * Create new session every page load
 */
export function createSession(): Session {
  const session: Session = {
    sessionId: generateId(),
    userId: getUserId(),
    startedAt: Date.now(),
  };

  cachedSession = session;

  if (typeof window !== "undefined") {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  return session;
}
/**
 * Get active session
 */
export function getSession(): Session {
  if (typeof window === "undefined") {
    return {
      sessionId: "server",
      userId: "server",
      startedAt: Date.now(),
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Runtime Singleton
  |--------------------------------------------------------------------------
  */

  if (cachedSession) {
    return cachedSession;
  }

  /*
  |--------------------------------------------------------------------------
  | Session Storage
  |--------------------------------------------------------------------------
  */

  const existing = sessionStorage.getItem(SESSION_KEY);

  if (existing) {
    const parsedSession: Session = JSON.parse(existing);

    cachedSession = parsedSession;

    return parsedSession;
  }

  /*
  |--------------------------------------------------------------------------
  | First Session
  |--------------------------------------------------------------------------
  */

  cachedSession = createSession();

  return cachedSession;
}
