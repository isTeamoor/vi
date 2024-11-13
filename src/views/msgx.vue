<template>
  <div>
    <div id="inputData">
      <input type="text" id="insertText" @change="input" />
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
import { getBSrow,getWorksTable } from '@/JS/msgx/srcTables.js';
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
    input(event){
      this.rawData = event.target.value;
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
      this.bsData = getBSrow(newVal);       //возвращает tr
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
  #bsData, #worksData, #reportData {
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
  