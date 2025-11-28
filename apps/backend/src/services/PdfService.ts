import PdfPrinter from "pdfmake";
import { TestRequest, TestRequestDocumentStatus } from "@prisma/client";
import path from "path";
import fs from "fs";
import logger from "../utils/logger";

export class PdfService {
  private printer: PdfPrinter;

  constructor() {
    // Define fonts
    // We'll attempt to use fonts from the pdfmake package in node_modules
    // Adjust path as necessary based on deployment
    const fontPath = path.join(
      process.cwd(),
      "node_modules",
      "pdfmake",
      "fonts",
    );

    // Fallback or check if fonts exist, otherwise we might need to bundle them
    // For now, assuming standard installation structure
    const fonts = {
      Roboto: {
        normal: path.join(fontPath, "Roboto-Regular.ttf"),
        bold: path.join(fontPath, "Roboto-Medium.ttf"),
        italics: path.join(fontPath, "Roboto-Italic.ttf"),
        bolditalics: path.join(fontPath, "Roboto-MediumItalic.ttf"),
      },
    };

    try {
      this.printer = new PdfPrinter(fonts);
    } catch (error) {
      logger.warn(
        "Failed to initialize PdfPrinter with default fonts, trying fallback...",
      );
      // Fallback logic or re-throw
      // In a real app, we'd ensure fonts are copied to dist/fonts
      this.printer = new PdfPrinter(fonts);
    }
  }

  async generateTestReport(testRequest: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const docDefinition = this.buildDocDefinition(testRequest);
        const pdfDoc = this.printer.createPdfKitDocument(docDefinition);
        const chunks: Buffer[] = [];

        pdfDoc.on("data", (chunk) => chunks.push(chunk));
        pdfDoc.on("end", () => resolve(Buffer.concat(chunks)));
        pdfDoc.on("error", (err) => reject(err));

        pdfDoc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  private buildDocDefinition(request: any): any {
    const { customer, testRequestSamples, approvedAt, approvedBy } = request;

    return {
      content: [
        // Header
        {
          text: "STAR LAB - Laboratory Report",
          style: "header",
          alignment: "center",
          margin: [0, 0, 0, 20],
        },

        // Request Info
        {
          columns: [
            [
              { text: "Customer Information", style: "subheader" },
              { text: `Company: ${customer?.companyNameEn || "-"}` },
              {
                text: `Contact: ${customer?.operatorFirstName || "-"} ${customer?.operatorLastName || "-"}`,
              },
              { text: `Phone: ${customer?.operatorMobilePhone || "-"}` },
            ],
            [
              { text: "Request Details", style: "subheader" },
              { text: `Request No: ${request.requestNo}` },
              {
                text: `Date: ${request.requestDate ? new Date(request.requestDate).toLocaleDateString() : "-"}`,
              },
              { text: `Status: ${request.documentStatus}` },
            ],
          ],
        },
        { text: "", margin: [0, 10] },

        // Line
        {
          canvas: [
            { type: "line", x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 1 },
          ],
        },
        { text: "", margin: [0, 10] },

        // Results
        { text: "Test Results", style: "sectionHeader" },
        this.buildResultsTable(testRequestSamples),

        { text: "", margin: [0, 20] },

        // Footer / Signature
        {
          columns: [
            { width: "*", text: "" },
            {
              width: 200,
              stack: [
                { text: "Approved By:", style: "label" },
                {
                  text: approvedBy?.userProfile
                    ? `${approvedBy.userProfile.firstName} ${approvedBy.userProfile.lastName}`
                    : "Doctor",
                  style: "signature",
                },
                {
                  text: approvedAt
                    ? new Date(approvedAt).toLocaleDateString()
                    : "-",
                  style: "small",
                },
                { text: "Authorized Signature", style: "small", italics: true },
              ],
            },
          ],
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
        },
        subheader: {
          fontSize: 12,
          bold: true,
          margin: [0, 0, 0, 5],
        },
        sectionHeader: {
          fontSize: 14,
          bold: true,
          margin: [0, 10, 0, 10],
        },
        label: {
          fontSize: 10,
          bold: true,
        },
        signature: {
          fontSize: 12,
          decoration: "underline",
          margin: [0, 20, 0, 5],
        },
        small: {
          fontSize: 8,
          color: "gray",
        },
        tableHeader: {
          bold: true,
          fontSize: 10,
          color: "black",
          fillColor: "#eeeeee",
        },
      },
      defaultStyle: {
        font: "Roboto",
        fontSize: 10,
      },
    };
  }

  private buildResultsTable(samples: any[]): any {
    if (!samples || samples.length === 0) {
      return { text: "No samples found" };
    }

    const body = [];

    // Header
    body.push([
      { text: "Sample ID", style: "tableHeader" },
      { text: "Test Panel", style: "tableHeader" },
      { text: "Parameter", style: "tableHeader" },
      { text: "Result", style: "tableHeader" },
      { text: "Unit", style: "tableHeader" },
      { text: "Ref. Range", style: "tableHeader" },
      { text: "Flag", style: "tableHeader" },
    ]);

    // Rows
    samples.forEach((sample) => {
      if (sample.labTests) {
        sample.labTests.forEach((test: any) => {
          if (test.labResults) {
            test.labResults.forEach((result: any) => {
              body.push([
                sample.customerSampleId || "-",
                test.testPanel || "-",
                result.parameter || "-",
                { text: result.value || "-", bold: true },
                result.unit || "-",
                result.referenceRange || "-",
                result.isAbnormal
                  ? { text: "ABNORMAL", color: "red", bold: true }
                  : "",
              ]);
            });
          }
        });
      }
    });

    return {
      table: {
        headerRows: 1,
        widths: ["auto", "auto", "*", "auto", "auto", "auto", "auto"],
        body: body,
      },
      layout: "lightHorizontalLines",
    };
  }
}
