---
layout: post
title:  "curriculum generation with simultaneous agent and environment competitive learning"
date:   2019-04-15 00:00:01 -0700
last_edited: 2019-04-15 00:00:01 -0700
categories: rl
excerpt: "agents vs environments"

loadScripts: false
scripts: []
---

![Trials Env]({{ "/assets/images/trials_agents_vs_envs/trials_env_low_fps.gif" | absolute_url }})

About a month ago, I had this idea for a prototype. A learning mechanism to enable more generalized Reinforcement Learning (RL). I started working on it with the [Bipedal Walker](https://gym.openai.com/envs/BipedalWalker-v2/){:target="_blank"} environment. After some tests, it was clear that I needed an environment that was easier to scale up in difficulty near linearly. The Bipedal Environment becomes harder almost exponentially when you start diversifying it. I designed a [Trials](https://www.ubisoft.com/en-us/game/trials-rising/){:target="_blank"}-like environment that was fairly easy to scale up in terms of difficulty. Below is a summary of everything that has been done so far.

### Background
Agents are typically trained in an environment and evaluated on similar environments. A good example is agents that learn to play Atari games [[1](https://www.cs.toronto.edu/~vmnih/docs/dqn.pdf)]. When you need agents to play in new environments, they need to be retrained. This also holds for when the original environment is scaled up in terms of diversity/difficulty. For example, adding a slightly new mechanic in the game Breakout will need you to retrain your agent on this modified environment. This is because agents don't necessarily learn the dynamics of the environment to an extent where they can extrapolate new mechanics and be good at them without the need for re-training. To put it another way, most RL techniques you see in the wild are model-free -- agents don't learn to model the environment. A interesting research direction that uses model based RL: using Bayesian learning to model environments [[2](https://people.eecs.berkeley.edu/~avivt/BRLS_journal.pdf)].

### Agents vs Environments
A cool way to try and generalize what an agent learns (and effectively learn the environment dynamics to some degree), would be to train it in variants of the same environment. But how would you increase diversity and still make sure that your agent can actually keep up with these more difficult tasks? A quick dive into competitive RL: agents are trained on minimizing the reward of other agents in the environment. This was the necessary insight needed to answer the above question. Environments and Agents compete! So instead of just the agents learning, we now train two things: the environment and the agents. Initially, the environment has high positive rewards since the agent is not able to do well. When the agent starts learning, the agent reward increases and the environment's rewards start to decrease. Since both the environment and the agent are trying to maximize their rewards, the environment will try to change itself in ways that gets it higher rewards (which in turn means the agent gets low rewards again!). This change in the environment is introduced as diversity. This ping-pong between the agent and the environment can be trained for arbitrarily long periods until you are satisfied with the complexity of the environment and the agent's performance. This competitive reward dynamic between the agent and the environment helps both of them to become better -- the agent learns to generalize very well to changing environments.

### Applications
1. Agents that learn sufficient environment dynamics and not just it's initial structure/distribution but are still model-free.
2. For testing. When you have a system with certain parameters (in this case an environment with its hyperparameters that generate it), you can use this agents vs environments arrangement to discover and test corner cases. The environment maximizes its reward which is inversely proportional to the agent's performance -- In corner cases, the environment is likely to be "broken" which will cause the agent to do poorly on it.
3. To build a curriculum: Because both the agent and the environment evolve to get better together, the changes in the environment form a natural curriculum. You cannot really learn calculus when you don't understand linear algebra! You need a curriculum that guides you smoothly through this process of learning linear algebra to all the way up to calculus and beyond. Results from below experiments show that agents, in fact, struggle to learn anything at all if placed in hard environments. But when you use the agents vs environments method, the naturally generated curriculum enables the agent to learn and do well on these hard environments.

### Experiments
1. Bipedal Walker: This is a fairly common environment used in my lab for prototyping. It was great to get some initial results to test this idea. The problem is, it is very difficult for environments to increase diversity at a generally steady pace. With a few minor changes in the dynamics, the task becomes exponentially harder and the agents fail to learn good policies.
2. Trials: In many ways, it is sufficiently easy to increase the difficulty of navigating a terrain. You start with a linear driving line and go from there. As the environments becomes harder, they start introducing noise to this linear driving line. More noise leads to interesting patterns that might be difficult to navigate for the agent. Some interesting patterns (a pit for example), diversify to become more complex by placing themselves at strategic places on the driving line.
This might make you wonder -- what makes the environment not go absolutely wild and generate a driving line that is impossible for the agent to learn? Well, the reward of the environment is not just the inverse of the agent's performance. It is a weighted sum of the inverse of the agent's performance and the delta between the previous environment and the current environment. So if the environment generates a bizarre driving line that will be impossible to learn, it gets low rewards and will be pruned in the next iteration.

### Implementation details:
1. Python
2. Physics - Box2D
3. Rendering - opengl
4. Neural networks - Tensorflow
5. Environments learn using: Evolution Strategies (ES), Minimal Criterion Coevolution
6. Agents learn using: Proximal Policy Optimization (PPO), Trust Region Policy Optimization (TRPO)

### Results
(The actions taken by the agent can be seen as filled controls in the D-pad-like UI)
1. Linear Driving Line: This is the base enviroment. Enviroments evolve from here.
    <br/><br/>
    <iframe width="560" height="315" src="https://www.youtube.com/embed/5XyiCdBMel8" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
2. Noisy Driving Line: The environments start introducing noise to the driving line after a few hundred epochs.
    <br/><br/>
    <iframe width="560" height="315" src="https://www.youtube.com/embed/AV_yiegBozo" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
3. Driving line with structures: After a few thousand epocs, the environments start using patterns strategically to make it harder for agents to learn. Agents learn their own form of `bunny hop`. I am not really sure if it counts as a `bunny hop` really, but agents learns to hop over pits.
    <br/><br/>
    <iframe width="560" height="315" src="https://www.youtube.com/embed/2nsjAC8aags" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

An interesting observation: Back when I implemented the Trials environment, changing reward dynamics enabled the agent to do tricks. For example, rewarding wheelies promoted the behavior of completing tracks on the rear wheel. Turns out, this is a local optimum! It is in fact not very hard to learn and most agents will learn it without an explicit reward dynamic. The intuition is that agents that can learn to balance on a wheel can effectively start to ignore the driving line largely and just focus on balancing to complete a track. This becomes an easier problem for the agent to solve! It is actually rather difficult to shape rewards that discourage this behavior. In some tests, the agent did end up learning to do just this. One of the ways to mitigate this was to weigh in the speed of the agent during reward computation. This was usually enough to knock it out of this local optimum. 

![Trials Env]({{ "/assets/images/trials_agents_vs_envs/plot.png" | absolute_url }})


Code for the Trials environment is available on my [github](https://github.com/{{site.github_username}}/trials). The agents vs environments code will be made available soon.
