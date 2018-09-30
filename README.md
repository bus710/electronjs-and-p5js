# electronjs-and-p5js

For my personal note to make a simple combination of Electron.js and p5.js.

## Writer

* SJ Kim
* bus710@gmail.com

## Index  
  
TBD...
  
## Get Node.js  
  
Node is the framework we have to use and I would like to try the current version (node-v10.11.0-x64.msi as of 2018/09).  
- https://nodejs.org/en/download/current/
- After downloading, just run the executable.
  
## Get Visual Studio Code
  
Code became so popular as a proper IDE for various projects.
- https://code.visualstudio.com/
- After downloding, just run the executable as well.
- I use Vim and Debugger-for-Chrome extensions.
  
## Kick Off

In fact, this part is just same as the official guide.  
https://electronjs.org/docs/tutorial/first-app  

But I added some lines to integrate with Code.  
  
- Before run Code, make a folder. I made a folder "Test" in my Desktop.
- Then run Code and open the folder just made.
- And make couple of files - index.html, style.css, main.js, and renderer.js.
  
Write contents for the files.  
  
For main.js
```
const { app, BrowserWindow } = require('electron')
let win
  
function createWindow () {    
  win = new BrowserWindow({ width: 800, height: 600 })
  win.loadFile('index.html')
  win.webContents.openDevTools()

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
```

For index.html
```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Hello World!</title>
  </head>
  <body>
    <h1>Hello World!</h1>
    We are using Node.js <script>document.write(process.versions.node)</script>,
    Chromium <script>document.write(process.versions.chrome)</script>,
    and Electron <script>document.write(process.versions.electron)</script>.

    <script>
      require('./renderer.js')
    </script>
  </body>
</html>
```

For renderer.js
```
/* Nothing for now. */
```

package.json
```
{
  "name": "test",
  "version": "1.0.0",
  "description": "A minimal Electron application",
  "main": "main.js",
  "scripts": {
    "start": "electron ."
  },
  "repository": "",
  "keywords": [
    "Electron",
    "p5.js"
  ],
  "author": "GitHub",
  "license": "CC0-1.0",
  "devDependencies": {
    "electron": "^3.0.0"
  }
}
```

## Get Electron binary

- Start Code's terminal by pressing **CTRL+\`**.
- Run **npm install** in the terminal.

## Debugging the main process with Code
  
https://electronjs.org/docs/tutorial/debugging-main-process-vscode

In **.vscode** under the root directory, a launch.json file needs to be made.
Then,
```
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Debug Main Process",
            "type": "node",
            "request": "launch",
            "cwd": "${workspaceRoot}",
            "runtimeExecutable": "${workspaceRoot}/node_modules/.bin/electron",
            "windows": {
                "runtimeExecutable": "${workspaceRoot}/node_modules/.bin/electron.cmd"
            },
            "args": [
                "."
            ]
        }
    ]
}
```

Now, the debugging tab can show us a new menu to run the debugger.  
  
## Get p5.js
  
  
