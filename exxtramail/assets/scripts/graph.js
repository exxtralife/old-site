class Line extends PIXI.Graphics {
    constructor(points, lineSize, lineColor) {
        super();
        
        var s = this.lineWidth = lineSize || 5;
        var c = this.lineColor = lineColor || "0x000000";
        
        this.points = points;

        this.lineStyle(s, c)

        this.moveTo(points[0], points[1]);
        this.lineTo(points[2], points[3]);
    }
    
    updatePoints(p) {
        
        var points = this.points = p.map((val, index) => val || this.points[index]);
        
        var s = this.lineWidth, c = this.lineColor;
        
        this.clear();
        this.lineStyle(s, c);
        this.moveTo(points[0], points[1]);
        this.lineTo(points[2], points[3]);
    }
}


(async ()=>
{
    var client = document.getElementById("page");

    var w = window.innerWidth;
    var h = window.innerHeight;

    const app = new PIXI.Application();
    await app.init({ background: '#FFFFFF', width: w * 0.989, height: h * 0.982 });
    
    document.getElementById("page").appendChild(app.canvas);

    const hey_image = await PIXI.Assets.load('assets/images/band.png');

    /*
    var particle = new PIXI.Sprite(hey_image);
  

    particle.x = app.screen.width / 2;
    particle.y = app.screen.height / 2;
    particle.anchor.set(0.5);

    app.stage.addChild(particle);
    */


    const thing = new PIXI.Graphics();
    app.stage.addChild(thing);
    thing.x = app.screen.width / 2;
    thing.y = app.screen.height / 2;



    var particle_list = [];

    const circle = await PIXI.Assets.load('assets/images/circle.png');
    
    var ubi_particle = new PIXI.Sprite(circle);
    particle_list.push(ubi_particle);
    var fble_particle = new PIXI.Sprite(circle);
    particle_list.push(fble_particle);

    var mk_particle = new PIXI.Sprite(circle);
    particle_list.push(mk_particle);

    var ash_particle = new PIXI.Sprite(circle);
    particle_list.push(ash_particle);

    var trshgrrrl = new PIXI.Sprite(circle);
    particle_list.push(trshgrrrl);

    for (let index = 0; index < particle_list.length; index++) {
        particle_list[index].anchor.set(0.01);
        particle_list[index].scale = 0.05;
        app.stage.addChild(particle_list[index]);
    }

    var line = new Line([200, 150, 0, 0]);
    app.stage.addChild(line);


    //mouse trail stuff 

    const trailTexture = await PIXI.Assets.load('assets/images/curor.png');
    const historyX = [];
    const historyY = [];
    const historySize = 5;
    const ropeSize = 200;
    const points = [];

    for (let i = 0; i < historySize; i++)
    {
        historyX.push(0);
    
        historyY.push(0);
    }


    for (let i = 0; i < ropeSize; i++)
    {
        points.push(new PIXI.Point(0, 0));
    }
    const rope = new PIXI.MeshRope({ texture: trailTexture, points });
    rope.blendmode = 'add';
    app.stage.addChild(rope);
    let mouseposition = null;


    app.stage.eventMode = 'static';
    app.stage.hitArea = app.screen;
    app.stage.on('mousemove', (event) =>
    {
        mouseposition = mouseposition || { x: 0, y: 0 };
        mouseposition.x = event.global.x;
        mouseposition.y = event.global.y;
    });
    //end of mouse trail stuff

    var whole_time = 0.0;

    app.ticker.add((time) =>
    {


        whole_time += time.deltaTime;
        //particle.rotation = Math.sin(0.01 * whole_time);

        for (let index = 0; index < particle_list.length; index++) {
            particle_list[index].x =  (app.screen.width * 0.5) + app.screen.width * 0.4 * Math.sin(0.01 * (index+1/8) * whole_time + (15 * index));
            particle_list[index].y = (app.screen.height * 0.75) + app.screen.height * 0.1 * Math.sin(0.02 * whole_time + (15 * index));
        }
            

        //mouse trail stuff
        if (!mouseposition) return;

        historyX.pop();
        historyX.unshift(mouseposition.x);
        historyY.pop();
        historyY.unshift(mouseposition.y);

        for (let i = 0; i < ropeSize; i++)
        {
            const p = points[i];

            // Smooth the curve with cubic interpolation to prevent sharp edges.
            const ix = cubicInterpolation(historyX, (i / ropeSize) * historySize);
            const iy = cubicInterpolation(historyY, (i / ropeSize) * historySize);

            p.x = ix;
            p.y = iy;
        }

        thing.clear();
        thing.moveTo(particle_list[1].x, particle_list[1].y)
        thing.lineTo(particle_list[0].x, particle_list[0].y)
        thing.stroke({ width: 0.8, color: 0x000000 });
    });


    ///mouse trail stuff
    function clipInput(k, arr)
    {
        if (k < 0) k = 0;
        if (k > arr.length - 1) k = arr.length - 1;

        return arr[k];
    }

    function getTangent(k, factor, array)
    {
        return (factor * (clipInput(k + 1, array) - clipInput(k - 1, array))) / 2;
    }

    function cubicInterpolation(array, t, tangentFactor = 1)
    {
        const k = Math.floor(t);
        const m = [getTangent(k, tangentFactor, array), getTangent(k + 1, tangentFactor, array)];
        const p = [clipInput(k, array), clipInput(k + 1, array)];

        t -= k;
        const t2 = t * t;
        const t3 = t * t2;

        return (2 * t3 - 3 * t2 + 1) * p[0] + (t3 - 2 * t2 + t) * m[0] + (-2 * t3 + 3 * t2) * p[1] + (t3 - t2) * m[1];
    }
})(); 