# Code Pod Website

## Setting up the environment

To start developing this website on your own computer, clone this repository and run ```npm install```.  

### Instructions to clone this repository and npm install

If you haven't previously cloned a github repository, you can do this by opening a terminal or command line window on your computer. You can then use the ```cd``` command to move to a directory you would like to put the website folder in (e.g. ```cd Documents/coding_projects```.  Once you have done this, type the following command: ```git clone https://github.com/codepoduk/website.git```.  This will copy the files from this repo to your computer.

You should then move into the copied directory by typing ```cd website/```.  Finally, enter the command ```npm install``` to install the tools we use in the development environment.  If you haven't previously installed node on your computer you will need to do so.  You can find instructions for this on the NodeJS website.

### Using gulp

Once you have run `npm install`, you can run `gulp` to build the production files and begin watching the source code for changes. Browsersync will start a server and open the site in a new browser window at `http://localhost:3000`. Any changes to the HTML, CSS or JS will be automatically updated in the browser.

If you are new to gulp, please read the `gulpfile.commented.js` file to read about the plugins we're using.
