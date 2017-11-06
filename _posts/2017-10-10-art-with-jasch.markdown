---
layout: post
title:  "art with jan schacher"
date:   2017-10-10 00:00:00 +0530
categories: phaser
excerpt: "immersive acoustic and visual experiences."
comments: true

loadScripts: false
scripts: []
---

[Jan Schacher](http://jasch.ch/focus.html). A double bass player, composer, exploratory artist and a researcher at Zurich University of the Arts. These days, Jan mainly focuses on creating immersive acoustic and abstract experiences (check out [Immersive Lab](http://immersivelab.zhdk.ch/)).
His performances are usually an eclectic mix of gestures, abstract interactions and use of acoustic cues combined with techonology.

Back in September2017, I met Jan. We talked about his work and the way he uses technology to create abstract social eperiences. We then worked on building an immersive lab like experience, where many users can interact and take actions collectively using their smartphones. 

# Project overview
1. We use the [Gesture Recognition Toolkit](https://github.com/nickgillian/grt) (mostly the Hidden Markov Models and Neural Networks) for real time gesture recognition.
2. A server hosts the audio and visual data.
3. Every user can connect to the server using a smartphone. A client sends gesture data to the server (the server uses grt).
4. The server, based on all current (and past) client data, decides the change in audio/visuals in real time, which is then sent to connected clients (Think of this as a fuzzy FSM).

I will keep updating this post as we make progress.
The project will be on github soon.