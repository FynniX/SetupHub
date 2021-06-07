// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const fs = require("fs")
const stream = require("stream")

let mainWindow;

function createWindow () {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        title: "SetupHub",
        icon: "./public/logo512.png",
        webPreferences: {
            nodeIntegration: false, // is default value after Electron v5
            contextIsolation: true, // protect against prototype pollution
            enableRemoteModule: false, // turn off remote
            preload: path.join(__dirname, 'preload.js')
        }
    })

    //Removes the Menubar.
    mainWindow.removeMenu();

    // and load the index.html of the app.
    mainWindow.loadFile('./build/index.html');

    // Open the DevTools.
    //mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow()

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on("DownloadFile", (event, args) => {
    const paths = args[0]
    const files = args[1]

    if(paths.length !== files.length)
        return event.reply("DownloadSuccess", false)

    paths.forEach((value, index) => {
        const writeStream = fs.createWriteStream(value);
        const bufferStream = new stream.PassThrough();

        bufferStream.end(Buffer.from(files[index]));
        bufferStream.pipe(writeStream);

        bufferStream.on('end', () => {
            event.reply("DownloadSuccess", true)
        });
        bufferStream.on('error', () => {
            event.reply("DownloadSuccess", false)
        });
    })
});

