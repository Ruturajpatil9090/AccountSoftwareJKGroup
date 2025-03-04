import React, { useState, useEffect } from "react";
import logo from "../../../Assets/jklogo.png";
import Sign from "../../../Assets/jksign.png";
import jsPDF from "jspdf";
import "jspdf-autotable";
import PdfPreview from '../../../Common/PDFPreview';
import { ConvertNumberToWord } from "../../../Common/FormatFunctions/ConvertNumberToWord";

const API_URL = process.env.REACT_APP_API;

const DebitCreditNoteReport = ({ doc_no, tran_type, disabledFeild }) => {

  //GET Values from Session Storage
  const companyCode = sessionStorage.getItem("Company_Code");
  const Year_Code = sessionStorage.getItem("Year_Code");

  const [invoiceData, setInvoiceData] = useState([]);
  const [pdfPreview, setPdfPreview] = useState(null);

  const AccountYear = sessionStorage.getItem("Accounting_Year");
  let formattedYear = "";

  if (AccountYear) {
    const years = AccountYear.split(" - ");
    if (years.length === 2) {
      const startYear = years[0].slice(0, 4);
      const endYear = years[1].slice(2, 4);
      formattedYear = `${startYear}-${endYear}`;
    }
  }

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${API_URL}/generating_DebitCredit_report?Company_Code=${companyCode}&Year_Code=${Year_Code}&doc_no=${doc_no}&tran_type=${tran_type}`
      );
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setInvoiceData(data.all_data);
      generatePdf(data.all_data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  //Genrate PDF Functionality
  const generatePdf = async (data) => {
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const allData = data?.[0] || {};
    const logoImg = new Image();
    logoImg.src = logo;

    logoImg.onload = () => {
      pdf.addImage(logoImg, "PNG", 10, 10, 25, 25);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.text(`${allData.Company_Name_E}`, 45, 15);
      pdf.setFontSize(8);
      pdf.text(`${allData.AL1}`, 45, 20);
      pdf.text(`${allData.AL2}`, 45, 25);
      pdf.text(`${allData.AL3}`, 45, 30);
      pdf.text(`${allData.AL4}`, 45, 35);
      pdf.text(`${allData.Other}`, 45, 40);

      pdf.setLineWidth(0.3);
      pdf.line(10, 45, 200, 45);

      pdf.setFontSize(6);
      let invoiceText = "";
      if (tran_type === "DN") invoiceText = "DEBIT NOTE TO CUSTOMER";
      else if (tran_type === "DS") invoiceText = "DEBIT NOTE TO SUPPLIER";
      else if (tran_type === "CN") invoiceText = "CREDIT NOTE TO CUSTOMER";
      else invoiceText = "CREDIT NOTE TO SUPPLIER";
      pdf.text(invoiceText, 80, 50);

      pdf.line(10, 53, 200, 53);

      const tableData = [
        ["Reverse Charge", "No"],
        ["Note No:", `${tran_type}${formattedYear}-${allData.doc_no}`],
        ["Note Date:", allData.doc_date],
        ["DO No:", allData.DO_No],
        ["State:", allData.companyStateName],
        ["State Code:", allData.companyGSTStateCode],
        ["Bill No:", allData.bill_no],
        ["Bill Date:", allData.bill_date],
        ["Buyer,", ""],
        [allData.ShopTo_Name, ""],
        [allData.ShipToAddress, ""],
        ["GST No:", allData.ShipToGSTNo],
        ["State Code:", allData.ShipToStateCode],
        ["PAN No:", allData.CompanyPan],
        ["FSSAI NO:", allData.billtoFSSAI],
        ["TAN NO:", allData.billtoTAN],
      ];

      pdf.autoTable({
        startY: 55,
        margin: { left: 10, right: 100 },
        body: tableData,
        theme: "grid",
        styles: { fontSize: 6, cellPadding: 1 },
        columnStyles: { 0: { fontStyle: "bold" } },
        pageBreak: 'auto',
        columnWidth: 'auto',
        didDrawPage: (data) => {
          const tableWidth = data.settings.margin.left + 100;
        },
      });

      const buyerData = [
        ["Our GST No:", allData.GST],
        ["Transport Mode:", "NA"],
        ["Date Of Supply:", "NA"],
        ["Place Of Supply:", "NA"],
        ["Consigned To,", ""],
        [`${allData.Unit_Name}`, ""],
        [`${allData.unitaddress}`, ""],
        ["Gst NO:", allData.unitgstno],
        ["State Code:", allData.unitstatecode],
        ["PAN No:", allData.unitpanno],
        ["FSSAI No:", allData.shiptoFSSAI],
        ["TAN No:", allData.shiptoTAN],
      ];

      pdf.autoTable({
        startY: 55,
        margin: { left: 110 },
        body: buyerData,
        theme: "grid",
        styles: { fontSize: 6, cellPadding: 1 },
        columnStyles: { 0: { fontStyle: "bold" } },
        pageBreak: 'auto',
        columnWidth: 'auto',
      });

      const particulars = [
        ["Particulars", "HSN/ACS", "Quintal ", "Value"],
        [allData.Item_Name, allData.HSN, allData.Quantal, allData.value],
      ];

      pdf.autoTable({
        startY: pdf.lastAutoTable.finalY + 20,
        head: [particulars[0]],
        body: particulars.slice(1),
        theme: "grid",
        styles: { fontSize: 8, cellPadding: 1, halign: "right", },
        pageBreak: 'auto',
      });

      const eInvoiceData = [
        ["EInvoice No:", allData.Ewaybillno],
        ["ACK No::", allData.ackno],
        ["ASN No::", allData.ASNNO],
        ["Narration:", allData.Narration],
      ];

      const summaryData = [
        ["Taxable Amount:", "", allData.texable_amount],
        ["CGST:", allData.cgst_rate, allData.cgst_amount],
        ["SGST:", allData.sgst_rate, allData.sgst_amount],
        ["IGST:", allData.igst_rate, allData.igst_amount],
        ["MISC:", "", allData.misc_amount],
        ["Total Amount:", "", allData.bill_amount],
        ["TCS:", allData.TCS_Rate, allData.TCS_Amt],
        ["TCS Net Payable:", "", allData.TCS_Net_Payable],
      ];

      const pageWidth = pdf.internal.pageSize.width;

      const tableWidth = (pageWidth - 20) / 2;

      pdf.autoTable({
        startY: pdf.lastAutoTable.finalY + 10,
        margin: { left: 10, right: 110 },
        body: eInvoiceData,
        theme: "plain",
        styles: {
          cellPadding: 0.5,
          fontSize: 6,
          halign: "left",
          valign: "middle",
          whiteSpace: "nowrap",
        },
        columnStyles: {
          0: { cellWidth: 'auto' },
          1: { fontStyle: 'bold' },
        },
        pageBreak: 'auto',
        width: tableWidth,
      });

      pdf.autoTable({
        startY: pdf.lastAutoTable.finalY - 22,
        margin: { left: tableWidth + 15, right: 14 },
        body: summaryData,
        theme: "grid",
        styles: { fontSize: 6, cellPadding: 1 },
        columnStyles: { 2: { halign: "right", fontStyle: "bold" } },
        pageBreak: 'auto',
        width: tableWidth,
      });

      pdf.setFontSize(8);

      let yPosition = pdf.lastAutoTable.finalY + 10;

      pdf.text(`Total Amount: ${ConvertNumberToWord(allData.TCS_Net_Payable)}`, 10, yPosition);

      yPosition += 5;

      pdf.line(10, yPosition, pdf.internal.pageSize.width - 5, yPosition);

      yPosition += 5;
      pdf.text(`Our Tin No: ${allData.TIN}`, 10, yPosition);
      pdf.text(`FSSAI No: ${allData.FSSAI_No}`, 60, yPosition);
      pdf.text(`PAN No: ${allData.Pan_No}`, 110, yPosition);

      const signImg = new Image();
      signImg.src = Sign;
      signImg.onload = () => {
        pdf.addImage(signImg, "PNG", 160, yPosition + 10, 30, 20);
        pdf.text(`For, ${allData.Company_Name_E}`, 145, yPosition + 35);
        pdf.text("Authorised Signatory", 160, yPosition + 40);
        const pdfData = pdf.output("datauristring");
        setPdfPreview(pdfData);
      };
    };
  };

  return (
    <div id="pdf-content" className="centered-container">
      {pdfPreview && <PdfPreview pdfData={pdfPreview} apiData={invoiceData[0]} label={"DebitCredit"} />}
      <button onClick={fetchData} className="print-button" style={{height:"38px"}} disabled={disabledFeild}>Print</button>
    </div>
  );
};

export default DebitCreditNoteReport;