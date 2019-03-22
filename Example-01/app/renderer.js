console.clear()

/* Renderer manages the connection between main and sketch.
    Also it manages data from both side like a cache. */
const { ipcRenderer } = require('electron')

var lastComportList;

/* This timer fires up every seconds
    to refresh some information periodically. */
var interval = setInterval(() => {
    // console.log('renderer timer')
}, 1000);


toRendererEmitter.on('aaa', (arg) => {
    ipcRenderer.send('aaa', arg);
});

ipcRenderer.on('bbb', (event, arg) => {
    toSketchEmitter.emit('bbb', 'bbb');
});