import type { TimeBlock } from "./time";

/**
 * Subtrai um único bloco `block` de um bloco livre `freeBlock`.
 * Pode retornar 0, 1 ou 2 pedaços resultantes:
 * - Se não há interseção, devolve [freeBlock].
 * - Se block cobre totalmente freeBlock, devolve [].
 * - Se block está no meio de freeBlock, devolve dois pedaços (antes e depois de block).
 * - Se block corta início ou fim de freeBlock, devolve o trecho restante.
 */
function subtractOneBlock(
  freeBlock: TimeBlock,
  block: TimeBlock
): TimeBlock[] {
  const A = block;
  const B = freeBlock;

  // 1) Sem interseção
  if (A.end <= B.start || A.start >= B.end) {
    return [B];
  }

  // 2) A cobre B por completo
  if (A.start <= B.start && A.end >= B.end) {
    return [];
  }

  // 3) A está no meio de B (divide em dois)
  if (A.start > B.start && A.end < B.end) {
    return [
      { start: B.start, end: A.start },
      { start: A.end, end: B.end }
    ];
  }

  // 4) A “corta” o início de B (corta da esquerda)
  if (A.start <= B.start && A.end < B.end) {
    return [{ start: A.end, end: B.end }];
  }

  // 5) A “corta” o fim de B (corta da direita)
  if (A.start > B.start && A.end >= B.end) {
    return [{ start: B.start, end: A.start }];
  }

  // (caso não previsto, devolve vazio)
  return [];
}

/**
 * Subtrai uma lista de `blocks[]` (bloqueios) de uma lista de `freeBlocks[]`.
 * Aplica recursivamente `subtractOneBlock` em cada bloco livre, removendo todas as interseções.
 */
export function subtractBlocksFromFree(
  freeBlocks: TimeBlock[],
  blocks: TimeBlock[]
): TimeBlock[] {
  let result: TimeBlock[] = [...freeBlocks];

  for (const block of blocks) {
    const tmp: TimeBlock[] = [];
    for (const fb of result) {
      const pieces = subtractOneBlock(fb, block);
      tmp.push(...pieces);
    }
    result = tmp;
    if (result.length === 0) break;
  }

  return result;
}
