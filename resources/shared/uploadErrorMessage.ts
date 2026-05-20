/**
 * Turns an axios-style upload error into a user-facing string.
 * 413 (nginx-rejected oversize) and 422 (Laravel validator-rejected
 * oversize) both surface as the same "file too big" copy — that's
 * the only distinction users care about. Other failures fall through
 * to a generic "couldn't upload" line.
 * @pure
 */

const MAX_UPLOAD_MB = 8;

interface AxiosLikeError {
  response?: { status?: number };
  message?: string;
}

export default function uploadErrorMessage(error: unknown): string {
  const status = (error as AxiosLikeError)?.response?.status;

  if (status === 413 || status === 422) {
    return `That image is too large. Please choose a file under ${MAX_UPLOAD_MB} MB.`;
  }

  return "Sorry, we couldn't upload that image. Please try again.";
}
