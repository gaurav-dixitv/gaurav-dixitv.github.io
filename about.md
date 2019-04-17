---
layout: about
title: me
permalink: /about/

excerpt: "I love writing code and building intelligent systems. Reinforcement learning intrigues me. I have built some reasonably smart <a href=\"/apps\" target=\"_blank\">apps</a> that experiment with learning techniques.
I closely follow the design and evolution of c++ (my c++20 favorites are <a href=\"http://www.open-std.org/jtc1/sc22/wg21/docs/papers/2018/p0542r5.html\" target=\"_blank\"> contracts</a> and <a href=\"http://www.open-std.org/jtc1/sc22/wg21/docs/papers/2019/p0848r1.html\" target=\"_blank\">conditional triviality</a>) -- come say hi to us on <a href=\"https://cpplang.now.sh/\" target=\"_blank\">slack</a>.
When I am not with my computer, you will probably find me jamming on my guitar, gazing at the night sky (tell me <a href=\"https://en.wikipedia.org/wiki/HH_34\" target=\"_blank\">hh34</a> is not beautiful, seriously) or sleeping."

profileUrl: "/assets/images/profile.png" 
---

## Collaborative Robotics and Intelligent Systems (CoRIS) Institute
#### *Graduate Research Assistant (august 2018 - present)*
I work on multiagent reinforcement learning (RL). I am particularly interested in heterogenous cooperative/competitive multiagent domains. My current research also involves agent/world modelling and Bayesian RL.

1. Dirichlet-Multinomial Counterfactual Rewards for Heterogeneous Multiagent Systems (MRS 2019): We introduce a Bayesian inference based selection mechanism for choosing hypothetical partners which improves learned coordination behaviors in heterogeneous tightly-coupled systems. We also show the reduced difficulty in learning effective coordination strategies by incorporating prior domain knowledge into the selection mechanism. Our method outperforms the baseline by over 40%.


## Ubisoft
#### *Programmer (august 2016 - june 2018)*
I worked at Ubisoft as a programmer on various projects supporting physics, rendering, machine learning, automation and language design.
Some of them include,
1. Trials Instant (due release later this year) - Developed a physics based web game in Typescript, Node.js and AWS. Implemented trained agents using policy gradients and NEAT. I was the only programmer in the team until after it was successfully soft-launched.

2. Rendering Engine - A webgl rendering engine that focuses on speed and mobile support. I started writing the engine as discrete components that worked with an existing open source framework ([PixiJS](http://www.pixijs.com/)) for enhanced rendering support. With time, this became a standalone rendering engine. Some parts of the engine will eventually be open sourced ([a post to get you started]({{ site.baseurl }}{% post_url 2017-6-8-phaser-shaders %})).    

3. Focus Framework - I developed (and maintain) an interactive focus engine (used in production by Ubisoft for microconsoles) which conforms to the [html user interaction standard](https://html.spec.whatwg.org/multipage/interaction.html), provides spatial navigation, text and graph based rule parsing. Written in c++, it can be easily dropped in as a library to an existing interface that needs keyboard/controller/remote support. Some parts of the framework (specially parts that implement the html user interaction standard) will be open sourced soon.

4. [Trials Frontier](https://www.ubisoft.com/en-us/game/trials-frontier/) -  Implemented new in-game content and improved the engine to bring down the crash ratio by up to 75%. The title has 60 million+ users on Android and IOS.


## BMC Software
#### *Software Development Project Intern  (august 2015 - july 2016)*
I worked for BMC Software as a project intern.

1. Developed a Log Event analysis tool using a variation of the Rete algorithm for real time analysis of network events in Java. The tool could perform event log associations, determine root cause of an event and suggest a prognosis for a chain of dependent events in real time. 
2. Because BMC stored network logs, we had tons of data. Using the Log Event tool, we labeled(security levels) the data. A Neural Network was then trained on this data and could predict log severity in real time. I wrote a RNN (LSTM), which was trained on associated sequences from the archived logs. By continuously evaluating live logs, the RNN could predict and warn about potential failures ahead of time.


[Get a compressed version]({{ "/assets/read/GauravDixit.pdf" | absolute_url }}) of me.
