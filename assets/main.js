// Variables and Constants

let allSet = {}; // Tags for all files

let outputSet = new Set; // Search output

let files = []; // Files in folder
let currentPathPos = -1; // Index of files in folder for edit
let currentSrchPos = -1; // Index of output for search

let imgPath = ''; // Image path for Quick Tag Editing

let fullScreenIDs = [
  'pathImgFull',
  'srchImgFull',
];

let wildcard = '*'; // Character used for wildcard search

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
      
      // Wildcard
      
      if(wildcard != '') {
        
        let wcStart = tag.startsWith(wildcard);
        let wcEnd = tag.endsWith(wildcard);
        
        let cleanTag = tag.replaceAll(wildcard, '');
        
        if(wcStart && wcEnd && objTag.includes(cleanTag)) return true;
        else if(wcStart && objTag.endsWith(cleanTag)) return true;
        else if(wcEnd && objTag.startsWith(cleanTag)) return true; 
        
      }
      
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
      
      // Wildcard
      
      if(wildcard != '') {
        
        let wcStart = tag.startsWith(wildcard);
        let wcEnd = tag.endsWith(wildcard);
        
        let cleanTag = tag.replaceAll(wildcard, '');
        
        if(wcStart && wcEnd && objTag.includes(cleanTag)) match = true;
        else if(wcStart && objTag.endsWith(cleanTag)) match = true;
        else if(wcEnd && objTag.startsWith(cleanTag)) match = true; 
        
      }
      
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
  
  for(const key in localStorage) {
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
  
  let frac = usage/quota;
  let percent = frac * 100;
  
  storageUsage.innerHTML = 'localStorage: ' + numForm(usage) + 
                           ' Bytes / ' + numForm(quota) + 
                           ' Bytes (' +(Math.floor(percent * 1000) / 1000) + '%)';
  
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
    
    li.innerHTML = '<button onclick="setImagePath(' + i + ')">Edit</button>' + 
                   '<span style="margin-left: 0.5em;"> ' + file.path + '</span>';
    
    list.appendChild(li);
    
  }
  
}

function setImagePath(pos, last = false) { // Select image for editing
  
  if(files.length == 0) return; // Do nothing if there is nothing
  
  // Elems
  
  let outPos = document.getElementById('pathOutPos');
  let editOut = document.getElementById('editOut');
  
  let editSrc = document.getElementById('editSrc');
  let editPage = document.getElementById('editPage');
  let editDate = document.getElementById('editDate');
  let editTags = document.getElementById('editTags');
  
  // Variables
  
  if(last) pos = files.length;
  
  if(pos < 0) pos = 0;
  if(pos >= files.length) pos = files.length - 1;
  
  currentPathPos = pos;
  
  // Fullscreen If
  
  if(document.getElementById('pathImgFull').style.display == 'block') {
    setDisplay(files[pos].path, 'pathDisplayFull');
    setDisplay('', 'pathDisplay');
  }
  else {
    setDisplay(files[pos].path, 'pathDisplay');
    setDisplay('', 'pathDisplayFull');
  }
  
  // Set
  
  outPos.innerText = '' + (pos + 1) + 
                     '. ' + files[pos].path;
  
  editSrc.value = files[pos].path;
  if(files[pos].date != '') editDate.value = files[pos].date;
  
  // Reset Edit Form Out
  
  editOut.innerHTML = "... Awaiting Input";
  
  // Set values from allSet if listed
  
  if(allSet[files[pos].path]) {
    
    let item = allSet[files[pos].path];
    
    editPage.value = item.page;
    editDate.value = item.date;
    
    // Tag str
    
    let tagStr = '';
    
    for(const tag of item.tags) {
      tagStr = tagStr + tag + ' ';
    }
    
    editTags.value = tagStr;
    
  }
  
}

function setImageSrch(pos, last = false) { // Select image for search
  
  if(outputSet.size == 0) return; // Do nothing if there is nothing
  
  // Elems
  
  let outPos = document.getElementById('srchOutPos');
  let outInfo = document.getElementById('srchOutInfo');
  
  // Variables
  
  let outputArr = Array.from(outputSet);
  
  if(last) pos = outputArr.length;
  
  if(pos < 0) pos = 0;
  if(pos >= outputArr.length) pos = outputArr.length - 1;
  
  currentSrchPos = pos;
  
  let key = outputArr[pos];
  
  // Fullscreen If
  
  if(document.getElementById('srchImgFull').style.display == 'block') {
    setDisplay(key, 'srchDisplayFull');
    setDisplay('', 'srchDisplay');
  }
  else {
    setDisplay(key, 'srchDisplay');
    setDisplay('', 'srchDisplayFull');
  }
  
  // Set
  
  outPos.innerText = '' + (pos + 1) + 
                     '. ' + key;
  
  // Set Info
  
  outInfo.innerHTML = 'Page: <a href="' + allSet[key].page + '" target="_blank">' + allSet[key].page + '</a><br><br>' + 
                      'Date: ' + allSet[key].date + '<br><br>' + 
                      'Tags:<br>';
  
  for(const tag of allSet[key].tags) {
    outInfo.innerHTML += tag + ' ';
  }
  
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
  
  let linkElem = document.getElementById('downloadLink'); // Download Link elem
  
  let allSetStr = JSON.stringify(allSet, null, 2); // Pretty String
  
  let blob = new Blob([allSetStr], {type: 'application/json'}); // Blob
  
  linkElem.href = URL.createObjectURL(blob); // Set URL
  linkElem.download = 'index';
  
}

function clearSave() { // For clearing localStorage
  
  if(!window.confirm('Clear localStorage?')) return
  
  localStorage.clear();
  
  outUsage();
  
}

function outSrchList() { // Output search list
  
  if(outputSet.size > 100) { // Over 100 Warning
    
    if(confirm('Over 100 results, are you sure you want to display?'));
    
    else return;
    
  }
  
  // Variables
  
  let list = document.getElementById('srchList');
  list.innerHTML = '';
  
  let i = 0;
  
  outputSet.forEach(function(key) {
    
    // Variables
    
    let li = document.createElement('li');
    li.style.whiteSpace = 'nowrap';
    
    // li
    
    li.innerHTML = '<button onclick="setImageSrch(' + i + ');">Display</button> ' + key;
    
    list.appendChild(li);
    
    i++;
    
  });
  
}

function clearOutput() {
  
  outputSet.clear();
  
  resultsQuant = document.getElementById('resultsQuant');
  resultsQuant.innerText = 'Results: ' + outputSet.size;
  
  console.log('Cleared outputSet');
  
}

function clrList(id) { // Clear HTML list
  
  let list = document.getElementById(id);
  
  list.innerHTML = '';
  
}

function setDisplay(src, id) { // Set the .src property of an elem.
  
  let display = document.getElementById(id);
  
  display.src = src;
  
  // Quick Tagging View
  
  if(id == 'pathDisplay') imgPath = src;
  
}

function listAllSet(clear = false) {
  
  let listElem = document.getElementById('listAllSet'); // Element
  
  if(clear) { // If clear
    listElem.innerHTML = ''; 
    return
  }
  
  let allSetStr = JSON.stringify(allSet, null, 2); // Pretty String
  
  listElem.innerText = ''; // Clear
  listElem.innerText = allSetStr; // Out
  
}

function listTags(clear = false) {
  
  // Variables
  
  let listElem = document.querySelector('#tagsList'); // Element
  let tagsObj = {};
  let tagsArr = [];
  
  // If clear
  
  if(clear) {
    listElem.innerHTML = ''; 
    return
  }
  
  // Loop through all tags
  
  for(const item in allSet) {
    for(const tag of allSet[item].tags) {
      if(tagsObj[tag]) tagsObj[tag] ++; // If Exists, ++
      else tagsObj[tag] = 1; // Else, new tag (1 instance)
    }
  }
  
  // Array (to Sort)
  
  for(const tag in tagsObj) tagsArr.push(tag);
  tagsArr.sort();
  
  // Output
  
  listElem.innerHTML = ''; // Clear
  let HTMLStr = '<tr><th>#</th><th>Tag</th></tr>';
  
  for(const tag of tagsArr) {
    if(tagsObj[tag] == 1) HTMLStr += '<tr><td id="lowTag">' + tagsObj[tag] + '</td><td>' + tag + '</td></tr>';
    else HTMLStr += '<tr><td>' + tagsObj[tag] + '</td><td>' + tag + '</td></tr>';
  }
  
  listElem.innerHTML = HTMLStr; // Set
  
}

function quickLoad() { // Load Quick Tag Editing View
  
  document.getElementById('greyout').style.display = 'block';
  
  // Load image
  
  setDisplay(imgPath, 'quickDisplay');
  
  // Load tags
  
  let qTags = document.querySelector('#greyout > #tags > textarea');
  qTags.value = document.getElementById('editTags').value;
  
  // Load All Tags List
  
  document.querySelector('#greyout > #list > div').innerHTML = '<span style="text-align: center;">Loading...</span>'
  
  quickListTags();
  
}

function quickListTags() { // List all Tags for Quick Tag Editing View
  
  // Variables
  
  let listElem = document.querySelector('#greyout > #list > div'); // Out Element
  let tagsElem = document.querySelector('#greyout > #tags > textarea'); // Current Tags
  let tagsSet = new Set;
  let tagsArr = [];
  
  let savedTags = [];
  let textareaTags = tagsElem.value.split(' ').filter(item => item !== '');
  
  if(allSet[imgPath]) savedTags = allSet[imgPath]['tags'];
  
  // Set (to Prevent Duplicates)
  
  for(const item in allSet) {
    for(const tag of allSet[item].tags) tagsSet.add(tag);
  }
  
  for(const tag of textareaTags) tagsSet.add(tag);
  
  // Array (to Sort)
  
  for(const tag of tagsSet) tagsArr.push(tag);
  tagsArr.sort();
  
  // Output
  
  listElem.innerHTML = ''; // Clear
  let HTMLStr = '';
  
  for(const tag of tagsArr) {
    
    // Overlap Variables
    
    let inSaved = savedTags.includes(tag);
    let inTextarea = textareaTags.includes(tag);
    
    // Add to HTMLStr
    
    HTMLStr += '<span title="Not Listed">❌❌</span>';
    if(inSaved && inTextarea) HTMLStr += '<span title="Listed in Both">✅☑️</span>';
    else if(inSaved && !inTextarea) HTMLStr += '<span title="Only in Saved">✅❌</span>';
    else if(!inSaved && inTextarea) HTMLStr += '<span title="Only in Textarea">❌☑️</span>';
    
    HTMLStr += tag + '<br>';
    
  }
  
  listElem.innerHTML = HTMLStr; // Set
  
}

function quickExit(save = true) { // Exit Quick Tag Editing View
  
  if(!save) {
    if(window.confirm('Don\'t Save?')) document.getElementById('greyout').style.display = 'none';
    return
  }
  
  document.getElementById('greyout').style.display = 'none';
  
  // Set tags
  
  let qTags = document.querySelector('#greyout > #tags > textarea');
  document.getElementById('editTags').value = qTags.value;
  
}

function fullScreen(id) {
  
  document.getElementById(id).style.display = 'block'; // Show
  
}

function fullScreenExit() {
  
  for(const id of fullScreenIDs) { // Each id
    document.getElementById(id).style.display = 'none'; // Hide
  }
  
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
    
    // Variables
    
    let folder = [];
    
    // Each Radio
    
    if(document.getElementById('folderRadio').checked) {
      folder = document.getElementById('folderInp').files;
    }
    
    if(document.getElementById('listRadio').checked) {
      for(const line of document.getElementById('listPathInp').value.split('\n')) {
        folder.push({lastModified: '', webkitRelativePath: line})
      }
    }
    
    // Generate
  
    try {
      
      //console.log(folder);
      
      pathOut.innerHTML = '🔄 Processing';
      pathOut.start = Date.now();
      
      files = [];
      
      for (let rawFile of folder) {
        
        let dateStr = '';
        
        if(rawFile.lastModified != '') {
          
          let date = new Date(rawFile.lastModified);
          
          let year = '' + date.getFullYear();
          let month = '' + (date.getMonth() + 1);
          if(month.length < 2) month = '0' + month;
          let day = '' + date.getDate();
          if(day.length < 2) day = '0' + day;
          
          dateStr = year + '-' + month + '-' + day;
          
        }
        
        let file = {
          'path': rawFile.webkitRelativePath,
          'date': dateStr
        };
        
        files.push(file);
        
      }
      
      files.sort((a, b) => a.path.localeCompare(b.path));
      
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
        tags: document.getElementById('editTags').value.split(' ').filter(item => item !== '')
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
        tags: document.getElementById('editTags').value.split(' ').filter(item => item !== '')
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
  
  editRmv.addEventListener('click', function() {
    
    try {
      
      editOut.innerHTML = '🔄 Removing';
      editOut.start = Date.now();
      
      let src = document.getElementById('editSrc').value;
      
      let match = false;
      
      Object.keys(allSet).forEach(function(key) { // Match
        if(key == src) match = true;
      });
      
      if(!match) throw new Error('!mtch') // Throw with '!mtch' error
      
      delete allSet[src];
      
      editOut.innerHTML = '✅ Removed in ' + (Date.now() - editOut.start) + 'ms';
      
      console.log('Removed:');
      console.log(src);
      
    }
    
    catch(error) {
      
      editOut.innerHTML = '⚠️ Error Removing';
      if(error.message == '!mtch') editOut.innerHTML = '⚠️ Not in Set'
      
      console.log('Removing Error:');
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
    
    wildcard = document.getElementById('wildcard').value.slice(0,1);
    
    let tags = document.getElementById('tagsSearch').value.split(' ').filter(item => item !== '');
    
    let searchOut = document.getElementById('searchOut');
    
    let resultsQuant = document.getElementById('resultsQuant');
    
    searchOut.innerHTML = '🔄 Searching';
    searchOut.start = Date.now();
    
    // inc
    
    if(incRadio.checked) {
      
      try {
        
        Object.keys(allSet).forEach(function(key) {
          
          let obj = allSet[key];
          
          let objDate = strToInt(obj.date);
          
          let withinDate = (!beforeChecked || (beforeDate > objDate)) && (!afterChecked || (afterDate < objDate))
          
          if(hasAnyTags(obj, tags) && withinDate) outputSet.add(key);
          
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
          
          let objDate = strToInt(obj.date);
          
          let withinDate = (beforeChecked && (beforeDate > objDate)) || (afterChecked && (afterDate < objDate));
          
          //console.log('withinDate: ' + withinDate);
          
          if(hasAnyTags(obj, tags) || withinDate) outputSet.delete(key);
          
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
          
          let objDate = strToInt(obj.date);
          
          let withinDate = (!beforeChecked || (beforeDate > objDate)) && (!afterChecked || (afterDate < objDate))
          
          console.log('withinDate: ' + withinDate);
          
          if(!hasAllTags(obj, tags) || !withinDate) outputSet.delete(key);
          
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

document.addEventListener('keydown', function() {
  
  // Edit form keys
  
  let pathBindArrows = document.getElementById('pathBindArrows').checked;
  
  if(event.key == 'ArrowLeft' && pathBindArrows) setImagePath(currentPathPos - 1);
  if(event.key == 'ArrowRight' && pathBindArrows) setImagePath(currentPathPos + 1);
  
  // Search out keys
  
  let srchBindArrows = document.getElementById('srchBindArrows').checked;
  
  if(event.key == 'ArrowLeft' && srchBindArrows) setImageSrch(currentSrchPos - 1);
  if(event.key == 'ArrowRight' && srchBindArrows) setImageSrch(currentSrchPos + 1);
  
});

// Theme

let themeSheet = new CSSStyleSheet();
document.adoptedStyleSheets.push(themeSheet);

let themeStyleSheetStrings = {
  'dark': `
body {
  color: rgb(255, 255, 255);
  background-color: rgb(0, 0, 0);
  background-image: none;
  background-image: 
    linear-gradient(135deg, rgb(0, 0, 0) 60%, rgb(0, 0, 16), rgb(16, 0, 16)),
    linear-gradient(90deg, rgb(0, 0, 0) 60%, rgb(0, 0, 16), rgb(16, 0, 16));
}

table {
  color: rgb(225, 225, 225);
  background-color: rgb(32, 32, 32) !important;
}
  `,
  'light': `
body {
  color: rgb(0, 0, 0);
  background-color: rgb(224, 224, 224);
  background-image: 
    linear-gradient(135deg, rgb(224, 224, 224) 60%, rgb(232, 232, 224), rgb(232, 224, 224)),
    linear-gradient(90deg, rgb(224, 224, 224) 60%, rgb(232, 232, 224), rgb(232, 224, 224));
}

table {
  color: rgb(0, 0, 0);
  background-color: rgb(224, 224, 224);
}
  `
};

function updateTheme() {
  
  let theme = localStorage.getItem('theme');
  
  themeSheet.replace(
    themeStyleSheetStrings[theme]
  );
  
}

function nextTheme(add) {
  
  // Variables
  
  let themeKeys = Object.keys(themeStyleSheetStrings);
  
  let currentTheme = localStorage.getItem('theme');
  let currentPos = themeKeys.indexOf(currentTheme);
  if(currentPos == -1) currentPos = 0;
  
  let themeButton = document.getElementById('themeButton');
  
  // Update Theme
  
  currentPos = (currentPos + add) % themeKeys.length;
  
  try {
    localStorage.setItem('theme', themeKeys[currentPos]);
    themeButton.innerText = '◪';
  }
  catch {
    themeButton.innerText = '⚠️';
    themeButton.title = 'localStorage Quota Full!';
    return
  }
  
  updateTheme();
  
  // Update themeButton Title
  
  let titleStr = 'Change Theme:\n';
  
  for(let i = 0; i < themeKeys.length; i++) {
    
    if(i == currentPos) titleStr += '✅ ';
    else titleStr += '⚫ ';
    
    titleStr += themeKeys[i] + '\n';
    
  }
  
  themeButton.title = titleStr;
  
}

updateTheme();

setTimeout(nextTheme, 10, 0);

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
