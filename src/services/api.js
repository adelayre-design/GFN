export async function checkBackendHealth() {
  const response = await fetch("/api/health");

  if (!response.ok) {
    throw new Error(
      `Backend health check failed with status ${response.status}`,
    );
  }

  return response.json();
}
