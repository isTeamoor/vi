export function getReport(bs, rawTableID){
    let report = document.createElement('div');

    let allRawRows = document.querySelectorAll(rawTableID);

    let rowsNTI = Array.from(allRawRows).filter(row => row.cells[11].textContent.toLowerCase() === 'nti');
    let rowsUNT = Array.from(allRawRows).filter(row => row.cells[11].textContent.toLowerCase() === 'unitel');
        
    report.appendChild(reportTable(bs, rowsNTI));
    report.appendChild(reportTable(bs, rowsUNT));

    return report.innerHTML
}


function reportTable(bs, rows){
    let resultTable = document.createElement('table');

    // Добавляем заголовки таблицы
    let headerRow = document.createElement("tr");

    let headers = ["№ пп", "Номер БС", "Название БС", "№ ТЦП", "Наименование работ", "фактическая дата выполнения работ", "Ед. изм.", 
        "Кол-во", "Цена за ед. (без НДС)", "Стоимость работ, Сум (без НДС)", "Стоимость работ, Сум (с НДС)"]

    headers.forEach(headerText => {
        let th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th)
    });

    resultTable.appendChild(headerRow);



    rows.forEach(row => {
        
        // Копируем исходные значения ячеек каждой строки в массив
        let rowValues = [];
        Array.from(row.cells).forEach((cell) => {
            let newCell = document.createElement("td");
            newCell.textContent = cell.textContent.trim();
            rowValues.push(newCell);            
        });

        // Добавляем строки новой таблицы со значениями из старой
        let newRow = document.createElement("tr");

        // Столбец-1. № пп
        let td_N = document.createElement('td');
        td_N.textContent = 1;
        
        // Столбец-2. BS ID
        let td_bsID = document.createElement('td');
        td_bsID.textContent = bs['ID'];
        
        // Столбец-3. BS Name
        let td_bsNm = document.createElement('td');
        td_bsNm.textContent = bs['Name'];
        
        // Столбец-4. Work ID
        let td_wID = document.createElement('td');
        td_wID.textContent = rowValues[1].textContent;
        
        // Столбец-5. Work Name
        let td_wNm = document.createElement('td');
        td_wNm.textContent = rowValues[2].textContent;
        
        // Столбец-6. Дата (оставить пустой)
        let td_date = document.createElement('td');
        td_date.textContent = '';
        
        // Столбец-7. Единица измерения
        let td_uom = document.createElement('td');
        td_uom.textContent = rowValues[3].textContent;
        
        // Столбец-8. Количество
        let td_qty= document.createElement('td');
        td_qty.textContent = rowValues[4].textContent.replace(",", ".");
        
        // Столбец-8. Цена
        let td_prc= document.createElement('td');
        td_prc.textContent = rowValues[10].textContent;
        
        // Столбец-9. Стоимость без НДС
        let td_cst= document.createElement('td');
        td_cst.textContent =Number(rowValues[10].textContent)*Number(rowValues[4].textContent.replace(",", "."));
        
        // Столбец-10. Стоимость с НДС
        let td_cstNDS= document.createElement('td');
        td_cstNDS.textContent = (Number(rowValues[10].textContent)*Number(rowValues[4].textContent.replace(",", "."))*1.12).toFixed(1);
        

        [td_N,td_bsID,td_bsNm,td_wID,td_wNm,td_date,td_uom,td_qty,td_prc,td_cst,td_cstNDS].forEach(x=>{
            newRow.appendChild(x)
        })
        resultTable.appendChild(newRow);
    });

    return resultTable
}