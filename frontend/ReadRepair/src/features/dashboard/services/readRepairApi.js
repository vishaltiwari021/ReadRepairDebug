function trimBaseUrl(baseUrl) {
  const value = `${baseUrl || ""}`.trim();
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

async function requestJson(baseUrl, path, options) {
  const url = `${trimBaseUrl(baseUrl)}${path}`;
  let response;

  try {
    response = await fetch(url, options);
  } catch {
    throw new Error(`Cannot reach backend at ${url}. Make sure the API server is running.`);
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data?.error || data?.message || "Request failed";
    throw new Error(message);
  }

  return data;
}

export const readRepairApi = {
  createDocument(baseUrl, payload) {
    return requestJson(baseUrl, "/document", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  },
  updateDocument(baseUrl, id, payload) {
    return requestJson(baseUrl, `/document/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  },
  readDocument(baseUrl, id) {
    return requestJson(baseUrl, `/document/${id}`);
  },
  simulateStaleReplica(baseUrl, id, payload) {
    return requestJson(baseUrl, `/document/${id}/simulate-stale`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  },
  runFullRepair(baseUrl) {
    return requestJson(baseUrl, "/repair/full", {
      method: "POST",
    });
  },
  loadMetrics(baseUrl) {
    return requestJson(baseUrl, "/metrics");
  },
};
