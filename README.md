Simple [Pixeldrain](https://pixeldrain.com/) API Connector to upload files from the local machine. 

Tested on Windows ✅

🌐 Available in Spanish, i18n incoming will be implemented if needed.

You'll just need to provide a valid Pixeldrain API key and upload the files to a local storage. The files will be included in an upload queue based on the order they were uploaded. This queue is presistent in a local database, so it doesn't matter if you close the app, you will keep your progress. Once your queue is ready, just press the button to start uploading to pixledrain and the files will be sent through their API in order until the queue is empty or you decide to stop the upload (in this case, the active upload will finish before stopping).

📂 Download the Windows installer here or test in your local machine with the web version running the command `npm run start` in the backend folder. The compiled frontend is already embeded in the backend.

Submit an issue if you want me to implement something else or contact me at 📩 <danny.glezcuet98@gmail.com>
