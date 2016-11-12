# FileLoader
Drag and drop your files and folders into browser for uploading with accurate structure preserving.

## Usage
Add dropzone.js to your page, so you can call main function from js code.
```javascript
dropzone(selector, options);
```
options can contain following properties:
* hoverClass
* droppedClass
* deniedClass
* onloadstart
* onload
* onloadend
* onerror

## Restrictions
So far, it works only for webkit-based browsers.
It can not work well with large files of folders, that contain them.
