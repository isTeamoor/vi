export function getReport(bs, rowsSelector){
    let report = document.createElement('div');

    let allRawRows = document.querySelectorAll(rowsSelector);

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




    //Переменные для итоговой строки
    let sum1 = 0;
    let sum2 = 0;
    let lastindex = 1;

    rows.forEach((row,i) => {
        lastindex +=1;
        
        // Копируем исходные значения ячеек каждой строки в массив
        let rowValues = [];
        Array.from(row.cells).forEach( cell => {
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
        td_wID.textContent = `\u200B${rowValues[1].textContent}\u200B`
        
        // Столбец-5. Work Name
        let td_wNm = document.createElement('td');
        td_wNm.textContent = rowValues[8].textContent;
        
        // Столбец-6. Дата (оставить пустой)
        let td_date = document.createElement('td');
        td_date.textContent = '';
        
        // Столбец-7. Единица измерения
        let td_uom = document.createElement('td');
        td_uom.textContent = rowValues[9].textContent;
        
        // Столбец-8. Количество
        let td_qty= document.createElement('td');
        td_qty.textContent = rowValues[4].textContent.replace(",", ".");
        
        // Столбец-8. Цена
        let td_prc= document.createElement('td');
        td_prc.textContent = rowValues[10].textContent;
        
        // Столбец-9. Стоимость без НДС
        let td_cst= document.createElement('td');
        //td_cst.textContent =Number(rowValues[10].textContent)*Number(rowValues[4].textContent.replace(",", "."));
        td_cst.textContent =`=H${i+2}*I${i+2}`;
        sum1 += Number(td_cst.textContent)
        
        // Столбец-10. Стоимость с НДС
        let td_cstNDS= document.createElement('td');
        //td_cstNDS.textContent = (Number(rowValues[10].textContent)*Number(rowValues[4].textContent.replace(",", "."))*1.12).toFixed(1);
        td_cstNDS.textContent = `=J${i+2}*12`
        sum2 += Number(td_cstNDS.textContent)

        let tds = [td_N,td_bsID,td_bsNm,td_wID,td_wNm,td_date,td_uom,td_qty,td_prc,td_cst,td_cstNDS]
        tds.forEach(x=>{
            newRow.appendChild(x)
        })
        resultTable.appendChild(newRow);
    });

    //Добавление итоговой строки
    let totalRow = document.createElement('tr');

    let spanedTD = document.createElement('td')
    spanedTD.textContent = 'Итого по БС';
    spanedTD.colSpan = 9;
    totalRow.appendChild(spanedTD);

    let sumCost = document.createElement('td');
    //sumCost.textContent = sum1;
    sumCost.textContent = `=СУММ(J${2}:J${lastindex})`
    totalRow.appendChild(sumCost);

    let sumCostNDS = document.createElement('td');
    //sumCostNDS.textContent = sum2;
    sumCostNDS.textContent = `=СУММ(K${2}:K${lastindex})`
    totalRow.appendChild(sumCostNDS);


    resultTable.appendChild(totalRow)
    return resultTable
}