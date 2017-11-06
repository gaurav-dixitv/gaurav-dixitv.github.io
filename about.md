---
layout: about
title: me
permalink: /about/

excerpt: "I love writing code and building intelligent systems. Machine learning is fun and intrigues me. I have built some reasonably smart apps that experiment with learning techniques.
When I am not with my computer, you will probably find me jamming on my guitar, gazing at the night sky (tell me HH34 is not beautiful, seriously) or sleeping."

profileUrl: "/assets/images/profile.png" 
---

## Ubisoft
#### *Programmer (august 2016 - present)*
I currenly work at Ubisoft. Machine learning in game development is still largely untapped and usually an afterthought. An unannounced title that I am currenly working on does use trained agents! The game is scheduled to be announced later next month, after which, I will be able to post some interesting data!

Projects I have worked on:
1. Unannounced title (due release early 2018) - A web game (for desktop and mobile) that focusses on rigid body physics. The game has an experimental mode that uses agents trained with policy gradient and NEAT.

2. Rendering Engine - This is a webgl rendering engine that focuses on speed and mobile support. I started writing the engine as discrete components that worked with existing open source frameworks to assist in rendering. With time, this became a complete standalone rendering engine. Some parts of the engine will eventually be open source ([a post to get you started]({{ site.baseurl }}{% post_url 2017-6-8-phaser-shaders %})).    

3. Focus Framework - I developed (and maintain) an interactive focus engine (used in production by Ubisoft for microconsoles) which conforms to the [html user interaction standard](https://html.spec.whatwg.org/multipage/interaction.html), provides spatial navigation, text and graph based rule parsing. Written in c++, it can be easily dropped in as a library to an existing interface that needs keyboard/controller/remote support. Some parts of the framework (specially parts that implement the html user interaction standard) will soon be open source my git.

4. [Trials Frontier](https://www.ubisoft.com/en-us/game/trials-frontier/) - I briefly worked on in-game content and bike physics. 


## BMC Software
#### *Software Development Project Intern  (August 2015 - july 2016)*
I worked with a team of two for BMC Software as a project intern.

1. We developed a Log Event analysis tool using a variation of the Rete algorithm for real time analysis of network events.
2. The tool could perform event log associations, determine root cause of an event and suggest a prognosis for a chain of dependent events in real time. 
3. Because BMC stored network logs, we had tons of data. Using the Log Event tool, we labeled(security levels) the data. A Neural Network was then trained on this data and could predict log severity in real time. I wrote a RNN (LSTM), which was trained on associated sequences from the archived logs. By continuously evaluating live logs, the RNN could predict and warn about potential failures ahead of time



[Get a compressed version]({{ "/assets/read/GauravDixit.pdf" | absolute_url }}) of me.
