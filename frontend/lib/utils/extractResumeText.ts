import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist";
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();
export async function extractResumeText(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (extension === "pdf") {
    const buffer = await file.arrayBuffer();

    const pdf = await pdfjsLib.getDocument({
      data: buffer,
    }).promise;

    let text = "";

    for (let page = 1; page <= pdf.numPages; page++) {
      const pageData = await pdf.getPage(page);

      const content = await pageData.getTextContent();

      text +=
        content.items
          .map((item: any) => item.str)
          .join(" ") + "\n";
    }

    return text;
  }

  if (extension === "docx") {
    const buffer = await file.arrayBuffer();

    const result = await mammoth.extractRawText({
      arrayBuffer: buffer,
    });

    return result.value;
  }

  throw new Error("Unsupported file type.");
}