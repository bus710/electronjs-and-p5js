/* Main manages two things:
    1. Electron windows/processes 
    2. Communication with serial devices */

/* =========================================================== 
    In this block Main makes the window instance 
        and assign certain configuration for that.
=========================================================== */
const { app, BrowserWindow } = require('electron')
const { ipcMain } = require('electron')

/* Comment this when deploy. */
require('electron-debug')([{ 'showDevTools': false }]);

/* To hide the security warning from the console. */
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

let win

function createWindow() {
    let winW, winH;
    if (process.platform == 'win32') {
        winW = 806;
        winH = 628;
    }
    else {
        winW = 800;
        winH = 600;
    }
    win = new BrowserWindow({
        /* To avoid Chrome's policy regarding the local file loading. */
        webPreferences: {
            webSecurity: false
        },
        /* Fix the size of the window. */
        resizable: false,
        width: winW,
        height: winH
    })
    win.setMenu(null);

    /* The path for loadFile method should start from root
        since that is the npm command's start point. */
    win.loadFile('./app/index.html')

    /* This line no longer needed 
        since the electron-debug makes another window for debugging.
        win.webContents.openDevTools() */

    win.on('closed', () => {
        win = null
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
})

/* =========================================================== 
    Some event handlers 
=========================================================== */
ipcMain.on('aaa', (event, arg) => {
    win.webContents.send('bbb', 'bbb')
});

/* This timer fires up every seconds
    to refresh some information periodically. */
var interval = setInterval(() => {
}, 1000);