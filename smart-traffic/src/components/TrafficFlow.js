import "./TrafficFlow.css";

function TrafficFlow() {
  return (
    <div className="app-container">
      <div className="animated-background"></div>
      <div className="video-container">
        {/* VIDEO ELEMENT */}
        <video
          src="/simulation_video.mp4"
          controls
          preload="auto"
          className="video-player"
          onError={(e) => console.error("Video failed to load:", e)}
        />
        {/* VIDEO LABEL */}
        <div className="video-label">
          Simulation Video
        </div>
      </div>
    </div>
  );
}

export default TrafficFlow;