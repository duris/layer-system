// CanvasLayer.tsx
import React from "react";
import { CanvasLayer } from "../context/LayerContext";
import { useCanvasInitialization } from "../context/LayerContext";

interface CanvasLayerProps {
  layer: CanvasLayer;
  handleMouseDown: (id: string) => void;
  handleMouseUp: (id: string) => void;
}

const CanvasLayer: React.FC<CanvasLayerProps> = React.memo(
  ({ layer, handleMouseDown, handleMouseUp }) => {
    useCanvasInitialization(layer.ref, layer.color);

    return (
      <canvas
        key={layer.id}
        ref={layer.ref}
        style={{
          position: "absolute",
          top: layer.top,
          left: layer.left,
        }}
        width={100}
        height={100}
        onMouseDown={() => handleMouseDown(layer.id)}
        onMouseUp={() => handleMouseUp(layer.id)}
      />
    );
  }
);

export default CanvasLayer;
