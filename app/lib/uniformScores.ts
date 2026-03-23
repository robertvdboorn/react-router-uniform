import type { Context } from "@uniformdev/context";

/**
 * Uniform Score Utilities
 * 
 * Helper functions for working with Uniform Context scores.
 * Scores are stored with keys like "1_1", "1_2" where the prefix is the enrichment ID.
 */

/**
 * Get total score for a specific enrichment ID
 * 
 * @param context - Uniform Context instance
 * @param enrichmentId - Enrichment ID (e.g., "1")
 * @returns Total score across all signals for that enrichment
 * 
 * @example
 * const totalScore = getEnrichmentScore(serverContext, "1");
 * // If scores = { '1_1': 5, '1_2': 4, '2_1': 10 }
 * // Returns: 9 (5 + 4)
 */
export function getEnrichmentScore(context: Context, enrichmentId: string): number {
  const scores = context.scores;
  return Object.entries(scores).reduce((sum, [key, value]) => {
    if (key.startsWith(`${enrichmentId}_`)) {
      return sum + value;
    }
    return sum;
  }, 0);
}

/**
 * Get all enrichment scores grouped by enrichment ID
 * 
 * @param context - Uniform Context instance
 * @returns Object with enrichment IDs as keys and total scores as values
 * 
 * @example
 * const enrichments = getEnrichmentScores(serverContext);
 * // If scores = { '1_1': 5, '1_2': 4, '2_1': 10 }
 * // Returns: { '1': 9, '2': 10 }
 */
export function getEnrichmentScores(context: Context): Record<string, number> {
  const scores = context.scores;
  const enrichments: Record<string, number> = {};
  
  Object.entries(scores).forEach(([key, value]) => {
    const enrichmentId = key.split('_')[0];
    if (enrichmentId) {
      enrichments[enrichmentId] = (enrichments[enrichmentId] || 0) + value;
    }
  });
  
  return enrichments;
}

/**
 * Check if visitor meets a score threshold for an enrichment
 * 
 * @param context - Uniform Context instance
 * @param enrichmentId - Enrichment ID to check
 * @param threshold - Minimum score required
 * @returns True if visitor's score meets or exceeds threshold
 * 
 * @example
 * const isVIP = meetsThreshold(serverContext, "1", 50);
 */
export function meetsThreshold(
  context: Context, 
  enrichmentId: string, 
  threshold: number
): boolean {
  return getEnrichmentScore(context, enrichmentId) >= threshold;
}

/**
 * Get total engagement score across ALL enrichments
 * 
 * @param context - Uniform Context instance
 * @returns Sum of all scores
 * 
 * @example
 * const totalEngagement = getTotalScore(serverContext);
 * // If scores = { '1_1': 5, '1_2': 4, '2_1': 10 }
 * // Returns: 19
 */
export function getTotalScore(context: Context): number {
  const scores = context.scores;
  return Object.values(scores).reduce((sum, value) => sum + value, 0);
}

/**
 * Get visitor segment based on enrichment score
 * 
 * @param context - Uniform Context instance
 * @param enrichmentId - Enrichment ID to check
 * @param thresholds - Segment thresholds
 * @returns Segment name
 * 
 * @example
 * const segment = getSegment(serverContext, "1", {
 *   vip: 75,
 *   engaged: 40,
 *   new: 0,
 * });
 * // Returns: "vip" | "engaged" | "new"
 */
export function getSegment(
  context: Context,
  enrichmentId: string,
  thresholds: Record<string, number>
): string {
  const score = getEnrichmentScore(context, enrichmentId);
  
  // Sort thresholds descending (highest first)
  const sorted = Object.entries(thresholds)
    .sort(([, a], [, b]) => b - a);
  
  // Find first segment where score meets threshold
  for (const [segment, threshold] of sorted) {
    if (score >= threshold) {
      return segment;
    }
  }
  
  return 'unknown';
}

/**
 * Debug: Get formatted score summary
 * 
 * @param context - Uniform Context instance
 * @returns Formatted string for logging
 * 
 * @example
 * console.log(getScoreSummary(serverContext));
 * // Logs:
 * // Enrichment 1: 9 (1_1: 5, 1_2: 4)
 * // Enrichment 2: 10 (2_1: 10)
 * // Total: 19
 */
export function getScoreSummary(context: Context): string {
  const scores = context.scores;
  const enrichments = getEnrichmentScores(context);
  const total = getTotalScore(context);
  
  const lines = Object.entries(enrichments).map(([id, sum]) => {
    const details = Object.entries(scores)
      .filter(([key]) => key.startsWith(`${id}_`))
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
    return `Enrichment ${id}: ${sum} (${details})`;
  });
  
  lines.push(`Total: ${total}`);
  
  return lines.join('\n');
}
