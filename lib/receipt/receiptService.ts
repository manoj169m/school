import { PrismaClient, ResetPeriod, Prisma } from '@prisma/client';

interface ReceiptSeries {
  id: number;
  prefix: string;
  currentNumber: number;
  lastResetDate: Date;
  updatedAt: Date;
}

export class ReceiptService {
  constructor(private prisma: PrismaClient) {}

  async generateReceiptNumber(
    accountId: number,
    academicYearId: number,
    branchId: number
  ): Promise<{ receiptNumber: string; receiptSeriesId: number }> {
    return await this.prisma.$transaction(async (tx) => {
      // 1. Get receipt configuration and academic year
      const [config, academicYear] = await Promise.all([
        tx.receiptConfig.findFirst({
          where: {
            OR: [
              { accountId },
              { accountId: null }
            ],
            isActive: true
          },
          orderBy: {
            accountId: 'desc' // Prioritize account-specific config
          }
        }),
        tx.academicYear.findUnique({
          where: { id: academicYearId }
        })
      ]);

      if (!config) {
        throw new Error('No receipt configuration found');
      }

      if (!academicYear) {
        throw new Error('Academic year not found');
      }

      let series = await tx.receiptSeries.findUnique({
        where: {
          configId_academicYearId_branchId: {
            configId: config.id,
            academicYearId,
            branchId
          }
        }
      });

      if (!series) {
        // Generate prefix based on format
        const prefix = await this.generatePrefix(
          tx,
          config.prefixFormat,
          accountId,
          academicYear,
        );

        series = await tx.receiptSeries.create({
          data: {
            configId: config.id,
            academicYearId,
            branchId,
            prefix,
            currentNumber: config.startNumber - 1
          }
        });
      }

      // Check if reset is needed based on academic year
      if (await this.shouldResetSeries(series, config.resetPeriod, academicYear)) {
        series = await tx.receiptSeries.update({
          where: { id: series.id },
          data: {
            currentNumber: config.startNumber - 1,
            lastResetDate: new Date()
          }
        });
      }

      // Increment and generate receipt number
      const updatedSeries = await tx.receiptSeries.update({
        where: { id: series.id },
        data: {
          currentNumber: { increment: 1 },
          updatedAt: new Date()
        }
      });

      // Format: ABC2024-2025/00000
      const receiptNumber = `${updatedSeries.prefix}/${updatedSeries.currentNumber.toString().padStart(config.numberFormat.length, '0')}`;

      return {
        receiptNumber,
        receiptSeriesId: updatedSeries.id
      };
    });
  }

  private async generatePrefix(
    tx: Prisma.TransactionClient,
    format: string,
    accountId: number,
    academicYear: { label: string; isCurrentYear: boolean }
  ): Promise<string> {
    const account = await tx.account.findUnique({
      where: { id: accountId }
    });
  
    // Format: ABC2024-2025
    const prefix = `${account ? this.getInitials(account.accountName) : 'RCT'}${academicYear.label}`;
    return prefix;
  }

  private getInitials(str: string): string {
    return str
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  }

  private async shouldResetSeries(
    series: ReceiptSeries,
    resetPeriod: ResetPeriod,
    academicYear: { isCurrentYear: boolean }
  ): Promise<boolean> {
    // Reset when academic year changes
    if (!academicYear.isCurrentYear) {
      return true;
    }

    if (resetPeriod === 'NEVER') return false;

    const lastReset = new Date(series.lastResetDate);
    const now = new Date();

    switch (resetPeriod) {
      case 'YEARLY':
        return lastReset.getFullYear() < now.getFullYear();
      case 'MONTHLY':
        return (
          lastReset.getFullYear() < now.getFullYear() ||
          lastReset.getMonth() < now.getMonth()
        );
      default:
        return false;
    }
  }

  // Helper to setup initial configuration
  async createReceiptConfig(data: {
    accountId?: number;
    prefixFormat: string;
    startNumber?: number;
    numberFormat?: string;
    resetPeriod?: ResetPeriod;
  }) {
    return await this.prisma.receiptConfig.create({
      data: {
        accountId: data.accountId,
        prefixFormat: data.prefixFormat,
        startNumber: data.startNumber ?? 1,
        currentNumber: data.startNumber ?? 1,
        numberFormat: data.numberFormat ?? '00000',
        resetPeriod: data.resetPeriod ?? 'YEARLY'
      }
    });
  }
}