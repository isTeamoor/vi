import { worksList } from './works';

export function worksDataExplorer(rawTable){
    let resultTable = document.createElement('table') 

    
    let rows = Array.from(rawTable.querySelectorAll('tr'))

    rows = rows.filter(row => !isEmpty(row))   //Удалить все полностью пустые ячейки
    rows = rows.filter(row => !isTotalRow(row))//Удалить итоговые строки



    rows.forEach((row, rowN)=>{

        // Добавляем заголовки таблицы
        if (rowN === 0) {
            let newRow = document.createElement("tr");

            let deleteHeader = document.createElement("th");
            deleteHeader.textContent = "Удалить строку";
            newRow.appendChild(deleteHeader);

            const headers = ['№ пункта по ТЦП', 'Наименование работ','Ед.изм','Кол-во','Цена за ед.',
                'Общая стоимость','ID (src)','WorkName (src)', 'UOM (src)', 'Price (src)', 'Owner (src)'];
            headers.forEach(headerText => {
                let th = document.createElement('th');
                th.textContent = headerText;
                newRow.appendChild(th)
            });

            resultTable.appendChild(newRow);
        }

        // Добавляем строки новой таблицы со значениями из старой
        if (rowN !== 0) {

            //Проверки и корректировки строк
            let checkedRow = hasWrongID(row);

            // Копируем исходные значения ячеек каждой строки в массив
            let rowValues = [];
            Array.from(checkedRow.cells).forEach( cell => {
                let newCell = document.createElement("td");
                newCell.textContent = cell.textContent.trim();
                rowValues.push(newCell);            
            });

            //Поиск в справочнике работ с аналогичным номером
            let matchedWorks = searchWorks(checkedRow);
            
            matchedWorks.forEach( item => {
                let newRow = document.createElement("tr");

                //Добавляем кнопку "удалить строку"
                let deleteCell = createDeleteCell();
                newRow.appendChild(deleteCell);
                
                // Клонируем каждую ячейку из rowValues и добавляем в newRow
                rowValues.forEach(val => {
                    let clonedCell = val.cloneNode(true);
                    newRow.appendChild(clonedCell);
                });
            
                // Создаем и добавляем ячейки для данных из matchedWorks
                WorksListValues(item).forEach(newCell => {
                    newRow.appendChild(newCell)
                })
            
                resultTable.appendChild(newRow);
            });
        }

    })
    //Добавляем event Listener на кнопки "удалить строку"
    deleteEventlistener(resultTable);
    
    return resultTable;
}
function isEmpty(row){
    let flag = true;
    Array.from(row.cells).forEach(cell=>{
        if (/[^\s]/.test(cell.textContent.trim())){
            flag = false
        }
    })
    return flag
}
function isTotalRow(row){
    let flag = false
    Array.from(row.cells).forEach(cell=>{
        if (cell.textContent.toLowerCase().includes('итого')) {
            flag = true;
        }
    })
    return flag
}
function hasWrongID(row) {
    let modRow = document.createElement('tr');

    // Если в первой ячейке есть какой то текст, то возвращаем оригинальную строку
    if (/[^\s]/.test(row.cells[0].textContent.trim())) {
        return row; 
    }


    // Используем регулярное выражение для извлечения ID и оставшегося текста
    let insideWorkIDMatch = row.cells[1].textContent.match(/^(\d+(\.\d+)*)(?=\D|$)/);

    
    // Проверяем, нашли ли мы совпадение
    if (insideWorkIDMatch) {
        let insideWorkID = insideWorkIDMatch[0];
        let remainingText = row.cells[1].textContent.replace(insideWorkID, '').trim(); // Удаляем ID из текста


        let ID = document.createElement('td');
        ID.textContent = insideWorkID;
        modRow.appendChild(ID);


        let WorkName = document.createElement('td');
        WorkName.textContent = remainingText;
        modRow.appendChild(WorkName);

        // Копируем остальные ячейки из оригинального ряда
        for (let i = 2; i < row.cells.length; i++) {
            let td = document.createElement('td');
            td.textContent = row.cells[i].textContent;
            modRow.appendChild(td);
        }
        return modRow; // Возвращаем модифицированную строку
    }
    return row; // Возвращаем оригинальный ряд, если ID не найден
}
function searchWorks(row){
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
    
    return matchedWorks
}
function createDeleteCell(){
    let deleteCell = document.createElement("td");
    let deleteButton = document.createElement("button");

    deleteButton.textContent = "Удалить";
    deleteButton.classList.add("delete-button");
    
    deleteCell.appendChild(deleteButton);

    return deleteCell
}
function WorksListValues(work){
    let ID = document.createElement("td");
    ID.textContent = work['ID'];

    let Name = document.createElement("td");
    Name.textContent = work['Work'];

    let UOM = document.createElement("td");
    UOM.textContent = work['UOM'];

    let Price = document.createElement("td");
    Price.textContent = work['Price'];

    let Owner = document.createElement("td");
    Owner.textContent = work['Owner'];

    return [ID,Name,UOM,Price,Owner]
}
function deleteEventlistener(table){
    table.addEventListener("click", (event) => {
        if (event.target.classList.contains("delete-button")) {
            event.target.closest("tr").remove();
        }
    });
}



