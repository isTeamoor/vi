function getBSrow(htmlID){
    const rows = document.querySelectorAll(`${htmlID} tr`)
    let targetRow = null;

    rows.forEach((row) => {
        row.querySelectorAll("td").forEach((cell) => {
            if (cell.textContent.includes("Номер") && cell.textContent.includes("название БС")) {
                targetRow = row;
            }
        });
    });

    let thirdTd = targetRow.querySelectorAll("td")[2];

    return thirdTd ? thirdTd.textContent.trim() : 'не найдено'
}

import { siteList } from "./sites";
export function getBSnumber(htmlID){
    let BScell = getBSrow(htmlID)
    if (BScell == 'не найдено') {return 'не найдено'}

    let matches = BScell.match(/\d{3,}/g);
    let numbers = matches ? matches.map(Number) : [];

    let result = {'BScell':BScell};
    numbers.forEach(number => {
        const matchedItems = siteList.filter(item => item.ID === String(number));
    
        if (matchedItems.length > 0) {
            matchedItems.forEach(item => {
                result[item.ID] = item; // Добавляем объект в результат по его ID
            });
        }
    });
    return result
}

export function createBSform(BSprops){
    let formHTML = '<form id="bsForm">Выберите номер БС из строки';

    for (let number in BSprops){
      if (number == 'BScell') {continue};

      const owner = BSprops[number]['Owner'];
      const bsID  = BSprops[number]['ID'];
      const bsname = BSprops[number]['Name'];

      formHTML += `
      <div>
        <input type="radio" name="bsOptions" owner="${owner}" bsID="${bsID}" bsname="${bsname}">
        <label for="${number}">${number} - ${bsname}</label>
      </div>`;
    }

    formHTML += '</form>';
    return formHTML
}

export function getWorksTable(htmlID) {
    const tables = document.querySelectorAll(`${htmlID} table`);
    let worksTableHTML = ''; // Инициализируем пустую строку для HTML

    tables.forEach((table) => {
        table.querySelectorAll("td").forEach((cell) => {
            if (cell.textContent.includes("Наименование работ") || cell.textContent.includes("Цена за единицу")) {
                worksTableHTML = table.outerHTML
            }
        });
    });

    return worksTableHTML
}
    
export function deleteTotal(htmlID){
    let workTable = document.querySelector(htmlID)

    for (let i = workTable.rows.length - 1; i >= 0; i--) {
        const row = workTable.rows[i];
        let hasMergedCells = false;
    
        for (const cell of row.cells) {
            if (cell.colSpan > 1) {
                hasMergedCells = true;
                break;
            }
        }
    
        if (hasMergedCells) {
            workTable.deleteRow(i);
            break;
        }
    }
    
    return workTable.outerHTML
}

export function remakeTable(htmlID) {
    let rows = document.querySelectorAll(htmlID);
    
    let resultTable = document.createElement("table");

    rows.forEach((row, rowN) => {
        let newRow = document.createElement("tr");

        Array.from(row.cells).forEach((cell, cellN) => {
            let newCell = document.createElement(rowN === 0 ? "th" : "td");
            newCell.textContent = cell.textContent.trim();
            newRow.appendChild(newCell);
        });

        resultTable.appendChild(newRow);
    });

    return resultTable.outerHTML
}

import { worksList } from './works'; // Убедитесь, что вы импортировали worksList

export function mergeWorkTypes(htmlID) {
    let resultTable = document.createElement("table");
    let rows = document.querySelectorAll(htmlID);

    rows.forEach((row, rowN) => {
        // Копируем исходные значения ячеек каждой строки в массив
        let rowValues = [];
        Array.from(row.cells).forEach((cell) => {
            let newCell = document.createElement(rowN === 0 ? "th" : "td");
            newCell.textContent = cell.textContent.trim();
            rowValues.push(newCell);            
        });

        // Добавляем заголовки таблицы только для первой строки (rowN === 0)
        if (rowN === 0) {
            const headers = ['ID (src)', 'WorkName (src)', 'UOM (src)', 'Price (src)', 'Owner (src)'];
            headers.forEach(headerText => {
                let th = document.createElement('th');
                th.textContent = headerText;
                rowValues.push(th); // Добавляем заголовки в массив значений строки
            });
            let newRow = document.createElement("tr");
            rowValues.forEach(val => newRow.appendChild(val));
            resultTable.appendChild(newRow);
        }


        if (rowN !== 0) {
            let srcIDArray = [];
            
            let workID = row.cells[0].textContent.match(/(\d+)/g);
            workID = workID.join('.');

            worksList.forEach(item => {
                let srcID = item['ID'].match(/(\d+)/g);
                if (srcID) {
                    srcID = srcID.join('.');
                    if (srcID === workID) {
                        srcIDArray.push(item);
                    }
                }
            });

            srcIDArray.forEach((item) => {
                let newRow = document.createElement("tr");
                
                // Клонируем каждую ячейку из rowValues и добавляем в newRow
                rowValues.forEach(val => {
                    let clonedCell = val.cloneNode(true);
                    newRow.appendChild(clonedCell);
                });
            
                // Создаем и добавляем ячейки для данных из srcIDArray
                let newCellID = document.createElement("td");
                let newCellWorkName = document.createElement("td");
                let newCellUOM = document.createElement("td");
                let newCellPrice = document.createElement("td");
                let newCellOwner = document.createElement("td");
            
                newCellID.textContent = item['ID'];
                newCellWorkName.textContent = item['Work'];
                newCellUOM.textContent = item['UOM'];
                newCellPrice.textContent = item['Price'];
                newCellOwner.textContent = item['Owner'];
            
                newRow.appendChild(newCellID);
                newRow.appendChild(newCellWorkName);
                newRow.appendChild(newCellUOM);
                newRow.appendChild(newCellPrice);
                newRow.appendChild(newCellOwner);
            
                resultTable.appendChild(newRow);
            });
        }
    });

    return resultTable.outerHTML; // Возвращаем HTML таблицы
}

export function addDeleteButton(htmlID) {
    let resultTable = document.createElement("table");
    let rows = document.querySelectorAll(htmlID);

    rows.forEach((row, rowN) => {
        let rowValues = [];
        Array.from(row.cells).forEach((cell) => {
            let newCell = document.createElement(rowN === 0 ? "th" : "td");
            newCell.textContent = cell.textContent.trim();
            rowValues.push(newCell);            
        });

        if (rowN === 0){
            let newRow = document.createElement("tr");

            let headerCell = document.createElement("th");
            headerCell.textContent = "Удалить строку";
            newRow.appendChild(headerCell);
            
            rowValues.forEach(val => newRow.appendChild(val));
            resultTable.appendChild(newRow);
        }

        if (rowN !== 0){
            let newRow = document.createElement("tr");

            let deleteCell = document.createElement("td");
            let deleteButton = document.createElement("button");
            deleteButton.textContent = "Удалить";
            deleteButton.classList.add("delete-button");
            
            deleteCell.appendChild(deleteButton);
            newRow.appendChild(deleteCell);

            rowValues.forEach(val => newRow.appendChild(val));
            resultTable.appendChild(newRow);
        }

    });
    return resultTable.outerHTML; // Возвращаем HTML таблицы
}

export function addEventListenersToDeleteButtons(tableSelector) {
    const table = document.querySelector(tableSelector);
    const deleteButtons = table.querySelectorAll(".delete-button");

    deleteButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            // Удаляем родительскую строку кнопки при нажатии
            event.target.closest("tr").remove();
        });
    });
}

export function getReport(bs, rawTableID){
    let resultTable = document.createElement('table');
    let rows = document.querySelectorAll(rawTableID);

    rows.forEach((row, rowN) => {
        let rowValues = [];
        Array.from(row.cells).forEach((cell) => {
            let newCell = document.createElement(rowN === 0 ? "th" : "td");
            newCell.textContent = cell.textContent.trim();
            rowValues.push(newCell);            
        });

        if (rowN === 0){
            let newRow = document.createElement("tr");

            let headers = ["№ пп", "Номер БС", "Название БС", "№ ТЦП", "Наименование работ", "фактическая дата выполнения работ", "Ед. изм.", 
                "Кол-во", "Цена за ед. (без НДС)", "Стоимость работ, Сум (без НДС)", "Стоимость работ, Сум (с НДС)"]
            headers.forEach(headerText => {
                let th = document.createElement('th');
                th.textContent = headerText;
                newRow.appendChild(th)
            });

            resultTable.appendChild(newRow);
        }

        if (rowN !==0){
            let newRow = document.createElement("tr");

            let td_N = document.createElement('td');
            td_N.textContent = 1;
            newRow.appendChild(td_N)

            let td_bsID = document.createElement('td');
            td_bsID.textContent = bs['ID'];
            newRow.appendChild(td_bsID)

            let td_bsNm = document.createElement('td');
            td_bsNm.textContent = bs['Name'];
            newRow.appendChild(td_bsNm)

            let td_wID = document.createElement('td');
            td_wID.textContent = rowValues[1].textContent;
            newRow.appendChild(td_wID)

            let td_wNm = document.createElement('td');
            td_wNm.textContent = rowValues[2].textContent;
            newRow.appendChild(td_wNm)

            let td_date = document.createElement('td');
            td_date.textContent = '';
            newRow.appendChild(td_date)

            let td_uom = document.createElement('td');
            td_uom.textContent = rowValues[3].textContent;
            newRow.appendChild(td_uom)

            let td_qty= document.createElement('td');
            td_qty.textContent = rowValues[4].textContent.replace(",", ".");
            newRow.appendChild(td_qty)

            let td_prc= document.createElement('td');
            td_prc.textContent = rowValues[10].textContent;
            newRow.appendChild(td_prc)

            let td_cst= document.createElement('td');
            td_cst.textContent =Number(rowValues[10].textContent)*Number(rowValues[4].textContent.replace(",", "."));
            newRow.appendChild(td_cst)

            let td_cstNDS= document.createElement('td');
            td_cstNDS.textContent = (Number(rowValues[10].textContent)*Number(rowValues[4].textContent.replace(",", "."))*1.12).toFixed(1);
            newRow.appendChild(td_cstNDS)


            resultTable.appendChild(newRow);
        }
    });
    return resultTable.outerHTML; // Возвращаем HTML таблицы
}