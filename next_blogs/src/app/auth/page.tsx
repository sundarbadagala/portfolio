"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  getAuthSession,
  loginUser,
  registerUser,
  logoutUser,
} from "@/features/auth/services";
import type { UserProfile } from "@/features/auth/types";
import Container from "@/shared/components/Container";
import {
  FaEnvelope,
  FaLock,
  FaUser,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
  FaCalendarAlt,
  FaShieldAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaCircleNotch,
  FaArrowRight,
} from "react-icons/fa";

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");
  const targetUrl = redirectParam ? decodeURIComponent(redirectParam) : "/ai/chat";

  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form Fields
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Load session on mount
  useEffect(() => {
    fetchSession();
  }, []);

  // Clear messages when tab changes
  useEffect(() => {
    setErrorMsg(null);
    setSuccessMsg(null);
  }, [activeTab]);

  const fetchSession = async () => {
    setLoading(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const userData = await getAuthSession({ signal: controller.signal });
      clearTimeout(timeoutId);
      setUser(userData);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setActionLoading(true);

    try {
      const resData = await loginUser({ email, password });
      if (resData && resData.status === "success") {
        setSuccessMsg(resData.message || "Logged in successfully! Redirecting...");
        setTimeout(() => {
          router.push(targetUrl);
        }, 800);
      } else {
        setErrorMsg(resData.message || "Failed to log in.");
      }
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message || "An unexpected error occurred during login.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setActionLoading(true);
    try {
      const resData = await registerUser({
        username,
        email,
        password,
        confirmpassword: confirmPassword,
      });
      if (resData && resData.status === "success") {
        setSuccessMsg("Account created and logged in successfully! Redirecting...");
        setTimeout(() => {
          router.push(targetUrl);
        }, 800);
      } else {
        setErrorMsg(resData.message || "Failed to register.");
      }
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message || "An unexpected error occurred during registration.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const resData = await logoutUser();
      if (resData && resData.status === "success") {
        setUser(null);
        // Clear forms
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setSuccessMsg("Logged out successfully.");
      } else {
        setErrorMsg(resData.message || "Failed to log out cleanly.");
      }
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message || "Error logging out.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="px-4 py-16 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
      <div className="w-full max-w-md relative z-0">
        
        {/* Loading Indicator */}
        {loading ? (
          <div className="flex flex-col items-center justify-center p-8 bg-[var(--background)] border border-[var(--foreground)] rounded-2xl shadow-xl">
            <FaCircleNotch className="animate-spin text-4xl mb-4 opacity-75" />
            <p className="text-sm font-medium opacity-60">Checking user session...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {user ? (
              /* Profile Screen */
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-[var(--background)] border border-[var(--foreground)] rounded-2xl shadow-xl p-8 relative overflow-hidden"
              >
                {/* Background glow effects */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 blur-2xl rounded-full" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-violet-500/10 blur-2xl rounded-full" />

                <div className="flex flex-col items-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-4">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight">{user.username}</h2>
                  <p className="text-sm opacity-60 mt-1">{user.email}</p>
                </div>

                <div className="space-y-4 border-t border-[var(--foreground)] border-dashed pt-6 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="opacity-60 flex items-center gap-2">
                      <FaShieldAlt className="opacity-75" /> Role
                    </span>
                    <span className="font-semibold uppercase tracking-wider text-xs px-2 py-1 rounded bg-blue-500/10 text-blue-500">
                      {user.role}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="opacity-60 flex items-center gap-2">
                      <FaCalendarAlt className="opacity-75" /> Joined
                    </span>
                    <span className="font-medium">
                      {new Date(user.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {successMsg && (
                  <div className="mb-6 flex items-start gap-2 p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg text-sm">
                    <FaCheckCircle className="mt-0.5 shrink-0" />
                    <span>{successMsg}</span>
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  <Link
                    href={targetUrl}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 transition-all shadow-md"
                  >
                    <span>Continue to AI</span>
                    <FaArrowRight className="text-xs" />
                  </Link>

                  <button
                    id="auth-logout-btn"
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors shadow-md hover:shadow-lg"
                  >
                    <FaSignOutAlt /> Sign Out
                  </button>
                </div>
              </motion.div>
            ) : (
              /* Auth Forms (Login / Register) */
              <motion.div
                key="auth-forms"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-[var(--background)] border border-[var(--foreground)] rounded-2xl shadow-xl p-8"
              >
                {/* Tabs */}
                <div className="flex border-b border-[var(--foreground)] mb-6">
                  <button
                    id="tab-login"
                    onClick={() => setActiveTab("login")}
                    className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition-all ${
                      activeTab === "login"
                        ? "border-[var(--foreground)] opacity-100"
                        : "border-transparent opacity-40 hover:opacity-75"
                    }`}
                  >
                    Login
                  </button>
                  <button
                    id="tab-register"
                    onClick={() => setActiveTab("register")}
                    className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition-all ${
                      activeTab === "register"
                        ? "border-[var(--foreground)] opacity-100"
                        : "border-transparent opacity-40 hover:opacity-75"
                    }`}
                  >
                    Register
                  </button>
                </div>

                {/* Feedback Banners */}
                {errorMsg && (
                  <div className="mb-4 flex items-start gap-2 p-3 bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg text-sm">
                    <FaExclamationTriangle className="mt-0.5 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {successMsg && (
                  <div className="mb-4 flex items-start gap-2 p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg text-sm">
                    <FaCheckCircle className="mt-0.5 shrink-0" />
                    <span>{successMsg}</span>
                  </div>
                )}

                <AnimatePresence mode="wait">
                  {activeTab === "login" ? (
                    /* Login Form */
                    <motion.form
                      key="login-form"
                      onSubmit={handleLogin}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider opacity-60 mb-2" htmlFor="login-email">
                          Email Address
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 opacity-40">
                            <FaEnvelope />
                          </span>
                          <input
                            id="login-email"
                            type="email"
                            required
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={actionLoading}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--foreground)] bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider opacity-60 mb-2" htmlFor="login-password">
                          Password
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 opacity-40">
                            <FaLock />
                          </span>
                          <input
                            id="login-password"
                            type="password"
                            required
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={actionLoading}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--foreground)] bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                          />
                        </div>
                      </div>

                      <button
                        id="login-submit-btn"
                        type="submit"
                        disabled={actionLoading}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 mt-6 rounded-xl font-semibold bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-55 shadow-md"
                      >
                        {actionLoading ? (
                          <FaCircleNotch className="animate-spin" />
                        ) : (
                          <>
                            <FaSignInAlt /> Sign In
                          </>
                        )}
                      </button>
                    </motion.form>
                  ) : (
                    /* Register Form */
                    <motion.form
                      key="register-form"
                      onSubmit={handleRegister}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider opacity-60 mb-2" htmlFor="register-username">
                          Username
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 opacity-40">
                            <FaUser />
                          </span>
                          <input
                            id="register-username"
                            type="text"
                            required
                            placeholder="johndoe"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={actionLoading}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--foreground)] bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider opacity-60 mb-2" htmlFor="register-email">
                          Email Address
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 opacity-40">
                            <FaEnvelope />
                          </span>
                          <input
                            id="register-email"
                            type="email"
                            required
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={actionLoading}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--foreground)] bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider opacity-60 mb-2" htmlFor="register-password">
                          Password
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 opacity-40">
                            <FaLock />
                          </span>
                          <input
                            id="register-password"
                            type="password"
                            required
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={actionLoading}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--foreground)] bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider opacity-60 mb-2" htmlFor="register-confirmpassword">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 opacity-40">
                            <FaLock />
                          </span>
                          <input
                            id="register-confirmpassword"
                            type="password"
                            required
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={actionLoading}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--foreground)] bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                          />
                        </div>
                      </div>

                      <button
                        id="register-submit-btn"
                        type="submit"
                        disabled={actionLoading}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 mt-6 rounded-xl font-semibold bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-55 shadow-md"
                      >
                        {actionLoading ? (
                          <FaCircleNotch className="animate-spin" />
                        ) : (
                          <>
                            <FaUserPlus /> Sign Up
                          </>
                        )}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </Container>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <Container className="px-4 py-16 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="flex flex-col items-center justify-center p-8 bg-[var(--background)] border border-[var(--foreground)] rounded-2xl shadow-xl">
            <FaCircleNotch className="animate-spin text-4xl mb-4 opacity-75" />
            <p className="text-sm font-medium opacity-60">Loading...</p>
          </div>
        </Container>
      }
    >
      <AuthContent />
    </Suspense>
  );
}

