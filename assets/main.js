// Variables and Constants

const allSet = new Set();

const outputSet = new Set();

let files = [];
let currentFile = -1;

// Functions

function strToArray(str, div = ' ') {
  
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

function strToInt(str) {
  
  let numChars = '1234567890';
  
  let out = '0';
  
  for(let i = 0; i < str.length; i++) {
    
    for(let iChar = 0; iChar < numChars.length; iChar++) {
      
      if(str[i] == numChars[iChar]) out = out + str[i];
      
    }
    
  }
  
  return parseInt(out);
  
}

function hasAnyTags(obj, tags) {
  
  for(const tag of tags) {
    
    if(tag == 'any:') return true;
    
    for(const objTag of obj.tags) {
      
      if(objTag == tag) return true;
      
    }
    
  }
  
  return false;
  
}

function hasAllTags(obj, tags) {
  
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

function numForm(num) {
  
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

function getUsage() {
  
  let usage = 0;
  
  for(let key in localStorage) {
    if(localStorage.hasOwnProperty(key)) {
      item = localStorage.getItem(key);
      
      usage += item.length;
    }
  }
  
  return usage;
  
}

function outUsage() {
  
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

function outPathList() {
  
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

function pathEdit(fileI) {
  
  // Elems
  
  let pathOutPos = document.getElementById('pathOutPos');
  
  let editSrc = document.getElementById('editSrc');
  let editDate = document.getElementById('editDate');
  
  // Variables
  
  if(fileI < 0) fileI = 0;
  if(fileI >= files.length) fileI = files.length - 1;
  
  currentFile = fileI;
  
  // Set
  
  setDisplay('imgs/' + files[fileI].path, 'pathDisplay');
  pathOutPos.innerText = '' + (currentFile + 1) + 
                         '. ' + files[fileI].path;
  
  editSrc.value = files[fileI].path;
  editDate.value = files[fileI].date;
                         
}

function save() {
  
  saveOut = document.getElementById('saveOut');
  saveOut.innerHTML = '🔄 Processing';
  saveOut.start = Date.now();
  
  localStorage.clear();
  
  let i = 0;
  
  console.log('Saving:');
  
  for(let item of allSet) {
    
    localStorage.setItem('allSet' + i, JSON.stringify(item));
    console.log('allSet' + i + ': ' + JSON.stringify(item));
    
    i++;
    
  }
  
  localStorage.setItem('allSetLen', i);
  
  outUsage();
  
  saveOut.innerHTML = '✅ Saved in ' + (Date.now() - saveOut.start) + 'ms';
  
}

function load() {
  
  saveOut = document.getElementById('saveOut');
  saveOut.innerHTML = '🔄 Processing';
  saveOut.start = Date.now();
  
  allSet.clear()
  
  let length = parseInt(localStorage.getItem('allSetLen'));
  
  for(let i = 0; i < length; i++) {
    
    let = key = 'allSet' + i;
    
    item = JSON.parse(localStorage.getItem(key));
    allSet.add(item);
    
  }
  
  console.log('allSet:');
  console.log(allSet);
  
  saveOut.innerHTML = '✅ Loaded in ' + (Date.now() - saveOut.start) + 'ms';
  
}

function outSrchList() {
  
  if(outputSet.size > 100) {
    
    if(confirm('Over 100 results, are you sure you want to display?'));
    
    else return;
    
  }
  
  let list = document.getElementById('srchList');
  
  list.innerHTML = '';
  
  outputSet.forEach(function (obj) {
    
    // Variables
    
    let li = document.createElement('li');
    li.style.whiteSpace = 'nowrap';
    
    // li
    
    let src = obj.src;
    
    for(tag of obj.tags) {
      if(tag == 'src:web') break;
      if(tag == 'src:path') src = 'imgs/' + src; break;
    }
    
    li.innerHTML = '<button onclick="setDisplay(\'' + src + '\', \'srchDisplay\');">Display</button>' + 
                   '<br>' + obj.src + 
                   '<br>Page: <a href="' + obj.page + '" target="_blank">' + obj.page + '</a>' + 
                   '<br>Date: ' + obj.date + 
                   '<br>Tags: ';
    
    for(tag of obj.tags) {
      
      li.innerHTML += tag + ', ';
      
    }
    
    list.appendChild(li);
    
  });
  
}

function clrList(id) {
  
  let list = document.getElementById(id);
  
  list.innerHTML = '';
  
}

function setDisplay(src, id) {
  
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
  
  let searchForm = document.getElementById('searchForm');
  let resultsQuant = document.getElementById('resultsQuant');
  
  // Storage
  
  outUsage();
  
  // :P
  
  loadSpin();
  
  // Forms
  
  fileForm.addEventListener('submit', function(event) {
    
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
            
            console.log('index:');
            console.log(index);
            
            allSet.clear();
            
            for(const obj of index) {
              
              allSet.add(obj);
              
            }
            
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
  
  pathForm.addEventListener('submit', function(event) {
    event.preventDefault();
  });
  
  pathForm.addEventListener('submit', async () => {
    
    let sub = document.getElementById('pathSub').value;
    
    try {
      
      const folder = await window.showDirectoryPicker();
      
      pathOut.innerHTML = '🔄 Processing';
      pathOut.start = Date.now();
      
      files = [];
      
      for await (const entry of folder.values()) {
        
        if(entry.kind != 'file') continue;
        
        let fileHandle = await entry.getFile();
        
        let date = new Date(fileHandle.lastModified);
        
        let year = '' + date.getFullYear();
        let month = '' + (date.getMonth() + 1);
        if(month.length < 2) month = '0' + month;
        let day = '' + date.getDate();
        if(day.length < 2) day = '0' + day;
        
        let dateStr = year + '-' + month + '-' + day;
        
        let file = {
          'path': sub + entry.name,
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
        
        allSet.forEach(function (obj) {
          
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
        
        outputSet.forEach(function (obj) {
          
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
        
        outputSet.forEach(function (obj) {
          
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
