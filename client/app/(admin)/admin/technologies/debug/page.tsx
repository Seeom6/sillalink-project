'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { FiUser, FiKey, FiCheck, FiX, FiRefreshCw } from 'react-icons/fi';
import { GlassCard } from '@/components/ui/glass-card';
import { EnhancedButton } from '@/components/ui/enhanced-button';

export default function AuthDebugPage() {
  const { data: session, status } = useSession();
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isTestingAPI, setIsTestingAPI] = useState(false);

  const testAPICall = async () => {
    setIsTestingAPI(true);
    setTestResult(null);

    try {
      const response = await fetch('/api/v1/admin/technologies', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': session?.accessToken ? `Bearer ${session.accessToken}` : '',
        },
      });

      if (response.ok) {
        setTestResult('✅ API call successful!');
      } else {
        const errorData = await response.text();
        setTestResult(`❌ API call failed: ${response.status} - ${errorData}`);
      }
    } catch (error: any) {
      setTestResult(`❌ Network error: ${error.message}`);
    } finally {
      setIsTestingAPI(false);
    }
  };

  const checkLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth-token');
      return token ? `Found: ${token.substring(0, 20)}...` : 'Not found';
    }
    return 'N/A (SSR)';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Authentication Debug</h1>
        <p className="text-gray-300">
          Debug authentication status and API connectivity
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Session Information */}
        <GlassCard variant="secondary" className="p-6">
          <h2 className="text-xl font-semibold text-gray-100 mb-4 flex items-center space-x-2">
            <FiUser className="w-5 h-5" />
            <span>NextAuth.js Session</span>
          </h2>
          
          <div className="space-y-4">
            <div className="bg-slate-900/50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-300 mb-2">Status</h3>
              <div className="flex items-center space-x-2">
                {status === 'loading' ? (
                  <>
                    <FiRefreshCw className="w-4 h-4 animate-spin text-blue-400" />
                    <span className="text-blue-400">Loading...</span>
                  </>
                ) : status === 'authenticated' ? (
                  <>
                    <FiCheck className="w-4 h-4 text-green-400" />
                    <span className="text-green-400">Authenticated</span>
                  </>
                ) : (
                  <>
                    <FiX className="w-4 h-4 text-red-400" />
                    <span className="text-red-400">Not authenticated</span>
                  </>
                )}
              </div>
            </div>

            {session && (
              <>
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-300 mb-2">User Info</h3>
                  <div className="text-sm text-gray-400 space-y-1">
                    <p><strong>Email:</strong> {session.user?.email}</p>
                    <p><strong>Name:</strong> {session.user?.name}</p>
                    <p><strong>Role:</strong> {(session.user as any)?.role || 'Not set'}</p>
                  </div>
                </div>

                <div className="bg-slate-900/50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-300 mb-2">Tokens</h3>
                  <div className="text-sm text-gray-400 space-y-1">
                    <p><strong>Access Token:</strong> {
                      (session as any)?.accessToken 
                        ? `${(session as any).accessToken.substring(0, 20)}...` 
                        : 'Not found'
                    }</p>
                    <p><strong>Refresh Token:</strong> {
                      (session as any)?.refreshToken 
                        ? `${(session as any).refreshToken.substring(0, 20)}...` 
                        : 'Not found'
                    }</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </GlassCard>

        {/* API Testing */}
        <GlassCard variant="secondary" className="p-6">
          <h2 className="text-xl font-semibold text-gray-100 mb-4 flex items-center space-x-2">
            <FiKey className="w-5 h-5" />
            <span>API Testing</span>
          </h2>
          
          <div className="space-y-4">
            <div className="bg-slate-900/50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-300 mb-2">LocalStorage Token</h3>
              <p className="text-sm text-gray-400">{checkLocalStorage()}</p>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-300 mb-2">API Base URL</h3>
              <p className="text-sm text-gray-400">
                {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}
              </p>
            </div>

            <EnhancedButton
              onClick={testAPICall}
              disabled={isTestingAPI || !session}
              variant="gradient"
              className="w-full"
              glow
            >
              {isTestingAPI ? (
                <>
                  <FiRefreshCw className="w-4 h-4 animate-spin" />
                  Testing API...
                </>
              ) : (
                <>
                  <FiKey className="w-4 h-4" />
                  Test API Call
                </>
              )}
            </EnhancedButton>

            {testResult && (
              <div className="bg-slate-900/50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-300 mb-2">Test Result</h3>
                <p className="text-sm text-gray-400 font-mono">{testResult}</p>
              </div>
            )}
          </div>
        </GlassCard>
      </div>

      {/* Raw Session Data */}
      <GlassCard variant="primary" className="p-6">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">Raw Session Data</h2>
        <div className="bg-slate-900/50 rounded-lg p-4 overflow-auto">
          <pre className="text-xs text-gray-400">
            {JSON.stringify({ session, status }, null, 2)}
          </pre>
        </div>
      </GlassCard>

      {/* Instructions */}
      <GlassCard variant="secondary" className="p-6">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">Troubleshooting Steps</h2>
        <div className="space-y-3 text-sm text-gray-300">
          <div className="flex items-start space-x-2">
            <span className="text-purple-400 font-bold">1.</span>
            <span>Check if you're logged in with admin role</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-purple-400 font-bold">2.</span>
            <span>Verify that accessToken is present in session</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-purple-400 font-bold">3.</span>
            <span>Test API call to see if authentication works</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-purple-400 font-bold">4.</span>
            <span>If token is missing, try logging out and logging back in</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-purple-400 font-bold">5.</span>
            <span>Check browser console for any authentication errors</span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
