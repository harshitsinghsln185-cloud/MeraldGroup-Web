/**
 * Utility function to verify buffer signature against expected magic byte sequences.
 */
export const verifyFileSignature = (
  buffer: Buffer,
  expectedCategory: 'passport' | 'resume',
  filename: string
): boolean => {
  if (!buffer || buffer.length < 4) return false;

  const ext = filename.split('.').pop()?.toLowerCase();

  const matchBytes = (bytes: number[]): boolean => {
    if (buffer.length < bytes.length) return false;
    for (let i = 0; i < bytes.length; i++) {
      if (buffer[i] !== bytes[i]) return false;
    }
    return true;
  };

  const isPdf = matchBytes([0x25, 0x50, 0x44, 0x46]);
  const isPng = matchBytes([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const isJpg = matchBytes([0xff, 0xd8, 0xff]);
  const isDocx = matchBytes([0x50, 0x4b, 0x03, 0x04]);

  if (expectedCategory === 'passport') {
    if (ext === 'pdf' && isPdf) return true;
    if (ext === 'png' && isPng) return true;
    if ((ext === 'jpg' || ext === 'jpeg') && isJpg) return true;
    return false;
  }

  if (expectedCategory === 'resume') {
    if (ext === 'pdf' && isPdf) return true;
    if (ext === 'docx' && isDocx) return true;
    return false;
  }

  return false;
};
