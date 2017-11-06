---
layout: post
title:  "extending gl_repeat to multiple quads"
date:   2017-7-27 00:00:00 +0530
categories: phaser
excerpt: "extending gl_repeat."
comments: true

loadScripts: false
scripts: []
simulation: ["/assets/simulations/glRepeat/index.html"]
---

WebGL and openGL support texture wrapping. `GL_REPEAT` will ignore the integer part of a texture coordinate - which esentially means that the texture will be repeated over the quad.
Alright perfect. Now how does `GL_REPEAT` really work? How does 'ignores the integer part of a coordinate' make sense?
Well, texture coordinates go from `0.0` to `1.0`, in both `x` and `y`.

Suppose you have a `64x64` texture. You want a quad to render the entire texture. The texture coordinates would then look like:
{% highlight js %}
bottom left = ( 0.0, 0.0) 
top left = ( 0.0, 1.0)
bottom right = ( 1.0, 0.0)
top right = ( 1.0, 1.0)
{% endhighlight %}

For the repeated texture you see above (the texture is a `512x512` red square with the numbers 1..3 in blue), the texture coordinates will be
![Texture coordinates]({{ "/assets/images/gl_repeat/textureCoords.png" | absolute_url }})

If I wanted this texture to repeat twice in the x direction, the coordinates would be
{% highlight js %}
bottom left = ( 0.0, 0.0) 
top left = ( 0.0, 1.0)
bottom right = ( 2.0, 0.0)
top right = ( 2.0, 1.0)
{% endhighlight %}

Since `GL_REPEAT` ignores the integral part of a coordinate, it sees this as `0.0` to `0.999` (well upto `1.0` really) and then a `0.0` to `1.0` again. Which means, the entire texture will be repeated in x twice!

If you wanted a texture to seamlessly wrap around a bunch of quads, all you need now is to offset the texture coordinates (`uvs`) and `GL_REPEAT` over every quad! 
Drag the simulation you see up top. Every sharp edge you see marks the end of a quad. The texture (a `512x512` red square with the numbers 1..3 in blue) seamlessly repeats over adjacent quads.

## Extending REPEAT in WebGL

In WebGL, to use REPEAT:

{% highlight js %}
this.gl.activeTexture(this.gl.TEXTURE0 + 0);        //Binding to the first texture unit.
let glTexture = this.gl.createTexture();            //Create a texture object.
this.gl.bindTexture(this.gl.TEXTURE_2D, glTexture); //The TEXTURE_2D bind point now points to glTexture.
this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT);  //REPEAT texture u (x)
this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT);  //REPEAT texture v (y)

//MAG and MIN filters
this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_NEAREST);  
this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
//Set if alpha is premultiplied with the texture.
this.gl.pixelStorei(this.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, texture.texture.baseTexture.premultipliedAlpha);
//Upload texture.
this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, texture.texture.baseTexture.source);
this.gl.generateMipmap(this.gl.TEXTURE_2D);         //Assume this is a POT texture.

{% endhighlight %}

Let's define a point interface for convenience
{% highlight js %}
interface GPoint {
    x: number;
    y: number;
}
{% endhighlight %}

Create a random set of adjacent quads using cosine interpolation.
{% highlight js %}
private createPath() {
    let interpolatedPoints: GPoint[] = [];
    let width = this.game.world.width * 1.5;    
    let wavelength = Math.floor(800 * Utils.deviceConfig.scaleFactor());
    let amplitude = Math.floor(900 * Utils.deviceConfig.scaleFactor());
    let x = 0;
    let a = 0;
    let b = 0;
    while (x < width) {
        if (x % wavelength === 0) {
            a = b;
            b = Math.random();
            interpolatedPoints.push({ x: x, y: a * amplitude });
        } else {
            let y = Utils.functions.Interpolate(a, b, (x % wavelength) / wavelength) * amplitude;
            interpolatedPoints.push({ x: x, y: y });
        }
        ++x;
    }

    //Sample points from interpolatedPoints to be used as quad coords.
    let gpoints: GPoint[] = [];
    let skipFactor = Math.floor(300 * Utils.deviceConfig.scaleFactor());    //Don't want too many small quads.
    for (let i = 0; i + skipFactor < interpolatedPoints.length; i += skipFactor) {
        gpoints.push({ x: interpolatedPoints[i].x, y: interpolatedPoints[i].y });       //top left coordinate of the quad
        gpoints.push({ x: interpolatedPoints[i + skipFactor].x, y: interpolatedPoints[i + skipFactor].y }); //top right coordinate of the quad
    }
    this.gRenderer.addRawRepeatingTexture(gpoints, 'untitled');
}
{% endhighlight %}

Where cosine interpolation is defined as
{% highlight js %}
    export function Interpolate(pa, pb, px) {
        let f = (1 - Math.cos(px * Math.PI)) * 0.5;
        return pa * (1 - f) + pb * f;
    }
{% endhighlight %}

Now that we have these coordinates, let's create quads that use the texture at `TEXTURE0`.

{% highlight js %}
public addRawRepeatingTexture(rawData: GPoint[]) {

        let width = texture.width;

        /* 
         * GPoints give us the top left and top right coordinates. 
         * Assuming every quad has a heigh of 1000,
         * we have the bottom left coordinate = ((top left).x, (top left).y + 1000) 
         * and the bottom right coordinate = ((top right).x, (top right).y + 1000)
         */
        let verticalExtendedLength = 1000;  
        
        let repeatYCount = (verticalExtendedLength / width); 
        //If every quad was a square, you would need to repeat in Y reapeatYCount times.

        let lastU = 0.0;    //texture u from last quad
        let lastV = 0.0;    //texture v from last quad

        let vertices: number[] = [];
        let textureCoords: number[] = [];

        for (let i = 0; i < rawData.length; i += 2) {

            //bottom left
            vertices[vertices.length] = rawData[i].x;
            vertices[vertices.length] = rawData[i].y + verticalExtendedLength;

            //top left
            vertices[vertices.length] = rawData[i].x;
            vertices[vertices.length] = rawData[i].y;

            //top right
            vertices[vertices.length] = rawData[i + 1].x;
            vertices[vertices.length] = rawData[i + 1].y;

            //bottom right
            vertices[vertices.length] = rawData[i + 1].x;
            vertices[vertices.length] = rawData[i + 1].y + verticalExtendedLength;

            let factor = (rawData[i + 1].x - rawData[i].x) / width; 
            //factor is number of times you need to repeat in x

            let y1 = ((rawData[i].y + verticalExtendedLength) - rawData[i].y);
            let y2 = ((rawData[i].y + verticalExtendedLength) - rawData[i + 1].y);
            let percent = (y1 - y2) / y1;   //The amount of change in y in current quad = gradient!
            percent *= repeatYCount;        //The actual number of times we need to repeat in y to amount for the gradient

            //bottom left
            textureCoords[textureCoords.length] = lastU;      //Start where the previous quad left off
            textureCoords[textureCoords.length] = repeatYCount + lastV; //The top right v of the previous quad + number of times we need to repeat in y

            //top left
            textureCoords[textureCoords.length] = lastU;      //Start where the previous quad left off
            textureCoords[textureCoords.length] = lastV;      //The top right v of the previous quad.

            //top right
            textureCoords[textureCoords.length] = factor + lastU;   //Current quad's u + the number of times we need to repeat in x
            textureCoords[textureCoords.length] = percent + lastV;  //The top right of the previous quad + ammount of change in y needed in this quad

            //bottom right
            textureCoords[textureCoords.length] = factor + lastU;   //Current quad's u + the number of times we need to repeat in x
            textureCoords[textureCoords.length] = repeatYCount + percent + lastV;   //Times to repeat in y + change in y in current quad + previous quad's last v

            /*
             * For the next quad, we start at the integral part of current quad's u.
             * Suppose you repeated the texture 2.4 times over the current quad, you need to to start the texture from 0.4 in the next * quad.
             */
            lastU = (factor + lastU) - Math.floor(factor + lastU);  
            lastV += percent;
        }

        //upload!
        this.uploadData(vertices, textureCoords);
    }

{% endhighlight %}

Sweet. 
Where do you use this? Umm, anytime you need a texture to repeat over a convex mesh.

Example, a texture of mossy cobble, repeated over many quads to create a path
![wines]({{ "/assets/images/gl_repeat/glrepeat.png" | absoulte_url }})
