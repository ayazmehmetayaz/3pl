import { Request, Response } from 'express';
import dashboardController from './dashboardController';
import analyticsController from './analyticsController';
import reportsController from './reportsController';

// Re-export all controllers for easy importing
export { dashboardController, analyticsController, reportsController };

// Main reporting controller that combines all functionality
export const reportingController = {
  // Dashboard routes
  ...dashboardController,

  // Analytics routes
  ...analyticsController,

  // Reports routes
  ...reportsController
};

export default reportingController;
