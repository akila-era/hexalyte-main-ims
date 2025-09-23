import JsBarcode from "jsbarcode";

export const generateBarcode = (text, options = {}) => {
  // Input validation
  if (!text && text !== 0) {
    console.warn("Barcode text is empty, using fallback");
    return generateFallbackBarcode("ERROR", options);
  }

  const barcodeText = String(text).trim();
  
  if (barcodeText.length === 0) {
    console.warn("Barcode text is empty after trimming, using fallback");
    return generateFallbackBarcode("ERROR", options);
  }

  const defaultOptions = {
    format: "CODE128",
    width: options.width || 1,
    height: options.height || 30,
    displayValue: options.displayValue || false,
    margin: options.margin || 0,
    background: "#ffffff",
    lineColor: "#000000",
    ...options,
  };

  try {
    const canvas = document.createElement("canvas");
    JsBarcode(canvas, barcodeText, defaultOptions);
    return canvas.toDataURL("image/png");
  } catch (error) {
    console.error("Barcode generation failed:", error);
    return generateFallbackBarcode(barcodeText, defaultOptions);
  }
};

// Fallback function for when barcode generation fails
const generateFallbackBarcode = (text, options = {}) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  
  const width = Math.max(text.length * 8 + 20, 100);
  const height = options.height || 30;
  
  canvas.width = width;
  canvas.height = height;
  
  // White background
  ctx.fillStyle = options.background || "#ffffff";
  ctx.fillRect(0, 0, width, height);
  
  // Black border
  ctx.strokeStyle = options.lineColor || "#000000";
  ctx.strokeRect(1, 1, width - 2, height - 2);
  
  // Black text
  ctx.fillStyle = options.lineColor || "#000000";
  ctx.font = "10px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  
  ctx.fillText(String(text), width / 2, height / 2);
  
  return canvas.toDataURL("image/png");
};

export default generateBarcode;