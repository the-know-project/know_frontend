import { httpClient } from './http-client';

interface CookieTestResult {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

interface LoginTestCredentials {
  email: string;
  password: string;
}

class CookieTestUtils {
  private baseURL: string;

  constructor() {
    this.baseURL = httpClient.getBaseURL();
  }

  /**
   * Test the debug endpoint to verify cookie and CORS setup
   */
  async testDebugEndpoint(): Promise<CookieTestResult> {
    try {
      console.log('🧪 Testing debug endpoint for cookie and CORS setup...');

      const response = await httpClient.get('/api/auth/debug/cookies');

      console.log('✅ Debug endpoint response:', response.data);

      return {
        success: true,
        message: 'Debug endpoint working correctly',
        data: response.data
      };
    } catch (error: any) {
      console.error('❌ Debug endpoint failed:', error);

      return {
        success: false,
        message: 'Debug endpoint failed',
        error: error.response?.data?.message || error.message
      };
    }
  }

  /**
   * Test login with cookie handling
   */
  async testLogin(credentials: LoginTestCredentials): Promise<CookieTestResult> {
    try {
      console.log('🔐 Testing login with cookie handling...');

      const response = await httpClient.post('/api/auth/login', credentials);

      if (response.data.data?.accessToken) {
        console.log('✅ Login successful with access token');
        console.log('🍪 Checking if refresh token cookie was set...');

        // Check if cookies were set by trying to access them
        const cookieCheck = this.checkCookies();

        return {
          success: true,
          message: 'Login successful',
          data: {
            accessToken: response.data.data.accessToken,
            user: response.data.data.user,
            cookiesAvailable: cookieCheck.available,
            cookieCount: cookieCheck.count
          }
        };
      } else {
        return {
          success: false,
          message: 'Login failed - no access token received',
          error: 'No access token in response'
        };
      }
    } catch (error: any) {
      console.error('❌ Login test failed:', error);

      return {
        success: false,
        message: 'Login test failed',
        error: error.response?.data?.message || error.message
      };
    }
  }

  /**
   * Test refresh token functionality
   */
  async testRefreshToken(): Promise<CookieTestResult> {
    try {
      console.log('🔄 Testing refresh token functionality...');

      const response = await httpClient.post('/api/auth/refreshToken', {});

      if (response.data.data?.accessToken) {
        console.log('✅ Refresh token successful');

        return {
          success: true,
          message: 'Refresh token successful',
          data: {
            accessToken: response.data.data.accessToken,
            user: response.data.data.user
          }
        };
      } else {
        return {
          success: false,
          message: 'Refresh token failed - no access token received',
          error: 'No access token in refresh response'
        };
      }
    } catch (error: any) {
      console.error('❌ Refresh token test failed:', error);

      const is401 = error.response?.status === 401;

      return {
        success: false,
        message: is401 ? 'Refresh token failed - likely no valid refresh token cookie' : 'Refresh token test failed',
        error: error.response?.data?.message || error.message
      };
    }
  }

  /**
   * Check browser cookies (limited by same-origin policy)
   */
  private checkCookies(): { available: boolean; count: number; cookies?: string } {
    if (typeof document === 'undefined') {
      return { available: false, count: 0 };
    }

    const cookies = document.cookie;
    const cookieArray = cookies.split(';').filter(cookie => cookie.trim().length > 0);

    return {
      available: cookies.length > 0,
      count: cookieArray.length,
      cookies: cookies || 'No cookies available'
    };
  }

  /**
   * Get browser information for debugging
   */
  getBrowserInfo(): any {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return { environment: 'server-side' };
    }

    return {
      userAgent: navigator.userAgent,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      language: navigator.language,
      platform: navigator.platform,
      url: window.location.href,
      origin: window.location.origin,
      protocol: window.location.protocol
    };
  }

  /**
   * Check if browser supports partitioned cookies
   */
  supportsPartitionedCookies(): boolean {
    // Basic check for Chromium-based browsers that support partitioned cookies
    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';

    // Chrome 118+, Edge 118+
    const chromeMatch = userAgent.match(/Chrome\/(\d+)/);
    const edgeMatch = userAgent.match(/Edg\/(\d+)/);

    if (chromeMatch) {
      return parseInt(chromeMatch[1]) >= 118;
    }

    if (edgeMatch) {
      return parseInt(edgeMatch[1]) >= 118;
    }

    // Safari 16.4+ (approximate check)
    const safariMatch = userAgent.match(/Version\/(\d+\.\d+).*Safari/);
    if (safariMatch) {
      const version = parseFloat(safariMatch[1]);
      return version >= 16.4;
    }

    // Firefox (experimental support, assume recent versions)
    if (userAgent.includes('Firefox')) {
      const firefoxMatch = userAgent.match(/Firefox\/(\d+)/);
      if (firefoxMatch) {
        return parseInt(firefoxMatch[1]) >= 120; // Approximate
      }
    }

    return false; // Unknown or unsupported
  }

  /**
   * Run comprehensive cookie and CORS tests
   */
  async runComprehensiveTest(credentials?: LoginTestCredentials): Promise<{
    summary: {
      debugEndpoint: boolean;
      login: boolean;
      refreshToken: boolean;
      browserSupport: boolean;
    };
    details: {
      debugResult: CookieTestResult;
      loginResult?: CookieTestResult;
      refreshResult?: CookieTestResult;
      browserInfo: any;
      recommendations: string[];
    };
  }> {
    console.log('🚀 Starting comprehensive cookie and CORS test suite...');
    console.log('='.repeat(60));

    const browserInfo = this.getBrowserInfo();
    const supportsPartitioned = this.supportsPartitionedCookies();

    console.log('🌐 Browser Info:', browserInfo);
    console.log('🍪 Partitioned Cookie Support:', supportsPartitioned);
    console.log('');

    // Test debug endpoint
    const debugResult = await this.testDebugEndpoint();
    console.log('');

    let loginResult: CookieTestResult | undefined;
    let refreshResult: CookieTestResult | undefined;

    // Test login if credentials provided
    if (credentials) {
      loginResult = await this.testLogin(credentials);
      console.log('');

      // Test refresh token if login was successful
      if (loginResult.success) {
        refreshResult = await this.testRefreshToken();
        console.log('');
      }
    } else {
      console.log('⏭️ Skipping login test - no credentials provided');
      console.log('ℹ️ To test login, provide credentials: { email: "test@example.com", password: "password" }');
      console.log('');
    }

    // Generate recommendations
    const recommendations: string[] = [];

    if (!debugResult.success) {
      recommendations.push('Fix debug endpoint connectivity and CORS configuration');
    }

    if (!supportsPartitioned) {
      recommendations.push('Update browser to version that supports partitioned cookies (Chrome 118+, Edge 118+, Safari 16.4+)');
    }

    if (loginResult && !loginResult.success) {
      recommendations.push('Check login credentials and endpoint connectivity');
    }

    if (refreshResult && !refreshResult.success) {
      recommendations.push('Verify refresh token cookie is being set correctly during login');
    }

    if (browserInfo.protocol === 'http:' && browserInfo.origin?.includes('localhost')) {
      recommendations.push('Consider testing with HTTPS for production-like cookie behavior');
    }

    if (recommendations.length === 0) {
      recommendations.push('All tests passed! Cookie and CORS configuration is working correctly.');
    }

    // Summary
    const summary = {
      debugEndpoint: debugResult.success,
      login: loginResult?.success ?? false,
      refreshToken: refreshResult?.success ?? false,
      browserSupport: supportsPartitioned
    };

    console.log('📋 Test Summary');
    console.log('='.repeat(30));
    console.log(`Debug Endpoint: ${summary.debugEndpoint ? '✅' : '❌'}`);
    console.log(`Browser Support: ${summary.browserSupport ? '✅' : '⚠️'}`);
    if (credentials) {
      console.log(`Login: ${summary.login ? '✅' : '❌'}`);
      console.log(`Refresh Token: ${summary.refreshToken ? '✅' : '❌'}`);
    }
    console.log('');

    console.log('💡 Recommendations:');
    recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec}`);
    });

    return {
      summary,
      details: {
        debugResult,
        loginResult,
        refreshResult,
        browserInfo,
        recommendations
      }
    };
  }
}

// Export singleton instance
export const cookieTestUtils = new CookieTestUtils();

// Export types
export type { CookieTestResult, LoginTestCredentials };

// Helper function for quick testing in console
export const quickTest = async (credentials?: LoginTestCredentials) => {
  return cookieTestUtils.runComprehensiveTest(credentials);
};

// Example usage:
/*
// Test without login
import { quickTest } from '@/lib/test-cookies';
quickTest();

// Test with login
quickTest({
  email: 'your-test@email.com',
  password: 'your-password'
});

// Or use the individual methods
import { cookieTestUtils } from '@/lib/test-cookies';
await cookieTestUtils.testDebugEndpoint();
await cookieTestUtils.testLogin({ email: 'test@example.com', password: 'password' });
await cookieTestUtils.testRefreshToken();
*/
