class AppState {
  constructor() {
    this.currentState = "search"; // 'search' or 'results'
    this.searchResults = [];
    this.currentVideo = null;
    this.searchQuery = "";
    this.viewRange = {
      min: 0,
      max: 1000000,
    };
  }

  setState(newState) {
    this.currentState = newState;
    this.notifyStateChange();
  }

  setSearchResults(results) {
    this.searchResults = results;
    this.notifyStateChange();
  }

  setCurrentVideo(video) {
    this.currentVideo = video;
    this.notifyStateChange();
  }

  setViewRange(min, max) {
    this.viewRange = { min, max };
  }

  notifyStateChange() {
    document.dispatchEvent(
      new CustomEvent("appStateChange", {
        detail: {
          state: this.currentState,
          results: this.searchResults,
          currentVideo: this.currentVideo,
        },
      }),
    );
  }
}

export default new AppState();
