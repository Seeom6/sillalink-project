'use client';

import React, { useState } from 'react';
import { useSession, signOut, signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import { FiLogOut, FiLogIn, FiRefreshCw, FiCheck, FiX } from 'react-icons/fi';
import { GlassCard } from '@/components/ui/glass-card';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { useRouter } from 'next/navigation';

export default function AuthFixPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      // Clear any localStorage tokens
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-token');
        localStorage.removeItem('refresh-token');
      }
      
      await signOut({ redirect: false });
      setTestResult('✅ Logged out successfully');
    } catch (error) {
      setTestResult('❌ Logout failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLogin = () => {
    router.push('/auth/login?admin=true');
  };

  const testTechnologyAPI = async () => {
    setIsLoading(true);
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
        const data = await response.json();
        setTestResult(`✅ API call successful! Found ${data.technologies?.length || 0} technologies`);
      } else {
        const errorText = await response.text();
        setTestResult(`❌ API call failed: ${response.status} - ${errorText}`);
      }
    } catch (error: any) {
      setTestResult(`❌ Network error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const createTestTechnology = async () => {
    setIsLoading(true);
    setTestResult(null);

    try {
      const testData = {
        name: `Test Technology ${Date.now()}`,
        description: 'This is a test technology created to verify API functionality',
        category: 'frontend',
        status: 'active',
        difficultyLevel: 'beginner',
        proficiencyLevel: 50,
        estimatedLearningHours: 20,
        isFeatured: false,
        tags: ['test'],
        prerequisites: [],
        learningResources: []
      };

      const response = await fetch('/api/v1/admin/technologies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': session?.accessToken ? `Bearer ${session.accessToken}` : '',
        },
        body: JSON.stringify(testData)
      });

      if (response.ok) {
        const data = await response.json();
        setTestResult(`✅ Technology created successfully! ID: ${data._id || data.id}`);
      } else {
        const errorText = await response.text();
        setTestResult(`❌ Creation failed: ${response.status} - ${errorText}`);
      }
    } catch (error: any) {
      setTestResult(`❌ Network error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Authentication Fix</h1>
        <p className="text-gray-300">
          Fix authentication issues and test API connectivity
        </p>
      </motion.div>

      {/* Current Status */}
      <GlassCard variant="secondary" className="p-6">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">Current Status</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/50 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              {status === 'authenticated' ? (
                <FiCheck className="w-6 h-6 text-green-400" />
              ) : (
                <FiX className="w-6 h-6 text-red-400" />
              )}
            </div>
            <h3 className="text-sm font-semibold text-gray-300">Session</h3>
            <p className="text-xs text-gray-400">{status}</p>
          </div>

          <div className="bg-slate-900/50 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              {session?.accessToken ? (
                <FiCheck className="w-6 h-6 text-green-400" />
              ) : (
                <FiX className="w-6 h-6 text-red-400" />
              )}
            </div>
            <h3 className="text-sm font-semibold text-gray-300">Access Token</h3>
            <p className="text-xs text-gray-400">
              {session?.accessToken ? 'Present' : 'Missing'}
            </p>
          </div>

          <div className="bg-slate-900/50 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              {(session?.user as any)?.role === 'admin' ? (
                <FiCheck className="w-6 h-6 text-green-400" />
              ) : (
                <FiX className="w-6 h-6 text-red-400" />
              )}
            </div>
            <h3 className="text-sm font-semibold text-gray-300">Admin Role</h3>
            <p className="text-xs text-gray-400">
              {(session?.user as any)?.role || 'Not set'}
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard variant="secondary" className="p-6">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">Authentication Actions</h2>
          
          <div className="space-y-3">
            <EnhancedButton
              onClick={handleLogout}
              disabled={isLoading || status !== 'authenticated'}
              variant="outline"
              className="w-full"
            >
              <FiLogOut className="w-4 h-4" />
              Logout & Clear Session
            </EnhancedButton>

            <EnhancedButton
              onClick={handleAdminLogin}
              disabled={isLoading}
              variant="gradient"
              className="w-full"
              glow
            >
              <FiLogIn className="w-4 h-4" />
              Go to Admin Login
            </EnhancedButton>
          </div>
        </GlassCard>

        <GlassCard variant="secondary" className="p-6">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">API Testing</h2>
          
          <div className="space-y-3">
            <EnhancedButton
              onClick={testTechnologyAPI}
              disabled={isLoading || !session?.accessToken}
              variant="outline"
              className="w-full"
            >
              <FiRefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Test GET Technologies
            </EnhancedButton>

            <EnhancedButton
              onClick={createTestTechnology}
              disabled={isLoading || !session?.accessToken}
              variant="gradient"
              className="w-full"
            >
              <FiCheck className="w-4 h-4" />
              Test CREATE Technology
            </EnhancedButton>
          </div>
        </GlassCard>
      </div>

      {/* Test Results */}
      {testResult && (
        <GlassCard variant="primary" className="p-6">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">Test Result</h2>
          <div className="bg-slate-900/50 rounded-lg p-4">
            <p className="text-sm font-mono text-gray-300">{testResult}</p>
          </div>
        </GlassCard>
      )}

      {/* Instructions */}
      <GlassCard variant="secondary" className="p-6">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">Step-by-Step Fix</h2>
        <div className="space-y-3 text-sm text-gray-300">
          <div className="flex items-start space-x-2">
            <span className="text-purple-400 font-bold">1.</span>
            <span>Click "Logout & Clear Session" to clear any corrupted session data</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-purple-400 font-bold">2.</span>
            <span>Click "Go to Admin Login" to navigate to the login page</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-purple-400 font-bold">3.</span>
            <span>Make sure to check the "Admin Login" checkbox when logging in</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-purple-400 font-bold">4.</span>
            <span>After login, return here and test the API calls</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-purple-400 font-bold">5.</span>
            <span>If successful, try creating a technology again</span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
