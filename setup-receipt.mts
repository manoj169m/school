import { PrismaClient } from '@prisma/client';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prisma = new PrismaClient();

async function setupReceiptConfig() {
  try {
    console.log('Starting receipt configuration setup...');
    
    // Check for existing config
    const existingConfig = await prisma.receiptConfig.findFirst({
      where: {
        isActive: true,
        accountId: null // Global config
      }
    });

    if (existingConfig) {
      console.log('Active global receipt configuration already exists:', existingConfig);
      return existingConfig;
    }

    // Create default receipt configuration
    const defaultConfig = await prisma.receiptConfig.create({
      data: {
        accountId: null, // Global configuration
        prefixFormat: 'RCT{YEAR}{BRANCH}', // Default format
        startNumber: 1,
        currentNumber: 1,
        numberFormat: '00000', // 5-digit number
        resetPeriod: 'YEARLY',
        isActive: true
      }
    });

    console.log('Created default receipt configuration:', defaultConfig);
    return defaultConfig;

  } catch (error) {
    console.error('Error setting up receipt configuration:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Execute the setup
setupReceiptConfig()
  .then((config) => {
    console.log('Receipt configuration setup completed:', config);
    process.exit(0);
  })
  .catch((error) => {
    console.error('Setup failed:', error);
    process.exit(1);
  });