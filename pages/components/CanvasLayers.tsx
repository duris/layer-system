import React, { useEffect, useRef } from "react";
import {
  useCanvasLayer,
  useCanvasInitialization,
  useCanvasLayersUpdate,
} from "../context/LayerContext";
import CanvasLayer from "./CanvasLayer";
import useDragLayer from "../hooks/useDragLayer";
import useResizableLayer from "../hooks/useResizableLayer";

const CanvasLayers: React.FC = () => {
  const { layers, addLayer, dragStart, dragMove, dragEnd } = useCanvasLayer();
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);
  //   const mousePositionRef = useRef({ x: 0, y: 0 });

  useCanvasInitialization(mainCanvasRef, "#ffffff");
  useCanvasLayersUpdate(layers);

  const { handleMouseDown, handleMouseUp, handleMouseMove } =
    useDragLayer(mainCanvasRef);

  const { handleResizeMouseDown, handleResizeMouseUp, handleResizeMouseMove } =
    useResizableLayer(mainCanvasRef);

  return (
    <div>
      <button onClick={addLayer}>Add Layer</button>
      <div
        style={{ position: "relative", width: 1000, height: 600 }}
        onMouseMove={handleMouseMove}
      >
        <canvas
          ref={mainCanvasRef}
          style={{
            position: "absolute",
            zIndex: -1,
          }}
          width={1000}
          height={600}
        />
        {layers.map((layer) => (
          <CanvasLayer
            key={layer.id}
            layer={layer}
            handleMouseDown={handleMouseDown}
            handleMouseUp={handleMouseUp}
            handleResizeMouseDown={handleResizeMouseDown}
            handleResizeMouseUp={handleResizeMouseUp}
            handleResizeMouseMove={handleResizeMouseMove}
          />
        ))}
      </div>
    </div>
  );
};

export default CanvasLayers;
