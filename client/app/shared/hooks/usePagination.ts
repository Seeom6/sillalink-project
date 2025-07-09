'use client';

import { useState, useMemo, useCallback } from 'react';

interface PaginationOptions {
  initialPage?: number;
  initialLimit?: number;
  totalItems?: number;
}

interface PaginationResult {
  currentPage: number;
  limit: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startIndex: number;
  endIndex: number;
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  setLimit: (limit: number) => void;
  setTotalItems: (total: number) => void;
  getVisiblePages: (delta?: number) => (number | string)[];
}

export function usePagination({
  initialPage = 1,
  initialLimit = 10,
  totalItems = 0,
}: PaginationOptions = {}): PaginationResult {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [limit, setLimitState] = useState(initialLimit);
  const [totalItemsState, setTotalItemsState] = useState(totalItems);

  const totalPages = useMemo(() => {
    return Math.ceil(totalItemsState / limit);
  }, [totalItemsState, limit]);

  const hasNextPage = useMemo(() => {
    return currentPage < totalPages;
  }, [currentPage, totalPages]);

  const hasPreviousPage = useMemo(() => {
    return currentPage > 1;
  }, [currentPage]);

  const startIndex = useMemo(() => {
    return (currentPage - 1) * limit;
  }, [currentPage, limit]);

  const endIndex = useMemo(() => {
    return Math.min(startIndex + limit, totalItemsState);
  }, [startIndex, limit, totalItemsState]);

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  const nextPage = useCallback(() => {
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  }, [hasNextPage]);

  const previousPage = useCallback(() => {
    if (hasPreviousPage) {
      setCurrentPage(prev => prev - 1);
    }
  }, [hasPreviousPage]);

  const setLimit = useCallback((newLimit: number) => {
    setLimitState(newLimit);
    // Reset to first page when limit changes
    setCurrentPage(1);
  }, []);

  const setTotalItems = useCallback((total: number) => {
    setTotalItemsState(total);
    // Adjust current page if it's beyond the new total pages
    const newTotalPages = Math.ceil(total / limit);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }
  }, [limit, currentPage]);

  const getVisiblePages = useCallback((delta: number = 2) => {
    const range: (number | string)[] = [];
    const rangeWithDots: (number | string)[] = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  }, [currentPage, totalPages]);

  return {
    currentPage,
    limit,
    totalPages,
    totalItems: totalItemsState,
    hasNextPage,
    hasPreviousPage,
    startIndex,
    endIndex,
    goToPage,
    nextPage,
    previousPage,
    setLimit,
    setTotalItems,
    getVisiblePages,
  };
}
