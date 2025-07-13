import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Alert } from './entities/alert.entity';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { createNotSuccessfulResponse, createResponse } from 'src/shared/utilities/createResponse';

@Injectable()
export class AlertService {
  constructor(@InjectRepository(Alert) private alertRepo: Repository<Alert>) { }

  async createAlert(userId: string, createAlertDto: CreateAlertDto) {
    const newAlert = this.alertRepo.create({
      userId,
      message: createAlertDto.message,
      risk_level: createAlertDto.risk_level
    });
    return await this.alertRepo.save(newAlert);
  }

  async findAll(userId: string) {
    return await this.alertRepo.find({
      where: {
        userId
      }
    });
  }

  async findOneById(id: string) {
    return await this.alertRepo.findOne({
      where: {
        id
      }
    })
  }

  async findOneAlertByIdAndUserId(userId: string, id: string) {
    return await this.alertRepo.findOne({
      where: {
        id,
        userId
      }
    })
  }

  async findUsersAlerts(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [items, total] = await this.alertRepo.findAndCount({
      where: {
        userId
      },
      skip,
      take: limit
    });

    return {
      data: items,
      totalAlerts: total,
      itemsPerPage: limit,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    }
  };

  async findTodayAlerts(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const [items, total] = await this.alertRepo.findAndCount({
      where: {
        userId,
        createdAt: MoreThanOrEqual(today)
      },
      order: { createdAt: 'DESC' },
      skip,
      take: limit
    });

    return {
      data: items,
      totalAlerts: total,
      itemsPerPage: limit,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    }
  };

  update(id: number, updateAlertDto: UpdateAlertDto) {
    return `This action updates a #${id} alert`;
  }

  remove(id: number) {
    return `This action removes a #${id} alert`;
  }

  async getMyAlerts(userId: string, page: number, limit: number) {
    try {
      const result = await this.findUsersAlerts(userId, page, limit);
      return createResponse(true, result, "Alerts result");
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }

      throw new HttpException(createNotSuccessfulResponse("Internal server error"), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findTodayByUser(userId: string, page: number, limit: number) {
    try {
      const result = await this.findTodayAlerts(userId, page, limit);
      return createResponse(true, result, "Alerts result");
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }

      throw new HttpException(createNotSuccessfulResponse("Internal server error"), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async markAsRead(userId: string, alertId: string) {
    try {
      const alert = await this.findOneAlertByIdAndUserId(userId, alertId);
      if (!alert) {
        throw new HttpException(createNotSuccessfulResponse("Alert not found"), HttpStatus.NOT_FOUND);
      };

      alert.isRead = true;
      const updatedAlert = await this.alertRepo.save(alert);

      return createResponse(true, { isRead: updatedAlert.isRead, id: updatedAlert.id }, "Alert updated");
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }

      throw new HttpException(createNotSuccessfulResponse("Internal server error"), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private getLastWeekDate(currentDate: Date) {

    return new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000)
  };


  async alertSummary(userId: string) {
    try {
      const alerts = await this.findAll(userId); // Get all alerts for user

      const lastWeekDate = this.getLastWeekDate(new Date());

      const stats = alerts.reduce(
        (acc, curr) => {
          acc.totalAlerts += 1;

          const createdDate = new Date(curr.createdAt);
          const dateStr = createdDate.toISOString().split("T")[0]; // format as YYYY-MM-DD

          // Track alerts from the last 7 days
          if (createdDate >= lastWeekDate) {
            acc.last7Days.push({
              date: dateStr,
              riskLevel: curr.risk_level
            });
          };

          // Count high-risk alerts
          if (curr.risk_level === 'High') {
            acc.highRiskDays += 1;
          };

          return acc;
        },
        {
          totalAlerts: 0,
          highRiskDays: 0,
          last7Days: [] as { date: string; riskLevel: string }[]
        }
      );

      return createResponse(true, stats, "User alert summary fetched");
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new HttpException(
        createNotSuccessfulResponse("Internal server error"),
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

}
