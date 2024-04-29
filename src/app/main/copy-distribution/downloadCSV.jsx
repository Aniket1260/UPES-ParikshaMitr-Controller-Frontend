import React from "react";
import { Button } from "@mui/material";
import { addDays, differenceInDays, isSunday } from "date-fns";

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

  function getNextWorkingDay(date) {
    const nextDay = addDays(date, 1);
    if (isSunday(nextDay)) {
      return getNextWorkingDay(nextDay);
    }
    return nextDay;
  }

  function getWorkingDateAfterDays(startDate, workingDays) {
    let currentDate = startDate;
    for (let i = 1; i < workingDays; i++) {
      currentDate = getNextWorkingDay(currentDate);
    }
    return currentDate;
  }

  const addRemark = (copy) => {
    if (copy.status === "SUBMITTED") {
      const due_date = copy.start_date
        ? getWorkingDateAfterDays(new Date(copy.start_date), 7)
        : "";
      const day_diff = differenceInDays(due_date, new Date(copy.submit_date));

      if (day_diff < 0) {
        return "Late Submission";
      }
    }
    return "";
  };

  const downloadCSV = () => {
    let csvContent =
      "Subject Name, Subject Code,Subject School, Evaluation Mode,Program,Batch,Number of Students,Evaluator Name,Evaluator SAP ID,Evaluator Phone,Date of Exam,Allotted Date,Available Date,Distribution Room Number,Start Date,Status,Submit Date, Remark\n";

    data.forEach((item) => {
      item.copies.forEach((copy) => {
        const remark = addRemark(copy);
        csvContent += `${item.subject_name},${item.subject_code},${
          item.subject_school
        },${item.evaluation_mode},${copy.program},${copy.batch},${
          copy.no_of_students
        },${item.evaluator?.name || ""},${item.evaluator?.sap_id || ""},${
          item.evaluator?.phone || ""
        },${item.date_of_exam},${formatDate(copy.allotted_date)},${formatDate(
          copy.available_date
        )},${item.room_no},${formatDate(copy.start_date)},${
          copy.status
        },${formatDate(copy.submit_date)}, ${remark}\n`;
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
      <Button sx={{ height: "100%" }} variant="contained" onClick={downloadCSV}>
        Download Master CSV
      </Button>
    </div>
  );
};

export default DownloadMasterCSV;
