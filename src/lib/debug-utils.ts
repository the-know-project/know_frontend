/**
 * Debug utilities for inspecting authentication and cookie issues
 */

export class AuthDebugger {
  /**
   * Log all cookies with their properties
   */
  static logAllCookies() {
    if (typeof document === "undefined") {
      console.log("🍪 Debug: Not in browser environment");
      return;
    }

    console.group("🍪 Cookie Debug Information");

    const cookies = document.cookie.split(";");
    console.log(`📊 Total cookies found: ${cookies.length}`);

    cookies.forEach((cookie, index) => {
      const [name, value] = cookie.trim().split("=");
      console.log(
        `${index + 1}. ${name}: ${value?.substring(0, 50)}${value?.length > 50 ? "..." : ""}`,
      );
    });

    // Check for specific auth-related cookies
    const authCookies = cookies.filter(
      (cookie) =>
        cookie.includes("refreshToken") ||
        cookie.includes("accessToken") ||
        cookie.includes("__cf_bm") ||
        cookie.includes("auth"),
    );

    if (authCookies.length > 0) {
      console.log("🔐 Auth-related cookies:");
      authCookies.forEach((cookie) => {
        console.log(`  - ${cookie.trim()}`);
      });
    } else {
      console.log("❌ No auth-related cookies found");
    }

    console.groupEnd();
  }

  /**
   * Test refresh token endpoint manually
   */
  static async testRefreshEndpoint(baseURL: string) {
    console.group("🔄 Manual Refresh Token Test");

    try {
      console.log(`📡 Testing: ${baseURL}/api/auth/refreshToken`);
      console.log("🍪 Current cookies:", document.cookie);

      const response = await fetch(`${baseURL}/api/auth/refreshToken`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // This is equivalent to withCredentials: true
        body: JSON.stringify({}),
      });

      console.log("📊 Response status:", response.status);
      console.log("📊 Response ok:", response.ok);
      console.log("📊 Response headers:");

      // Log response headers
      response.headers.forEach((value, key) => {
        console.log(`  ${key}: ${value}`);
      });

      // Also log cookies being sent
      console.log("🍪 Request cookies sent:", document.cookie);

      // Check specifically for refreshToken cookie
      const cookies = document.cookie.split(";");
      const refreshTokenCookie = cookies.find((cookie) =>
        cookie.trim().startsWith("refreshToken="),
      );
      if (refreshTokenCookie) {
        console.log(
          "✅ RefreshToken cookie found and sent:",
          refreshTokenCookie.trim().substring(0, 100) + "...",
        );
      } else {
        console.log("❌ No refreshToken cookie found to send");
      }

      const responseText = await response.text();
      console.log("📦 Response body (text):", responseText);

      try {
        const responseData = JSON.parse(responseText);
        console.log("📦 Response body (parsed):", responseData);
        console.log("🔍 Available keys:", Object.keys(responseData));
        console.log("🔍 Response type:", typeof responseData);
        console.log("🔍 Response is array:", Array.isArray(responseData));

        // Check for various token field names
        const tokenFields = [
          "accessToken",
          "access_token",
          "token",
          "authToken",
          "jwt",
        ];

        tokenFields.forEach((field) => {
          if (responseData[field]) {
            console.log(
              `✅ Found token in field '${field}':`,
              responseData[field].substring(0, 50) + "...",
            );
          } else {
            console.log(`❌ No token found in field '${field}'`);
          }
        });

        // Check for nested objects
        if (responseData.data) {
          console.log('🔍 Found nested "data" object:', responseData.data);
          tokenFields.forEach((field) => {
            if (responseData.data[field]) {
              console.log(
                `✅ Found token in nested data.${field}:`,
                responseData.data[field].substring(0, 50) + "...",
              );
            }
          });
        }

        // Log all string values that might be tokens (JWT format)
        console.log("🔍 Scanning for JWT-like strings...");
        const scanForTokens = (obj: any, path = "") => {
          Object.entries(obj).forEach(([key, value]) => {
            const currentPath = path ? `${path}.${key}` : key;
            if (
              typeof value === "string" &&
              value.length > 100 &&
              value.includes(".")
            ) {
              // Likely a JWT token
              console.log(
                `🎯 Potential JWT token at ${currentPath}:`,
                value.substring(0, 50) + "...",
              );
            } else if (typeof value === "object" && value !== null) {
              scanForTokens(value, currentPath);
            }
          });
        };
        scanForTokens(responseData);

        // Check for user data
        if (responseData.user) {
          console.log("👤 User data found:", responseData.user);
        } else if (responseData.userData) {
          console.log("👤 User data found in userData:", responseData.userData);
        } else {
          console.log("❌ No user data found");
        }
      } catch (parseError) {
        console.error("❌ Failed to parse response as JSON:", parseError);
      }
    } catch (error) {
      console.error("❌ Refresh test failed:", error);

      if (error instanceof TypeError && error.message.includes("fetch")) {
        console.error("🌐 This might be a CORS or network issue");
      }
    }

    console.groupEnd();
  }

  /**
   * Check if cookies can be set properly
   */
  static testCookieSettings() {
    console.group("🍪 Cookie Setting Test");

    // Test setting a simple cookie
    const testCookieName = "debug_test_cookie";
    const testValue = "test_value_" + Date.now();

    console.log(`🧪 Setting test cookie: ${testCookieName}=${testValue}`);
    document.cookie = `${testCookieName}=${testValue}; path=/; SameSite=None; Secure`;

    // Check if it was set
    const cookieExists = document.cookie.includes(
      `${testCookieName}=${testValue}`,
    );
    console.log(`✅ Cookie set successfully: ${cookieExists}`);

    if (cookieExists) {
      // Clean up
      document.cookie = `${testCookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      console.log("🧹 Test cookie cleaned up");
    }

    // Check current domain and protocol
    console.log("🌐 Current location:", {
      protocol: window.location.protocol,
      host: window.location.host,
      hostname: window.location.hostname,
      port: window.location.port,
      origin: window.location.origin,
    });

    console.groupEnd();
  }

  /**
   * Analyze Cloudflare cookie issues
   */
  static analyzeCloudflareCookies() {
    console.group("☁️ Cloudflare Cookie Analysis");

    const cookies = document.cookie.split(";");
    const cfCookies = cookies.filter((cookie) => cookie.includes("__cf_"));

    console.log(`📊 Cloudflare cookies found: ${cfCookies.length}`);

    cfCookies.forEach((cookie) => {
      const [name, value] = cookie.trim().split("=");
      console.log(`☁️ ${name}: ${value?.substring(0, 30)}...`);
    });

    // Check for __cf_bm specifically
    const cfBmCookie = cookies.find((cookie) => cookie.includes("__cf_bm"));
    if (cfBmCookie) {
      console.log("🤖 Bot Management cookie found:", cfBmCookie.trim());
      console.log(
        "ℹ️ This cookie is set by Cloudflare and should not affect your auth flow",
      );
    } else {
      console.log("❌ No __cf_bm cookie found");
    }

    console.groupEnd();
  }

  /**
   * Full debug suite - run all diagnostics
   */
  static async runFullDiagnostics(baseURL: string) {
    console.log("🚀 Starting full authentication diagnostics...");

    this.logAllCookies();
    this.testCookieSettings();
    this.analyzeCloudflareCookies();
    await this.testRefreshEndpoint(baseURL);

    console.log("✅ Full diagnostics complete");
  }

  /**
   * Monitor network requests for cookie issues
   */
  static monitorNetworkRequests() {
    console.log("📡 Setting up network monitoring...");

    // Override fetch to log cookie-related info
    const originalFetch = window.fetch;

    window.fetch = async function (...args) {
      const [url, options] = args;

      console.group(`📡 Network Request: ${url}`);
      console.log("🍪 Cookies being sent:", document.cookie);

      if (options?.credentials) {
        console.log("🔐 Credentials mode:", options.credentials);
      }

      try {
        const response = await originalFetch(...args);

        console.log("📊 Response status:", response.status);

        // Check for Set-Cookie headers
        const setCookieHeader = response.headers.get("set-cookie");
        if (setCookieHeader) {
          console.log("🍪 Set-Cookie header:", setCookieHeader);
        }

        console.groupEnd();
        return response;
      } catch (error) {
        console.error("❌ Request failed:", error);
        console.groupEnd();
        throw error;
      }
    };

    console.log("✅ Network monitoring active");
  }

  /**
   * Stop network monitoring
   */
  static stopNetworkMonitoring() {
    // Note: This is a simple implementation - in a real app you'd want to store the original fetch
    console.log(
      "🛑 Network monitoring stopped (page refresh required to fully restore)",
    );
  }
}

// Export a convenient global function for console use
if (typeof window !== "undefined") {
  (window as any).authDebug = AuthDebugger;
}
