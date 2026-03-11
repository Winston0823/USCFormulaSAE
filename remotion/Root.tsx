import { Composition } from "remotion";
import { LoadingVideo } from "./LoadingVideo";

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
    </>
  );
};
