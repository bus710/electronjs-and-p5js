# electronjs-and-p5js

For my personal note to make a simple combination of Electron.js and p5.js.

## Writer

* SJ Kim
* bus710@gmail.com
  
----

## Index  
  
- Get Node.js  
- Get Visual Studio Code
- Kick Off
- Get some required modules
- Debugging the main process with Code
  
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

I referred couple of repos:  
- https://electronjs.org/docs/tutorial/first-app  
- https://github.com/garciadelcastillo/p5js-electron-templates

The steps are:
  
- Before run Code, make a folder (I made a folder "Test" in my Desktop).
- Then run Code and open the folder just made.
- And make couple of files like:
-- package.json
-- index.html
-- style.css
-- main.js
-- renderer.js
-- and sketch.js
  
Write contents for the files.  
  
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

For syle.css
```
body {
    padding: 0; 
    margin: 0; 
    background: #000000; 
    overflow-x:hidden; 
    overflow-y: hidden
}
```

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
  
For renderer.js
```
/* Nothing for now. */
```
  
For sketch.js (Thanks to Garcia Del Castillo)
```
const easerCount = 500
const easing = 0.05
const diameter = 10
let easer = []

console.log("sketch!")

function setup() {
    createCanvas(windowWidth, windowHeight)
    console.log(`${windowWidth}, ${windowHeight}`)
    noStroke()
    background(255)

    for (let i = 0; i < easerCount; i++) {
        let e = new Easer(width / 2, height / 2, diameter, easing)
        easer.push(e)
    }
}

function draw() {
    background(255)

    for (let i = 0; i < easer.length; i++) {
        easer[i].update()
        easer[i].render()
    }
}

function mousePressed() {
    for (let i = 0; i < easer.length; i++) {
        easer[i].setTarget(mouseX, mouseY)
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight)
}

function Easer(xpos, ypos, diameter, newEasing) {
    this.x = xpos
    this.y = ypos
    this.targetX = this.x
    this.targetY = this.y
    this.d = diameter
    this.ease = newEasing
    this.clr = color(random(0, 255), random(0, 255), random(0, 255), 127)

    this.render = function () {
        fill(this.clr)
        ellipse(this.x, this.y, this.d, this.d)
    }

    this.update = function () {
        let dx = this.targetX - this.x
        let dy = this.targetY - this.y
        if (abs(dx) > 0.1 || abs(dy) > 0.1) {
            this.x += dx * this.ease
            this.y += dy * this.ease
        } else {
            this.setRandomTarget()
        }
    }

    this.setTarget = function (xpos, ypos) {
        this.targetX = xpos
        this.targetY = ypos
    }

    this.setRandomTarget = function () {
        this.targetX = random(0, width)
        this.targetY = random(0, height)
    }
}
```

## Get some required modules

Start Code's terminal by pressing **CTRL+\`**.

To get Electron.js:
```
$ npm install --save-dev electron
```

To get p5.js:
```
$ npm install --save-dev p5
```

To install as the package.json.
```
$ npm install
```  

And finally:
```
$ npm start
```
  
## Debugging the main process with Code
  
I referred a repo as below:  
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
  
----

## Conclusion
  
This is a super simple process to have the minimal setting of the combination between Electron.js and p5.js.  
We saw from the installation of the framework and IDE.  
Also the minimum code to show the nice and dynamic canvas.  




