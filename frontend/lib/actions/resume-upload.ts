"use server";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";

export async function extractResumeText(file: File) {
  try {
    const arrayBuffer = await file.arrayBuffer();

    const buffer = Buffer.from(arrayBuffer);

    const extension = file.name
      .split(".")
      .pop()
      ?.toLowerCase();

    // PDF
    if (extension === "pdf") {
      const pdf = await pdfParse(buffer);

      return {
        success: true,
        text: pdf.text,
      };
    }

    // DOCX
    if (extension === "docx") {
      const doc = await mammoth.extractRawText({
        buffer,
      });

      return {
        success: true,
        text: doc.value,
      };
    }

    return {
      success: false,
      text: "",
      message: "Unsupported file type.",
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      text: "",
      message: "Unable to extract resume.",
    };
  }
}

