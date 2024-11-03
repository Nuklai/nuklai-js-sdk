import fetch from "node-fetch";

export async function verifyEndpoint(endpoint: string): Promise<{
  isValid: boolean;
  details: string;
}> {
  try {
    const response = await fetch(endpoint);
    const contentType = response.headers.get("content-type");
    const text = await response.text();

    console.log("Response details:", {
      status: response.status,
      contentType,
      bodyPreview: text.substring(0, 100), // First 100 chars
    });

    return {
      isValid: contentType?.includes("application/json") ?? false,
      details: `Status: ${response.status}, Content-Type: ${contentType}`,
    };
  } catch (error) {
    return {
      isValid: false,
      details: `Error: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}
