'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  FiX,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiBriefcase,
  FiCalendar,
  FiStar,
  FiEdit,
  FiExternalLink
} from 'react-icons/fi';
import { Employee, EmployeeDepartment, EmployeeStatus } from '@/lib/types/employee';
import { GlassCard } from '@/components/ui/glass-card';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { ImageUploadTest } from './ImageUploadTest';

interface EmployeeModalProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
}

// Helper function to validate and format image URLs
const getValidImageUrl = (imageUrl: string | undefined): string | null => {
  if (!imageUrl || imageUrl.trim() === '') {
    return null;
  }

  // If it's already a full URL, return it
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    try {
      new URL(imageUrl);
      return imageUrl;
    } catch {
      return null;
    }
  }

  // If it's a relative path, construct the full URL
  if (imageUrl.startsWith('/') || imageUrl.startsWith('media/')) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    const serverBaseUrl = baseUrl.replace('/api/v1', '');
    return `${serverBaseUrl}/${imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl}`;
  }

  // For other cases, try to construct a valid URL
  try {
    new URL(imageUrl);
    return imageUrl;
  } catch {
    // If it's not a valid URL, treat it as a relative path
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    const serverBaseUrl = baseUrl.replace('/api/v1', '');
    return `${serverBaseUrl}/${imageUrl}`;
  }
};

// Helper function to get status color
const getStatusColor = (status: EmployeeStatus): string => {
  const colors = {
    [EmployeeStatus.ACTIVE]: 'text-green-400',
    [EmployeeStatus.INACTIVE]: 'text-gray-400',
    [EmployeeStatus.TERMINATED]: 'text-red-400',
    [EmployeeStatus.ON_LEAVE]: 'text-yellow-400',
    [EmployeeStatus.PROBATION]: 'text-orange-400',
    [EmployeeStatus.NOTICE_PERIOD]: 'text-purple-400'
  };
  return colors[status] || colors[EmployeeStatus.INACTIVE];
};

// Helper function to format department name
const formatDepartmentName = (department: EmployeeDepartment): string => {
  const names = {
    [EmployeeDepartment.ENGINEERING]: 'Engineering',
    [EmployeeDepartment.DESIGN]: 'Design',
    [EmployeeDepartment.MARKETING]: 'Marketing',
    [EmployeeDepartment.HR]: 'Human Resources',
    [EmployeeDepartment.FINANCE]: 'Finance',
    [EmployeeDepartment.OPERATIONS]: 'Operations',
    [EmployeeDepartment.SALES]: 'Sales',
    [EmployeeDepartment.PRODUCT]: 'Product',
    [EmployeeDepartment.QUALITY_ASSURANCE]: 'Quality Assurance',
    [EmployeeDepartment.CUSTOMER_SUPPORT]: 'Customer Support',
    [EmployeeDepartment.LEGAL]: 'Legal',
    [EmployeeDepartment.OTHER]: 'Other'
  };
  return names[department] || 'Other';
};

// Helper function to format status name
const formatStatusName = (status: EmployeeStatus): string => {
  const names = {
    [EmployeeStatus.ACTIVE]: 'Active',
    [EmployeeStatus.INACTIVE]: 'Inactive',
    [EmployeeStatus.TERMINATED]: 'Terminated',
    [EmployeeStatus.ON_LEAVE]: 'On Leave',
    [EmployeeStatus.PROBATION]: 'Probation',
    [EmployeeStatus.NOTICE_PERIOD]: 'Notice Period'
  };
  return names[status] || 'Unknown';
};

export const EmployeeModal: React.FC<EmployeeModalProps> = ({
  employee,
  isOpen,
  onClose
}) => {
  if (!employee) return null;

  const imageUrl = getValidImageUrl(employee.profileImage) || getValidImageUrl(employee.avatar);
  const fullName = `${employee.firstName} ${employee.lastName}`;
  
  // Calculate tenure
  const hireDate = new Date(employee.hireDate);
  const now = new Date();
  const tenureYears = ((now.getTime() - hireDate.getTime()) / (1000 * 60 * 60 * 24 * 365)).toFixed(1);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <GlassCard className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    {imageUrl ? (
                      <div className="w-16 h-16 relative">
                        <Image
                          src={imageUrl}
                          alt={fullName}
                          fill
                          className="object-cover rounded-full"
                          onError={() => {
                            // Handle image load error silently
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-purple rounded-full flex items-center justify-center">
                        <FiUser className="w-8 h-8 text-white" />
                      </div>
                    )}
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-dark-800 ${
                      employee.status === EmployeeStatus.ACTIVE ? 'bg-green-500' : 'bg-gray-500'
                    }`} />
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="text-2xl font-bold text-white">{fullName}</h2>
                      {employee.isFeatured && (
                        <FiStar className="w-5 h-5 text-yellow-400 fill-current" />
                      )}
                    </div>
                    <p className="text-primary-300">{employee.position}</p>
                    <p className="text-primary-400 text-sm">ID: {employee.employeeId}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <EnhancedButton
                    variant="secondary"
                    size="sm"
                    onClick={() => window.open(`/admin/employees/edit/${employee._id}`, '_blank')}
                  >
                    <FiEdit className="w-4 h-4 mr-2" />
                    Edit
                  </EnhancedButton>
                  <button
                    onClick={onClose}
                    className="text-primary-400 hover:text-white transition-colors duration-200"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Status and Department */}
              <div className="flex items-center space-x-4 mb-6">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(employee.status)}`}>
                  {formatStatusName(employee.status)}
                </span>
                <span className="px-3 py-1 bg-primary-500/20 text-primary-300 rounded-full text-sm font-medium">
                  {formatDepartmentName(employee.department)}
                </span>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Contact Information</h3>

                  <div className="flex items-center space-x-3 text-primary-300">
                    <FiMail className="w-5 h-5" />
                    <span>{employee.email}</span>
                  </div>

                  {employee.phone && (
                    <div className="flex items-center space-x-3 text-primary-300">
                      <FiPhone className="w-5 h-5" />
                      <span>{employee.phone}</span>
                    </div>
                  )}

                  {(employee.address?.city || employee.city) && (
                    <div className="flex items-center space-x-3 text-primary-300">
                      <FiMapPin className="w-5 h-5" />
                      <span>
                        {employee.address ?
                          `${employee.address.city}, ${employee.address.country}` :
                          employee.city
                        }
                      </span>
                    </div>
                  )}

                  {employee.emergencyContact && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-primary-400">Emergency Contact</h4>
                      <div className="text-primary-300 text-sm">
                        <div>{employee.emergencyContact}</div>
                        {employee.emergencyPhone && <div>{employee.emergencyPhone}</div>}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Employment Details</h3>

                  <div className="flex items-center space-x-3 text-primary-300">
                    <FiCalendar className="w-5 h-5" />
                    <span>Hired: {new Date(employee.hireDate).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center space-x-3 text-primary-300">
                    <FiBriefcase className="w-5 h-5" />
                    <span>Tenure: {tenureYears} years</span>
                  </div>

                  {employee.jobTitle && (
                    <div className="text-primary-300 text-sm">
                      <span className="font-medium">Job Title:</span> {employee.jobTitle}
                    </div>
                  )}

                  {employee.employmentType && (
                    <div className="text-primary-300 text-sm">
                      <span className="font-medium">Type:</span> {employee.employmentType.replace('_', ' ')}
                    </div>
                  )}

                  {employee.contractType && (
                    <div className="text-primary-300 text-sm">
                      <span className="font-medium">Contract:</span> {employee.contractType.replace('_', ' ')}
                    </div>
                  )}

                  {employee.salary && (
                    <div className="flex items-center space-x-3 text-primary-300">
                      <span>Salary: ${employee.salary.toLocaleString()}</span>
                      {employee.salaryDetails?.currency && employee.salaryDetails.currency !== 'USD' && (
                        <span className="text-xs">({employee.salaryDetails.currency})</span>
                      )}
                    </div>
                  )}

                  {employee.performanceRating && (
                    <div className="text-primary-300 text-sm">
                      <span className="font-medium">Performance:</span> {employee.performanceRating}/5
                    </div>
                  )}
                </div>
              </div>

              {/* Bio */}
              {employee.bio && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Bio</h3>
                  <p className="text-primary-300">{employee.bio}</p>
                </div>
              )}

              {/* Skills */}
              {employee.skills && employee.skills.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {employee.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-dark-700/50 text-primary-300 rounded-md text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Technologies */}
              {employee.technologies && employee.technologies.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Technologies</h3>
                  <div className="space-y-2">
                    {(employee.technologySkills || []).map((tech, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-dark-700/30 rounded-lg">
                        <span className="text-primary-300">{tech.technology?.name || 'Unknown'}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-dark-600 rounded-full h-2">
                            <div
                              className="bg-primary-500 h-2 rounded-full"
                              style={{ width: `${tech.proficiencyLevel}%` }}
                            />
                          </div>
                          <span className="text-primary-400 text-sm">{tech.proficiencyLevel}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {employee.projects && employee.projects.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Projects ({employee.projects.length})</h3>
                  <div className="space-y-3">
                    {employee.projects.slice(0, 3).map((project, index) => (
                      <div key={index} className="p-3 bg-dark-700/30 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-white font-medium">{project.projectName}</h4>
                            <p className="text-primary-400 text-sm">{project.role}</p>
                            {project.description && (
                              <p className="text-primary-300 text-sm mt-1">{project.description}</p>
                            )}
                            <div className="flex items-center space-x-4 mt-2 text-xs text-primary-400">
                              <span>{new Date(project.startDate).toLocaleDateString()}</span>
                              {project.endDate && <span>- {new Date(project.endDate).toLocaleDateString()}</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {employee.projects.length > 3 && (
                      <div className="text-center">
                        <span className="text-primary-400 text-sm">
                          +{employee.projects.length - 3} more projects
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Trainings & Certifications */}
              {employee.trainings && employee.trainings.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Training & Certifications ({employee.trainings.length})</h3>
                  <div className="space-y-3">
                    {employee.trainings.slice(0, 3).map((training, index) => (
                      <div key={index} className="p-3 bg-dark-700/30 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-white font-medium">{training.title}</h4>
                            <p className="text-primary-400 text-sm">{training.provider}</p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-primary-400">
                              <span>Completed: {new Date(training.completionDate).toLocaleDateString()}</span>
                              {training.isVerified && (
                                <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded">Verified</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {employee.trainings.length > 3 && (
                      <div className="text-center">
                        <span className="text-primary-400 text-sm">
                          +{employee.trainings.length - 3} more trainings
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Achievements */}
              {employee.achievements && employee.achievements.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Achievements ({employee.achievements.length})</h3>
                  <div className="space-y-3">
                    {employee.achievements.slice(0, 3).map((achievement, index) => (
                      <div key={index} className="p-3 bg-dark-700/30 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-white font-medium">{achievement.title}</h4>
                            <p className="text-primary-300 text-sm mt-1">{achievement.description}</p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-primary-400">
                              <span>{new Date(achievement.date).toLocaleDateString()}</span>
                              <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded">
                                {achievement.category}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {employee.achievements.length > 3 && (
                      <div className="text-center">
                        <span className="text-primary-400 text-sm">
                          +{employee.achievements.length - 3} more achievements
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Personal Information */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {employee.gender && (
                    <div>
                      <span className="text-primary-400">Gender:</span>
                      <span className="text-white ml-2">{employee.gender}</span>
                    </div>
                  )}
                  {employee.maritalStatus && (
                    <div>
                      <span className="text-primary-400">Marital Status:</span>
                      <span className="text-white ml-2">{employee.maritalStatus}</span>
                    </div>
                  )}
                  {employee.nationalId && (
                    <div>
                      <span className="text-primary-400">National ID:</span>
                      <span className="text-white ml-2">{employee.nationalId}</span>
                    </div>
                  )}
                  {employee.birthDate && (
                    <div>
                      <span className="text-primary-400">Birth Date:</span>
                      <span className="text-white ml-2">{new Date(employee.birthDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* External Links */}
              <div className="flex items-center space-x-4 mb-6">
                {employee.linkedinProfile && (
                  <a
                    href={employee.linkedinProfile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-primary-400 hover:text-white transition-colors duration-200"
                  >
                    <FiExternalLink className="w-4 h-4" />
                    <span>LinkedIn</span>
                  </a>
                )}

                {employee.githubProfile && (
                  <a
                    href={employee.githubProfile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-primary-400 hover:text-white transition-colors duration-200"
                  >
                    <FiExternalLink className="w-4 h-4" />
                    <span>GitHub</span>
                  </a>
                )}

                {employee.portfolioUrl && (
                  <a
                    href={employee.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-primary-400 hover:text-white transition-colors duration-200"
                  >
                    <FiExternalLink className="w-4 h-4" />
                    <span>Portfolio</span>
                  </a>
                )}
              </div>

              {/* Image Upload Test - Development Only */}
              {process.env.NODE_ENV === 'development' && (
                <ImageUploadTest
                  employeeId={employee._id}
                  employeeName={`${employee.firstName} ${employee.lastName}`}
                  currentImageUrl={imageUrl || ''}
                  onImageUploaded={(newImageUrl) => {
                    console.log('Image uploaded successfully:', newImageUrl);
                    // You could refresh the employee data here
                  }}
                />
              )}
            </GlassCard>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
