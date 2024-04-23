import React from "react";
import { Button } from "@mui/material";

const DownloadMasterCSV = ({ data }) => {
  const currentDate = new Date();
  const formatDate = (dateString) => {
    if (!dateString) {
      return "-";
    }
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
  };

  const downloadCSV = () => {
    let csvContent =
      "Subject Name, Subject Code,Evaluation Mode,Program,Batch,Number of Students,Evaluator Name,Evaluator SAP ID,Evaluator Phone,Date of Exam,Allotted Date,Available Date,Start Date,Status,Submit Date\n";

    data.forEach((item) => {
      item.copies.forEach((copy) => {
        csvContent += `${item.subject_name},${item.subject_code},${
          item.evaluation_mode
        },${copy.program},${copy.batch},${copy.no_of_students},${
          item.evaluator?.name || ""
        },${item.evaluator?.sap_id || ""},${item.evaluator?.phone || ""},${
          item.date_of_exam
        },${formatDate(copy.allotted_date)},${formatDate(
          copy.available_date
        )},${formatDate(copy.start_date)},${copy.status},${formatDate(
          copy.submit_date
        )}\n`;
      });
    });

    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Copy Distribution_Master CSV_${currentDate.toLocaleDateString(
        "en-GB"
      )}.csv`
    );
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div>
      <Button variant="contained" onClick={downloadCSV}>
        Download Master CSV
      </Button>
    </div>
  );
};

export default DownloadMasterCSV;
