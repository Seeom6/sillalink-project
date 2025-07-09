"use client";

import { TechnologyStats as TechnologyStatsType } from "@/app/types/technologyTypes";
import { Card } from "@/app/shared/ui/Card";
import { Badge } from "@/app/shared/ui/badge";
import { 
  Code, 
  Star, 
  TrendingUp, 
  Clock, 
  BarChart3,
  Target,
  Award,
  Activity
} from "lucide-react";

interface TechnologyStatsProps {
  stats: TechnologyStatsType;
}

export const TechnologyStats = ({ stats }: TechnologyStatsProps) => {
  // Handle case when stats is undefined or null
  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Technologies",
      value: (stats?.totalTechnologies || 0).toLocaleString(),
      icon: Code,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Technologies in your stack"
    },
    {
      title: "Featured",
      value: (stats?.featuredCount || 0).toLocaleString(),
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      description: "Featured technologies"
    },
    {
      title: "Avg. Proficiency",
      value: `${Math.round(stats?.averageProficiencyLevel || 0)}%`,
      icon: Target,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "Average skill level"
    },
    {
      title: "Learning Hours",
      value: (stats?.totalLearningHours || 0).toLocaleString(),
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "Total estimated hours"
    }
  ];

  const getCategoryStats = () => {
    if (!stats.byCategory || typeof stats.byCategory !== 'object') {
      return [];
    }

    return Object.entries(stats.byCategory)
      .map(([category, count]) => ({
        category: category.replace('_', ' ').toUpperCase(),
        count: typeof count === 'number' ? count : 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5 categories
  };

  const getStatusStats = () => {
    if (!stats.byStatus || typeof stats.byStatus !== 'object') {
      return [];
    }

    return Object.entries(stats.byStatus)
      .map(([status, count]) => ({
        status: status.charAt(0).toUpperCase() + status.slice(1),
        count: typeof count === 'number' ? count : 0,
        color: getStatusColor(status)
      }))
      .sort((a, b) => b.count - a.count);
  };

  const getDifficultyStats = () => {
    if (!stats.byDifficultyLevel || typeof stats.byDifficultyLevel !== 'object') {
      return [];
    }

    return Object.entries(stats.byDifficultyLevel)
      .map(([difficulty, count]) => ({
        difficulty: difficulty.charAt(0).toUpperCase() + difficulty.slice(1),
        count: typeof count === 'number' ? count : 0,
        color: getDifficultyColor(difficulty)
      }))
      .sort((a, b) => {
        const order = ['beginner', 'intermediate', 'advanced', 'expert'];
        return order.indexOf(a.difficulty.toLowerCase()) - order.indexOf(b.difficulty.toLowerCase());
      });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      deprecated: "bg-red-100 text-red-800",
      learning: "bg-blue-100 text-blue-800",
      expert: "bg-purple-100 text-purple-800"
    };
    return colors[status] || colors.active;
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      beginner: "bg-green-100 text-green-800",
      intermediate: "bg-yellow-100 text-yellow-800",
      advanced: "bg-orange-100 text-orange-800",
      expert: "bg-red-100 text-red-800"
    };
    return colors[difficulty] || colors.beginner;
  };

  const categoryStats = getCategoryStats();
  const statusStats = getStatusStats();
  const difficultyStats = getDifficultyStats();

  return (
    <div className="space-y-6">
      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stat.description}
                  </p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Distribution */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Top Categories
            </h3>
          </div>
          <div className="space-y-3">
            {categoryStats.length > 0 ? (
              categoryStats.map((item) => (
                <div key={`category-${item.category}`} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 capitalize">
                    {item.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${(item.count / stats.totalTechnologies) * 100}%`
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8 text-right">
                      {item.count}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No category data available</p>
            )}
          </div>
        </Card>

        {/* Status Distribution */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Status Distribution
            </h3>
          </div>
          <div className="space-y-3">
            {statusStats.length > 0 ? (
              statusStats.map((item) => (
                <div key={`status-${item.status}`} className="flex items-center justify-between">
                  <Badge className={item.color}>
                    {item.status}
                  </Badge>
                  <span className="text-sm font-medium text-gray-900">
                    {item.count}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No status data available</p>
            )}
          </div>
        </Card>

        {/* Difficulty Distribution */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Difficulty Levels
            </h3>
          </div>
          <div className="space-y-3">
            {difficultyStats.length > 0 ? (
              difficultyStats.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <Badge className={item.color}>
                    {item.difficulty}
                  </Badge>
                  <span className="text-sm font-medium text-gray-900">
                    {item.count}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No difficulty data available</p>
            )}
          </div>
        </Card>
      </div>

      {/* Progress Insights */}
      {stats.averageProficiencyLevel > 0 && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Skill Progress Overview
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">
                {Math.round(stats.averageProficiencyLevel)}%
              </div>
              <p className="text-sm text-gray-600">Average Proficiency</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {statusStats.find(s => s.status === 'Expert')?.count || 0}
              </div>
              <p className="text-sm text-gray-600">Expert Level</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {statusStats.find(s => s.status === 'Learning')?.count || 0}
              </div>
              <p className="text-sm text-gray-600">Currently Learning</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
