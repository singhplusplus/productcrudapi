const workbook = require("exceljs");

getSheetData = async function () {
  const workbook = new Excel.Workbook();
  await workbook.xlsx.read(stream);
  workbook.eachSheet(function (worksheet, sheetId) {
    // ...
  });
};
