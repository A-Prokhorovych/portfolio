import "./index.css";
import { Composition } from "remotion";
import { MaguroHealthyReel, MaguroTravelReel } from "./Composition";

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
      <Composition
        id="MaguroHealthyReel"
        component={MaguroHealthyReel}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
