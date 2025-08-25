"use client";

import { Suspense } from "react";
import AuthDebugComponent from "@/src/components/debug/auth-debug";

export default function DebugAuthPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Authentication Debug Tool
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Use this tool to diagnose cookie and authentication issues
          </p>
        </div>

        <Suspense fallback={
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        }>
          <AuthDebugComponent />
        </Suspense>

        <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-4xl mx-auto">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            🐛 Common Issues to Check
          </h3>

          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <div>
              <strong className="text-red-600 dark:text-red-400">Cloudflare __cf_bm Cookie Issues:</strong>
              <p>The "__cf_bm" cookie rejection warnings are usually harmless. They occur because:</p>
              <ul className="list-disc list-inside ml-4 mt-1">
                <li>Your frontend is on localhost/IP (192.168.1.189) but API is on .ondigitalocean.app domain</li>
                <li>Cloudflare sets domain=.ondigitalocean.app but browser rejects it for cross-origin requests</li>
                <li>This doesn't affect your refresh token cookie which should work independently</li>
              </ul>
            </div>

            <div>
              <strong className="text-orange-600 dark:text-orange-400">Token Refresh Loop:</strong>
              <p>If you see infinite refresh attempts, check:</p>
              <ul className="list-disc list-inside ml-4 mt-1">
                <li>Server response structure - does it return accessToken in the expected format?</li>
                <li>HTTP status code - 201 vs 200 shouldn't matter but client might expect 200</li>
                <li>Cookie path and domain settings for refreshToken cookie</li>
                <li>CORS configuration allowing credentials</li>
              </ul>
            </div>

            <div>
              <strong className="text-blue-600 dark:text-blue-400">Page Refresh Issues:</strong>
              <p>Access tokens are not persisted (by design) so page refresh should trigger silent refresh:</p>
              <ul className="list-disc list-inside ml-4 mt-1">
                <li>Only user data and isAuthenticated flag are persisted in localStorage</li>
                <li>accessToken is cleared on page load for security</li>
                <li>First API call should trigger silent refresh using HTTP-only refreshToken cookie</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
