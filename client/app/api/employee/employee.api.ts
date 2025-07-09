import {createEmpPayload} from "./emp-api-type"
import apiClient from "../apiClient"

export const empApi ={
    createEmp : async (payload : createEmpPayload)=>{
        return apiClient.post("/admin/employee" , payload)
    },
    getEmp: async ()=>{
        return apiClient.get("/admin/employee")
    }
}