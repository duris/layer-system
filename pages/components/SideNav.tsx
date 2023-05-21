import React from "react";
import { useCanvasLayer } from "../context/LayerContext";

const SideNav: React.FC = () => {
  const { layers, deleteLayer } = useCanvasLayer(); // Get deleteLayer from the context

  return (
    <div
      style={{
        position: "fixed",
        right: 0,
        top: 0,
        width: "200px",
        height: "100vh",
        border: "1px solid black",
        padding: "10px",
        overflowY: "auto",
      }}
    >
      <h3>Layers:</h3>
      <ul>
        {layers.map((layer) => (
          <li
            key={layer.id}
            style={{
              background: layer.color,
              padding: "5px",
              marginBottom: "10px",
            }}
          >
            Layer ID: {layer.id}
            <button
              onClick={() => deleteLayer(layer.id)}
              style={{ marginLeft: "10px" }}
            >
              Delete
            </button>{" "}
            {/* Add this button */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideNav;
