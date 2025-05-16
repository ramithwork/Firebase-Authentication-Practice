# Firebase Authentication Practice
Testing out Firebase authentication and understanding the authentication flows. Check firebase-auth.js file for details. 

## Firebase Hosting

SETUP
=====

Install firebase globally:
npm i firebase-tools -g


FIREBASE USER ACC
=================

Login to firebase:
firebase login

Login with different email:
firebase login:add another@email.com

Switch between emails:
firebase login:use another@email.com


FIREBASE HOSTING
================

Initialise Firebase project in current directory:
firebase init hosting

Public directory setting:
Assign wherever the build is made. For no build projects use ./


SERVE & DEPLOY
==============

Serve Locally:
firebase serve 

Serve Deploy to Live site:
firebase deploy


PREVIEW CHANNELS
================

Deploy Preview Channel:
Deploy staging site. "stage" is the custom ID and it can be anything you want. --2d it will expire after 2 days. Example https://fb-js-crud-module-test--stage-fzkoysuy.web.app [expires 2025-05-17 16:08:45]
firebase hosting:channel:deploy stage --expires 2d

List Preview Channels:
firebase hosting:channel:list

Delete Preview Channel:
firebase hosting:channel:delete stage


PREVIEW CHANNELS WITH GITHUB ACTIONS
====================================
Can't get it to push to preview channels. 


BEST FLOW
=========
Use Github as you normally would. Init Firebase Hosting to the specific project. When you are in one branch you can deploy that to a preview channel. 

