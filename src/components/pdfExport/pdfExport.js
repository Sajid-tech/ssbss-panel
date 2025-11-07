import html2pdf from "html2pdf.js";
export const downloadPDF = (targetId, filename = "report.pdf", message) => {
  const element = document.getElementById(targetId);

  if (!element) {
    message?.error?.("PDF content not found!");
    return;
  }

  const cleanColors = (el) => {
    const elements = el.querySelectorAll("*");
    elements.forEach((node) => {
      const style = window.getComputedStyle(node);
      if (style.color.includes("oklch")) node.style.color = "#000000";
      if (style.backgroundColor.includes("oklch"))
        node.style.backgroundColor = "#ffffff";
      if (style.borderColor.includes("oklch"))
        node.style.borderColor = "#000000";
    });
  };

  cleanColors(element);

  element.style.fontSize = "14px";
  const children = element.querySelectorAll("*");
  children.forEach((child) => {
    child.style.fontSize = "14px";
  });

  const options = {
    margin: 5,
    filename,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
    },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    pagebreak: { mode: ["avoid-all", "css", "legacy"] },
  };

  html2pdf()
    .set(options)
    .from(element)
    .save()
    .catch((err) => {
      console.error("Error generating PDF:", err);
      message?.error?.("Something went wrong while generating the PDF.");
    });
};
