const fs = require('fs');
const path = require('path');

const fileReg = /\.(vue|js|ts)$/;

function fileDisplay(filePath){
  let stats = fs.statSync(filePath)
  let isFile = stats.isFile();//是文件
  let isDir = stats.isDirectory();//是文件夹
  if(isFile){
    let content = fs.readFileSync(filePath, 'utf-8');
    fixer(filePath, content)
    return
  }
  let files = fs.readdirSync(filePath);
  for(let filename of files){
    let filedir = path.join(filePath, filename);
    fileDisplay(filedir);
  }
}

function fixer(filePath, file) {
  const isSureFile = fileReg.test(filePath);
  if(!isSureFile) {
    return
  }
  let newFile = file;
  if(/\.(vue)/.test(filePath)) {
    newFile = vueFileFix(file)
  } else {
    newFile = '/* eslint-disable */\n' + file;
  }
  fs.writeFileSync(filePath, newFile);
}

function vueFileFix(file) {
  let newFile = file;
  const templeteReg = /<template>/g;
  const scriptReg = /<script(.*)>/g; 
  let res_template = templeteReg.exec(newFile);
  if(res_template && templeteReg.lastIndex > 0) {
    newFile = newFile.slice(0, templeteReg.lastIndex) + '\n  <!-- eslint-disable -->' + newFile.slice(templeteReg.lastIndex)
  }
  let res_script = scriptReg.exec(newFile);
  if(res_template && scriptReg.lastIndex > 0) {
    newFile = newFile.slice(0, scriptReg.lastIndex) + '\n/* eslint-disable */' + newFile.slice(scriptReg.lastIndex)
    // console.log('22222222222222222222222222222222222222222222')
    // console.log(scriptReg.lastIndex, newFile)
    // console.log('22222222222222222222222222222222222222222222')
  }
  return newFile
}

let fixPath = 'C:/Users/Administrator/Desktop/project/ZZAniqueTool/ZZAntiqueTool/src'

async function main(){
  // var _promptOption = [{
  //   name: 'filePath',
  //   type: 'input',
  //   message: '请输入需要修复的文件夹地址，绝对路径'
  // }]

  // let file = await prompt(_promptOption);

  // if(file.filePath && path.resolve(file.filePath)){
    fileDisplay(fixPath);
  // }
}
main();