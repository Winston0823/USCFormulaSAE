import { Composition } from "remotion";
import { LoadingVideo } from "./LoadingVideo";
import { FireAnimation } from "./FireAnimation";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="LoadingVideo"
        component={LoadingVideo}
        durationInFrames={180}
        fps={30}
        width={3840}
        height={2160}
      />
      <Composition
        id="FireAnimation"
        component={FireAnimation}
        durationInFrames={90}
        fps={30}
        width={128}
        height={128}
      />
    </>
  );
};
