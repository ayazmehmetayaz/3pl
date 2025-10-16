import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/config/database';
import { MessageQueueService, MessageTypes } from '@/config/rabbitmq';
import { AuthRequest } from '@/middleware/auth';
import { CustomError } from '@/middleware/errorHandler';
import { logger } from '@/utils/logger';

export const tmsController = {
  // Vehicle Management
  async getVehicles(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, status, vehicleType } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      let query = db('vehicles')
        .select(
          'vehicles.*',
          'users.first_name as driver_first_name',
          'users.last_name as driver_last_name',
          'warehouses.name as assigned_warehouse_name'
        )
        .leftJoin('users', 'vehicles.current_driver_id', 'users.id')
        .leftJoin('warehouses', 'vehicles.assigned_warehouse_id', 'warehouses.id');

      if (status) {
        query = query.where('vehicles.status', status);
      }

      if (vehicleType) {
        query = query.where('vehicles.vehicle_type', vehicleType);
      }

      const [{ count }] = await query.clone().count('* as count');
      const vehicles = await query
        .limit(Number(limit))
        .offset(offset)
        .orderBy('vehicles.created_at', 'desc');

      res.json({
        success: true,
        data: vehicles,
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

  async createVehicle(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const {
        vehiclePlate,
        vehicleType,
        brand,
        model,
        modelYear,
        color,
        vinNumber,
        engineNumber,
        capacityWeight,
        capacityVolume,
        maxPallets,
        hasTemperatureControl,
        hasGpsTracking,
        fuelType,
        fuelCapacity,
        averageConsumption,
        insuranceNumber,
        insuranceExpiry,
        registrationExpiry,
        inspectionExpiry,
        currentDriverId,
        assignedWarehouseId
      } = req.body;

      // Check if vehicle plate already exists
      const existingVehicle = await db('vehicles').where('vehicle_plate', vehiclePlate).first();
      if (existingVehicle) {
        throw new CustomError('Vehicle with this plate already exists', 400);
      }

      const [vehicleId] = await db('vehicles').insert({
        vehicle_plate: vehiclePlate,
        vehicle_type: vehicleType,
        brand,
        model,
        model_year: modelYear,
        color,
        vin_number: vinNumber,
        engine_number: engineNumber,
        capacity_weight: capacityWeight,
        capacity_volume: capacityVolume,
        max_pallets: maxPallets,
        has_temperature_control: hasTemperatureControl,
        has_gps_tracking: hasGpsTracking,
        fuel_type: fuelType,
        fuel_capacity: fuelCapacity,
        average_consumption: averageConsumption,
        insurance_number: insuranceNumber,
        insurance_expiry: insuranceExpiry,
        registration_expiry: registrationExpiry,
        inspection_expiry: inspectionExpiry,
        current_driver_id: currentDriverId,
        assigned_warehouse_id: assignedWarehouseId,
        status: 'active'
      }).returning('id');

      logger.info(`Vehicle created: ${vehiclePlate} by ${req.user?.email}`);

      res.status(201).json({
        success: true,
        data: { id: vehicleId.id },
        message: 'Vehicle created successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  async getVehicleById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const vehicle = await db('vehicles')
        .select(
          'vehicles.*',
          'users.first_name as driver_first_name',
          'users.last_name as driver_last_name',
          'warehouses.name as assigned_warehouse_name'
        )
        .leftJoin('users', 'vehicles.current_driver_id', 'users.id')
        .leftJoin('warehouses', 'vehicles.assigned_warehouse_id', 'warehouses.id')
        .where('vehicles.id', id)
        .first();

      if (!vehicle) {
        throw new CustomError('Vehicle not found', 404);
      }

      // Get maintenance records
      const maintenance = await db('vehicle_maintenance')
        .where('vehicle_id', id)
        .orderBy('maintenance_date', 'desc')
        .limit(10);

      vehicle.maintenance = maintenance;

      res.json({
        success: true,
        data: vehicle
      });
    } catch (error) {
      next(error);
    }
  },

  async updateVehicle(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const vehicle = await db('vehicles').where('id', id).first();
      if (!vehicle) {
        throw new CustomError('Vehicle not found', 404);
      }

      await db('vehicles')
        .where('id', id)
        .update({
          ...updateData,
          updated_at: new Date()
        });

      logger.info(`Vehicle updated: ${vehicle.vehicle_plate} by ${req.user?.email}`);

      res.json({
        success: true,
        message: 'Vehicle updated successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  async getVehicleMaintenance(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { page = 1, limit = 10 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const [{ count }] = await db('vehicle_maintenance')
        .where('vehicle_id', id)
        .count('* as count');

      const maintenance = await db('vehicle_maintenance')
        .select(
          'vehicle_maintenance.*',
          'users.first_name as performed_by_first_name',
          'users.last_name as performed_by_last_name'
        )
        .leftJoin('users', 'vehicle_maintenance.performed_by', 'users.id')
        .where('vehicle_maintenance.vehicle_id', id)
        .limit(Number(limit))
        .offset(offset)
        .orderBy('maintenance_date', 'desc');

      res.json({
        success: true,
        data: maintenance,
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

  async addMaintenanceRecord(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const {
        maintenanceDate,
        maintenanceType,
        description,
        cost,
        odometerReading,
        serviceProvider,
        notes,
        nextMaintenanceDue
      } = req.body;

      const [maintenanceId] = await db('vehicle_maintenance').insert({
        vehicle_id: id,
        maintenance_date: maintenanceDate,
        maintenance_type: maintenanceType,
        description,
        cost,
        odometer_reading: odometerReading,
        service_provider: serviceProvider,
        notes,
        status: 'completed',
        next_maintenance_due: nextMaintenanceDue,
        performed_by: req.user?.id
      }).returning('id');

      logger.info(`Maintenance record added for vehicle ${id} by ${req.user?.email}`);

      res.status(201).json({
        success: true,
        data: { id: maintenanceId.id },
        message: 'Maintenance record added successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  // Route Planning
  async getRoutes(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, status } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      let query = db('routes')
        .select(
          'routes.*',
          'vehicles.vehicle_plate',
          'users.first_name as driver_first_name',
          'users.last_name as driver_last_name'
        )
        .leftJoin('vehicles', 'routes.vehicle_id', 'vehicles.id')
        .leftJoin('users', 'routes.driver_id', 'users.id');

      if (status) {
        query = query.where('routes.status', status);
      }

      const [{ count }] = await query.clone().count('* as count');
      const routes = await query
        .limit(Number(limit))
        .offset(offset)
        .orderBy('routes.created_at', 'desc');

      res.json({
        success: true,
        data: routes,
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

  async createRoute(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const {
        vehicleId,
        driverId,
        routeName,
        startLocation,
        endLocation,
        stops,
        estimatedDistance,
        estimatedDuration,
        notes
      } = req.body;

      const [routeId] = await db('routes').insert({
        vehicle_id: vehicleId,
        driver_id: driverId,
        route_name: routeName,
        start_location: startLocation,
        end_location: endLocation,
        stops: JSON.stringify(stops),
        estimated_distance: estimatedDistance,
        estimated_duration: estimatedDuration,
        status: 'planned',
        notes,
        created_by: req.user?.id
      }).returning('id');

      logger.info(`Route created: ${routeName} by ${req.user?.email}`);

      res.status(201).json({
        success: true,
        data: { id: routeId.id },
        message: 'Route created successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  async optimizeRoute(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { stops, constraints } = req.body;

      // Simple optimization algorithm - in production, use proper route optimization service
      const optimizedStops = stops.sort((a: any, b: any) => {
        // Sort by distance from start point or by priority
        return (a.priority || 0) - (b.priority || 0);
      });

      const totalDistance = optimizedStops.reduce((total: number, stop: any, index: number) => {
        if (index === 0) return total;
        return total + (stop.distance || 0);
      }, 0);

      const estimatedDuration = Math.round(totalDistance / 60); // Assuming 60 km/h average speed

      res.json({
        success: true,
        data: {
          optimizedStops,
          totalDistance,
          estimatedDuration,
          optimizationScore: Math.round(Math.random() * 100) // Mock score
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // Shipment Management
  async getShipments(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, status, driverId } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      let query = db('shipments')
        .select(
          'shipments.*',
          'orders.order_number',
          'orders.customer_id',
          'customers.company_name as customer_name',
          'vehicles.vehicle_plate',
          'users.first_name as driver_first_name',
          'users.last_name as driver_last_name'
        )
        .join('orders', 'shipments.order_id', 'orders.id')
        .join('customers', 'orders.customer_id', 'customers.id')
        .leftJoin('vehicles', 'shipments.vehicle_id', 'vehicles.id')
        .leftJoin('users', 'shipments.driver_id', 'users.id');

      if (status) {
        query = query.where('shipments.status', status);
      }

      if (driverId) {
        query = query.where('shipments.driver_id', driverId);
      }

      const [{ count }] = await query.clone().count('* as count');
      const shipments = await query
        .limit(Number(limit))
        .offset(offset)
        .orderBy('shipments.created_at', 'desc');

      res.json({
        success: true,
        data: shipments,
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

  async createShipment(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const {
        orderId,
        vehicleId,
        driverId,
        estimatedDepartureTime,
        notes
      } = req.body;

      // Check if order exists and is ready for shipment
      const order = await db('orders')
        .where('id', orderId)
        .andWhere('status', 'picked')
        .first();

      if (!order) {
        throw new CustomError('Order not found or not ready for shipment', 404);
      }

      const [shipmentId] = await db('shipments').insert({
        shipment_number: `SH${Date.now()}`,
        order_id: orderId,
        vehicle_id: vehicleId,
        driver_id: driverId,
        departure_time: estimatedDepartureTime,
        total_weight: order.total_weight,
        total_volume: order.total_volume,
        status: 'planned',
        notes,
        created_by: req.user?.id
      }).returning('id');

      // Update order status
      await db('orders')
        .where('id', orderId)
        .update({ status: 'shipped' });

      logger.info(`Shipment created: ${shipmentId.id} by ${req.user?.email}`);

      res.status(201).json({
        success: true,
        data: { id: shipmentId.id },
        message: 'Shipment created successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  async getShipmentById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const shipment = await db('shipments')
        .select(
          'shipments.*',
          'orders.order_number',
          'orders.customer_id',
          'customers.company_name as customer_name',
          'customers.address as customer_address',
          'customers.city as customer_city',
          'customers.district as customer_district',
          'customers.phone as customer_phone',
          'vehicles.vehicle_plate',
          'vehicles.vehicle_type',
          'users.first_name as driver_first_name',
          'users.last_name as driver_last_name',
          'users.phone as driver_phone'
        )
        .join('orders', 'shipments.order_id', 'orders.id')
        .join('customers', 'orders.customer_id', 'customers.id')
        .leftJoin('vehicles', 'shipments.vehicle_id', 'vehicles.id')
        .leftJoin('users', 'shipments.driver_id', 'users.id')
        .where('shipments.id', id)
        .first();

      if (!shipment) {
        throw new CustomError('Shipment not found', 404);
      }

      // Get order items
      const orderItems = await db('order_items')
        .select(
          'order_items.*',
          'products.product_code',
          'products.name as product_name',
          'products.unit_of_measure'
        )
        .join('products', 'order_items.product_id', 'products.id')
        .where('order_items.order_id', shipment.order_id);

      shipment.orderItems = orderItems;

      res.json({
        success: true,
        data: shipment
      });
    } catch (error) {
      next(error);
    }
  },

  async updateShipmentStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;

      const shipment = await db('shipments').where('id', id).first();
      if (!shipment) {
        throw new CustomError('Shipment not found', 404);
      }

      const updateData: any = {
        status,
        updated_at: new Date()
      };

      if (status === 'loading') {
        updateData.departure_time = new Date();
      } else if (status === 'in_transit') {
        updateData.departure_time = new Date();
      } else if (status === 'delivered') {
        updateData.arrival_time = new Date();
      }

      if (notes) {
        updateData.delivery_notes = notes;
      }

      await db('shipments')
        .where('id', id)
        .update(updateData);

      // Update order status if shipment is delivered
      if (status === 'delivered') {
        await db('orders')
          .where('id', shipment.order_id)
          .update({ status: 'delivered', actual_delivery_date: new Date() });
      }

      // Send notification
      await MessageQueueService.publishToExchange(
        MessageTypes.TMS_UPDATE.exchange,
        MessageTypes.TMS_UPDATE.routingKey,
        {
          type: 'shipment_status_update',
          shipmentId: id,
          status,
          orderId: shipment.order_id
        }
      );

      logger.info(`Shipment status updated: ${id} to ${status} by ${req.user?.email}`);

      res.json({
        success: true,
        message: 'Shipment status updated successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  async loadShipment(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const shipment = await db('shipments').where('id', id).first();
      if (!shipment) {
        throw new CustomError('Shipment not found', 404);
      }

      await db('shipments')
        .where('id', id)
        .update({
          status: 'loading',
          departure_time: new Date()
        });

      logger.info(`Shipment loaded: ${id} by ${req.user?.email}`);

      res.json({
        success: true,
        message: 'Shipment loaded successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  async unloadShipment(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { deliveryNotes, deliverySignature, deliveryPhoto } = req.body;

      const shipment = await db('shipments').where('id', id).first();
      if (!shipment) {
        throw new CustomError('Shipment not found', 404);
      }

      await db('shipments')
        .where('id', id)
        .update({
          status: 'delivered',
          arrival_time: new Date(),
          delivery_notes: deliveryNotes,
          delivery_signature: deliverySignature,
          delivery_photo: deliveryPhoto
        });

      // Update order status
      await db('orders')
        .where('id', shipment.order_id)
        .update({
          status: 'delivered',
          actual_delivery_date: new Date()
        });

      // Send notification
      await MessageQueueService.publishToExchange(
        MessageTypes.TMS_UPDATE.exchange,
        MessageTypes.TMS_UPDATE.routingKey,
        {
          type: 'shipment_delivered',
          shipmentId: id,
          orderId: shipment.order_id
        }
      );

      logger.info(`Shipment unloaded: ${id} by ${req.user?.email}`);

      res.json({
        success: true,
        message: 'Shipment unloaded successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  // Delivery Tracking
  async getShipmentTracking(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const shipment = await db('shipments')
        .select(
          'shipments.*',
          'orders.order_number',
          'orders.requested_delivery_date',
          'orders.promised_delivery_date',
          'customers.company_name as customer_name',
          'customers.address as customer_address',
          'customers.city as customer_city',
          'customers.district as customer_district',
          'customers.phone as customer_phone',
          'vehicles.vehicle_plate',
          'users.first_name as driver_first_name',
          'users.last_name as driver_last_name',
          'users.phone as driver_phone'
        )
        .join('orders', 'shipments.order_id', 'orders.id')
        .join('customers', 'orders.customer_id', 'customers.id')
        .leftJoin('vehicles', 'shipments.vehicle_id', 'vehicles.id')
        .leftJoin('users', 'shipments.driver_id', 'users.id')
        .where('shipments.id', id)
        .first();

      if (!shipment) {
        throw new CustomError('Shipment not found', 404);
      }

      // Get tracking history
      const trackingHistory = await db('shipment_tracking')
        .where('shipment_id', id)
        .orderBy('tracking_date', 'desc');

      shipment.trackingHistory = trackingHistory;

      res.json({
        success: true,
        data: shipment
      });
    } catch (error) {
      next(error);
    }
  },

  async updateShipmentTracking(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { latitude, longitude, status, notes } = req.body;

      // Add tracking record
      await db('shipment_tracking').insert({
        shipment_id: id,
        latitude,
        longitude,
        status,
        notes,
        tracking_date: new Date(),
        driver_id: req.user?.id
      });

      // Update shipment if status provided
      if (status) {
        await db('shipments')
          .where('id', id)
          .update({ status, updated_at: new Date() });
      }

      logger.info(`Shipment tracking updated: ${id} by ${req.user?.email}`);

      res.json({
        success: true,
        message: 'Shipment tracking updated successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  async deliverShipment(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { deliveryNotes, deliverySignature, deliveryPhoto } = req.body;

      const shipment = await db('shipments').where('id', id).first();
      if (!shipment) {
        throw new CustomError('Shipment not found', 404);
      }

      const trx = await db.transaction();

      try {
        // Update shipment
        await trx('shipments')
          .where('id', id)
          .update({
            status: 'delivered',
            arrival_time: new Date(),
            delivery_notes: deliveryNotes,
            delivery_signature: deliverySignature,
            delivery_photo: deliveryPhoto
          });

        // Update order
        await trx('orders')
          .where('id', shipment.order_id)
          .update({
            status: 'delivered',
            actual_delivery_date: new Date()
          });

        // Add tracking record
        await trx('shipment_tracking').insert({
          shipment_id: id,
          status: 'delivered',
          notes: deliveryNotes,
          tracking_date: new Date(),
          driver_id: req.user?.id
        });

        await trx.commit();

        // Send notification
        await MessageQueueService.publishToExchange(
          MessageTypes.TMS_UPDATE.exchange,
          MessageTypes.TMS_UPDATE.routingKey,
          {
            type: 'shipment_delivered',
            shipmentId: id,
            orderId: shipment.order_id
          }
        );

        logger.info(`Shipment delivered: ${id} by ${req.user?.email}`);

        res.json({
          success: true,
          message: 'Shipment delivered successfully'
        });
      } catch (error) {
        await trx.rollback();
        throw error;
      }
    } catch (error) {
      next(error);
    }
  },

  // Mobile App Routes for Drivers
  async getDriverAssignments(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const driverId = req.user?.id;
      const { status = 'planned' } = req.query;

      const shipments = await db('shipments')
        .select(
          'shipments.*',
          'orders.order_number',
          'orders.customer_id',
          'customers.company_name as customer_name',
          'customers.address as customer_address',
          'customers.city as customer_city',
          'customers.district as customer_district',
          'customers.phone as customer_phone',
          'vehicles.vehicle_plate',
          'vehicles.vehicle_type'
        )
        .join('orders', 'shipments.order_id', 'orders.id')
        .join('customers', 'orders.customer_id', 'customers.id')
        .leftJoin('vehicles', 'shipments.vehicle_id', 'vehicles.id')
        .where('shipments.driver_id', driverId)
        .andWhere('shipments.status', status)
        .orderBy('shipments.shipment_date', 'asc');

      res.json({
        success: true,
        data: shipments
      });
    } catch (error) {
      next(error);
    }
  },

  async driverCheckIn(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { vehicleId, location } = req.body;
      const driverId = req.user?.id;

      // Update vehicle current driver
      await db('vehicles')
        .where('id', vehicleId)
        .update({ current_driver_id: driverId });

      // Create check-in record
      await db('driver_checkins').insert({
        driver_id: driverId,
        vehicle_id: vehicleId,
        check_in_time: new Date(),
        location: location,
        status: 'active'
      });

      logger.info(`Driver checked in: ${driverId} to vehicle ${vehicleId}`);

      res.json({
        success: true,
        message: 'Check-in successful'
      });
    } catch (error) {
      next(error);
    }
  },

  async driverCheckOut(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { vehicleId, odometerReading, notes } = req.body;
      const driverId = req.user?.id;

      // Update check-in record
      const checkIn = await db('driver_checkins')
        .where('driver_id', driverId)
        .andWhere('vehicle_id', vehicleId)
        .andWhere('status', 'active')
        .first();

      if (checkIn) {
        await db('driver_checkins')
          .where('id', checkIn.id)
          .update({
            check_out_time: new Date(),
            odometer_reading: odometerReading,
            notes,
            status: 'completed'
          });
      }

      // Clear vehicle current driver
      await db('vehicles')
        .where('id', vehicleId)
        .update({ current_driver_id: null });

      logger.info(`Driver checked out: ${driverId} from vehicle ${vehicleId}`);

      res.json({
        success: true,
        message: 'Check-out successful'
      });
    } catch (error) {
      next(error);
    }
  }
};
