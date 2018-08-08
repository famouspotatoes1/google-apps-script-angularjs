# Use AngularJS and Google Apps Script together
You can use Google Apps Script to make a unique web application, deployed to a private URL and secured for people behind your private corporate domain, just you, or expose it to the entire web. It is up to you. You can also use almost any JavaScript framework or Library of your choice (AngularJS, Vue, Mithril, etc.), essentially anything you can add with a <script> tag is something you can use. You can also integrate it with the database of your choice, Firebase, CouchDB, etc. (these are the ones I use). You get a basic version control system and a Web-IDE to edit your code in, although it could use some serious updating.
It is even now possible to integrate git into your workflow and edit files locally if you like.

## What?
Yes, it's true and many people don't even realize it. When you search for Google Apps Script, you mostly get some documentation about how to integrate it with other Google products like Docs, Sheets, etc. Even though this is nice, it is not the main purpose I use it for. I have made apps that I use at work with a small team, to take advantage of web technologies and manage my data better than ever. You don't even have to be a professional programmer by-day to make something useful (I'm not, just a regular guy that likes making things).

The company I work for uses G Suite (formerly Google Apps for Work and Google Apps for Your Domain), and this adds an additional neat feature for deploying a Web App behind the corporate domain, where only users on your domain can access it. This doesn't mean you *have* to be using G Suite. Anyone with a Google Account can have a Google App Script and make web apps. It is simply that if you are part of G Suite, you can deploy strictly to users on your domain, a nice security feature.

## How 
If you're using Google Apps Script to make a web app, you should really be trying to make a Single Page App or SPA. This way, you do not need to reload the page each time you want to navigate. You will use a library or framework that has routing capability to accomplish this. I have mostly been using AngularJS 1.5+ with the Component Model for my work combined with Angular UI-Router. This will outline the most basic Angular application without routing, and I will add a more complicated example as a Part 2 in the future.

### Start with a "*.gs*" file
To make a web app with Google Apps Script, you need to have a *google script* file or .gs file. It will default to *Code.gs* when you first create an Apps Script file. This is where it all starts and you must have some specific functions in here, as they are specific to the Google Apps Script way of producing a web app.
```javascript
function doGet() {
  var t = HtmlService.createTemplateFromFile('index');
  return t.evaluate()
    .setTitle('Single Page Web App');
}
 
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}  
```
The *doGet* function must be present for this to work.
The *include* function is a helper to create .html files that your application will use.

Think of the *doGet* function as your web server; that is really all it is doing. It is serving a file at a url, but instead of being at `http://localhost:3001` or something, it is at another url on a Google server. It's pretty robust too. I haven't had any issues with it like I have with `python -m SimpleHTTPServer 3001` where it requires the occasional restart.

### Next create the *index.html* file
The index file is identical to any other website you may have made, only it does not need to be named *index*, it can be anything. Following convention, I like to use index. Your index file will look like this:
```html
<!DOCTYPE html>
<html ng-app="App">
  
  <head>
    <base target="_top">
  </head>
  
  <body ng-controller="MainController">
    <div class="container">
      {{ helloWorld }}
    </div>
  </body>
  
  <!-- below is Google Apps Script's way of executing functions that are in the .gs file (called a scriptlet) -->
  <?!= include('js_app'); ?>  
  
</html>
```

### Next add your JavaScript
Now the first thing to realize is, to add JavaScript to your Google Apps Script web app will require you to add another *.html* file and put your code within `<script>` tags. This might seem goofy, and I agree, but everything in Apps Script is an *.html* file and you have to work around that fact.  So create a new file by going to the command bar: *File > New > Html file*  

Give it a name, and I will give you a hint to a good structure to follow. I like to call it something like *js_app.html*, because later on, when you have a multitude of files, you may want them to be organized by type. The dated Web IDE will allow you to organize the files either by the order they were created, or alphabetically. I prefer this naming convention, then organized alphabetically so I can keep all my *component* files in a logical order.

A minimal AngularJS/Bootstrap 4 application will have these contents in the *js_app.html* file:
```javascript
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.8/angular.js"></script>

<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>

<script>
//////  Module Definition//////
(function () {
  'use strict';
  angular
    .module('App', [])
})();

(function () {
  'use strict';
  angular
    .module('App')
    .controller('MainController', MainController)
    
    MainController.$inject = ['$scope']
    
    function MainController($scope) {
      $scope.helloWorld = 'Hello World'
    } 
})();
</script>
```
If you search the web, you will find people who have written on Stack Overflow about not being able to use the minified versions, or the Caja Sanitizer did this or couldn't do that. I have not found any issues. Minified versions work just fine, css libraries work just fine, most all JavaScript libraries or frameworks work just fine. The base Google Apps Script functionality (using *.gs* files) requires ES5, but when you are doing a Single Page App this way, you can use some of the ES2015 features. I'm no expert in why some work and some don't so I won't try to explain it.
- Arrow functions work `(arr.map(v => v + 1)`
- Operators `let` and `const` work just fine
- Template Strings DO NOT work

### Finally, Publish the Web App
The next step is to *Publish* the web app and it is really simple. From the command bar select *Publish > Deploy as web app*.

![publish command](/images/google-apps-script-publish-01.png)


You will be presented with a modal dialog that has a few options:

![publish modal](/images/google-apps-script-publish-02.png)

If you choose to run the app as *Me*, people would technically have access to *your* Google Drive. Sometimes that is what you want, like in a secured corporate environment, you may want to send emails using your Google credentials or maybe save some file to a location on your Drive. For a publically facing web app, I would probably choose the second option *User accessing the web app*.


The next dropdown has the options that determine the accessibility of the app.

![publish modal](/images/google-apps-script-publish-03.png)


It can be private, like if you wanted to use it for a home iot dashboard interface, this would be a great option. If you want anyone else to see it, the only other option is to allow *Anyone*. I'm not sure what *even anonymous* means, but it doesn't sound like a secure option so I haven't used it. If you are part of a G Suite domain, like at work, you will have one more option: *Anyone at yourdomain.com*. This is the feature I mentioned earlier that I think adds a nice layer of security. Now I don't need to worry about my URL being shared outside my organization, even if somebody did by mistake.

You will have to select *New* the first time you deploy it. From there on, it will have a version number and this is where you get some basic version control. The app will have two separate URL's you can access it from, a development one (ending in /dev) and a production one (ending in /exec). When you deploy and change version numbers, users accessing the app from the production url will get your latest code. If you are accessing the app through the development url, any changes you make in the editor are immediately executed and shown. I wouldn't share the development url.

### Is there anything special when using Google Apps Scripts for Single Page Web Apps?
There are a few things you may want to know: 
- Any library you want to use must be linked up using `<script>` tags; you cannot `npm install` anything or `require` files into your workspace that I know of. Typically this means you need to find the library on a CDN. A lot of library authors offer this, so I haven't found it to be a limitation. The only other option is to cut and paste the code into the Web IDE, but this can be kind of nasty.
- The Web IDE does not work with JSX. For this reason, React is not an option as far as I can see. For my work, AngularJS has been my goto, and it works very well.
- When you are routing within your app, you will not see the URL change like a typical web application would. It is still possible to send parameters on the URL route and everything, you just won't see that URL in the address bar. This is because the application is *sandboxed* in an iframe and everything it is doing is inside the sandbox.
- I wouldn't use it for a real website (remember, my use case is a *web app*). If you expect crawlers to index your site and be available on search engines, this is not your ideal choice. Because it is sandboxed, it is not possible to modify the `<meta>` tags at the head of the page it is served on. Anything you put in your index.html file is buried in the sandbox and I don't think it will be found, though I haven't tested this.

### No build tools (bundlers, minifiers, linters)?
No. None of that is needed.
You can actually build a very functional web application without using bleeding edge technology, meaning the latest build tools (webpack, Parcel, etc.). There are some benefits to this. Your code can be updated from anywhere immediately, much quicker than getting your dev environment started, running `npm install` then `npm build` or whatever flavor you like to use. Even though your application might run faster if you did this, it will likely be small enough that it won't be a big knob in terms of startup speed. 
If you really want to use a build step, you can; you just have to use the *bundle.js* output file as your `js_app.html`.

### What I hope Google Apps Script could become
While it is very useful for me (in my use case), I think it could be much better and allow more recent technologies. If anybody important might stumble upon this and can effect some change, here is my list:
- Update the code editor so it uses something like the Monaco editor used by VS Code (also StackBlitz)
- Make the GUI possible to do builds using a build tool like Webpack or Parcel. I would love to see a GUI that brings us out of the command line and `webpack.config.js` file, so it doesn't require day-to-day usage of the tool to be able to remember commands. Make the *loaders* and *plugins* selectable from a list and build my `webpack.config.js` file for me.
- Run this bundled file as my application when I say *Publish as web app*
- It seems like there should be an opportunity to do Server Side Rendering to make Google Apps Scripts blazing fast applications
- Don't try to dumb it down and over complicate things, like IBM has done with all their freaking modules in IBM Cloud where I have to select all my technologies and connect them through the GUI interface. I'm fine with adding my connection to Firebase exactly as I do today, in my index.html file, which also matches their documentation.

Remember that not everybody that might be using or needing web technologies, is a day-to-day programmer. In fact, I don't even work in IT and to get all these tools installed on my work computer to do such stuff is a pain in the you know what; that is why the Web IDE is awesome.

### Conclusion
Thanks for reading. This has become something I really enjoy and I hope my writing here will enable somebody to build an application of their own. When I started writing JavaScript 3 years ago, it was to build an application that would help manage my data at work. I didn't know the first thing about making a web application, but I was able to press on, learn, and make what I needed. 
While you don't need to use Google Apps Script to do this, I think it is a great starting point and platform if you should choose to. Give it a shot!
