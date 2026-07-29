export async function verifyInstallation(publicKey: string) {
  const response = await fetch("/api/brain/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      publicKey,
    }),
  });

  return response.json();
}
