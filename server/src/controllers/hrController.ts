import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/config/database';
import { MessageQueueService, MessageTypes } from '@/config/rabbitmq';
import { AuthRequest } from '@/middleware/auth';
import { CustomError } from '@/middleware/errorHandler';
import { logger } from '@/utils/logger';

export const hrController = {
  // Employee Management
  async getEmployees(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, search, status, department } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      let query = db('employees')
        .select(
          'employees.*',
          'users.email',
          'users.first_name',
          'users.last_name',
          'users.phone',
          'users.is_active',
          'departments.name as department_name'
        )
        .join('users', 'employees.user_id', 'users.id')
        .leftJoin('departments', 'employees.department_id', 'departments.id');

      if (search) {
        query = query.where(function() {
          this.where('users.first_name', 'ilike', `%${search}%`)
            .orWhere('users.last_name', 'ilike', `%${search}%`)
            .orWhere('users.email', 'ilike', `%${search}%`)
            .orWhere('employees.personal_id_no', 'ilike', `%${search}%`);
        });
      }

      if (status) {
        query = query.where('employees.status', status);
      }

      if (department) {
        query = query.where('employees.department_id', department);
      }

      const [{ count }] = await query.clone().count('* as count');
      const employees = await query
        .limit(Number(limit))
        .offset(offset)
        .orderBy('employees.created_at', 'desc');

      res.json({
        success: true,
        data: employees,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: Number(count),
          totalPages: Math.ceil(Number(count) / Number(limit))
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async createEmployee(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const {
        userId,
        personalIdNo,
        startDate,
        position,
        departmentId,
        salaryBase,
        bankAccount,
        payrollCode,
        emergencyContact,
        address,
        notes
      } = req.body;

      const [employeeId] = await db('employees').insert({
        user_id: userId,
        personal_id_no: personalIdNo,
        start_date: startDate,
        position,
        department_id: departmentId,
        salary_base: salaryBase,
        bank_account: bankAccount,
        payroll_code: payrollCode,
        emergency_contact: JSON.stringify(emergencyContact),
        address: JSON.stringify(address),
        status: 'active',
        notes
      }).returning('id');

      logger.info(`Employee created: ${personalIdNo} by ${req.user?.email}`);

      res.status(201).json({
        success: true,
        data: { id: employeeId.id },
        message: 'Employee created successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  async getEmployeeById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const employee = await db('employees')
        .select(
          'employees.*',
          'users.email',
          'users.first_name',
          'users.last_name',
          'users.phone',
          'users.is_active',
          'departments.name as department_name'
        )
        .join('users', 'employees.user_id', 'users.id')
        .leftJoin('departments', 'employees.department_id', 'departments.id')
        .where('employees.id', id)
        .first();

      if (!employee) {
        throw new CustomError('Employee not found', 404);
      }

      // Parse JSON fields
      employee.emergency_contact = JSON.parse(employee.emergency_contact || '{}');
      employee.address = JSON.parse(employee.address || '{}');

      res.json({
        success: true,
        data: employee
      });
    } catch (error) {
      next(error);
    }
  },

  async updateEmployee(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const employee = await db('employees').where('id', id).first();
      if (!employee) {
        throw new CustomError('Employee not found', 404);
      }

      // Convert JSON fields
      if (updateData.emergencyContact) {
        updateData.emergency_contact = JSON.stringify(updateData.emergencyContact);
      }
      if (updateData.address) {
        updateData.address = JSON.stringify(updateData.address);
      }

      await db('employees')
        .where('id', id)
        .update({
          ...updateData,
          updated_at: new Date()
        });

      logger.info(`Employee updated: ${employee.personal_id_no} by ${req.user?.email}`);

      res.json({
        success: true,
        message: 'Employee updated successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteEmployee(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const employee = await db('employees').where('id', id).first();
      if (!employee) {
        throw new CustomError('Employee not found', 404);
      }

      // Soft delete - deactivate employee
      await db('employees')
        .where('id', id)
        .update({
          status: 'inactive',
          end_date: new Date(),
          updated_at: new Date()
        });

      logger.info(`Employee deactivated: ${employee.personal_id_no} by ${req.user?.email}`);

      res.json({
        success: true,
        message: 'Employee deactivated successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  // Job Applications
  async getApplications(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, status, position } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      let query = db('hr_applications');

      if (status) {
        query = query.where('status', status);
      }

      if (position) {
        query = query.where('applied_position', 'ilike', `%${position}%`);
      }

      const [{ count }] = await query.clone().count('* as count');
      const applications = await query
        .limit(Number(limit))
        .offset(offset)
        .orderBy('created_at', 'desc');

      res.json({
        success: true,
        data: applications,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: Number(count),
          totalPages: Math.ceil(Number(count) / Number(limit))
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async createApplication(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        fullName,
        email,
        phone,
        appliedPosition,
        cvPath,
        motivationLetter,
        references
      } = req.body;

      const [applicationId] = await db('hr_applications').insert({
        full_name: fullName,
        email,
        phone,
        applied_position: appliedPosition,
        cv_path: cvPath,
        motivation_letter: motivationLetter,
        references: JSON.stringify(references || []),
        status: 'new'
      }).returning('id');

      // Send notification to HR
      await MessageQueueService.publishToExchange(
        MessageTypes.EMAIL.exchange,
        MessageTypes.EMAIL.routingKey,
        {
          to: 'hr@ayazlojistik.com',
          template: 'new_application',
          data: {
            applicantName: fullName,
            position: appliedPosition,
            applicationId: applicationId.id
          }
        }
      );

      logger.info(`Job application received: ${fullName} for ${appliedPosition}`);

      res.status(201).json({
        success: true,
        data: { id: applicationId.id },
        message: 'Application submitted successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  async getApplicationById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const application = await db('hr_applications')
        .where('id', id)
        .first();

      if (!application) {
        throw new CustomError('Application not found', 404);
      }

      // Parse JSON fields
      application.references = JSON.parse(application.references || '[]');

      res.json({
        success: true,
        data: application
      });
    } catch (error) {
      next(error);
    }
  },

  async updateApplicationStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;

      const application = await db('hr_applications').where('id', id).first();
      if (!application) {
        throw new CustomError('Application not found', 404);
      }

      await db('hr_applications')
        .where('id', id)
        .update({
          status,
          notes,
          reviewer_id: req.user?.id,
          reviewed_at: new Date(),
          updated_at: new Date()
        });

      // Send notification to applicant
      await MessageQueueService.publishToExchange(
        MessageTypes.EMAIL.exchange,
        MessageTypes.EMAIL.routingKey,
        {
          to: application.email,
          template: 'application_status_update',
          data: {
            applicantName: application.full_name,
            position: application.applied_position,
            status
          }
        }
      );

      logger.info(`Application status updated: ${id} to ${status} by ${req.user?.email}`);

      res.json({
        success: true,
        message: 'Application status updated successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  // Shift Management
  async getShifts(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, employeeId, date } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      let query = db('shifts')
        .select(
          'shifts.*',
          'users.first_name',
          'users.last_name'
        )
        .join('users', 'shifts.employee_id', 'users.id');

      if (employeeId) {
        query = query.where('shifts.employee_id', employeeId);
      }

      if (date) {
        query = query.where('shifts.shift_date', date);
      }

      const [{ count }] = await query.clone().count('* as count');
      const shifts = await query
        .limit(Number(limit))
        .offset(offset)
        .orderBy('shifts.shift_date', 'desc');

      res.json({
        success: true,
        data: shifts,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: Number(count),
          totalPages: Math.ceil(Number(count) / Number(limit))
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async createShift(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const {
        employeeId,
        shiftDate,
        startTime,
        endTime,
        shiftType,
        notes
      } = req.body;

      const [shiftId] = await db('shifts').insert({
        employee_id: employeeId,
        shift_date: shiftDate,
        start_time: startTime,
        end_time: endTime,
        shift_type: shiftType,
        status: 'scheduled',
        notes,
        created_by: req.user?.id
      }).returning('id');

      logger.info(`Shift created: ${shiftId.id} by ${req.user?.email}`);

      res.status(201).json({
        success: true,
        data: { id: shiftId.id },
        message: 'Shift created successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  async getShiftRequests(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, status } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      let query = db('shift_requests')
        .select(
          'shift_requests.*',
          'users.first_name',
          'users.last_name'
        )
        .join('users', 'shift_requests.employee_id', 'users.id');

      if (status) {
        query = query.where('shift_requests.status', status);
      }

      const [{ count }] = await query.clone().count('* as count');
      const requests = await query
        .limit(Number(limit))
        .offset(offset)
        .orderBy('shift_requests.created_at', 'desc');

      res.json({
        success: true,
        data: requests,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: Number(count),
          totalPages: Math.ceil(Number(count) / Number(limit))
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async createShiftRequest(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const {
        shiftDate,
        startTime,
        endTime,
        shiftType,
        reason,
        notes
      } = req.body;

      const [requestId] = await db('shift_requests').insert({
        employee_id: req.user?.id,
        shift_date: shiftDate,
        start_time: startTime,
        end_time: endTime,
        shift_type: shiftType,
        reason,
        notes,
        status: 'pending'
      }).returning('id');

      logger.info(`Shift request created: ${requestId.id} by ${req.user?.email}`);

      res.status(201).json({
        success: true,
        data: { id: requestId.id },
        message: 'Shift request created successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  async approveShiftRequest(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const request = await db('shift_requests').where('id', id).first();
      if (!request) {
        throw new CustomError('Shift request not found', 404);
      }

      const trx = await db.transaction();

      try {
        // Update request status
        await trx('shift_requests')
          .where('id', id)
          .update({
            status: 'approved',
            approved_by: req.user?.id,
            approved_at: new Date()
          });

        // Create shift
        await trx('shifts').insert({
          employee_id: request.employee_id,
          shift_date: request.shift_date,
          start_time: request.start_time,
          end_time: request.end_time,
          shift_type: request.shift_type,
          status: 'scheduled',
          notes: request.notes,
          created_by: req.user?.id
        });

        await trx.commit();

        logger.info(`Shift request approved: ${id} by ${req.user?.email}`);

        res.json({
          success: true,
          message: 'Shift request approved successfully'
        });
      } catch (error) {
        await trx.rollback();
        throw error;
      }
    } catch (error) {
      next(error);
    }
  },

  async rejectShiftRequest(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      const request = await db('shift_requests').where('id', id).first();
      if (!request) {
        throw new CustomError('Shift request not found', 404);
      }

      await db('shift_requests')
        .where('id', id)
        .update({
          status: 'rejected',
          rejected_by: req.user?.id,
          rejected_at: new Date(),
          rejection_reason: reason
        });

      logger.info(`Shift request rejected: ${id} by ${req.user?.email}`);

      res.json({
        success: true,
        message: 'Shift request rejected successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  // Leave Management
  async getLeaveRequests(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, status, employeeId } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      let query = db('leaves')
        .select(
          'leaves.*',
          'users.first_name',
          'users.last_name'
        )
        .join('users', 'leaves.employee_id', 'users.id');

      if (status) {
        query = query.where('leaves.status', status);
      }

      if (employeeId) {
        query = query.where('leaves.employee_id', employeeId);
      }

      const [{ count }] = await query.clone().count('* as count');
      const requests = await query
        .limit(Number(limit))
        .offset(offset)
        .orderBy('leaves.created_at', 'desc');

      res.json({
        success: true,
        data: requests,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: Number(count),
          totalPages: Math.ceil(Number(count) / Number(limit))
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async createLeaveRequest(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const {
        leaveType,
        startDate,
        endDate,
        reason,
        notes
      } = req.body;

      // Calculate leave days
      const start = new Date(startDate);
      const end = new Date(endDate);
      const leaveDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

      const [leaveId] = await db('leaves').insert({
        employee_id: req.user?.id,
        leave_type: leaveType,
        start_date: startDate,
        end_date: endDate,
        leave_days: leaveDays,
        reason,
        notes,
        status: 'pending'
      }).returning('id');

      logger.info(`Leave request created: ${leaveId.id} by ${req.user?.email}`);

      res.status(201).json({
        success: true,
        data: { id: leaveId.id },
        message: 'Leave request created successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  async getLeaveRequestById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const leave = await db('leaves')
        .select(
          'leaves.*',
          'users.first_name',
          'users.last_name'
        )
        .join('users', 'leaves.employee_id', 'users.id')
        .where('leaves.id', id)
        .first();

      if (!leave) {
        throw new CustomError('Leave request not found', 404);
      }

      res.json({
        success: true,
        data: leave
      });
    } catch (error) {
      next(error);
    }
  },

  async approveLeaveRequest(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const leave = await db('leaves').where('id', id).first();
      if (!leave) {
        throw new CustomError('Leave request not found', 404);
      }

      await db('leaves')
        .where('id', id)
        .update({
          status: 'approved',
          approved_by: req.user?.id,
          approved_at: new Date()
        });

      logger.info(`Leave request approved: ${id} by ${req.user?.email}`);

      res.json({
        success: true,
        message: 'Leave request approved successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  async rejectLeaveRequest(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      const leave = await db('leaves').where('id', id).first();
      if (!leave) {
        throw new CustomError('Leave request not found', 404);
      }

      await db('leaves')
        .where('id', id)
        .update({
          status: 'rejected',
          rejected_by: req.user?.id,
          rejected_at: new Date(),
          rejection_reason: reason
        });

      logger.info(`Leave request rejected: ${id} by ${req.user?.email}`);

      res.json({
        success: true,
        message: 'Leave request rejected successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  // Payroll Management
  async getPayrollRecords(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, period, employeeId } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      let query = db('payroll_records')
        .select(
          'payroll_records.*',
          'users.first_name',
          'users.last_name'
        )
        .join('users', 'payroll_records.employee_id', 'users.id');

      if (period) {
        query = query.where('payroll_records.payroll_period', period);
      }

      if (employeeId) {
        query = query.where('payroll_records.employee_id', employeeId);
      }

      const [{ count }] = await query.clone().count('* as count');
      const records = await query
        .limit(Number(limit))
        .offset(offset)
        .orderBy('payroll_records.created_at', 'desc');

      res.json({
        success: true,
        data: records,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: Number(count),
          totalPages: Math.ceil(Number(count) / Number(limit))
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async generatePayroll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { period } = req.body;

      // Get all active employees
      const employees = await db('employees')
        .select('employees.*', 'users.first_name', 'users.last_name')
        .join('users', 'employees.user_id', 'users.id')
        .where('employees.status', 'active');

      const payrollRecords = [];

      for (const employee of employees) {
        // Calculate payroll components
        const basicSalary = employee.salary_base || 0;
        const overtimeHours = 0; // Calculate from timesheet
        const overtimeRate = basicSalary / 160; // Assuming 160 hours per month
        const overtimePay = overtimeHours * overtimeRate;
        const grossSalary = basicSalary + overtimePay;

        // Calculate deductions
        const taxRate = 0.15; // 15% tax
        const socialSecurityRate = 0.14; // 14% social security
        const incomeTax = grossSalary * taxRate;
        const socialSecurity = grossSalary * socialSecurityRate;
        const totalDeductions = incomeTax + socialSecurity;
        const netSalary = grossSalary - totalDeductions;

        const [payrollId] = await db('payroll_records').insert({
          employee_id: employee.user_id,
          payroll_period: period,
          basic_salary: basicSalary,
          overtime_hours: overtimeHours,
          overtime_pay: overtimePay,
          gross_salary: grossSalary,
          income_tax: incomeTax,
          social_security: socialSecurity,
          total_deductions: totalDeductions,
          net_salary: netSalary,
          status: 'generated',
          created_by: req.user?.id
        }).returning('id');

        payrollRecords.push(payrollId.id);
      }

      logger.info(`Payroll generated for period ${period} by ${req.user?.email}`);

      res.status(201).json({
        success: true,
        data: { recordIds: payrollRecords },
        message: 'Payroll generated successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  async getPayrollRecordById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const record = await db('payroll_records')
        .select(
          'payroll_records.*',
          'users.first_name',
          'users.last_name'
        )
        .join('users', 'payroll_records.employee_id', 'users.id')
        .where('payroll_records.id', id)
        .first();

      if (!record) {
        throw new CustomError('Payroll record not found', 404);
      }

      res.json({
        success: true,
        data: record
      });
    } catch (error) {
      next(error);
    }
  },

  async getPayrollPDF(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const record = await db('payroll_records')
        .select(
          'payroll_records.*',
          'users.first_name',
          'users.last_name'
        )
        .join('users', 'payroll_records.employee_id', 'users.id')
        .where('payroll_records.id', id)
        .first();

      if (!record) {
        throw new CustomError('Payroll record not found', 404);
      }

      // In a real implementation, generate PDF using a library like Puppeteer
      // For now, return the record data
      res.json({
        success: true,
        data: record,
        message: 'Payroll PDF would be generated here'
      });
    } catch (error) {
      next(error);
    }
  },

  // Performance Management
  async getPerformanceReviews(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, employeeId, reviewPeriod } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      let query = db('performance_reviews')
        .select(
          'performance_reviews.*',
          'users.first_name',
          'users.last_name'
        )
        .join('users', 'performance_reviews.employee_id', 'users.id');

      if (employeeId) {
        query = query.where('performance_reviews.employee_id', employeeId);
      }

      if (reviewPeriod) {
        query = query.where('performance_reviews.review_period', reviewPeriod);
      }

      const [{ count }] = await query.clone().count('* as count');
      const reviews = await query
        .limit(Number(limit))
        .offset(offset)
        .orderBy('performance_reviews.created_at', 'desc');

      res.json({
        success: true,
        data: reviews,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: Number(count),
          totalPages: Math.ceil(Number(count) / Number(limit))
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async createPerformanceReview(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const {
        employeeId,
        reviewPeriod,
        goals,
        achievements,
        areasForImprovement,
        overallRating,
        comments,
        reviewerComments
      } = req.body;

      const [reviewId] = await db('performance_reviews').insert({
        employee_id: employeeId,
        review_period: reviewPeriod,
        goals: JSON.stringify(goals),
        achievements: JSON.stringify(achievements),
        areas_for_improvement: JSON.stringify(areasForImprovement),
        overall_rating: overallRating,
        comments,
        reviewer_comments: reviewerComments,
        status: 'draft',
        created_by: req.user?.id
      }).returning('id');

      logger.info(`Performance review created: ${reviewId.id} by ${req.user?.email}`);

      res.status(201).json({
        success: true,
        data: { id: reviewId.id },
        message: 'Performance review created successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  async getPerformanceReviewById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const review = await db('performance_reviews')
        .select(
          'performance_reviews.*',
          'users.first_name',
          'users.last_name'
        )
        .join('users', 'performance_reviews.employee_id', 'users.id')
        .where('performance_reviews.id', id)
        .first();

      if (!review) {
        throw new CustomError('Performance review not found', 404);
      }

      // Parse JSON fields
      review.goals = JSON.parse(review.goals || '[]');
      review.achievements = JSON.parse(review.achievements || '[]');
      review.areas_for_improvement = JSON.parse(review.areas_for_improvement || '[]');

      res.json({
        success: true,
        data: review
      });
    } catch (error) {
      next(error);
    }
  },

  async updatePerformanceReview(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const review = await db('performance_reviews').where('id', id).first();
      if (!review) {
        throw new CustomError('Performance review not found', 404);
      }

      // Convert JSON fields
      if (updateData.goals) {
        updateData.goals = JSON.stringify(updateData.goals);
      }
      if (updateData.achievements) {
        updateData.achievements = JSON.stringify(updateData.achievements);
      }
      if (updateData.areasForImprovement) {
        updateData.areas_for_improvement = JSON.stringify(updateData.areasForImprovement);
      }

      await db('performance_reviews')
        .where('id', id)
        .update({
          ...updateData,
          updated_at: new Date()
        });

      logger.info(`Performance review updated: ${id} by ${req.user?.email}`);

      res.json({
        success: true,
        message: 'Performance review updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }
};
