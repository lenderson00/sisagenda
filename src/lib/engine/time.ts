/**
 * Converte um valor em minutos (desde 00:00) para string "HH:MM".
 * Ex.: 540 → "09:00", 785 → "13:05".
 */
export function formatHHMM(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/**
 * Tipo que representa um bloco de tempo livre ou bloqueado:
 * { start: minutoInicial, end: minutoFinal } (minutos desde 00:00).
 */
export type TimeBlock = { start: number; end: number };

/**
 * Divide um intervalo [overallStart, overallEnd] (em minutos) pelo horário de almoço.
 * - Se o almoço não intercepta o período, devolve um único bloco [{start, end}].
 * - Caso contrário, devolve até dois blocos: antes e depois do almoço.
 *
 * @param overallStart minuto inicial (ex.: 540 para 09:00)
 * @param overallEnd   minuto final   (ex.: 1020 para 17:00)
 * @param lunchStart   minuto de início do almoço (ex.: 720 para 12:00)
 * @param lunchEnd     minuto de fim    do almoço (ex.: 780 para 13:00)
 */
export function splitByLunch(
  overallStart: number,
  overallEnd: number,
  lunchStart: number,
  lunchEnd: number
): TimeBlock[] {
  if (overallStart >= overallEnd) return [];

  // Se almoço não colide no período
  if (lunchEnd <= overallStart || lunchStart >= overallEnd) {
    return [{ start: overallStart, end: overallEnd }];
  }

  const blocks: TimeBlock[] = [];

  // Bloco antes do almoço
  if (lunchStart > overallStart) {
    blocks.push({ start: overallStart, end: Math.min(lunchStart, overallEnd) });
  }

  // Bloco depois do almoço
  if (lunchEnd < overallEnd) {
    blocks.push({ start: Math.max(lunchEnd, overallStart), end: overallEnd });
  }

  return blocks;
}

/**
 * Tenta encaixar uma atividade de duração `duration` dentro de um único bloco livre.
 * - Se couber (block.end - block.start >= duration), retorna {start: block.start, end: block.start+duration}.
 * - Caso contrário, retorna null.
 */
export function fitOnceInBlock(
  block: TimeBlock,
  duration: number
): TimeBlock | null {
  console.log(block, duration, "block, duration")
  if (block.end - block.start >= duration) {
    return { start: block.start, end: block.start + duration };
  }
  return null;
}

/**
 * Finds all possible fits within a single block in fixed intervals based on duration.
 * For example, if duration is 30 minutes, it will find slots like 9:00, 9:30, 10:00, etc.
 */
function findFitsInBlock(block: TimeBlock, duration: number): TimeBlock[] {
  const fits: TimeBlock[] = [];
  const blockDuration = block.end - block.start;

  // If block is too small, return empty array
  if (blockDuration < duration) return fits;

  // Calculate how many complete fits we can have in this block
  const numberOfFits = Math.floor(blockDuration / duration);

  // Create fits at fixed intervals
  for (let i = 0; i < numberOfFits; i++) {
    const start = block.start + (i * duration);
    fits.push({
      start: start,
      end: start + duration
    });
  }

  return fits;
}

/**
 * Finds all possible time blocks where an activity of given duration can fit.
 * Uses fixed intervals based on the duration (e.g., 30min slots: 9:00, 9:30, 10:00, etc.)
 */
export function findFits(
  freeBlocks: TimeBlock[],
  duration: number
): TimeBlock[] {
  const fits: TimeBlock[] = [];
  for (const block of freeBlocks) {
    fits.push(...findFitsInBlock(block, duration));
  }
  return fits;
}

export const transformFitsToHH = (fits: TimeBlock[]): number[] => {
  return fits.map((fit) => fit.start)
}