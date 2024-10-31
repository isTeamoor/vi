import mammoth from 'mammoth';
//import * as XLSX from 'xlsx';


//Прочитать данные из .docx документа
export async function openWord(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
        reader.onload = async (e) => {
            const arrayBuffer = e.target.result;
            const { value: html } = await mammoth.convertToHtml({ arrayBuffer });
            resolve(html);  // Возвращаем HTML
        };

        reader.onerror = (error) => {
            reject(error);  // Обработка ошибки чтения файла
        };

        reader.readAsArrayBuffer(file);  // Чтение файла
    });
}

/*
// Прочитать данные из .xlsx файла и установить их в целевой узел в виде HTML
export async function openExcel(event, nodeID) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
        const arrayBuffer = e.target.result;
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });

        // Чтение первой страницы
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Преобразуем данные в формат JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Форматируем JSON как HTML-таблицу
        let html = "<table border='1'>";
        jsonData.forEach((row) => {
            html += "<tr>";
            row.forEach((cell) => {
                html += `<td>${cell || ''}</td>`;
            });
            html += "</tr>";
        });
        html += "</table>";

        // Устанавливаем сгенерированный HTML в целевой узел
        document.getElementById(nodeID).innerHTML = html;
    };

    reader.readAsArrayBuffer(file);
}
*/
