import * as XLSX from 'xlsx';

export function printReports(srcID){
    let reportTables = document.querySelectorAll(`${srcID} table`);

    reportTables.forEach((table,i) => {
        const workbook = XLSX.utils.table_to_book(table, { sheet: "Vi" });
        XLSX.writeFile(workbook, `${['NTI','Unitel'][i]}.xlsx`);
    });
}