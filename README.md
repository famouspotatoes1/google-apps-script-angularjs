# Google-Apps-Script-is-your-Buddy
You can use Google Apps Script to make a unique web application, deployed to a private URL and secured for people behind your private corporate domain. You can also use almost any JavaScript framework or Library of your choice (AngularJS, Vue, Mithril, etc.), essentially anything you can add with a <script> tag is something you can use. You can also integrate it with the database of your choice, Firebase, CouchDB, etc. (these are the ones I use). You get a basic version control system and a Web-IDE to edit your code in, although it could use some serious updating.
It is even now possible to integrate git into your workflow and edit files locally if you like.

## What?
Yes, it's true and many people don't even realize it. When you search for Google Apps Script, you mostly get some documentation about how to integrate it with other Google products like Docs, Sheets, etc. Even though this is nice, it is not the main purpose I use it for. I have made apps that I use at work with a small team, to take advantage of web technologies and manage my data better than ever. You don't even have to be a professional programmer by-day to make something useful (I'm not, just a regular guy that likes making things).

The company I work for uses G Suite (formerly Google Apps for Work and Google Apps for Your Domain), and this adds an additional neat feature for deploying a Web App behind the corporate domain, where only users on your domain can access it. This doesn't mean you *have* to be using G Suite. Anyone with a Google Account can have a Google App Script and make web apps. It is simply that if you are part of G Suite, you can deploy strictly to users on your domain, a nice security feature.

## How 
If you're using Google Apps Script to make a web app, you should really be trying to make a Single Page App or SPA. This way, you do not need to reload the page each time you want to navigate. You will use a library or framework that has routing capability to accomplish this. I have mostly been using AngularJS 1.5+ with the Component Model for my work combined with Angular UI-Router. This will outline the most basic Angular application without routing, and I will add a more complicated example later.

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
  
  <?!= include('js_app'); ?>
  
</html>
```

### Next add your JavaScript
Now the first thing to realize is, to add JavaScript to your Google Apps Script web app will require you to add another *.html* file and put your code within `<script>` tags. This might seem goofy, and I agree, but everything in Apps Script is an *.html* file and you have to work around that fact.
So create a new file by going to the command bar: *File > New > Html file*
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
### Finally, Publish the Web App
The next step is to *Publish* the web app and it is really simple. From the command bar select *Publish > Deploy as web app*.
![publish command](/images/google-apps-script-publish-01.png)

You will be presented with a modal dialog that has a few options:
![publish modal](/images/google-apps-script-publish-02.png)

If you choose to run the app as *Me*, people would technically have access to *your* Google Drive. Sometimes that is what you want, like in a secured corporate environment, you may want to send emails using your Google credentials. For a publically facing web app, I would not do this, and would choose the second option *User accessing the web app*.

The next dropdown has the options that determine the accessibility of the app. 
![publish modal](/images/google-apps-script-publish-03.png)

It can be private, like if you wanted to use it for a home iot dashboard interface, this would be a great option. If you want anyone else to see it, the only other option is to allow *Anyone*. I'm not sure what *even Anonymous* means, but it doesn't sound like a secure option so I haven't used it.

You will have to select *New* the first time you deploy it. From there on, it will have a version number and this is where you get some basic version control. The app will have two separate URL's you can access it from, a development one (ending in /dev) and a production one (ending in /exec). When you deploy and change version numbers, users accessing the app from the production endpoint will get your latest code. If you are accessing the app through the development endpoint, any changes you make in the editor are immediately executed and shown.
