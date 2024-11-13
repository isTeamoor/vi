export const bsRowCriteria = ['название бс', 'регион и адрес']

export const worksTableCriteria = [
    'общая стоимость','общая сумма',
    'цена за единицу','цена за ед',
    '№ пункта по тцп','пункт в тцп',]



export function getBSrow(rawData){//текст заходит
    let targetRow = document.createElement('tr');

    let numberCell = document.createElement('td');
    let nameCell = document.createElement('td');
    let bsInfoCell = document.createElement('td');

    numberCell.textContent = '1';
    nameCell.textContent = 'name';
    bsInfoCell.textContent = rawData;

    targetRow.appendChild(numberCell);
    targetRow.appendChild(nameCell);
    targetRow.appendChild(bsInfoCell);

    return targetRow
}
export function getWorksTable(rawData){//текст заходит
    let targetTable = document.createElement('table');

    let row = document.createElement('tr');
    

    let workID = document.createElement('td');
    let workName = document.createElement('td');
    let uom = document.createElement('td');
    let qty = document.createElement('td');
    let price = document.createElement('td');
    let cost = document.createElement('td');

    workID.textContent = '';
    workName.textContent = rawData;
    uom.textContent = '';
    qty.textContent = (rawData.match(/\[\[(.*?)\]\]/))[1];
    price.textContent = '';
    cost.textContent = '';

    row.appendChild(workID);
    row.appendChild(workName);
    row.appendChild(uom);
    row.appendChild(qty);
    row.appendChild(price);
    row.appendChild(cost);

    let headers = ['№ пункта по ТЦП', 'Наименование работ','Ед.изм','Кол-во','Цена за ед.','Общая стоимость',]
    let headerRow = document.createElement('tr')
    headers.forEach(text=>{
        let td = document.createElement('td');
        td.textContent = text;
        headerRow.appendChild(td);
    })

    targetTable.appendChild(headerRow);
    targetTable.appendChild(row);

    return targetTable
}