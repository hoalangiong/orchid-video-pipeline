import { getInputProps } from "remotion";
import { McVyVideo, type McVyConfig } from "./McVyVideo";

export const McVyDynamic: React.FC = () => {
  const cfg = getInputProps<McVyConfig>();
  return <McVyVideo config={cfg} />;
};
