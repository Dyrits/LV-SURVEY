export function surveyExpirationForInput(expiration) {
  return expiration
    ? new Date(expiration.split(" ")[0]).toISOString().split("T")[0]
    : null;
}
