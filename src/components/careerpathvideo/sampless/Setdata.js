import Reatc, { Component } from "react";
import ReactPlayer from "react-player";
class Setdata extends Component {
  state = {
    duration: null,
    secondsElapsed: null,
  };
  onDuration = (duration) => {
    this.setState({ duration });
  };
  onProgress = (progress) => {
    if (!this.state.duration) {
      return;
    }
    const secondsElapsed = progress.played * this.state.duration;
    if (secondsElapsed !== this.state.secondsElapsed) {
      this.setState({ secondsElapsed });
    }
  };
  render() {
    return (
      <ReactPlayer
        playing
        url="http://example.com/file.mp4"
        onDuration={this.onDuration}
        onProgress={this.onProgress}
      />
    );
  }
}
export default Setdata;
