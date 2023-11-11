"use client"

import { useEffect } from "react";
import type {FC} from "react";
import {wordWrap} from "./wrapText";

export const HomePage: FC = () => {
  const text =
    "content of a page 12345678901234567890123456789012345678901234567890123456789012345678901234567890 when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English";

  useEffect(() => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const fontConfig = {
      fontFamily: "Gilroy",
      fontSize: 12
    };
    const MAX_WIDTH = 240;
    const wrappedText = wordWrap(text, MAX_WIDTH, fontConfig);

    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Canvas has no context! WTF?");
    }

    console.log(wrappedText.join("\n"));

    canvas.width = 260;
    canvas.height = 200;

    context.font = `${fontConfig.fontSize}px ${fontConfig.fontFamily}`;
    context.textBaseline;

    wrappedText.forEach((line, i) => {
      context.fillText(line, 10, (i + 1) * 20);
    });
  }, []);

  return (
    <section>
      <div>
        <h1>HTML5 Canvas + React.js</h1>
        <canvas
          id="canvas"
          style={{ border: "1px solid #d3d3d3" }}
        ></canvas>
      </div>
    </section>
  )
};