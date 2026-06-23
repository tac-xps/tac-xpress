"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect, useState } from "react";
import { testSentryServerAction } from "./actions";

class SentryExampleFrontendError extends Error {
  constructor(message: string | undefined) {
    super(message);
    this.name = "SentryExampleFrontendError";
  }
}

export default function Page() {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    async function checkConnectivity() {
      const result = await Sentry.diagnoseSdkConnectivity();
      setIsConnected(result !== "sentry-unreachable");
    }
    checkConnectivity();
  }, []);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-gray-50 p-6 dark:bg-gray-950">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-900">
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <div className="rounded-full bg-violet-100 p-4 dark:bg-violet-900/30">
            <svg
              height="40"
              width="40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Sentry logo"
              className="text-violet-600 dark:text-violet-400"
            >
              <path
                d="M21.85 2.995a3.698 3.698 0 0 1 1.353 1.354l16.303 28.278a3.703 3.703 0 0 1-1.354 5.053 3.694 3.694 0 0 1-1.848.496h-3.828a31.149 31.149 0 0 0 0-3.09h3.815a.61.61 0 0 0 .537-.917L20.523 5.893a.61.61 0 0 0-1.057 0l-3.739 6.494a28.948 28.948 0 0 1 9.63 10.453 28.988 28.988 0 0 1 3.499 13.78v1.542h-9.852v-1.544a19.106 19.106 0 0 0-2.182-8.85 19.08 19.08 0 0 0-6.032-6.829l-1.85 3.208a15.377 15.377 0 0 1 6.382 12.484v1.542H3.696A3.694 3.694 0 0 1 0 34.473c0-.648.17-1.286.494-1.849l2.33-4.074a8.562 8.562 0 0 1 2.689 1.536L3.158 34.17a.611.611 0 0 0 .538.917h8.448a12.481 12.481 0 0 0-6.037-9.09l-1.344-.772 4.908-8.545 1.344.77a22.16 22.16 0 0 1 7.705 7.444 22.193 22.193 0 0 1 3.316 10.193h3.699a25.892 25.892 0 0 0-3.811-12.033 25.856 25.856 0 0 0-9.046-8.796l-1.344-.772 5.269-9.136a3.698 3.698 0 0 1 3.2-1.849c.648 0 1.285.17 1.847.495Z"
                fill="currentcolor"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
            Sentry Debug Dashboard
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            Test the observability of your Next.js application across all boundaries.
          </p>
        </div>

        {!isConnected && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-center text-sm text-red-600 dark:bg-red-950/50 dark:text-red-400">
            <strong>Warning:</strong> Sentry network requests appear to be blocked (perhaps by an ad-blocker). Errors might not reach the dashboard.
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-1">
          {/* Client Error */}
          <button
            onClick={() => {
              throw new SentryExampleFrontendError("This error is raised synchronously on the client.");
            }}
            className="group relative flex w-full items-center justify-between overflow-hidden rounded-xl bg-violet-600 px-6 py-4 text-left font-semibold text-white shadow-md transition-all hover:bg-violet-700 active:scale-[0.98]"
          >
            <div>
              <div className="text-lg">Trigger Client Error</div>
              <div className="text-sm font-normal text-violet-200">Throws a React rendering/click error</div>
            </div>
            <div className="rounded-full bg-white/20 p-2 group-hover:bg-white/30">⚡</div>
          </button>

          {/* API Route Error */}
          <button
            onClick={async () => {
              await Sentry.startSpan(
                { name: "Client fetching API Route", op: "http.client" },
                async () => {
                  await fetch("/api/sentry-example-api");
                }
              );
            }}
            className="group relative flex w-full items-center justify-between overflow-hidden rounded-xl bg-blue-600 px-6 py-4 text-left font-semibold text-white shadow-md transition-all hover:bg-blue-700 active:scale-[0.98]"
          >
            <div>
              <div className="text-lg">Trigger API Route Error</div>
              <div className="text-sm font-normal text-blue-200">Calls a Route Handler that throws an error</div>
            </div>
            <div className="rounded-full bg-white/20 p-2 group-hover:bg-white/30">🌐</div>
          </button>

          {/* Server Action Error */}
          <button
            onClick={async () => {
              await Sentry.startSpan(
                { name: "Client invoking Server Action", op: "function" },
                async () => {
                  await testSentryServerAction();
                }
              );
            }}
            className="group relative flex w-full items-center justify-between overflow-hidden rounded-xl bg-emerald-600 px-6 py-4 text-left font-semibold text-white shadow-md transition-all hover:bg-emerald-700 active:scale-[0.98]"
          >
            <div>
              <div className="text-lg">Trigger Server Action Error</div>
              <div className="text-sm font-normal text-emerald-200">Calls a Next.js Server Action that throws an error</div>
            </div>
            <div className="rounded-full bg-white/20 p-2 group-hover:bg-white/30">⚙️</div>
          </button>
        </div>
      </div>
    </div>
  );
}
