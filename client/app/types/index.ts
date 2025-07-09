import { ReactNode } from "react";

export interface CardItem {
    id: string;
    title: string;
    description: string;
    icons: string[]
    imageUrl?: string;
  }

export  interface Service {
    title: string;
    description: string;
    icon: ReactNode;
    delay: number;
  }
  

  export interface Employee {
    id: string;
    name: string;
    email: string;
    position: string;
    department: string;
    joinDate: string;
  }
  
  export type EmployeeFormData = Omit<Employee, "id">;
  
  export interface EmployeeTableProps {
    employees: Employee[];
    onAdd: (employee: EmployeeFormData) => void;
    onUpdate: (id: string, employee: EmployeeFormData) => void;
    onDelete: (id: string) => void;
    isLoading?: boolean;
    error?: string | null;
  }