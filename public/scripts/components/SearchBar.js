import AppState from "../state/AppState.js";
import APIService from "../apis/APIService.js";

class SearchBar {
  constructor() {
    this.searchInput = document.getElementById("search-input");
    this.searchButton = document.querySelector(".search-button");
    this.minViewsInput = document.getElementById("min-views");
    this.maxViewsInput = document.getElementById("max-views");
    this.bindEvents();
  }

  bindEvents() {
    this.searchButton.addEventListener("click", () => this.handleSearch());
    this.searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.handleSearch();
    });

    // Update view range when inputs change
    this.minViewsInput.addEventListener("change", () => this.updateViewRange());
    this.maxViewsInput.addEventListener("change", () => this.updateViewRange());
  }

  async handleSearch() {
    const query = this.searchInput.value.trim();
    if (!query) return;

    try {
      AppState.searchQuery = query;
      const results = await APIService.searchVideos(
        query,
        AppState.viewRange.min,
        AppState.viewRange.max,
      );

      AppState.setSearchResults(results);
      AppState.setState("results");
    } catch (error) {
      console.error("Search failed:", error);
    }
  }

  updateViewRange() {
    const min = parseInt(this.minViewsInput.value) || 0;
    const max = parseInt(this.maxViewsInput.value) || 1000000;
    AppState.setViewRange(min, max);
  }
}

export default SearchBar;
