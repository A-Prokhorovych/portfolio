import "./index.css";
import { Composition } from "remotion";
import {
  BiottaReel,
  FishAndMoreReel,
  GymeraReel,
  MaguroHealthyReel,
  MaguroTravelReel,
  ScotchBriteReel,
  SynergeticReel,
} from "./Composition";

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
      <Composition
        id="SynergeticReel"
        component={SynergeticReel}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="BiottaReel"
        component={BiottaReel}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ScotchBriteReel"
        component={ScotchBriteReel}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="FishAndMoreReel"
        component={FishAndMoreReel}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="GymeraReel"
        component={GymeraReel}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
