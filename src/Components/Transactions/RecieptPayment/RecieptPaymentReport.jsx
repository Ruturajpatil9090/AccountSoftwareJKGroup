import React, { useState, useEffect, useRef } from "react";
import logo from "../../../Assets/jklogo.png";
import Sign from "../../../Assets/jklogo.png";
import jsPDF from "jspdf";
import "jspdf-autotable";
import PdfPreview from '../../../Common/PDFPreview'

const API_URL = process.env.REACT_APP_API;

const RecieptPaymentReport = ({ doc_no, Tran_Type,disabledFeild }) => {
    const companyCode = sessionStorage.getItem("Company_Code");
    const Year_Code = sessionStorage.getItem("Year_Code");
    const [invoiceData, setInvoiceData] = useState([]);
    const [pdfPreview, setPdfPreview] = useState(null);

    const numberToWords = (num) => {
        const belowTwenty = [
            "Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
            "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
        ];

        const tens = [
            "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
        ];

        const scales = [
            "", "Thousand", "Lakh", "Crore"
        ];

        const words = (num) => {
            if (num === 0) return "";
            if (num < 20) return belowTwenty[num];
            if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? " " + belowTwenty[num % 10] : "");
            if (num < 1000) return belowTwenty[Math.floor(num / 100)] + " Hundred" + (num % 100 !== 0 ? " and " + words(num % 100) : "");

            if (num < 100000) {
                return words(Math.floor(num / 1000)) + " Thousand" + (num % 1000 !== 0 ? " " + words(num % 1000) : "");
            } else if (num < 10000000) {
                return words(Math.floor(num / 100000)) + " Lakh" + (num % 100000 !== 0 ? " " + words(num % 100000) : "");
            } else {
                return words(Math.floor(num / 10000000)) + " Crore" + (num % 10000000 !== 0 ? " " + words(num % 10000000) : "");
            }
        };

        const convertFraction = (fraction) => {
            if (fraction === 0) return "Zero Paise";
            return words(fraction) + " Paise";
        };

        const integerPart = Math.floor(num);
        const fractionPart = Math.round((num - integerPart) * 80);

        let result = words(integerPart) + " Rupees";

        if (fractionPart > 0) {
            result += " and " + convertFraction(fractionPart);
        } else {
            result += " Only";
        }

        return result;
    };

    const fetchData = async () => {
        try {
            const response = await fetch(
                `${API_URL}/generating_RecieptPaymrnt_report?Company_Code=${companyCode}&Year_Code=${Year_Code}&doc_no=${doc_no}&TranType=${Tran_Type}`
            );
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();

            setInvoiceData(data.all_data);
            generatePdf(data.all_data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };


    const generatePdf = async (data) => {
        const pdf = new jsPDF({ orientation: "portrait" });
        const allData = data?.[0] || {};
        const logoImg = new Image();

        logoImg.src = logo;
        logoImg.onload = () => {
            pdf.addImage(logoImg, "PNG", 5, 5, 30, 30);
            pdf.setFontSize(14);
            pdf.text(`${allData.Company_Name_E}`, 40, 10);
            pdf.setFontSize(8);
            pdf.setFont("helvetica", "bold");
            pdf.text(`${allData.AL1}`, 40, 15);
            pdf.text(`${allData.AL2}`, 40, 20);
            pdf.text(`${allData.AL3}`, 40, 25);
            pdf.text(`${allData.AL4}`, 40, 30);
            pdf.text(`${allData.Other}`, 40, 35);

            pdf.setFontSize(12);
            pdf.setLineWidth(0.3);
            pdf.line(10, 38, 200, 38);

            pdf.setFontSize(10);
            pdf.text("Receipt Payment Report", 90, 43);

            pdf.setFontSize(12);
            pdf.setLineWidth(0.3);
            pdf.line(10, 45, 200, 45);


            const totalAmount = parseFloat(allData.total);
            const totalAmountWords = numberToWords(totalAmount);
   
            const tableData = [
                ["Bill No:", `${allData.doc_no}`],
                ["Reciept Date:", allData.doc_dateConverted],
            ];
            
            pdf.autoTable({
                startY: 45,
                margin: { right: pdf.internal.pageSize.width / 2 + 10 },
                body: tableData,
                theme: "plain",
                styles: {
                    cellPadding: 1,  
                    fontSize: 8,   
                },
                columnStyles: {
                    0: { cellWidth: 'auto', fontStyle: 'normal', halign: 'left' }, 
                    1: { cellWidth: 'auto', fontStyle: 'normal', halign: 'left' }, 
                },
                didDrawCell: function (data) {
                    if (data.row.index === 3) {
                        pdf.setLineWidth(0.3);
                        pdf.setDrawColor(0);
                        const startX = 10;
                        const endX = pdf.internal.pageSize.width / 2;
                        const y = data.cell.y + data.cell.height + 7.9;
                        pdf.line(startX, y, endX, y);
                    }
                }
            });
            
            const particulars = [
                ["Party Name", "Amount", "Cheque No. / Remark", "Narration", "Bank Name"],
                ...data.map(item => [
                    item.creditname || "",
                    item.amount || "",
                    item.narration || "",
                    item.narration2 || "",
                    item.Ac_Name_E || ""
                ])
            ];

            pdf.autoTable({
                startY: pdf.lastAutoTable.finalY + 10,
                head: [particulars[0]],
                body: particulars.slice(1),
                styles: {
                    cellPadding: 0.5,
                    fontSize: 8,
                    valign: 'middle',
                    halign: 'left',
                    lineColor: 200
                },
                tableWidth: '100%',
            });
            const lineY = pdf.lastAutoTable.finalY + 5;

            pdf.setFontSize(8);
            pdf.setFont("helvetica", "bold");

            pdf.text(`Total: ${allData.total}`, 35, lineY);

            const afterTotalY = lineY + 5;

            pdf.setLineWidth(0.5);
            pdf.line(10, afterTotalY, 200, afterTotalY);

            const afterTableY = afterTotalY + 5;

            pdf.setFontSize(8);
            pdf.text(`Amount In Words: ${totalAmountWords}`, 10, afterTableY);

            const afterAmountTextY = afterTableY + 5;
            pdf.line(10, afterAmountTextY, 200, afterAmountTextY);

            const pdfData = pdf.output("datauristring");
            setPdfPreview(pdfData);
        };
    };

    return (
        <div id="pdf-content" className="centered-container">
            {pdfPreview && <PdfPreview pdfData={pdfPreview} apiData={invoiceData[0]} label={"RecieptPayment"} />}
            <button onClick={fetchData} className="print-button" disabled = {disabledFeild}>Print</button>
        </div>
    );
};

export default RecieptPaymentReport;