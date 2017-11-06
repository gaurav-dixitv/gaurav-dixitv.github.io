---
layout: post
title:  "shaders with phaser!"
date:   2017-6-8 00:00:00 +0530
categories: phaser
excerpt: "use custom vertex and fragment shaders with phaser."
comments: true

loadScripts: false
scripts: []
simulation: ["/assets/simulations/customShader/index.html"]
---


[Phaser](https://phaser.io/) is a game engine for the web. Build on top of [PIXI](http://www.pixijs.com/), it provides a pretty robust environment for building web games.
Up top, is the phaser mascot - tweening like there is no tomorrow - with a custom written shader on top of it that plays well with Phaser's rendering engine (well there is some tussle between Phaser's rendering engine and the custom written rendering code, but more on that later).

Back in May2017, I started work on an upcoming Ubisoft title that would be Ubisoft's first on the web (mobile web to be precise). Phaser seemed like an obvious choice. You also get TypeScript Declaration files out of the box - I usually prefer TypeScript over JS for a variety of reasons, including type checking and clean oject oriented design.
The game uses a ton of rigid body physics which is computationally expensive. Since cutting down on physics was not an option, and since your run-of-the-mill mobile CPU is now already overworked, rendering had to be really fast; And ideally, completely done on the GPU with minimal CPU needs. Phaser did a reasonbly good job. But with the multitude of mobile devices with varing specs floating around, maintaing a high and consistent framerate, speically on low end devices was hard. Eventually, I had to write a rendering engine that was specifically designed to target mobile web and was really really fast. The engine is in no way as generic as Phaser/PIXI, nor does it provide as many features. But what it does, it does it very effeciently. Also, since I was writing it ground up, it could easily accomodate very specific needs. For every state other than the actual gameplay, Phaser is still used - not just because these states do not have very high computation demands, but also becuase Phaser eases development of things like state management, tween, texts et cetera. 

In a series of posts, I will chalk out the entire rendering engine (code will be on my git) and how you can extend it to suite your needs or potentially write one yourself.

The first step - let's write some webgl code to create a quad and then slap a shader program on top of it.
Your own rendering code and Phaser's rendering engine can co-exist for the most part. For this post, they will co-exist. Perhaps, you can use this to create post processing effects - Phaser will render the game/simulation, then your run your own shader programs.

## Diving In

Let's start by creating a class/module which will be the entry point of our renderer.

{% highlight js %}

export class GRenderer {

    public constructor(game: Phaser.Game) {
        /*
         *  grab/generate shader programs. Compile, link and build them. 
         *  Get the browser's webgl context.
         *  Initialize buffers, uniforms, and upload.
         */
        this.init();
    }

    //Buffers
    private mVertexBuffer: WebGLBuffer;
    private mIndexBuffer: WebGLBuffer;

    //Attribute locations
    private mAVertexCoordsLocation: number;

    //Uniform locations
    private mUClipMatrixLocation: WebGLUniformLocation;

    //Programs
    private mShaderProgram: WebGLProgram;
    private mOriginalProgram: WebGLProgram;

    private gl: WebGLRenderingContext;
}

{% endhighlight %}

Since we are working alongside Phaser's rendering, we need to save a reference to Phaser's shader program to be able to restore it after we are done rendering.

{% highlight js %}
    private init() {
        let currentProgram = this.gl.getParameter(this.gl.CURRENT_PROGRAM); //A reference to Phaser's shader program.
        if (currentProgram) this.mOriginalProgram = currentProgram;
        else if (DEBUG) console.warn("GRenderer: Did not save a program to restore.");
        this.useProgram();
        this.createBuffers();
        this.initGLSLParameters();
        this.initBuffers();
    }
{% endhighlight %}

I will not write the theory explaining what a fragment/vertex shader is. In fact, I will only write about everything you need to know to get your own rendering code running along with (or independently from) Phaser. For everything webgl, there's Google :). Also, [this](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API) amazing reference from Mozilla.

Alright. Let's keep the fragment and vertex shader super simple for now.
The fragment shader just returns a color.

{% highlight glsl %}
precision mediump float;

void main(void) { 
    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.3); //Return a black tint, because meh. 
}
{% endhighlight %}

`medium precision float`, because some mobile devices with low spec'd gpus will not support `high precision`.

The vertex shader returns the view postion transformed to `clip space`.
{% highlight glsl %}
attribute vec3 aVertexPosition; //Provides data from the attached (vertex) buffer

uniform mat3 clipMatrix;    //Converts view coordinates to clip coordinates.

void main() {
    vec3 translated = clipMatrix * vec3(aVertexPosition.xy,1);
    gl_Position = vec4(translated.x, -translated.y, 0, 1);
}
{% endhighlight %}

Now, let's add a quad that covers the screen.

{% highlight js %}
public addPostProcessingQuad() {

    let width = this.screen.width;
    let height = this.screen.height;
    let x = 0;
    let y = 0;

    let vertices: number[] = [];
    let indices: number[] = [];

    /*
     *  Tranform coordinates using 0 rotation and anchors at 0, 0
     *  This will be useful later when we do have some rotation and anchors. 
     */
    let cosr = Math.cos(0);
    let sinr = Math.sin(0);
    let anchorX = 0;
    let anchorY = 0;

    let x0 = ((- width * anchorX) * cosr - (-height * anchorY) * sinr) + x;
    let y0 = ((- width * anchorX) * sinr + (-height * anchorY) * cosr) + y;

    let x1 = ((- width * anchorX) * cosr - (height * (1 - anchorY)) * sinr) + x;
    let y1 = ((- width * anchorX) * sinr + (height * (1 - anchorY)) * cosr) + y;

    let x2 = ((width * (1 - anchorX)) * cosr - (height * (1 - anchorY)) * sinr) + x;
    let y2 = ((width * (1 - anchorX)) * sinr + (height * (1 - anchorY)) * cosr) + y;

    let x3 = ((width * (1 - anchorX)) * cosr - (-height * anchorY) * sinr) + x;
    let y3 = ((width * (1 - anchorX)) * sinr + (-height * anchorY) * cosr) + y;

    //bottom left
    vertices[vertices.length] = x0;
    vertices[vertices.length] = y0;
    //top left
    vertices[vertices.length] = x1;
    vertices[vertices.length] = y1;
    //top right
    vertices[vertices.length] = x2;
    vertices[vertices.length] = y2;
    //bottom right
    vertices[vertices.length] = x3;
    vertices[vertices.length] = y3;

    indices[indices.length] = this.mIndexCount;
    indices[indices.length] = this.mIndexCount + 1;
    indices[indices.length] = this.mIndexCount + 2;
    indices[indices.length] = this.mIndexCount;
    indices[indices.length] = this.mIndexCount + 2;
    indices[indices.length] = this.mIndexCount + 3;
    this.mIndexCount += 4;

    this.uploadData(vertices, indices); //Binds buffers and uploads them.
}
{% endhighlight %}

Now that the data for this quad is uploaded, when we make a draw call, the vertex shader will transform every vertex to `clip space`. Notice we used `screen.width/height` to calculate the vertices. In WebGL, the clip space is `-1.0` to `1.0` on both the axes. The `clipMatrix` will perform this transform. For every fragment in the quad, the fragment shader is called, which returns a black tint. All that needs to be done now to see the black tint convering the entire screen, is make a draw call.

{% highlight js %}
public render() {

    //Bind the vextex and index buffer
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.mVertexBuffer);
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.mIndexBuffer);

    //Bind the attribure aVertexPosition to the buffer at ARRAY_BUFFER. Grab 2 gl.FLOATS per fetch.
    this.gl.enableVertexAttribArray(this.mAVertexCoordsLocation);
    this.gl.vertexAttribPointer(this.mAVertexCoordsLocation, 2, this.gl.FLOAT, false, 0, 0);

    //Draw everything!
    this.gl.drawElements(this.gl.TRIANGLES, this.mDrawElementsCount, this.gl.UNSIGNED_SHORT, 0);
}
{% endhighlight %}

Oh but wait. Who calls `render()`? Since we are rendering alongwith Phaser, we need to call `render()` from our Phaser state code. Also, after every `render()`,Phaser's program should be restored for it to be able to render the next frame.
Convenient functions for using our prgroam and restoring Phaser's program:

{% highlight js %}
public restoreProgram() {
    if (this.mOriginalProgram) this.gl.useProgram(this.mOriginalProgram);
    else if (DEBUG) console.warn("GRenderer: Could not restore program.");
}
public useProgram() {
    if (this.mShaderProgram) this.gl.useProgram(this.mShaderProgram);
    else if (DEBUG) console.warn("GRenderer: Could not use program.");
}
{% endhighlight %}

And the Phaser state's `render()` now looks like:

{% highlight js %}
public render() {
    this.gRenderer.useProgram();
    this.gRenderer.render();
    this.gRenderer.restoreProgram();
}
{% endhighlight %}


This should now render a tinted quad over your game/simulation!
Adding a post processing effect now should be fairly straightforward. Write your code in the fragment shader, sit back and enjoy the view.
