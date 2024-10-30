<template>
    <div>
      <input type="file" id="docxFileInput" @change="handleFileSelect" />
      <div id="BSnumber"></div>
      <div id="output"></div>
    </div>
</template>
  
<script>
import mammoth from 'mammoth';

export default {
    methods: {
        async handleFileSelect(event) {
            const file = event.target.files[0];
            const reader = new FileReader();

            reader.onload = async (e) => {
                const arrayBuffer = e.target.result;
                const { value: html } = await mammoth.convertToHtml({ arrayBuffer });
                document.getElementById('output').innerHTML = html;

                // Ищем целевую строку после вставки HTML
                const rows = document.querySelectorAll("#output tr");
                let targetRow = null;

                rows.forEach((row) => {
                    row.querySelectorAll("td p").forEach((cell) => {
                        if (cell.textContent.includes("Номер") && cell.textContent.includes("название БС")) {
                            targetRow = row;
                        }
                    });
                });

                // Проверяем результат
                if (targetRow) {
                    const thirdTd = targetRow.querySelectorAll("td")[2]; // Получаем третий <td>
                    const value = thirdTd ? thirdTd.textContent.trim() : null; // Извлекаем текст и удаляем лишние пробелы

                    document.querySelector('#BSnumber').textContent=value
                } else {
                    console.log("Целевая строка не найдена.");
                }
            };

            reader.readAsArrayBuffer(file);
        },
    },
};
</script>
  
  <style >
  table td {
    border: 2px solid black
  }
  </style>
  