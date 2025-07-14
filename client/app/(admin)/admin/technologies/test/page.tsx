'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlay, FiCheck, FiX, FiLoader } from 'react-icons/fi';
import { GlassCard } from '@/components/ui/glass-card';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { technologiesApi } from '@/lib/api/admin/technologies';
import { publicTechnologiesApi } from '@/lib/api/public/technologies';
import { TechnologyCategory, TechnologyStatus, DifficultyLevel } from '@/lib/types/technology';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message?: string | undefined;
  duration?: number | undefined;
}

export default function TechnologyTestPage() {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const updateTest = (name: string, status: TestResult['status'], message?: string, duration?: number) => {
    setTests(prev => {
      const existing = prev.find(t => t.name === name);
      if (existing) {
        return prev.map(t => t.name === name ? { ...t, status, message, duration } : t);
      }
      return [...prev, { name, status, message, duration }];
    });
  };

  const runTest = async (name: string, testFn: () => Promise<any>) => {
    const startTime = Date.now();
    updateTest(name, 'pending');
    
    try {
      await testFn();
      const duration = Date.now() - startTime;
      updateTest(name, 'success', 'Passed', duration);
    } catch (error: any) {
      const duration = Date.now() - startTime;
      updateTest(name, 'error', error.message || 'Failed', duration);
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTests([]);

    // Test sample technology data
    const sampleTechnology = {
      name: 'Test Technology',
      description: 'This is a test technology for validation',
      category: TechnologyCategory.FRONTEND,
      status: TechnologyStatus.ACTIVE,
      difficultyLevel: DifficultyLevel.INTERMEDIATE,
      proficiencyLevel: 75,
      tags: ['test', 'validation'],
      isFeatured: false
    };

    // Admin API Tests
    await runTest('Get All Technologies', async () => {
      const result = await technologiesApi.getAll({ page: 1, limit: 5 });
      if (!result || typeof result !== 'object') {
        throw new Error('Invalid response format');
      }
    });

    await runTest('Get Technology Categories', async () => {
      const result = await technologiesApi.getCategories();
      if (!Array.isArray(result)) {
        throw new Error('Categories should be an array');
      }
    });

    await runTest('Get Technology Stats', async () => {
      const result = await technologiesApi.getStats();
      if (!result || typeof result.total !== 'number') {
        throw new Error('Invalid stats format');
      }
    });

    await runTest('Search Technologies', async () => {
      const result = await technologiesApi.search({ query: 'test', limit: 5 });
      if (!Array.isArray(result)) {
        throw new Error('Search results should be an array');
      }
    });

    await runTest('Get Featured Technologies', async () => {
      const result = await technologiesApi.getFeatured(3);
      if (!Array.isArray(result)) {
        throw new Error('Featured technologies should be an array');
      }
    });

    // Public API Tests
    await runTest('Public: Get All Technologies', async () => {
      const result = await publicTechnologiesApi.getAll({ page: 1, limit: 5 });
      if (!result || typeof result !== 'object') {
        throw new Error('Invalid response format');
      }
    });

    await runTest('Public: Get Featured Technologies', async () => {
      const result = await publicTechnologiesApi.getFeatured(3);
      if (!Array.isArray(result)) {
        throw new Error('Featured technologies should be an array');
      }
    });

    await runTest('Public: Get Categories', async () => {
      const result = await publicTechnologiesApi.getCategories();
      if (!Array.isArray(result)) {
        throw new Error('Categories should be an array');
      }
    });

    await runTest('Public: Get Stats', async () => {
      const result = await publicTechnologiesApi.getStats();
      if (!result || typeof result.total !== 'number') {
        throw new Error('Invalid stats format');
      }
    });

    await runTest('Public: Search Technologies', async () => {
      const result = await publicTechnologiesApi.search({ query: 'test', limit: 5 });
      if (!Array.isArray(result)) {
        throw new Error('Search results should be an array');
      }
    });

    // CRUD Tests (if user has permissions)
    let createdTechnologyId: string | null = null;

    await runTest('Create Technology', async () => {
      const result = await technologiesApi.create(sampleTechnology);
      if (!result || !result._id) {
        throw new Error('Failed to create technology');
      }
      createdTechnologyId = result._id;
    });

    if (createdTechnologyId) {
      await runTest('Get Technology by ID', async () => {
        const result = await technologiesApi.getById(createdTechnologyId!);
        if (!result || result._id !== createdTechnologyId) {
          throw new Error('Failed to get technology by ID');
        }
      });

      await runTest('Update Technology', async () => {
        const result = await technologiesApi.update(createdTechnologyId!, {
          description: 'Updated test description'
        });
        if (!result || result._id !== createdTechnologyId) {
          throw new Error('Failed to update technology');
        }
      });

      // Test image upload functionality
      await runTest('Upload Technology Image', async () => {
        // Create a test image file (1x1 pixel PNG)
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#7916ff';
          ctx.fillRect(0, 0, 1, 1);
        }

        // Convert canvas to blob
        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((blob) => {
            resolve(blob!);
          }, 'image/png');
        });

        // Create file from blob
        const testImageFile = new File([blob], 'test-image.png', { type: 'image/png' });

        // Upload the image
        const result = await technologiesApi.uploadImage(createdTechnologyId!, testImageFile);
        if (!result || !result.imageUrl) {
          throw new Error('Failed to upload image');
        }
      });

      await runTest('Delete Technology', async () => {
        await technologiesApi.delete(createdTechnologyId!);
      });
    }

    setIsRunning(false);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pending':
        return <FiLoader className="w-4 h-4 animate-spin text-blue-400" />;
      case 'success':
        return <FiCheck className="w-4 h-4 text-green-400" />;
      case 'error':
        return <FiX className="w-4 h-4 text-red-400" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'pending':
        return 'text-blue-400';
      case 'success':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
    }
  };

  const successCount = tests.filter(t => t.status === 'success').length;
  const errorCount = tests.filter(t => t.status === 'error').length;
  const totalTests = tests.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Technology API Tests</h1>
          <p className="text-primary-300 mt-2">
            Test all technology management API endpoints
          </p>
        </div>
        
        <EnhancedButton
          variant="gradient"
          onClick={runAllTests}
          disabled={isRunning}
          glow
        >
          {isRunning ? (
            <>
              <FiLoader className="w-4 h-4 animate-spin" />
              Running Tests...
            </>
          ) : (
            <>
              <FiPlay className="w-4 h-4" />
              Run All Tests
            </>
          )}
        </EnhancedButton>
      </div>

      {/* Test Results Summary */}
      {tests.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{totalTests}</div>
                <div className="text-sm text-primary-300">Total Tests</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{successCount}</div>
                <div className="text-sm text-primary-300">Passed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{errorCount}</div>
                <div className="text-sm text-primary-300">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-400">
                  {totalTests > 0 ? Math.round((successCount / totalTests) * 100) : 0}%
                </div>
                <div className="text-sm text-primary-300">Success Rate</div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Test Results */}
      {tests.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard className="p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Test Results</h2>
            <div className="space-y-3">
              {tests.map((test, index) => (
                <motion.div
                  key={test.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 bg-dark-800/30 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(test.status)}
                    <span className="text-white font-medium">{test.name}</span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm">
                    {test.duration && (
                      <span className="text-primary-300">{test.duration}ms</span>
                    )}
                    <span className={getStatusColor(test.status)}>
                      {test.message || test.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Instructions */}
      <GlassCard className="p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Test Information</h2>
        <div className="space-y-3 text-primary-300">
          <p>
            This test suite validates all technology management API endpoints including:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Admin API endpoints (CRUD operations)</li>
            <li>Public API endpoints (read-only)</li>
            <li>Search and filtering functionality</li>
            <li>Statistics and analytics</li>
            <li>File upload capabilities</li>
          </ul>
          <p className="mt-4">
            <strong className="text-white">Note:</strong> Some tests may fail if you don't have proper authentication 
            or if the backend server is not running. Make sure you're logged in as an admin user.
          </p>
        </div>
      </GlassCard>
    </div>
  );
}
