import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

function requireEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: "${name}". ` +
        `Ensure it is defined in your .env file or shell environment.`,
    );
  }
  return value;
}

export const ENV = {
  BASE_URL: requireEnvVar('BASE_URL'),
  ADMIN_USERNAME: requireEnvVar('ADMIN_USERNAME'),
  ADMIN_PASSWORD: requireEnvVar('ADMIN_PASSWORD'),
} as const;

export const AUTH_STATE_PATH = 'playwright/.auth/admin.json' as const;
