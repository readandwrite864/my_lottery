export function screenshot(selector) {
  return html2canvas(document.getElementById(selector), {
    allowTaint: true,
    useCORS: true,
  }).then(function (canvas) {
    let image = canvas.toDataURL("image/png", 0.8);
    return image;
  });
}

export const downloadFile = (dataUrl, fileName) => {
  const link = document.createElement("a");
  document.body.appendChild(link);

  link.href = dataUrl;
  link.target = "_self";
  link.fileName = fileName;
  link.download = fileName;
  link.click();
  link.remove();
};
