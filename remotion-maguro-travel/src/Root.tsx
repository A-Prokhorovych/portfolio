import "./index.css";
import { Composition } from "remotion";
import { MaguroTravelReel } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MaguroTravelReel"
        component={MaguroTravelReel}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
