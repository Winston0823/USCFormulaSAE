import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

// SVG paths from the helmet logo
const CREST_PATH = "M16.7853 56.6631C17.9363 56.3692 18.7932 55.3951 18.936 54.2195C20.5154 41.3805 26.0433 33.4117 32.4197 28.4155C39.4094 22.9407 48.3146 20.7406 57.0097 21.5132C72.6693 22.8987 77.5504 34.1675 78.3905 35.0156C78.8273 35.4522 79.575 35.3011 80.0539 34.9232L92.7395 21.975C93.0924 21.4628 93.084 20.7826 92.7059 20.2872C90.236 16.962 81.4737 0 53.1956 0C42.207 0 28.9837 5.30692 19.7845 15.7528C8.62786 26.9124 6.09914 45.8309 4.2845 53.2707C3.38559 56.9654 2.30185 56.4616 0.125966 59.602C-0.252083 60.1562 0.251982 60.8868 0.898866 60.7188L16.7853 56.6631Z";

const FACE_PATH = "M79.8859 65.8578C79.6255 66.2945 79.2475 66.4792 79.2475 66.4792C78.9366 66.6303 78.609 66.6219 78.3653 66.58L59.6813 62.1044C59.2865 61.9952 58.9588 61.7181 58.7992 61.3402L54.8591 52.4058C54.6491 51.9272 54.1786 51.6081 53.6493 51.5913L37.326 51.1043C36.5279 51.0791 36.3515 49.9707 37.0992 49.702L56.6569 42.5561C57.1442 42.3798 57.6903 42.4889 58.0683 42.85L65.3773 49.8195C65.6713 50.105 66.083 50.2394 66.4946 50.189L79.3735 48.5264C79.6003 48.4928 79.9027 48.4844 80.1884 48.6355C80.6252 48.8706 80.8101 49.3661 80.9025 49.7439C81.7174 52.9264 80.8353 64.254 79.8775 65.8578H79.8859Z";

const CHIN_PATH = "M69.1325 88.9999C69.8298 88.8824 70.0062 87.9671 69.4097 87.5892L22.5905 58.334C21.4563 57.6287 20.4734 58.5943 20.2634 59.9126C19.9441 61.8356 19.2973 67.4196 25.7157 70.5517C48.8103 81.8289 69.1325 88.9999 69.1325 88.9999Z";

const LOGO_COLOR = "#1D1E18";
const BG_COLOR = "#D4A84B";

// Original SVG viewBox dimensions
const SVG_WIDTH = 93;
const SVG_HEIGHT = 89;

export const LoadingVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Scale factor for 4K
  const logoScale = 5;
  const scaledWidth = SVG_WIDTH * logoScale;
  const scaledHeight = SVG_HEIGHT * logoScale;

  // Center position for the logo
  const centerX = width / 2 - scaledWidth / 2;
  const centerY = height / 2 - scaledHeight / 2;

  // Animation phases
  const slideInStart = 15; // 0.5s
  const mergeStart = 90; // 3s

  // Staggered entry for each piece
  const crestDelay = 0;
  const faceDelay = 9; // 0.3s
  const chinDelay = 18; // 0.6s

  // Spring config for snappy feel
  const springConfig = {
    damping: 12,
    stiffness: 180,
    mass: 0.8,
  };

  // Off-screen positions (from actual screen edges)
  const offScreenLeft = -scaledWidth - 100;
  const offScreenRight = width + 100;

  // Crest animation (from left side of screen)
  const crestProgress = spring({
    frame: frame - slideInStart - crestDelay,
    fps,
    config: springConfig,
  });
  const crestX = interpolate(crestProgress, [0, 1], [offScreenLeft, centerX]);

  // Face animation (from right side of screen)
  const faceProgress = spring({
    frame: frame - slideInStart - faceDelay,
    fps,
    config: springConfig,
  });
  const faceX = interpolate(faceProgress, [0, 1], [offScreenRight, centerX]);

  // Chin animation (from left side of screen)
  const chinProgress = spring({
    frame: frame - slideInStart - chinDelay,
    fps,
    config: springConfig,
  });
  const chinX = interpolate(chinProgress, [0, 1], [offScreenLeft, centerX]);

  // Merge pulse animation
  const mergeProgress = spring({
    frame: frame - mergeStart,
    fps,
    config: {
      damping: 8,
      stiffness: 200,
      mass: 0.5,
    },
  });

  const pulseScale = interpolate(
    mergeProgress,
    [0, 0.5, 1],
    [1, 1.06, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Only apply pulse after pieces have arrived
  const allArrived = frame >= mergeStart;
  const finalScale = allArrived ? pulseScale : 1;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG_COLOR,
      }}
    >
      {/* Crest/Plume - from left */}
      <svg
        width={scaledWidth}
        height={scaledHeight}
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        fill="none"
        style={{
          position: "absolute",
          top: centerY,
          left: crestX,
          transform: `scale(${finalScale})`,
          transformOrigin: "center center",
        }}
      >
        <path d={CREST_PATH} fill={LOGO_COLOR} />
      </svg>

      {/* Face/Eye area - from right */}
      <svg
        width={scaledWidth}
        height={scaledHeight}
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        fill="none"
        style={{
          position: "absolute",
          top: centerY,
          left: faceX,
          transform: `scale(${finalScale})`,
          transformOrigin: "center center",
        }}
      >
        <path d={FACE_PATH} fill={LOGO_COLOR} />
      </svg>

      {/* Chin/Jaw - from left */}
      <svg
        width={scaledWidth}
        height={scaledHeight}
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        fill="none"
        style={{
          position: "absolute",
          top: centerY,
          left: chinX,
          transform: `scale(${finalScale})`,
          transformOrigin: "center center",
        }}
      >
        <path d={CHIN_PATH} fill={LOGO_COLOR} />
      </svg>
    </AbsoluteFill>
  );
};
