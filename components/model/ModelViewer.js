import "@google/model-viewer";

const ModelViewer = ({ name }) => (
  <model-viewer
    style={{ width: "100%", height: "500px" }}
    src={`/models/${name}.gltf`}
    ios-src={`/models/${name}.usdz`}
    // poster={`/models/posters/${name}.webp`}
    alt="3D Model"
    camera-controls
    auto-rotate
    loading="eager"
    // ar
    autoplay
    // interaction-prompt="none"
  ></model-viewer>
);

export default ModelViewer;
