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
  if (block.end - block.start >= duration) {
    return { start: block.start, end: block.start + duration };
  }
  return null;
}

/**
 * Para cada bloco em `freeBlocks`, aplica `fitOnceInBlock` e retorna lista de encaixes possíveis.
 */
export function findFits(
  freeBlocks: TimeBlock[],
  duration: number
): TimeBlock[] {
  const fits: TimeBlock[] = [];
  for (const block of freeBlocks) {
    const fit = fitOnceInBlock(block, duration);
    if (fit) fits.push(fit);
  }
  return fits;
}
