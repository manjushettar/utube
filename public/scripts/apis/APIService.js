import { dummyVideos } from "../utils/testData.js";

class APIService {
  constructor() {
    this.baseUrl = "/api";
    this.isTestMode = true;
  }

  async searchVideos(query, minViews, maxViews) {
    if (this.isTestMode) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return dummyVideos;
    }

    try {
      const response = await fetch(`${this.baseUrl}/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          minViews,
          maxViews,
        }),
      });

      if (!response.ok) throw new Error("Search request failed");
      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }
}

export default new APIService();
