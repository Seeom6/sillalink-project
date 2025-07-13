import {createEmpPayload, updateEmpPayload} from "./emp-api-type"
import apiClient from "../apiClient"
import { Employee } from "@/app/types/employeeTypes"

export const empApi ={
    createEmp : async (payload : createEmpPayload)=>{
        try {
            const response = await apiClient.post("/admin/employee" , payload);
            return response;
        } catch (error) {
            throw error;
        }
    },
    getEmp: async (): Promise<any> => {
        try {
            // Add required pagination parameters
            const params = {
                page: 1,
                limit: 100, // Get more employees per page
                needPagination: false
            };

            if (process.env.NODE_ENV === 'development') {
                console.log('[empApi.getEmp] Using params:', params);
            }

            const response = await apiClient.get("/admin/employee", { params });
            return response;
        } catch (error: any) {
            throw error;
        }
    },
    getEmpById: async (id: string): Promise<any> => {
        console.log(`🌐 API: Fetching employee by ID from /admin/employee/${id}`);
        try {
            // Add cache busting parameter to prevent caching issues
            const cacheBuster = Date.now();
            const response = await apiClient.get(`/admin/employee/${id}?_t=${cacheBuster}`, {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    // New function to get ANY user by ID (works for all roles)
    getUserById: async (id: string): Promise<any> => {
        console.log(`🌐 API: Fetching user by ID from /admin/users/${id}`);
        try {
            // Add cache busting parameter to prevent caching issues
            const cacheBuster = Date.now();
            const response = await apiClient.get(`/admin/users/${id}?_t=${cacheBuster}`, {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });
            return response;
        } catch (error) {
            throw error;
        }
    },
    updateEmp: async (id: string, payload: updateEmpPayload): Promise<Employee> => {
        console.log(`🌐 API: Updating employee ${id} at /admin/employee/${id}`);
        console.log(payload)
        console.log('📋 API: Update payload:', payload);
        try {
            const response = await apiClient.put(`/admin/employee/${id}`, payload);
            console.log('✅ API: Update employee response:', response);
            return response as unknown as Employee;
        } catch (error) {
            console.error('❌ API: Update employee failed:', error);
            throw error;
        }
    },

    // Enhanced function to update ANY user by ID (works for all roles)
    updateUser: async (id: string, payload: updateEmpPayload): Promise<any> => {
        try {
            if (process.env.NODE_ENV === 'development') {
                console.log('[empApi.updateUser] Payload:', payload);
            }
            const response = await apiClient.patch(`/admin/users/${id}`, payload);
            if (process.env.NODE_ENV === 'development') {
                console.log('[empApi.updateUser] Response:', response);
            }
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Enhanced smart update function with proper error handling and password validation fix
    smartUpdateUser: async (id: string, payload: updateEmpPayload): Promise<any> => {
        // Create a clean payload without password to fix validation inconsistency
        const cleanPayload = { ...payload };
        delete cleanPayload.password; // Remove password to avoid validation conflicts

        try {
            // First try the employee endpoint (for users with employee role)
            if (process.env.NODE_ENV === 'development') {
                console.log('[empApi.smartUpdateUser] Trying employee endpoint first...');
            }
            const response = await apiClient.put(`/admin/employee/${id}`, cleanPayload);
            if (process.env.NODE_ENV === 'development') {
                console.log('[empApi.smartUpdateUser] Employee endpoint success');
            }
            return response;
        } catch (employeeError: any) {
            if (process.env.NODE_ENV === 'development') {
                console.log('[empApi.smartUpdateUser] Employee endpoint failed, trying user endpoint...', {
                    status: employeeError?.response?.status
                });
            }

            try {
                // Fallback to user endpoint (for admin, operator, user roles)
                const response = await apiClient.patch(`/admin/users/${id}`, cleanPayload);
                if (process.env.NODE_ENV === 'development') {
                    console.log('[empApi.smartUpdateUser] User endpoint success');
                }
                return response;
            } catch (userError: any) {
                console.error('[empApi.smartUpdateUser] Both update endpoints failed', {
                    employeeError: employeeError?.response?.status,
                    userError: userError?.response?.status
                });
                throw userError;
            }
        }
    },
    deleteEmp: async (id: string): Promise<{ message: string }> => {
        console.log(`🌐 API: Deleting employee ${id} at /admin/employee/${id}`);
        try {
            const response = await apiClient.delete(`/admin/employee/${id}`);
            console.log('✅ API: Delete employee response:', response);
            return response as unknown as { message: string };
        } catch (error) {
            console.error('❌ API: Delete employee failed:', error);
            throw error;
        }
    }
}