'use strict';

window.dropzone = function(selector, options) {

  /**********************************************
  * INIT
  **********************************************/

  let hoverClass = options.hoverClass || '',
      droppedClass = options.droppedClass || '',
      deniedClass = options.deniedClass || '',
      dropzone = document.querySelector(selector),
      loadend = options.onloadend,
      loadevent = options.onload,
      loadstart = options.onloadstart,
      droppedFilesArray = [];

  /**********************************************
  * EVENTS
  **********************************************/

  dropzone.addEventListener('dragover', function(e) {
    e.preventDefault();

    this.classList.add(hoverClass);
  });

  dropzone.addEventListener('dragleave', function(e) {
    this.classList.remove(hoverClass);
  });

  dropzone.addEventListener('drop', function(e) {
    e.preventDefault();

    watchIfFilesAreStillLoading(function() {
      dropzone.classList.add(droppedClass);
      loadend(droppedFilesArray);
    });

    for(let item of e.dataTransfer.items)
      traverseFileTree(item.webkitGetAsEntry())

  });

  /**********************************************
  * LOGIC
  **********************************************/

  function watchIfFilesAreStillLoading(cb) {
    let initWatcher = function() {
      let arrayInitLength = droppedFilesArray.length,

      timer = setInterval(function() {
        if(droppedFilesArray.length > arrayInitLength)
          arrayInitLength = droppedFilesArray.length;
        else {
          clearInterval(timer);
          cb();
        }
      }, 450);

    };

    setTimeout(initWatcher, 200);
  }

  function traverseFileTree(item, path) {
    path = path || '';
    if(item.isFile) {

      // dont need to upload hidden files which usually start with dot
      if(item.name.startsWith('.')) return false;

      item.file(file => {
        let fileReader = new FileReader();

        fileReader.onloadend = function(e) {
          droppedFilesArray.push({
            path: path,
            filename: file.name,
            content: e.target.result
          });
        };

        fileReader.onprogress = function(e) {
          loadevent({
            index: droppedFilesArray.length + 1,
            file: path + file.name
          });
        };

        fileReader.readAsBinaryString(file);
      });
    } else {
      let dirReader = item.createReader();

      // dont need to upload hidden folders which usually start with dot
      if(item.name.startsWith('.')) return false;

      dirReader.readEntries(function(entries) {
        for(let entry of entries)
          traverseFileTree(entry, path + item.name + '/');
      });
    }
  }

};

/**********************************************
* TEST;
**********************************************/

let dropzoneSelector = '#dropzone',
dz = document.querySelector(dropzoneSelector);

dropzone(dropzoneSelector, {
  hoverClass: 'hovered',
  droppedClass: 'dropped',
  deniedClass: 'denied',
  onloadstart: preload,
  onload: onload,
  onloadend: send,
});

/*
* @param array of objects each of
* which represents file with path,
* filename and content of its
*/
function send(files) {
  dz.innerHTML = `You are ready to upload ${files.length} files`;
}

/*
* @param object which contains index
* of current file and its full path so
* you can display this information
*/
function onload(args) {
  console.log(`Processing file #${args.index}: ${args.file}`);
}

function preload() {
  //do some preload stuff
  dz.innerHTML = 'Detecting files...'
}
