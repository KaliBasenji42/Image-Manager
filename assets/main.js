// Variables and Constants

const allSet = new Set();

const outputSet = new Set();

const files = new Set();

const newSet = new Set();

let loadStart = 0;

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

// Button Functions

function outPathList() {
  
  let list = document.getElementById('pathList');
  
  list.innerHTML = '';
  
  files.forEach(function (obj) {
    
    // Variables
    
    let li = document.createElement('li');
    li.style.whiteSpace = 'nowrap';
    
    // li
    
    li.innerHTML = '<button onclick="setImgPath(\'' + obj.name + '\')">Edit</button>' + 
                   obj.name;
    
    list.appendChild(li);
    
  });
  
}

function setImgPath(name) {
  
  // Get Elems
  
  let dirInp = document.getElementById('dir');
  let srcInp = document.getElementById('src');
  let pageInp = document.getElementById('page');
  let dateInp = document.getElementById('date');
  let tagsInp = document.getElementById('tagsEdit');
  
  // Vars
  
  path = dirInp.value + name;
  console.log(path);
  
  // Set
  
  setDisplay('imgs/' + path, 'pathDisplay');
  
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
    
    li.innerHTML = '<button onclick="setDisplay(\'' + obj.src + '\', \'srchDisplay\');">Display</button>' + 
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

function clrSrchList() {
  
  let list = document.getElementById('srchList');
  
  let display = document.getElementById('srchDisplay');
  
  list.innerHTML = '';
  
  display.src = "";
  
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
  let pathInp = document.getElementById('pathInp');
  let pathOut = document.getElementById('pathOut');
  
  let searchForm = document.getElementById('searchForm');
  let resultsQuant = document.getElementById('resultsQuant');
  
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
        loadStart = Date.now();
        
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
            
            fileOut.innerHTML = '✅ Time: ' + (Date.now() - loadStart) + 'ms';
            
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
  
  pathInp.addEventListener('click', async () => {
    
    try {
      
      const folder = await window.showDirectoryPicker();
      
      pathOut.innerHTML = '🔄 Processing';
      loadStart = Date.now();
      
      console.log(folder);
      
      for await (const entry of folder.values()) {
        if(entry.kind == 'file') files.add(entry);
      }
      
      outPathList();
      
      pathOut.innerHTML = '✅ Time: ' + (Date.now() - loadStart) + 'ms';
      
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
    loadStart = Date.now();
    
    // inc
    
    if(incRadio.checked) {
      
      try {
        
        allSet.forEach(function (obj) {
          
          let objDate = strToInt(obj.date);
          
          let withinDate = (!beforeChecked || (beforeDate > objDate)) && (!afterChecked || (afterDate < objDate))
          
          if(hasAnyTags(obj, tags) && withinDate) outputSet.add(obj);
          
        });
        
        searchOut.innerHTML = '✅ Time: ' + (Date.now() - loadStart) + 'ms';
        
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
        
        searchOut.innerHTML = '✅ Time: ' + (Date.now() - loadStart) + 'ms';
        
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
        
        searchOut.innerHTML = '✅ Time: ' + (Date.now() - loadStart) + 'ms';
        
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
