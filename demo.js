let dropzoneSelector = '#dropzone',
dz = document.querySelector(dropzoneSelector);

dropzone(dropzoneSelector, {
  hoverClass: 'hovered',
  droppedClass: 'dropped',
  deniedClass: 'denied',
  onloadstart: preload,
  onload: onload,
  onloadend: send,
  onerror: handleError
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

/*
* @param object which contains index
* of current file and error event with
* full information about it
*/
function handleError(args) {
  console.log(`Error occured while processing file #${args.index}: ${args.file}`);
  console.log(`Error code: ${args.e.target.error.code}`);
}
