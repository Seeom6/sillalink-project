"use client"

import { useState } from "react"
import { UserLineChart } from "./../components/dashboard/line-chart"
import { TrafficPieChart } from "./../components/dashboard/pie-chart"
import { ExpensesBarChart } from "./../components/dashboard/bar-chart"
import  Button  from "@/app/shared/ui/button"
import { Tabs, TabsList, TabsTrigger } from "../../shared/ui/tabs"
import { LuChevronDown } from "react-icons/lu";
import { BsFillBarChartFill } from "react-icons/bs";
import { MetricCard } from './../components/dashboard/metric-card';
import { ProjectsTable } from './../components/dashboard/project-table';
import { Card } from '../../shared/ui/Card';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("users")

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <MetricCard
            title="visits"
            value="7,265"
            change="+11.01%"
            positive={true}
            className="bg-gradient-to-t border-none text-white rounded-3xl from-[#131422] to-[#878787]"
          />
          <MetricCard
            title="users"
            value="3,671"
            change="-0.03%"
            positive={false}
            className="bg-gradient-to-t border-none text-white rounded-3xl from-primary to-[#131422]/80"
          />
          <MetricCard
            title="New Users"
            value="256"
            change="+15.03%"
            positive={true}
            className="bg-gradient-to-b border-none text-white rounded-3xl from-[#007AFF]/50 to-[#131422]"
          />
        </div>

        {/* Chart Section */}
        <Card className="p-6 mb-6 border-none shadow-black/20">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <Tabs defaultValue="users" className="w-full sm:w-auto" onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="users" className={activeTab === "users" ? "text-primary" : ""}>
                  Users
                </TabsTrigger>
                <TabsTrigger value="projects" className={activeTab === "projects" ? "text-primary" : "text-indego-dark"}>
                  Projects
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex gap-2 mt-4 sm:mt-0">
              <Button variant="outline" size="sm" className="h-8">
                Week <LuChevronDown className="ml-1 h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="h-8">
                <BsFillBarChartFill className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <UserLineChart />
        </Card>

        {/* Data Visualization Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="p-6 border-none shadow-black/20">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Traffic by Location</h3>
              <Button variant="primary" size="sm" className="bg-transparent text-blue-500! ">
                View Details
              </Button>
            </div>
            <TrafficPieChart />
          </Card>

          <Card className="p-6 border-none shadow-black/20">
            <h3 className="text-lg font-medium mb-4">Company expenses this month</h3>
            <ExpensesBarChart />
          </Card>
        </div>

        {/* Projects Table */}
        <Card className="p-6 border-none shadow-black/20">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-primary">Projects</h3>
            <Button variant="primary" className="rounded-full" >
              <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
            </Button>
          </div>
          <ProjectsTable />
        </Card>
      </main>
    </div>
  )
}
