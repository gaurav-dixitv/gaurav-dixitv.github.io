---
layout: post
title:  "policy gradient rider (update)"
date:   2017-11-03 00:30:00 +0530
last_edited: 2019-04-13 00:00:01 -0700
categories: phaser
excerpt: "using reinforcement learning to ride."

loadScripts: false
scripts: []
---

On a [Trials](https://www.ubisoft.com/en-us/game/trials-rising/) testbed ([Trials Messenger](https://apps.facebook.com/instanttrials) has now soft-launched!), a number of techniques were used to train riders.

Prototypes of agents trained with Policy gradients and Q-learning will be added soon!

In the meantime, check out a quick preview of a population trained with Neuroevolution. The fitness of a genome is directly proportional to the distance traveled and inversely related to the time taken to finish the track.

The video down below shows three runs.
1. Generation 20
2. Generation 50
3. Generation 80 for a fitness function that rewards wheelies

<iframe width="560" height="315" src="https://www.youtube.com/embed/eURH-EOYijg?rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>