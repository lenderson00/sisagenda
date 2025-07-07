// Utility to clean and mask NIP (8 digits) and CNPJ (14 digits)

export function cleanCredential(input: string): string {
  // Remove all non-digit characters
  return input.replace(/\D/g, "");
}

export function maskCredential(input: string): string {
  const digits = cleanCredential(input);
  if (digits.length <= 8) {
    // NIP: XX.XXXX.XX
    return digits
      .replace(/(\d{2})(\d{0,4})(\d{0,2})/, (match, p1, p2, p3) => {
        let result = p1;
        if (p2) result += `.${p2}`;
        if (p3) result += `.${p3}`;
        return result;
      })
      .slice(0, 10); // Max length with mask
  }
  // CNPJ: XX.XXX.XXX/XXXX-XX
  if (digits.length <= 14) {
    return digits
      .replace(
        /(\d{2})(\d{0,3})(\d{0,3})(\d{0,4})(\d{0,2})/,
        (match, p1, p2, p3, p4, p5) => {
          let result = p1;
          if (p2) result += `.${p2}`;
          if (p3) result += `.${p3}`;
          if (p4) result += `/${p4}`;
          if (p5) result += `-${p5}`;
          return result;
        }
      )
      .slice(0, 18); // Max length with mask
  }
  return input;
}
