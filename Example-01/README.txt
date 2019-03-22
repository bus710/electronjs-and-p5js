
## For Windows

serialport package requires to be compiled to be a part of electron.

In an Admin terminal:
npm install -g --production windows-build-tools

Then with electron-rebuild of install hook in package.json,
npm install 

## For Linux

Don't forget to add the current user ID to dialout of /etc/group