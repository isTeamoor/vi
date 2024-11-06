<template>
  <div>
    <div id="inputData">
      <input type="file" id="insertXlsx" @change="input" />
    </div>

    <div id="bsData">
      <h1>Определение номера и параметров БС:</h1>
      <div id="bsInfo"></div>
      <div id="bsForm"></div>
      <div>Выбранное значение: {{ site }}</div>
    </div>

    <div id="worksData">
      <h1>Определение номера и параметров Работ:</h1>
      <div id="rawTable"></div>
    </div>
   
    <div id="reportData">
      <h1>Сформировать отчёт</h1>
      <button @click="makeReport">Давай</button>
      <button @click="toExcel">Скачать таблицу</button>
      <div id="report"></div>
    </div>

  </div>
</template>

<script>
import { readXlsx } from '../JS/fileReader.js';
import { getBSrow,getWorksTable } from '@/JS/xlsx/srcTables.js';
import { bsDataExplorer } from '@/JS/bsData.js';
import { worksDataExplorer } from '@/JS/worksData.js';
import { getReport } from '../JS/report.js';
import { printReports } from '@/JS/reportWriter.js';

export default {
data(){
  return{
    rawData:'',
    bsData:'',
    worksData:'',
    site:{},
  }
},
methods: {
  async input(event){
    this.rawData = await readXlsx(event) //возвращает HTML загруженного документа
  },
  makeReport(){
    document.getElementById('report').innerHTML = getReport(this.site, '#worksData tr') //возвращает 2 tables
  },
  changeSite(val){
    this.site = val
  },
  toExcel(){
    printReports('#report');
  }
},
watch:{
  rawData(newVal){
    this.bsData = getBSrow(newVal);         //Возвращает tr
    this.worksData = getWorksTable(newVal); //возвращает table
  },
  bsData(newVal){
    let bsCalculations = bsDataExplorer(newVal, this.changeSite)
    document.querySelector('#bsInfo').textContent = bsCalculations['bsInfo'];
    document.querySelector('#bsForm').appendChild (bsCalculations['bsForm']); //div c формой
  },
  worksData(newVal){
    document.querySelector('#worksData').appendChild(worksDataExplorer(newVal)) //возвращает table
  }
}
};
</script>



<style >
#bsData, #worksData, #reportData, #showHTML {
  border: 2px solid black;
}

td, th {
  border: 2px solid black
}

.inputData{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
}

h1 {
  text-align: center;
}
#bsInfo{
  margin-bottom: 5px;
  font-weight: bold;
  text-align: center;
}
#bsForm {
  margin:20px 600px;
}
#reportData{
  text-align: center;
}
</style>
