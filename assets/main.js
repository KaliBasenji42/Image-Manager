// Variables and Constants

let allSet = {}; // Tags for all files

let outputSet = new Set; // Search output

let files = []; // Files in folder
let currentFile = -1; // Index of files in folder

// Functions

function strToArray(str, div = ' ') { // Str --> Array
  
  const out = [];
  
  let val = '';
  
  str = str + div;
  
  for(let i = 0; i < str.length; i++) {
    
    if(str.slice(i-div.length,i) == div) {
      
      val = val.slice(0,-div.length);
      
      out.push(val);
      
      val = '';
      
    }
    
    val = val + str[i];
    
  }

  val = val.slice(0,-div.length);
  
  out.push(val);
  
  return out;
  
}

function strToInt(str) { // Str --> Int
  
  let numChars = '1234567890';
  
  let out = '0';
  
  for(let i = 0; i < str.length; i++) {
    
    for(let iChar = 0; iChar < numChars.length; iChar++) {
      
      if(str[i] == numChars[iChar]) out = out + str[i];
      
    }
    
  }
  
  return parseInt(out);
  
}

function hasAnyTags(obj, tags) { // True if any tag matches (for search)
  
  for(const tag of tags) {
    
    if(tag == 'any:') return true;
    
    for(const objTag of obj.tags) {
      
      if(objTag == tag) return true;
      
    }
    
  }
  
  return false;
  
}

function hasAllTags(obj, tags) { // True if all tags match (for search)
  
  for(const tag of tags) {
    
    if(tag == 'any:') return true;
    
    let match = false;
    
    for(const objTag of obj.tags) {
      
      if(objTag == tag) match = true;
      
    }
    
    if(!match) return false;
    
  }
  
  return true;
  
}

function numForm(num) { // Add commas to numbers
  
  let numStr = '' + num;
  let out = '';
  
  for(let i = 0; i < numStr.length; i++) {
    
    pos = numStr.length - i - 1;
    add = i % 3 == 0 && i != 0;
    
    if(add) out = ',' + out;
    
    out = numStr[pos] + out;
    
  }
  
  return out;
  
}

function getUsage() { // Get localStorage usage
  
  let usage = 0;
  
  for(let key in localStorage) {
    if(localStorage.hasOwnProperty(key)) {
      item = localStorage.getItem(key);
      
      usage += item.length;
    }
  }
  
  return usage;
  
}

function outUsage() { // Output localStorage usage
  
  // Variables
  
  let storageUsage = document.getElementById('storageUsage');
  
  let quota = 5 * 1024 * 1024;
  let usage = getUsage();
  
  // Text
  
  frac = usage/quota;
  percent = frac * 100;
  
  storageUsage.innerHTML = 'localStorage: ' + numForm(usage) + 
                           ' Bytes / ' + numForm(quota) + 
                           ' Bytes (' + Math.floor(percent) + '%)';
  
}

// Button Functions

function outPathList() { // Create a list, showing files (allows for selection)
  
  let list = document.getElementById('pathList');
  
  list.innerHTML = '';
  
  for(let i = 0; i < files.length; i++) {
    
    // Variables
    
    file = files[i];
    
    let li = document.createElement('li');
    li.style.whiteSpace = 'nowrap';
    
    // li
    
    li.innerHTML = '<button onclick="pathEdit(' + i + ')">Edit</button>' + 
                   '<span style="margin-left: 0.5em;"> ' + file.path + '</span>';
    
    list.appendChild(li);
    
  }
  
}

function pathEdit(fileI) { // Select image for editing
  
  // Elems
  
  let pathOutPos = document.getElementById('pathOutPos');
  
  let editSrc = document.getElementById('editSrc');
  let editDate = document.getElementById('editDate');
  
  // Variables
  
  if(fileI < 0) fileI = 0;
  if(fileI >= files.length) fileI = files.length - 1;
  
  currentFile = fileI;
  
  // Set
  
  setDisplay(files[fileI].path, 'pathDisplay');
  pathOutPos.innerText = '' + (currentFile + 1) + 
                         '. ' + files[fileI].path;
  
  editSrc.value = files[fileI].path;
  editDate.value = files[fileI].date;
                         
}

function save() { // Save allSet to localStorage
  
  saveOut = document.getElementById('saveOut');
  saveOut.innerHTML = '🔄 Processing';
  saveOut.start = Date.now();
  
  localStorage.clear();
  
  console.log('Saving:');
  
  let allSetStr = JSON.stringify(allSet);
  
  localStorage.setItem('allSet', allSetStr);
  
  console.log(allSetStr);
  
  outUsage();
  
  saveOut.innerHTML = '✅ Saved in ' + (Date.now() - saveOut.start) + 'ms';
  
}

function load() { // Load allSet from localStorage
  
  saveOut = document.getElementById('saveOut');
  saveOut.innerHTML = '🔄 Processing';
  saveOut.start = Date.now();
  
  allSet = JSON.parse(localStorage.getItem('allSet'));
  
  console.log('allSet:');
  console.log(allSet);
  
  saveOut.innerHTML = '✅ Loaded in ' + (Date.now() - saveOut.start) + 'ms';
  
}

function download() { // For downloading allSet
  
  
  
}

function outSrchList() { // Output search list
  
  if(outputSet.size > 100) {
    
    if(confirm('Over 100 results, are you sure you want to display?'));
    
    else return;
    
  }
  
  let list = document.getElementById('srchList');
  
  list.innerHTML = '';
  
  outputSet.forEach(function(item) {
    
    // Variables
    
    let li = document.createElement('li');
    li.style.whiteSpace = 'nowrap';
    
    // li
    
    li.innerHTML = '<button onclick="setDisplay(\'' + item.src + '\', \'srchDisplay\');">Display</button>' + 
                   '<br>' + item.src + 
                   '<br>Page: <a href="' + item.page + '" target="_blank">' + item.page + '</a>' + 
                   '<br>Date: ' + item.date + 
                   '<br>Tags: ';
    
    for(tag of item.tags) {
      
      li.innerHTML += tag + ', ';
      
    }
    
    list.appendChild(li);
    
  });
  
}

function clrList(id) { // Clear HTML list
  
  let list = document.getElementById(id);
  
  list.innerHTML = '';
  
}

function setDisplay(src, id) { // Set the .src property of an elem.
  
  let display = document.getElementById(id);
  
  display.src = src;
  
}

// Events

document.addEventListener('DOMContentLoaded', function() {
  
  // Elems
  
  let fileForm = document.getElementById('fileForm');
  let fileOut = document.getElementById('fileOut');
  
  let pathForm = document.getElementById('pathForm');
  let pathOut = document.getElementById('pathOut');
  
  let editAdd = document.getElementById('editAdd');
  let editOvr = document.getElementById('editOvr');
  let editRmv = document.getElementById('editRmv');
  let editOut = document.getElementById('editOut');
  
  let searchForm = document.getElementById('searchForm');
  let resultsQuant = document.getElementById('resultsQuant');
  
  // Storage
  
  outUsage();
  
  // :P
  
  loadSpin();
  
  // Forms
  
  fileForm.addEventListener('submit', function(event) { // For JSON
    
    event.preventDefault();
    
    // Variables and Constants
    
    let file = document.getElementById('fileInp').files[0];
    
    // Read File
    
    if(file) {
      
      if(file.type == 'application/json') {
        
        fileOut.innerHTML = '🔄 Processing';
        fileOut.start = Date.now();
        
        const reader = new FileReader();
        
        reader.onload = function(event) {
          
          const json = event.target.result;
          
          try {
            
            const index = JSON.parse(json);
            
            allSet = index;
            
            console.log('allSet:');
            console.log(allSet);
            
            fileOut.innerHTML = '✅ Time: ' + (Date.now() - fileOut.start) + 'ms';
            
          }
          
          catch(error) {
            
            fileOut.innerHTML = '⚠️ Processing Error';
            
            console.log('Processing Error:');
            console.log(error);
            
          }
          
        }
        
        reader.readAsText(file);
        
      }
      
      else fileOut.innerText = '⚠️ Wrong Type';
      
    }
    
    else fileOut.innerText = '❌ No File';
    
  });
  
  pathForm.addEventListener('submit', function(event) { // For image folder
    
    event.preventDefault();
    
    try {
      
      let folder = document.getElementById('folderInp').files;
      console.log(folder);
      
      pathOut.innerHTML = '🔄 Processing';
      pathOut.start = Date.now();
      
      files = [];
      
      for (let rawFile of folder) {
        
        let date = new Date(rawFile.lastModified);
        
        let year = '' + date.getFullYear();
        let month = '' + (date.getMonth() + 1);
        if(month.length < 2) month = '0' + month;
        let day = '' + date.getDate();
        if(day.length < 2) day = '0' + day;
        
        let dateStr = year + '-' + month + '-' + day;
        
        let file = {
          'path': rawFile.webkitRelativePath,
          'date': dateStr
        };
        
        files.push(file);
        
      }
      
      files.sort();
      
      console.log('Files:');
      console.log(files);
      
      outPathList();
      
      pathOut.innerHTML = '✅ Time: ' + (Date.now() - pathOut.start) + 'ms';
      
    }
    
    catch(error) {
      
      pathOut.innerHTML = '⚠️ Processing Error';
      if(error.name == 'AbortError') pathOut.innerHTML = '❌ Aborted'
      
      console.log('Processing Error:');
      console.log(error);
      
    }
    
  });
  
  editAdd.addEventListener('click', function() {
    
    try {
      
      editOut.innerHTML = '🔄 Adding';
      editOut.start = Date.now();
      
      let src = document.getElementById('editSrc').value;
      
      Object.keys(allSet).forEach(function(key) { // Throw with 'dup' error
        if(key == src) throw new Error('dup');
      });
      
      let obj = {
        page: document.getElementById('editPage').value,
        date: document.getElementById('editDate').value,
        tags: document.getElementById('editTags').value.split(' ')
      };
      
      allSet[src] = obj;
      
      editOut.innerHTML = '✅ Added in ' + (Date.now() - editOut.start) + 'ms';
      
      console.log('Added:');
      console.log(obj);
      
    }
    
    catch(error) {
      
      editOut.innerHTML = '⚠️ Error Adding';
      if(error.message == 'dup') editOut.innerHTML = '⚠️ Already in Set'
      
      console.log('Adding Error:');
      console.log(error);
      
    }
    
  });
  
  editOvr.addEventListener('click', function() {
    
    try {
      
      editOut.innerHTML = '🔄 Overwriting';
      editOut.start = Date.now();
      
      let src = document.getElementById('editSrc').value;
      
      let match = false;
      
      Object.keys(allSet).forEach(function(key) { // Match
        if(key == src) match = true;
      });
      
      if(!match) throw new Error('!mtch') // Throw with '!mtch' error
      
      let obj = {
        page: document.getElementById('editPage').value,
        date: document.getElementById('editDate').value,
        tags: document.getElementById('editTags').value.split(' ')
      };
      
      allSet[src] = obj;
      
      editOut.innerHTML = '✅ Overwritten in ' + (Date.now() - editOut.start) + 'ms';
      
      console.log('Overwritten:');
      console.log(obj);
      
    }
    
    catch(error) {
      
      editOut.innerHTML = '⚠️ Error Overwriting';
      if(error.message == '!mtch') editOut.innerHTML = '⚠️ Not in Set'
      
      console.log('Overwriting Error:');
      console.log(error);
      
    }
    
  });
  
  searchForm.addEventListener('submit', function(event) {
    
    event.preventDefault();
    
    // Variables and Constants
    
    let beforeChecked = document.getElementById('beforeCheck').checked;
    let afterChecked = document.getElementById('afterCheck').checked;
    let beforeDate = strToInt(document.getElementById('beforeInp').value);
    let afterDate = strToInt(document.getElementById('afterInp').value);
    
    let incRadio = document.getElementById('inc');
    let excRadio = document.getElementById('exc');
    let fltRadio = document.getElementById('flt');
    
    let tags = strToArray(document.getElementById('tagsSearch').value);
    
    let searchOut = document.getElementById('searchOut');
    
    let resultsQuant = document.getElementById('resultsQuant');
    
    searchOut.innerHTML = '🔄 Searching';
    searchOut.start = Date.now();
    
    // inc
    
    if(incRadio.checked) {
      
      try {
        
        Object.keys(allSet).forEach(function(key) {
          
          let obj = allSet[key];
          obj.src = key;
          
          let objDate = strToInt(obj.date);
          
          let withinDate = (!beforeChecked || (beforeDate > objDate)) && (!afterChecked || (afterDate < objDate))
          
          if(hasAnyTags(obj, tags) && withinDate) outputSet.add(obj);
          
        });
        
        searchOut.innerHTML = '✅ Time: ' + (Date.now() - searchOut.start) + 'ms';
        
      }
      
      catch(error) {
        
        searchOut.innerHTML = '⚠️ Search Error';
        
        console.log('Search Error (inc):');
        console.log(error);
        
      }
      
    }
    
    // exc
    
    if(excRadio.checked) {
      
      try {
        
        Object.keys(allSet).forEach(function(key) {
          
          let obj = allSet[key];
          obj.src = key;
          
          let objDate = strToInt(obj.date);
          
          let withinDate = (beforeChecked && (beforeDate > objDate)) || (afterChecked && (afterDate < objDate));
          
          console.log('withinDate: ' + withinDate);
          
          if(hasAnyTags(obj, tags) || withinDate) outputSet.delete(obj);
          
        });
        
        searchOut.innerHTML = '✅ Time: ' + (Date.now() - searchOut.start) + 'ms';
        
      }
      
      catch(error) {
        
        searchOut.innerHTML = '⚠️ Search Error';
        
        console.log('Search Error (exc):');
        console.log(error);
        
      }
      
    }
    
    // flt
     
    if(fltRadio.checked) {
      
      try {
        
        Object.keys(allSet).forEach(function(key) {
          
          let obj = allSet[key];
          obj.src = key;
          
          let objDate = strToInt(obj.date);
          
          let withinDate = (!beforeChecked || (beforeDate > objDate)) && (!afterChecked || (afterDate < objDate))
          
          console.log('withinDate: ' + withinDate);
          
          if(!hasAllTags(obj, tags) || !withinDate) outputSet.delete(obj);
          
        });
        
        searchOut.innerHTML = '✅ Time: ' + (Date.now() - searchOut.start) + 'ms';
        
      }
      
      catch(error) {
        
        searchOut.innerHTML = '⚠️ Search Error';
        
        console.log('Search Error (flt):');
        console.log(error);
        
      }
      
    }
    
    // Output
    
    console.log('outputSet:');
    console.log(outputSet)
    
    resultsQuant.innerText = 'Results: ' + outputSet.size;
    
  });
  
});

// :P

document.addEventListener('keypress', function() {
  let key = event.keyCode || event.charCode;
  if(key == 33) window.alert('Hello!');
});

let elems = [];
let rotate = 0;
let run = true;
let trigger = '@';

function loadSpin(){
  elems = document.getElementsByTagName('*');
}

function spin() {
  rotate += 180;
  
  for(let i = 0; i < elems.length; i ++) elems[i].style.rotate = '' + rotate + 'deg';
}

document.addEventListener('keypress', function() {
    if(event.key == trigger && run) {
        run = false;
        spin();
        window.setTimeout(spin, 5 * 1000);
        window.setTimeout(function runTrue(){
            run = true;
        }, 5 * 1000 * 2);
    }
});
