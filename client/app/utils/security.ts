// Security utilities for frontend

export class SecurityUtils {
  private static csrfToken: string | null = null;

  // Get CSRF token from server
  static async getCSRFToken(): Promise<string> {
    if (this.csrfToken) {
      return this.csrfToken;
    }

    try {
      const response = await fetch('/api/v1/website/auth/csrf-token', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        this.csrfToken = data.csrfToken;
        return this.csrfToken;
      }
    } catch (error) {
      console.error('Failed to get CSRF token:', error);
    }

    return '';
  }

  // Add CSRF token to request headers
  static async addCSRFHeader(headers: Record<string, string> = {}): Promise<Record<string, string>> {
    const csrfToken = await this.getCSRFToken();
    if (csrfToken) {
      headers['X-CSRF-Token'] = csrfToken;
    }
    return headers;
  }

  // Sanitize user input to prevent XSS
  static sanitizeInput(input: string): string {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  }

  // Validate email format
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate password strength
  static validatePasswordStrength(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Rate limiting check for client-side
  static checkRateLimit(key: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Get stored requests from localStorage
    const stored = localStorage.getItem(`rate_limit_${key}`);
    let requests: number[] = stored ? JSON.parse(stored) : [];
    
    // Filter out old requests
    requests = requests.filter(timestamp => timestamp > windowStart);
    
    // Check if limit exceeded
    if (requests.length >= maxRequests) {
      return false;
    }
    
    // Add current request
    requests.push(now);
    localStorage.setItem(`rate_limit_${key}`, JSON.stringify(requests));
    
    return true;
  }

  // Clear rate limit data
  static clearRateLimit(key: string): void {
    localStorage.removeItem(`rate_limit_${key}`);
  }
}
