import { log } from '@clack/prompts';
import kleur from 'kleur';
import type { SeedLogger } from "./types";

/**
 * Logger implementation using @clack/prompts
 */
export class ClackSeedLogger implements SeedLogger {
  info(message: string): void {
    log.info(message);
  }
  warn(message: string): void {
    log.warn(message);
  }
  error(message: string): void {
    log.error(message);
  }
  success(message: string): void {
    log.success(message);
  }
  step(message: string): void {
    log.step(message);
  }
  message(message: string, symbol?: string): void {
    log.message(message, { symbol: symbol ?? kleur.cyan('~') });
  }
}

/**
 * Helper to safely get environment variables
 */
export function getRequiredEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is required but not set`);
  }
  return value;
}

/**
 * Helper to get optional environment variables with defaults
 */
export function getOptionalEnvVar(name: string, defaultValue: string): string {
  return process.env[name] || defaultValue;
}

/**
 * Utility to create a delay (useful for rate limiting)
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Helper to batch process items with async operations
 */
export async function processBatch<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  batchSize = 10
): Promise<R[]> {
  const results: R[] = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(processor));
    results.push(...batchResults);
  }

  return results;
}
