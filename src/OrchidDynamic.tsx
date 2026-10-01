import { getInputProps } from "remotion";
import { makeOrchidVideo, type VideoConfig } from "./NhaDamSeries";

export const OrchidDynamic: React.FC = () => {
  const cfg = getInputProps<VideoConfig>();
  const Video = makeOrchidVideo(cfg);
  return <Video />;
};
