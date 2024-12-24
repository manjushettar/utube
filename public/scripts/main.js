import SearchBar from "./components/SearchBar.js";
import VideoPanel from "./components/VideoPanel.js";
import AppState from "./state/AppState.js";

class App {
  constructor() {
    this.initializeComponents();
    this.setupStateManagement();
  }

  initializeComponents() {
    this.searchBar = new SearchBar();
    this.videoPanel = new VideoPanel();
  }

  setupStateManagement() {
    document.addEventListener("appStateChange", (e) => {
      this.updateUI(e.detail.state);
    });

    document.querySelector(".nav-toggle").addEventListener("click", () => {
      if (AppState.currentState === "results") {
        AppState.setState("search");
      }
    });
  }

  updateUI(state) {
    document
      .querySelectorAll(".search-state, .results-state")
      .forEach((el) => el.classList.remove("active"));

    document.querySelector(`.${state}-state`).classList.add("active");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new App();
});
