import React, { useEffect, useRef } from "react";
import "@google/model-viewer";

const ModelViewer = ({ name, color }) => {
  const modelViewerRef = useRef(null);

  useEffect(() => {
    const modelViewer = modelViewerRef.current;

    modelViewer.addEventListener("load", () => {
      if (!modelViewer.model) return;

      // Set the color of the model based on the name
      if (name === "koji-closed") {
        const [materialOne, materialTwo, materialThree] = modelViewer.model.materials;
        materialOne.pbrMetallicRoughness.setBaseColorFactor(color);
        materialTwo.pbrMetallicRoughness.setBaseColorFactor(color);
        materialThree.pbrMetallicRoughness.setBaseColorFactor(color);
      } else {
        const [materialOne, materialTwo, materialThree] = modelViewer.model.materials;
        materialOne.pbrMetallicRoughness.setBaseColorFactor("black");
        materialTwo.pbrMetallicRoughness.setBaseColorFactor("black");
        materialThree.pbrMetallicRoughness.setBaseColorFactor(color);
      }
    });

    // on unmount remove the event listener
    return () => {
      modelViewer.removeEventListener("load", () => {
        for (const material of modelViewer.model.materials) {
          material.pbrMetallicRoughness.setBaseColorFactor("black");
        }
      });
    };
  }, [color, name]);

  return (
    <model-viewer
      ref={modelViewerRef}
      style={{ width: "100%", height: "400px", marginTop: "-10px" }}
      src={`/models/${name}.gltf`}
      ios-src={`/models/${name}.usdz`}
      tone-mapping="neutral"
      shadow-intensity="1"
      disable-zoom
      zoom="10"
      alt="3D Model"
      camera-controls
      auto-rotate
      loading="eager"
      autoplay
    ></model-viewer>
  );
};

export default ModelViewer;
