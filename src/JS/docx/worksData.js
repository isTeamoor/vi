import { worksList } from '../works';

export function worksDataExplorer(worksDataHTML){
    let tempDiv = document.createElement('div');
    tempDiv.innerHTML = worksDataHTML;

    let resultTable = document.createElement('table')

    Array.from(tempDiv.querySelectorAll('tr')).forEach((row, rowN)=>{
        
        //Проверка является ли строка итоговой, если да, то пропускаем ее
        if (isTotalRow(row)){return}

        // Копируем исходные значения ячеек каждой строки в массив
        let rowValues = [];
        Array.from(row.cells).forEach((cell) => {
            let newCell = document.createElement(rowN === 0 ? "th" : "td");
            newCell.textContent = cell.textContent.trim();
            rowValues.push(newCell);            
        });

        // Добавляем заголовки таблицы
        if (rowN === 0) {
            let newRow = document.createElement("tr");

            let deleteHeader = document.createElement("th");
            deleteHeader.textContent = "Удалить строку";
            newRow.appendChild(deleteHeader);

            const headers = ['ID (src)', 'WorkName (src)', 'UOM (src)', 'Price (src)', 'Owner (src)'];
            headers.forEach(headerText => {
                let th = document.createElement('th');
                th.textContent = headerText;
                rowValues.push(th);
            });
            
            rowValues.forEach(val => newRow.appendChild(val));
            resultTable.appendChild(newRow);
        }

        // Добавляем строки новой таблицы со значениями из старой
        if (rowN !== 0) {
            let matchedWorks = searchWorks(row);
            
            matchedWorks.forEach((item) => {
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
function isTotalRow(row){
    let flag = false

    Array.from(row.cells).forEach(cell=>{
        if (cell.colSpan > 1 || cell.textContent.toLowerCase().includes('итого')) {
            flag = true;
        }
    })

    return flag
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