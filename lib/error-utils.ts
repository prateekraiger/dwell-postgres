export function getErrorMessage(error: unknown): string {
  if (!error) {
    return "An unknown error occurred";
  }

  if (error instanceof Error) {
    return error.message;
  }

  // Handle string errors
  if (typeof error === "string") {
    return error;
  }

  // Fallback for unknown error types
  return "An unexpected error occurred";
}

export function formatErrorMessage(message: string): string {
  if (!message) return "An error occurred";

  // Capitalize first letter
  const formatted = message.charAt(0).toUpperCase() + message.slice(1);

  // Add period if not present
  if (
    !formatted.endsWith(".") &&
    !formatted.endsWith("!") &&
    !formatted.endsWith("?")
  ) {
    return formatted + ".";
  }

  return formatted;
}

export function getFormattedErrorMessage(error: unknown): string {
  return formatErrorMessage(getErrorMessage(error));
}
