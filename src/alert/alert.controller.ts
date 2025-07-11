import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Req } from '@nestjs/common';
import { AlertService } from './alert.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';
import { JwtGuard } from 'src/auth/jwt.guard';
import { CustomRequest } from 'src/shared/interfaces/CustomRequest';
import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';

@UseGuards(JwtGuard)
@Controller('alert')
export class AlertController {
  constructor(private readonly alertService: AlertService) { }

  // @Post()
  // create(@Body() createAlertDto: CreateAlertDto) {
  //   return this.alertService.create(createAlertDto);
  // }

  @ApiOperation({ summary: "Get all alerts", description: "Get paginated list of alerts" })
  @ApiBearerAuth()
  @ApiQuery({ name: "page", default: 1, })
  @ApiQuery({ name: "limit", default: 10, })
  @Get()
  async findAll(@Req() req: CustomRequest, @Query('page') page = 1, @Query('limit') limit = 10) {
    return await this.alertService.getMyAlerts(req.user.id, page, limit);
  };

  @ApiOperation({ summary: "Get todays alerts", description: "Get paginated list of todays alerts" })
  @ApiBearerAuth()
  @ApiQuery({ name: "page", default: 1, })
  @ApiQuery({ name: "limit", default: 10, })
  @Get('today')
  async getToday(@Req() req: CustomRequest, @Query('page') page = 1, @Query('limit') limit = 10) {
    return await this.alertService.findTodayByUser(req.user.id, page, limit);
  };

  @ApiOperation({ summary: "Read an alert", description: "Mark alert as read" })
  @ApiBearerAuth()
  @Patch(':id/read')
  async markAsRead(@Param('id') id: string, @Req() req: CustomRequest) {
    return await this.alertService.markAsRead(req.user.id, id);
  };

  @ApiOperation({ summary: "Dashboard summary", description: "Get dashboard summary of alerts." })
  @ApiBearerAuth()
  @Get('summary')
  async getSummary(@Req() req: CustomRequest) {
    return await this.alertService.alertSummary(req.user.id);
  }


  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.alertService.findOne(+id);
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAlertDto: UpdateAlertDto) {
    return this.alertService.update(+id, updateAlertDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.alertService.remove(+id);
  }
}
