import AppState from "../state/AppState.js";

class VideoPanel {
  constructor() {
    this.mainVideo = document.querySelector(".video-main");
    this.previewBar = document.querySelector(".preview-bar");
    this.videoInfo = document.querySelector(".video-info");
    this.currentIndex = 0;
    this.bindEvents();
  }

  bindEvents() {
    document.addEventListener("appStateChange", (e) => {
      if (e.detail.state === "results" && e.detail.results) {
        this.renderResults(e.detail.results);
      }
    });

    this.previewBar.addEventListener("click", (e) => {
      const previewItem = e.target.closest(".preview-item");
      if (previewItem) {
        const videoId = previewItem.dataset.videoId;
        const video = AppState.searchResults.find((v) => v.id === videoId);
        if (video) {
          this.switchVideo(video);
        }
      }
    });

    document.addEventListener("keydown", (e) => {
      if (AppState.currentState !== "results") return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        this.navigateVideos(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        this.navigateVideos(1);
      }
    });
  }

  navigateVideos(direction) {
    const videos = AppState.searchResults;
    if (!videos || videos.length === 0) return;

    this.currentIndex =
      (this.currentIndex + direction + videos.length) % videos.length;
    const video = videos[this.currentIndex];
    this.switchVideo(video);
    this.scrollPreviewIntoView(this.currentIndex);
  }

  scrollPreviewIntoView(index) {
    const previewItems = this.previewBar.querySelectorAll(".preview-item");
    if (previewItems[index]) {
      previewItems[index].scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }

  renderResults(videos) {
    AppState.searchResults = videos;

    if (!videos || videos.length === 0) {
      this.mainVideo.innerHTML =
        '<div class="no-results">No videos found</div>';
      this.previewBar.innerHTML = "";
      return;
    }

    this.currentIndex = 0;
    this.switchVideo(videos[0]);
    this.renderPreviewBar(videos);
  }

  renderPreviewBar(videos) {
    this.previewBar.innerHTML = videos
      .map(
        (video) => `
            <div class="preview-item ${video.id === AppState.currentVideo?.id ? "active" : ""}"
                 data-video-id="${video.id}">
                <img src="${video.thumbnail}" alt="${video.title}">
            </div>
        `,
      )
      .join("");
  }

  switchVideo(video) {
    AppState.currentVideo = video;

    this.mainVideo.innerHTML = `
            <div class="video-frame">
                <iframe
                    src="https://www.youtube.com/embed/${video.id}"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                ></iframe>
            </div>
        `;

    this.videoInfo.innerHTML = `
            <h2>${video.title}</h2>
            <p>${this.formatViews(video.views)} views</p>
        `;

    this.updateActivePreview(video.id);
  }

  updateActivePreview(videoId) {
    const previews = this.previewBar.querySelectorAll(".preview-item");
    previews.forEach((preview) => {
      preview.classList.toggle("active", preview.dataset.videoId === videoId);
    });
  }

  formatViews(views) {
    return new Intl.NumberFormat().format(views);
  }
}

export default VideoPanel;
