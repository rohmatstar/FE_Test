import React from "react";

const OverlayShade = ({
  width = 200,
  height = 200,
  left = "auto",
  right = "auto",
  top = "auto",
  bottom = "auto",
  opacity = 0.5,
  color = "255, 255, 255",
  borderRadius = 0,
  zIndex = 1,
  position = "fixed",
  rotation = 0,
  animationSpeed = "20s",
  transformOrigin = "left",
}) => {
  return (
    <div
      style={{
        position,
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        left: typeof left === "number" ? `${left}px` : left,
        right: typeof right === "number" ? `${right}px` : right,
        top: typeof top === "number" ? `${top}px` : top,
        bottom: typeof bottom === "number" ? `${bottom}px` : bottom,
        backgroundColor: `rgba(${color}, ${opacity})`,
        borderRadius: `${borderRadius}px`,
        zIndex,
        transition: "opacity 0.3s ease, background-color 0.3s ease",
        transform: `rotate(${rotation}deg)`,
        animation: `infiniteRotate ${animationSpeed} linear infinite`,
        transformOrigin: transformOrigin,
      }}
    />
  );
};

export default OverlayShade;
