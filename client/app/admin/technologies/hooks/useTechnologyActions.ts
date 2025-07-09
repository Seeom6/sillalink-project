"use client";

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTechnologyActions as useBaseTechnologyActions } from '@/app/hooks/technology/useTechnology';
import { useToast } from '@/app/hooks/useToast';
import {
  TechnologyFormData
} from '@/app/types/technologyTypes';
import {
  isValidTechnologyId,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES
} from '../utils';

/**
 * Enhanced technology actions hook with validation and error handling
 */
export const useEnhancedTechnologyActions = () => {
  const router = useRouter();
  const toast = useToast();
  const baseTechnologyActions = useBaseTechnologyActions();

  const handleEdit = useCallback((id: string) => {
    if (!isValidTechnologyId(id)) {
      toast.error('Error', ERROR_MESSAGES.INVALID_ID);
      return;
    }
    router.push(`/admin/technologies/edit/${id}`);
  }, [router, toast]);

  const handleView = useCallback((id: string) => {
    if (!isValidTechnologyId(id)) {
      toast.error('Error', ERROR_MESSAGES.INVALID_ID);
      return;
    }
    router.push(`/admin/technologies/${id}`);
  }, [router, toast]);

  const handleDelete = useCallback(async (id: string) => {
    if (!isValidTechnologyId(id)) {
      toast.error('Error', ERROR_MESSAGES.INVALID_ID);
      return false;
    }

    try {
      const success = await baseTechnologyActions.deleteTechnology(id);
      if (success) {
        toast.success('Success', SUCCESS_MESSAGES.DELETED);
        return true;
      }
      return false;
    } catch (error) {
      toast.error('Error', ERROR_MESSAGES.GENERIC_ERROR);
      return false;
    }
  }, [baseTechnologyActions, toast]);

  const handleToggleFeatured = useCallback(async (id: string) => {
    if (!isValidTechnologyId(id)) {
      toast.error('Error', ERROR_MESSAGES.INVALID_ID);
      return false;
    }

    try {
      const result = await baseTechnologyActions.toggleFeatured(id);
      if (result) {
        toast.success('Success', SUCCESS_MESSAGES.FEATURED_TOGGLED);
        return true;
      }
      return false;
    } catch (error) {
      toast.error('Error', ERROR_MESSAGES.GENERIC_ERROR);
      return false;
    }
  }, [baseTechnologyActions, toast]);

  const handleCreate = useCallback(async (data: TechnologyFormData, imageFile?: File) => {
    try {
      const result = await baseTechnologyActions.createTechnology(data, imageFile);
      if (result) {
        toast.success('Success', SUCCESS_MESSAGES.CREATED);
        router.push('/admin/technologies');
        return true;
      }
      return false;
    } catch (error) {
      toast.error('Error', ERROR_MESSAGES.GENERIC_ERROR);
      return false;
    }
  }, [baseTechnologyActions, toast, router]);

  const handleUpdate = useCallback(async (id: string, data: TechnologyFormData, imageFile?: File) => {
    if (!isValidTechnologyId(id)) {
      toast.error('Error', ERROR_MESSAGES.INVALID_ID);
      return false;
    }

    try {
      const result = await baseTechnologyActions.updateTechnology(id, data, imageFile);
      if (result) {
        toast.success('Success', SUCCESS_MESSAGES.UPDATED);
        router.push('/admin/technologies');
        return true;
      }
      return false;
    } catch (error) {
      toast.error('Error', ERROR_MESSAGES.GENERIC_ERROR);
      return false;
    }
  }, [baseTechnologyActions, toast, router]);

  return {
    ...baseTechnologyActions,
    handleEdit,
    handleView,
    handleDelete,
    handleToggleFeatured,
    handleCreate,
    handleUpdate
  };
};
