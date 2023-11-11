type FontConfig = {
  fontFamily: string;
  fontSize: number;
};

const getTextTotalWidth = (
  text: string,
  { fontSize, fontFamily }: FontConfig
): number => {
  const offscreenCanvas = new OffscreenCanvas(0, 0);
  const context = offscreenCanvas.getContext("2d");
  if (context) {
    context.font = `${fontSize}px ${fontFamily}`;
    const metrics = context.measureText(text);
    return metrics.width;
  }
  return 0;
}

const matchWord = (text: string): string => {
  const delimiterIndex = text.indexOf(" ");

  if (delimiterIndex !== -1) {
    return text.slice(0, delimiterIndex + 1);
  }

  return text;
}

export const wordWrap = (text: string, maxWidth: number, fontConfig: FontConfig) => {
  const lines: string[] = [];
  let line = "";

  while (text.length > 0) {
    const word = matchWord(text);

    if (!word) {
      break;
    }

    if (getTextTotalWidth((line + word).trim(), fontConfig) <= maxWidth) {
      line += word;
      text = text.slice(word.length);
    } else if (
      getTextTotalWidth(line, fontConfig) < maxWidth &&
      getTextTotalWidth(word, fontConfig) > maxWidth
    ) {
      let trimmedWord = "";

      for (let length = 1; ; length++) {
        const testWord = word.slice(0, length);

        if (
          getTextTotalWidth((line + testWord).trim(), fontConfig) > maxWidth
        ) {
          break;
        }

        trimmedWord = testWord;
      }

      if (trimmedWord == "") {
        lines.push(line.trim());
        line = "";
      } else {
        line += trimmedWord;
        text = text.slice(trimmedWord.length);
      }
    } else {
      lines.push(line.trim());
      line = "";
    }
  }

  if (line != "") {
    lines.push(line.trim());
  }

  return lines;
}