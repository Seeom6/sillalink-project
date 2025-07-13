// Event emitter for global application events
class EventEmitter {
  private events: { [key: string]: Function[] } = {};

  on(event: string, callback: Function) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  off(event: string, callback: Function) {
    if (!this.events[event]) return;
    
    this.events[event] = this.events[event].filter(cb => cb !== callback);
  }

  emit(event: string, data?: any) {
    if (!this.events[event]) return;
    
    this.events[event].forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        // Silently handle callback errors to prevent breaking other listeners
      }
    });
  }

  removeAllListeners(event?: string) {
    if (event) {
      delete this.events[event];
    } else {
      this.events = {};
    }
  }
}

// Global event emitter instance
export const globalEvents = new EventEmitter();

// Event constants
export const EVENTS = {
  // Project events
  PROJECT_CREATED: 'project:created',
  PROJECT_UPDATED: 'project:updated',
  PROJECT_DELETED: 'project:deleted',
  PROJECTS_BULK_DELETED: 'projects:bulk_deleted',
  PROJECTS_BULK_UPDATED: 'projects:bulk_updated',
  
  // Employee events
  EMPLOYEE_CREATED: 'employee:created',
  EMPLOYEE_UPDATED: 'employee:updated',
  EMPLOYEE_DELETED: 'employee:deleted',
  
  // Technology events
  TECHNOLOGY_CREATED: 'technology:created',
  TECHNOLOGY_UPDATED: 'technology:updated',
  TECHNOLOGY_DELETED: 'technology:deleted',
  
  // Task events
  TASK_CREATED: 'task:created',
  TASK_UPDATED: 'task:updated',
  TASK_DELETED: 'task:deleted',
  
  // UI events
  SIDEBAR_TOGGLE: 'ui:sidebar_toggle',
  THEME_CHANGED: 'ui:theme_changed',
  
  // Auth events
  USER_LOGIN: 'auth:login',
  USER_LOGOUT: 'auth:logout',
  USER_SESSION_EXPIRED: 'auth:session_expired',
  
  // Notification events
  NOTIFICATION_SHOW: 'notification:show',
  NOTIFICATION_HIDE: 'notification:hide',
  
  // Data refresh events
  REFRESH_PROJECTS: 'data:refresh_projects',
  REFRESH_EMPLOYEES: 'data:refresh_employees',
  REFRESH_TECHNOLOGIES: 'data:refresh_technologies'
} as const;

// Type for event names
export type EventName = typeof EVENTS[keyof typeof EVENTS];

// Helper function to emit events with type safety
export const emitEvent = (event: EventName, data?: any) => {
  globalEvents.emit(event, data);
};

// Helper function to listen to events with type safety
export const listenToEvent = (event: EventName, callback: Function) => {
  globalEvents.on(event, callback);
  
  // Return cleanup function
  return () => {
    globalEvents.off(event, callback);
  };
};

// Hook for using events in React components
import { useEffect, useCallback } from 'react';

export const useEventListener = (event: EventName, callback: Function, deps: any[] = []) => {
  const memoizedCallback = useCallback(callback, deps);

  useEffect(() => {
    globalEvents.on(event, memoizedCallback);
    
    return () => {
      globalEvents.off(event, memoizedCallback);
    };
  }, [event, memoizedCallback]);
};

// Hook for emitting events
export const useEventEmitter = () => {
  return useCallback((event: EventName, data?: any) => {
    globalEvents.emit(event, data);
  }, []);
};

export default globalEvents;
