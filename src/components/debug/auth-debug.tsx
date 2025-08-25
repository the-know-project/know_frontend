"use client";

import { useState } from "react";
import { httpClient } from "@/src/lib/http-client";
import { AuthDebugger } from "@/src/lib/debug-utils";
import { useTokenStore } from "@/src/features/auth/state/store";

export const AuthDebugComponent = () => {
  const [debugOutput, setDebugOutput] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const tokenStore = useTokenStore();

  const logToOutput = (message: string) => {
    setDebugOutput((prev) => prev + message + "\n");
  };

  const clearOutput = () => {
    setDebugOutput("");
  };

  const testRefreshToken = async () => {
    setIsLoading(true);
    clearOutput();

    try {
      logToOutput("🔄 Testing refresh token manually...");

      const baseURL = httpClient.getBaseURL();
      logToOutput(`📡 Base URL: ${baseURL}`);

      // Test with httpClient's public method
      const result = await httpClient.attemptPublicSilentRefresh();

      logToOutput(`📊 Refresh Result: ${JSON.stringify(result, null, 2)}`);

      if (result.success) {
        logToOutput("✅ Refresh token test successful!");
        logToOutput(
          `🔑 Access Token: ${result.accessToken?.substring(0, 50)}...`,
        );
        logToOutput(`👤 User Data: ${JSON.stringify(result.user, null, 2)}`);
      } else {
        logToOutput("❌ Refresh token test failed!");
        logToOutput(`🚫 Error: ${result.error}`);
      }
    } catch (error) {
      logToOutput(`💥 Exception during refresh test: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testRefreshTokenParsing = async () => {
    setIsLoading(true);
    clearOutput();

    try {
      logToOutput("🔄 Testing refresh token with fixed parsing...");

      const result = await httpClient.attemptPublicSilentRefresh();

      logToOutput(`📊 Refresh Result: ${JSON.stringify(result, null, 2)}`);

      if (result.success && result.accessToken) {
        logToOutput("🎉 SUCCESS! The parsing fix worked!");
        logToOutput(
          `🔑 Access Token: ${result.accessToken.substring(0, 50)}...`,
        );
        logToOutput(`👤 User Data: ${JSON.stringify(result.user, null, 2)}`);

        // Test if we can update the token store
        const userToStore = result.user || tokenStore.user;
        if (userToStore) {
          tokenStore.setAccessToken(result.accessToken, userToStore);
          logToOutput("✅ Token successfully stored in auth store");
          logToOutput("🔄 Try making a request now - it should work!");
        }
      } else {
        logToOutput("❌ Parsing fix didn't work. Still failing...");
        logToOutput(`🚫 Error: ${result.error}`);
      }
    } catch (error) {
      logToOutput(`💥 Exception during parsing test: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testCookies = () => {
    clearOutput();

    // Capture console output
    const originalLog = console.log;
    const originalGroup = console.group;
    const originalGroupEnd = console.groupEnd;
    const originalWarn = console.warn;
    const originalError = console.error;

    console.log = (...args) => {
      logToOutput(args.join(" "));
      originalLog(...args);
    };

    console.group = (...args) => {
      logToOutput(`📁 ${args.join(" ")}`);
      originalGroup(...args);
    };

    console.groupEnd = () => {
      logToOutput("📁 ---");
      originalGroupEnd();
    };

    console.warn = (...args) => {
      logToOutput(`⚠️ ${args.join(" ")}`);
      originalWarn(...args);
    };

    console.error = (...args) => {
      logToOutput(`❌ ${args.join(" ")}`);
      originalError(...args);
    };

    try {
      AuthDebugger.logAllCookies();
      AuthDebugger.testCookieSettings();
      AuthDebugger.analyzeCloudflareCookies();
    } finally {
      // Restore console methods
      console.log = originalLog;
      console.group = originalGroup;
      console.groupEnd = originalGroupEnd;
      console.warn = originalWarn;
      console.error = originalError;
    }
  };

  const testLoginCookies = async () => {
    clearOutput();
    logToOutput("🔐 Testing login cookie flow...");

    try {
      const baseURL = httpClient.getBaseURL();
      logToOutput(`📡 Base URL: ${baseURL}`);

      // Show cookies before login attempt
      logToOutput("🍪 Cookies BEFORE login test:");
      document.cookie.split(";").forEach((cookie, index) => {
        logToOutput(`  ${index + 1}. ${cookie.trim()}`);
      });

      // Try a mock login to see what cookies get set
      logToOutput(
        "⚠️ Note: This is just testing cookie behavior, not actually logging in",
      );

      const response = await fetch(`${baseURL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: "test@example.com",
          password: "test",
        }),
      });

      logToOutput(`📊 Login test response status: ${response.status}`);

      // Log response headers to see Set-Cookie
      logToOutput("📋 Response headers:");
      response.headers.forEach((value, key) => {
        logToOutput(`  ${key}: ${value}`);
      });

      // Show cookies after login attempt
      logToOutput("🍪 Cookies AFTER login test:");
      document.cookie.split(";").forEach((cookie, index) => {
        logToOutput(`  ${index + 1}. ${cookie.trim()}`);
      });

      // Check specifically for refreshToken
      const hasRefreshToken = document.cookie.includes("refreshToken=");
      logToOutput(`🔍 RefreshToken cookie present: ${hasRefreshToken}`);
    } catch (error) {
      logToOutput(`❌ Login cookie test failed: ${error}`);
    }
  };

  const runCookieDiagnostics = () => {
    clearOutput();
    logToOutput("🔬 Running comprehensive cookie diagnostics...");

    // Test 1: Check if cookies are enabled
    logToOutput("\n📋 Test 1: Cookie Support Check");
    const cookiesEnabled = navigator.cookieEnabled;
    logToOutput(`🍪 Browser cookies enabled: ${cookiesEnabled}`);

    // Test 2: Check current location details
    logToOutput("\n📋 Test 2: Location Analysis");
    logToOutput(`🌐 Protocol: ${window.location.protocol}`);
    logToOutput(`🌐 Hostname: ${window.location.hostname}`);
    logToOutput(`🌐 Port: ${window.location.port || "default"}`);
    logToOutput(`🌐 Origin: ${window.location.origin}`);
    logToOutput(`🔒 Is HTTPS: ${window.location.protocol === "https:"}`);

    // Test 3: Try setting different types of cookies
    logToOutput("\n📋 Test 3: Cookie Setting Tests");

    const testCookies = [
      { name: "test1", value: "simple", options: "" },
      { name: "test2", value: "with-path", options: "; path=/" },
      {
        name: "test3",
        value: "secure-samesite",
        options: "; path=/; Secure; SameSite=None",
      },
      { name: "test4", value: "no-secure", options: "; path=/; SameSite=Lax" },
    ];

    testCookies.forEach(({ name, value, options }) => {
      document.cookie = `${name}=${value}${options}`;
      const wasSet = document.cookie.includes(`${name}=${value}`);
      logToOutput(
        `  ${wasSet ? "✅" : "❌"} ${name} (${options || "no options"}): ${wasSet}`,
      );
    });

    // Test 4: Check what cookies are actually present
    logToOutput("\n📋 Test 4: Current Cookie Analysis");
    const allCookies = document.cookie;
    logToOutput(`🍪 Raw cookie string: "${allCookies}"`);
    logToOutput(`📏 Cookie string length: ${allCookies.length}`);

    if (allCookies.length === 0) {
      logToOutput(
        "⚠️ NO COOKIES FOUND - This indicates a serious cookie issue!",
      );
      logToOutput("Possible causes:");
      logToOutput("  - Browser blocking cookies");
      logToOutput("  - Incognito/private mode");
      logToOutput("  - Extension blocking cookies");
      logToOutput("  - HTTPS/HTTP cookie security mismatch");
    } else {
      const cookieArray = allCookies
        .split(";")
        .map((c) => c.trim())
        .filter((c) => c);
      logToOutput(`📊 Number of cookies: ${cookieArray.length}`);
      cookieArray.forEach((cookie, index) => {
        const [name, value] = cookie.split("=");
        logToOutput(
          `  ${index + 1}. ${name}: ${(value || "").substring(0, 30)}${value && value.length > 30 ? "..." : ""}`,
        );
      });
    }

    // Test 5: Check localStorage and sessionStorage
    logToOutput("\n📋 Test 5: Storage Access Test");
    try {
      localStorage.setItem("test-storage", "test-value");
      const retrieved = localStorage.getItem("test-storage");
      logToOutput(
        `💾 localStorage: ${retrieved === "test-value" ? "✅ Working" : "❌ Failed"}`,
      );
      localStorage.removeItem("test-storage");
    } catch (error) {
      logToOutput(`💾 localStorage: ❌ Error - ${error}`);
    }

    try {
      sessionStorage.setItem("test-session", "test-value");
      const retrieved = sessionStorage.getItem("test-session");
      logToOutput(
        `🗂️ sessionStorage: ${retrieved === "test-value" ? "✅ Working" : "❌ Failed"}`,
      );
      sessionStorage.removeItem("test-session");
    } catch (error) {
      logToOutput(`🗂️ sessionStorage: ❌ Error - ${error}`);
    }

    // Test 6: Check browser environment
    logToOutput("\n📋 Test 6: Browser Environment");
    logToOutput(`🌍 User Agent: ${navigator.userAgent.substring(0, 100)}...`);
    logToOutput(`🔒 Is secure context: ${window.isSecureContext}`);
    logToOutput(`👁️ Document visibility: ${document.visibilityState}`);

    // Clean up test cookies
    logToOutput("\n🧹 Cleaning up test cookies...");
    testCookies.forEach(({ name }) => {
      document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    });

    logToOutput("\n✅ Cookie diagnostics complete!");
  };

  const decodeJWT = (token: string) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      return null;
    }
  };

  const analyzeCurrentToken = () => {
    clearOutput();
    logToOutput("🔍 Analyzing current JWT token...");

    const currentToken = tokenStore.accessToken;
    if (!currentToken) {
      logToOutput("❌ No token available to analyze");
      return;
    }

    logToOutput(`🎯 Token preview: ${currentToken.substring(0, 50)}...`);
    logToOutput(`📏 Token length: ${currentToken.length}`);

    // Decode JWT payload
    const payload = decodeJWT(currentToken);
    if (!payload) {
      logToOutput("❌ Failed to decode JWT token");
      return;
    }

    logToOutput("📦 JWT Payload:");
    logToOutput(JSON.stringify(payload, null, 2));

    // Check expiration
    if (payload.exp) {
      const expirationTime = new Date(payload.exp * 1000);
      const currentTime = new Date();
      const timeUntilExpiry = expirationTime.getTime() - currentTime.getTime();

      logToOutput(`⏰ Token expires at: ${expirationTime.toISOString()}`);
      logToOutput(`⏰ Current time: ${currentTime.toISOString()}`);
      logToOutput(
        `⏰ Time until expiry: ${Math.round(timeUntilExpiry / 1000)} seconds`,
      );

      if (timeUntilExpiry <= 0) {
        logToOutput("🚨 TOKEN IS EXPIRED! This explains the 401 errors.");
      } else if (timeUntilExpiry < 300000) {
        // Less than 5 minutes
        logToOutput("⚠️ Token expires soon (less than 5 minutes)");
      } else {
        logToOutput("✅ Token is valid and not expired");
      }
    }

    // Check issued at
    if (payload.iat) {
      const issuedAt = new Date(payload.iat * 1000);
      logToOutput(`📅 Token issued at: ${issuedAt.toISOString()}`);
    }
  };

  const testFullDiagnostics = async () => {
    setIsLoading(true);
    clearOutput();

    // Capture console output like above
    const originalLog = console.log;
    const originalGroup = console.group;
    const originalGroupEnd = console.groupEnd;
    const originalWarn = console.warn;
    const originalError = console.error;

    console.log = (...args) => {
      logToOutput(args.join(" "));
      originalLog(...args);
    };

    console.group = (...args) => {
      logToOutput(`📁 ${args.join(" ")}`);
      originalGroup(...args);
    };

    console.groupEnd = () => {
      logToOutput("📁 ---");
      originalGroupEnd();
    };

    console.warn = (...args) => {
      logToOutput(`⚠️ ${args.join(" ")}`);
      originalWarn(...args);
    };

    console.error = (...args) => {
      logToOutput(`❌ ${args.join(" ")}`);
      originalError(...args);
    };

    try {
      const baseURL = httpClient.getBaseURL();
      await AuthDebugger.runFullDiagnostics(baseURL);
    } catch (error) {
      logToOutput(`💥 Diagnostics failed: ${error}`);
    } finally {
      // Restore console methods
      console.log = originalLog;
      console.group = originalGroup;
      console.groupEnd = originalGroupEnd;
      console.warn = originalWarn;
      console.error = originalError;
      setIsLoading(false);
    }
  };

  const getCurrentAuthState = () => {
    clearOutput();

    const state = tokenStore;
    logToOutput("🔐 Current Auth State:");
    logToOutput(`  - Authenticated: ${state.isAuthenticated}`);
    logToOutput(`  - Has Access Token: ${!!state.accessToken}`);
    logToOutput(
      `  - Access Token Preview: ${state.accessToken?.substring(0, 50)}${state.accessToken ? "..." : "null"}`,
    );
    logToOutput(`  - User: ${JSON.stringify(state.user, null, 2)}`);
    logToOutput(`  - Has Hydrated: ${state.hasHydrated}`);

    // Check localStorage
    try {
      const persistedData = localStorage.getItem("auth-store");
      logToOutput(`📦 Persisted Auth Data: ${persistedData}`);
    } catch (error) {
      logToOutput(`❌ Failed to read persisted data: ${error}`);
    }
  };

  const simulatePageRefresh = () => {
    clearOutput();
    logToOutput("🔄 Simulating page refresh behavior...");

    // Clear access token (like what happens on refresh)
    logToOutput("1. Clearing access token (simulating page refresh)");
    tokenStore.updateAccessToken("");

    setTimeout(() => {
      logToOutput("2. Attempting to make authenticated request...");

      // Try to make a request that will trigger token refresh
      httpClient
        .get(
          "/api/notifications/fetchUserNotifications?userId=" +
            tokenStore.user?.id,
        )
        .then(() => {
          logToOutput("✅ Request successful after token refresh");
        })
        .catch((error) => {
          logToOutput(`❌ Request failed: ${error.message}`);
        });
    }, 1000);
  };

  const testSingleRequest = async () => {
    clearOutput();
    setIsLoading(true);

    try {
      logToOutput("🚀 Testing single request with token flow...");

      // Show current auth state
      const currentState = tokenStore;
      logToOutput(
        `🔐 Current auth state: authenticated=${currentState.isAuthenticated}, hasToken=${!!currentState.accessToken}`,
      );

      if (currentState.accessToken) {
        logToOutput(
          `🎯 Current token: ${currentState.accessToken.substring(0, 50)}...`,
        );
      }

      logToOutput("📡 Making single request to notifications endpoint...");

      const response = await httpClient.get(
        `/api/notifications/fetchUserNotifications?userId=${tokenStore.user?.id}`,
      );

      logToOutput("✅ Single request successful!");
      logToOutput(`📦 Response status: ${response.status}`);
      logToOutput(
        `📦 Response data: ${JSON.stringify(response.data).substring(0, 200)}...`,
      );
    } catch (error: any) {
      logToOutput(`❌ Single request failed: ${error.message}`);
      if (error.response) {
        logToOutput(`📦 Error response status: ${error.response.status}`);
        logToOutput(
          `📦 Error response data: ${JSON.stringify(error.response.data)}`,
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const testRawFetchRequest = async () => {
    clearOutput();
    setIsLoading(true);

    try {
      logToOutput(
        "🧪 Testing raw fetch request with manual Authorization header...",
      );

      const currentToken = tokenStore.accessToken;
      if (!currentToken) {
        logToOutput("❌ No token available for raw test");
        setIsLoading(false);
        return;
      }

      logToOutput(`🎯 Using token: ${currentToken.substring(0, 50)}...`);

      const baseURL = httpClient.getBaseURL();
      const url = `${baseURL}/api/notifications/fetchUserNotifications?userId=${tokenStore.user?.id}`;

      logToOutput(`📡 Making raw fetch to: ${url}`);

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      };

      logToOutput("📋 Request headers:");
      Object.entries(headers).forEach(([key, value]) => {
        logToOutput(
          `  ${key}: ${key === "Authorization" ? value.substring(0, 50) + "..." : value}`,
        );
      });

      const response = await fetch(url, {
        method: "GET",
        headers: headers,
        credentials: "include",
      });

      logToOutput(`📊 Raw fetch response status: ${response.status}`);
      logToOutput(`📊 Raw fetch response ok: ${response.ok}`);

      const responseText = await response.text();
      logToOutput(`📦 Raw response body: ${responseText.substring(0, 300)}...`);

      if (response.ok) {
        logToOutput("✅ Raw fetch successful - token is valid!");
        logToOutput("🤔 This suggests the issue is with axios, not the server");
      } else {
        logToOutput("❌ Raw fetch also failed - server issue confirmed");
        logToOutput("🔍 Let's check response headers:");
        response.headers.forEach((value, key) => {
          logToOutput(`  ${key}: ${value}`);
        });
      }
    } catch (error: any) {
      logToOutput(`💥 Raw fetch error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
      <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        🔍 Authentication Debug Tool
      </h2>

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3">
        <button
          onClick={getCurrentAuthState}
          className="rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
          disabled={isLoading}
        >
          📊 Auth State
        </button>

        <button
          onClick={testCookies}
          className="rounded-lg bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600"
          disabled={isLoading}
        >
          🍪 Test Cookies
        </button>

        <button
          onClick={testRefreshToken}
          className="rounded-lg bg-orange-500 px-4 py-2 text-white transition-colors hover:bg-orange-600"
          disabled={isLoading}
        >
          🔄 Test Refresh
        </button>

        <button
          onClick={testRefreshTokenParsing}
          className="rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
          disabled={isLoading}
        >
          ✅ Test Fix
        </button>

        <button
          onClick={runCookieDiagnostics}
          className="rounded-lg bg-yellow-500 px-4 py-2 text-white transition-colors hover:bg-yellow-600"
          disabled={isLoading}
        >
          🔬 Cookie Diagnostics
        </button>

        <button
          onClick={testFullDiagnostics}
          className="rounded-lg bg-purple-500 px-4 py-2 text-white transition-colors hover:bg-purple-600"
          disabled={isLoading}
        >
          🚀 Full Diagnostics
        </button>

        <button
          onClick={simulatePageRefresh}
          className="rounded-lg bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600"
          disabled={isLoading}
        >
          🔄 Simulate Refresh
        </button>

        <button
          onClick={testLoginCookies}
          className="rounded-lg bg-indigo-500 px-4 py-2 text-white transition-colors hover:bg-indigo-600"
          disabled={isLoading}
        >
          🔐 Test Login Cookies
        </button>

        <button
          onClick={testSingleRequest}
          className="rounded-lg bg-teal-500 px-4 py-2 text-white transition-colors hover:bg-teal-600"
          disabled={isLoading}
        >
          🚀 Test Single Request
        </button>

        <button
          onClick={analyzeCurrentToken}
          className="rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700"
          disabled={isLoading}
        >
          🔍 Analyze Token
        </button>

        <button
          onClick={testRawFetchRequest}
          className="rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
          disabled={isLoading}
        >
          🧪 Raw Fetch Test
        </button>

        <button
          onClick={clearOutput}
          className="rounded-lg bg-gray-500 px-4 py-2 text-white transition-colors hover:bg-gray-600"
        >
          🧹 Clear Output
        </button>
      </div>

      {isLoading && (
        <div className="mb-4 rounded-lg bg-blue-100 p-3 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          ⏳ Running diagnostics...
        </div>
      )}

      <div className="max-h-96 overflow-x-auto overflow-y-auto rounded-lg bg-black p-4 font-mono text-sm text-green-400">
        <pre className="whitespace-pre-wrap">
          {debugOutput || "📝 Debug output will appear here..."}
        </pre>
      </div>

      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <p>
          <strong>Instructions:</strong>
        </p>
        <ul className="list-inside list-disc space-y-1">
          <li>
            <strong>Auth State:</strong> Shows current authentication status and
            tokens
          </li>
          <li>
            <strong>Test Cookies:</strong> Analyzes current cookies including
            Cloudflare ones
          </li>
          <li>
            <strong>Test Refresh:</strong> Manually tests the refresh token
            endpoint
          </li>
          <li>
            <strong>Full Diagnostics:</strong> Runs all tests including network
            analysis
          </li>
          <li>
            <strong>Simulate Refresh:</strong> Simulates what happens when you
            refresh the page
          </li>
          <li>
            <strong>Test Login Cookies:</strong> Tests what cookies get set
            during login flow
          </li>
          <li>
            <strong>Test Fix:</strong> Tests if the parsing fix for nested
            response structure works
          </li>
          <li>
            <strong>Cookie Diagnostics:</strong> Comprehensive cookie support
            and environment analysis
          </li>
          <li>
            <strong>Test Single Request:</strong> Makes one authenticated
            request to see the complete token flow with detailed logging
          </li>
          <li>
            <strong>Analyze Token:</strong> Decodes the current JWT token to
            check expiration time and payload content
          </li>
          <li>
            <strong>Raw Fetch Test:</strong> Makes a raw fetch request with
            manual Authorization header to bypass axios and test server directly
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AuthDebugComponent;
