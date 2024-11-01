import { siteList } from "./sites";
import { worksList } from './works';
const fileData = document.getElementById('output')


function getBSrow(){
    let rows = fileData.querySelectorAll('tr')
    let BSrow = null;
    rows.forEach((row) => {
        row.querySelectorAll("td").forEach((cell) => {
            if (cell.textContent.includes("Номер") && cell.textContent.includes("название БС")) {
                BSrow = row.cells[2];
            }
        });
    });
    return BSrow
}
export function getBSnumber(){
    let BSrow = getBSrow().textContent

    let matches = BSrow.match(/\d{3,}/g);
    let numbers = matches ? matches.map(Number) : [];

    let output = {'BSrow':BSrow};

    numbers.forEach(number => {
        let matchedSites = siteList.filter(item => item.ID === String(number));
    
        if (matchedSites.length > 0) {
            matchedSites.forEach(site => {
                output[site.ID] = site; // Добавляем объект в результат по его ID
            });
        }
    });
    return output
}
export function createBSform(BSdata){
    let formHTML = '<form id="bsForm">Выберите номер БС из строки';

    for (let number in BSdata){
      if (number == 'BSrow') {continue};

      const owner = BSdata[number]['Owner'];
      const bsID  = BSdata[number]['ID'];
      const bsname = BSdata[number]['Name'];

      formHTML += `
      <div>
        <input type="radio" name="bsOptions" owner="${owner}" bsID="${bsID}" bsname="${bsname}">
        <label for="${number}">${number} - ${bsname}</label>
      </div>`;
    }

    formHTML += '</form>';

    return formHTML
}
function getWorksTable() {
    let tables = fileData.querySelectorAll('table');
    let rawTable = null;

    tables.forEach((table) => {
        table.querySelectorAll("td").forEach((cell) => {
            if (cell.textContent.includes("Наименование работ") || cell.textContent.includes("Цена за единицу")) {
                rawTable = table
            }
        });
    });
    return rawTable
}
function isTotalRow(row){
    let flag = false
    for (const cell of row.cells) {
        if (cell.colSpan > 1 || cell.textContent.includes('Итого')) {
            flag = true;
        }
    }
    return flag
}
export function modTable() {
    let rawTable = getWorksTable()
    let resultTable = document.createElement('table')
    let rows = rawTable.querySelectorAll('tr')

    rows.forEach((row, rowN) => {

        //Проверка, если есть "Итого" или colspan, то удаляем эту строку
        if (isTotalRow(row)) return

        // Копируем исходные значения ячеек каждой строки в массив
        let rowValues = [];
        Array.from(row.cells).forEach((cell) => {
            let newCell = document.createElement(rowN === 0 ? "th" : "td");
            newCell.textContent = cell.textContent.trim();
            rowValues.push(newCell);            
        });

        // Добавляем заголовки таблицы только для первой строки
        if (rowN === 0) {
            const headers = ['ID (src)', 'WorkName (src)', 'UOM (src)', 'Price (src)', 'Owner (src)'];
            headers.forEach(headerText => {
                let th = document.createElement('th');
                th.textContent = headerText;
                rowValues.push(th);
            });
            let newRow = document.createElement("tr");
            rowValues.forEach(val => newRow.appendChild(val));
            resultTable.appendChild(newRow);
        }

        // Добавляем строки новой таблицы со значениями из старой
        if (rowN !== 0) {
            let matchedWorks = [];
            
            let workID = row.cells[0].textContent.match(/(\d+)/g);
            workID = workID.join('.');

            worksList.forEach(item => {
                let srcID = item['ID'].match(/(\d+)/g);
                srcID = srcID.join('.');
                if (srcID === workID) {
                    matchedWorks.push(item);
                }
            });

            matchedWorks.forEach((item) => {
                let newRow = document.createElement("tr");
                
                // Клонируем каждую ячейку из rowValues и добавляем в newRow
                rowValues.forEach(val => {
                    let clonedCell = val.cloneNode(true);
                    newRow.appendChild(clonedCell);
                });
            
                // Создаем и добавляем ячейки для данных из matchedWorks
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