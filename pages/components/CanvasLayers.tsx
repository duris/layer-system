import React, { useEffect, useRef } from "react";
import {
  useCanvasLayer,
  useCanvasInitialization,
  useCanvasLayersUpdate,
} from "../context/LayerContext";

const CanvasLayers: React.FC = () => {
  const { layers, addLayer, dragStart, dragMove, dragEnd } = useCanvasLayer();
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);
  const mousePositionRef = useRef({ x: 0, y: 0 });

  useCanvasInitialization(mainCanvasRef, "#ffffff");
  useCanvasLayersUpdate(layers);

  // Add this useEffect to add the global mouseup listener
  useEffect(() => {
    const globalMouseUpListener = () => {
      layers.forEach((layer) => {
        if (layer.mouseDown) {
          dragEnd(layer.id);
        }
      });
    };

    window.addEventListener("mouseup", globalMouseUpListener);
    return () => {
      window.removeEventListener("mouseup", globalMouseUpListener);
    };
  }, [layers, dragEnd]);

  const handleMouseDown = (id: string) => {
    dragStart(id);
  };

  const handleMouseUp = (id: string) => {
    dragEnd(id);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = event;
    if (!mainCanvasRef.current) return null;
    const { left, top } = mainCanvasRef.current.getBoundingClientRect();
    const x = clientX - left;
    const y = clientY - top;
    mousePositionRef.current = { x, y };

    layers.forEach((layer) => {
      if (layer.mouseDown) {
        dragMove(layer.id, x, y);
      }
    });
  };

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
        ))}
      </div>
    </div>
  );
};

export default CanvasLayers;
