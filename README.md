## pro-test
Demo project for testing Async operations on the provided fake server env.

### App Description

App will load all posts with post titles and post message from external API and will display them to a message board.
User will be able to click on message title so that message body will be shown.
User can enter and post new message, but will be required to enter proper title and message body. Also, user can search/filter trough message board for message titles.
App was created using only JS, without JS libraries/frameworks such as React.JS, because of small scale of project, and to direct attention on JS rather then JSX code.

**Tech**: JavaScript, Sass, Parcel, NPM

### **Install**

Clone or download repository. 
- In command line type: **npm i** 
- start app by typing: **npm start**
- or build app: **npm run build**


### **1. Problem/Solution**

All loaded data(messages) is asynchronous. Because of that it was a requirement to wait for data to be loaded so it can be rendered to the DOM.
Since it was needed to have that data 'clickable' - toggle show/hide of message on title click, and delete-able, it was necessary to reapply those functions after every data render.

After every API call(post, delete), data had to be rendered again along with toggle/delete functions. This was most major issue for me, as it took me some time to properly select that async generated html elements.
Other part is Search functionality. After data is loaded into datalist, search/filter was done over loaded datalist. Delete and toggle functions are applied to searched results as well.

### **2. Architecture**

Because of small scale of the project, I deemed it not necessary to use MVC architecture. All code is placed into one complete script file, which is well commented and every function is described.

### **3. Issues/Other**

 - Mostly used async/await functions, instead of classic http requests / data load events.
 - Lazy loading functionality is not implemented as it would need different approach/structure to make it work with current code structure.
 - App is NOT developed for optimal scalability. Since purpose of message board usage is not clear(no dates f.e.) for larger database lazy loading/pagination would be a must.
 - Where errors are handeled, app will display a error message above message board, which will dissapear after 5 seconds.
 - There are no safeguards in place for extreme scenarios, like trying to post a lot messages in quick succesion or reloading page in similar manner.
 - About 10-15% of development time was dedicated to provide simple yet elegant and modern UI and design using SASS.
 - Things that can be improved/implemented:
   - An option to filter messages posted by specific user.
   - Option to sort messages by order ASC/DSC.
   - Keyboard events, and proper execution of cut/copy/paste events for input fields.
   - Option for user to edit his own posts.

