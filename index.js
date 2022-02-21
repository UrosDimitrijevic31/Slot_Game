const app = new PIXI.Application({ backgroundColor: 0x0f1a44 });
document.body.appendChild(app.view); //ovako se kreira canvas element


class Information {
    constructor(credit, bet, win) {
        this.credit = 1000;
        this.bet     = 1;
        this.win     = 0;
        this.maxBet  = 100;
        this.oneBet  = 1;
        this.playing = false;

        this.addBet = function () {
            //Add bet with one point till it equals to three
            if (playerInformation.bet >= 1 && playerInformation.bet <= 100) {
                playerInformation.bet ++;
            }
        };
        this.minusBet = function minusBet() {
            //Reduce bet one point till it equals to 1
            if (playerInformation.bet > 1) {
                playerInformation.bet --;
            }
        };
        this.reduceCredit = function (){
            //Reduce credit when player press on spin button
            this.credit = this.credit - this.bet;
        }
        this.reduceBetMax = function (){
            //Reduce bet when player press on maxBet button
            this.bet = this.maxBet;
        }
        this.reduceBetOne = function (){
            //Reduce bet when player press on maxBet button
            this.bet = this.oneBEt;
        }
    }
}
let playerInformation = new Information();


app.loader
    .add('banana',      './assets/images/bananaSlot_250x250.png')
    .add('cherry',      './assets/images/cherrySlot_250x250.png')
    .add('lemon',       './assets/images/lemonSlot_250x250.png')
    .add('seven',       './assets/images/sevenSlot_250x250.png')
    .add('betOne',      './assets/images/betOne.png')
    .add('betMax',      './assets/images/betMax.png')
    .add('spinVisible', './assets/images/spin_visible.png')
    .add('spinHidden',  './assets/images/spin_hidden.png' )
    .load(onAssetsLoaded);

let banana      = PIXI.Texture.from("./assets/images/bananaSlot_250x250.png");
let cherry      = PIXI.Texture.from("./assets/images/cherrySlot_250x250.png");
let lemon       = PIXI.Texture.from("./assets/images/lemonSlot_250x250.png"); 
let seven       = PIXI.Texture.from("./assets/images/sevenSlot_250x250.png");
let betOne      = PIXI.Texture.from("./assets/images/betOne.png");
let betMax      = PIXI.Texture.from("./assets/images/betMax.png");
let spinVisible = PIXI.Texture.from("./assets/images/spin_visible.png");
let spinHidden  = PIXI.Texture.from("./assets/images/spin_hidden.png");
  
const REEL_WIDTH = 160; //200 je ok
const SYMBOL_SIZE = 150; //190

// onAssetsLoaded handler builds the example.
function onAssetsLoaded() {
    // Create different slot symbols.
    const slotTextures = [
        banana,
        cherry,
        lemon,
        seven
    ];

    // Build the reels
    const reels = [];
    const reelContainer = new PIXI.Container(); //ovo je veliki container za reelove

    for (let i = 0; i < 3; i++) {
        const rc = new PIXI.Container();
        rc.x = i * REEL_WIDTH;
        reelContainer.addChild(rc);

        const reel = {
            container: rc,
            symbols: [],
            position: 0,
            previousPosition: 0,
            blur: new PIXI.filters.BlurFilter(),
        };
        reel.blur.blurX = 0;
        reel.blur.blurY = 0;
        rc.filters = [reel.blur];

        // Build the symbols
        for (let j = 0; j < 4; j++) {
            const symbol = new PIXI.Sprite(slotTextures[Math.floor(Math.random() * slotTextures.length)]);
            // Scale the symbol to fit symbol area.
            symbol.y = j * SYMBOL_SIZE;
            symbol.scale.x = symbol.scale.y = Math.min(SYMBOL_SIZE / symbol.width, SYMBOL_SIZE / symbol.height);
            symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
            reel.symbols.push(symbol);
            rc.addChild(symbol);
        }
        reels.push(reel);   
    }
    app.stage.addChild(reelContainer);

    // Build top & bottom covers and position reelContainer
    const margin = (app.screen.height - SYMBOL_SIZE * 3) / 2; //75 - ovde podesavam top & bottom
    reelContainer.y = margin;
    reelContainer.x = Math.round(app.screen.width - REEL_WIDTH * 4); //160

    const topContainer = new PIXI.Container();

    const top = new PIXI.Graphics();
    top.beginFill(0, 1);        
    top.drawRect(0, 0, app.screen.width, margin);
    topContainer.addChild(top)

    const bottomContainer = new PIXI.Container();
    const bottom = new PIXI.Graphics();
    bottom.beginFill(0, 1);
    bottom.drawRect(0, SYMBOL_SIZE * 3 + margin, app.screen.width, margin);
    bottomContainer.addChild(bottom);

    

    // Add play text
    const style = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 36,
        fontStyle: 'italic',
        fontWeight: 'bold',
        fill: ['#ffffff', '#00ff99'], // gradient
        stroke: '#4a1850',
        strokeThickness: 5,
        dropShadow: true,
        dropShadowColor: '#000000',
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 6,
        wordWrap: true,
        wordWrapWidth: 440,
    });

    const playText = new PIXI.Text('Spin!', style);
    playText.x = Math.round((bottom.width - playText.width) / 2);
    playText.y = app.screen.height - margin + Math.round((margin - playText.height) / 2);
    bottom.addChild(playText);

    // Add header text
    const headerText = new PIXI.Text('EPIC JOKER', style);
    headerText.x = Math.round((top.width - headerText.width) / 2);
    headerText.y = Math.round((margin - headerText.height) / 2);
    top.addChild(headerText);

    //credit rectangle
    const creditDisplay = new PIXI.Graphics();
    creditDisplay.lineStyle(2, 0xFFFFFF, 1);
    creditDisplay.beginFill(0x0f1a44);
    creditDisplay.drawRect(app.screen.width - margin * 2.2, ( margin - 40) / 2 , 140, 40);
    creditDisplay.endFill();

    const informationStyle = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 27,
        fontWeight: 'bold',
        fill: '#ffffff',
        strokeThickness: 1,
        dropShadow: true,
        dropShadowColor: '#000000',
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 1,
        wordWrap: true,
        wordWrapWidth: 300
    });

    //credit display
    const creditText = new PIXI.Text(`${playerInformation.credit}`, informationStyle)
    creditText.x = (app.screen.width - margin * 1.6);
    creditText.y = ( 22.5 ); //treba dobiti matematicki ovo
    creditDisplay.addChild(creditText)

    top.addChild(creditDisplay)

    app.stage.addChild(topContainer);
    app.stage.addChild(bottomContainer);

    // Set the interactivity.
    bottom.interactive = true;
    bottom.buttonMode = true;
    bottom.addListener('pointerdown', () => {
        startPlay();
    });

    let running = false;

    // Function to start playing.
    function startPlay() {
        if (running) return;
        running = true;

        if(playerInformation.credit >= 1 ) {
            playerInformation.reduceCredit();
            console.log(`credit se smanjio i sada iznosi ${playerInformation.credit}`);
            creditText.text = playerInformation.credit;
        } else return;

        for (let i = 0; i < reels.length; i++) {
            const r = reels[i];
            // console.log(r, `ovo su rilovi ${i}`);

            const extra = Math.floor(Math.random() * 3);
            // console.log(extra);

            const target = r.position + 10 + i * 5 + extra;
            // console.log(target);
            
            const time = 2500 + i * 600 + extra * 600;
            tweenTo(r, 'position', target, time, backout(0.5), null, i === reels.length - 1 ? reelsComplete : null);
        }
    }

    // Reels done handler.
    function reelsComplete() {
        running = false;
    }

    // Listen for animate update.
    app.ticker.add((delta) => {
    // Update the slots.
        for (let i = 0; i < reels.length; i++) {
            const r = reels[i];
            // Update blur filter y amount based on speed.
            // This would be better if calculated with time in mind also. Now blur depends on frame rate.
            r.blur.blurY = (r.position - r.previousPosition) * 8;
            r.previousPosition = r.position;

            // Update symbol positions on reel.
            for (let j = 0; j < r.symbols.length; j++) {
                const s = r.symbols[j];
                const prevy = s.y;
                s.y = ((r.position + j) % r.symbols.length) * SYMBOL_SIZE - SYMBOL_SIZE;
                if (s.y < 0 && prevy > SYMBOL_SIZE) {
                    // Detect going over and swap a texture.
                    // This should in proper product be determined from some logical reel.
                    s.texture = slotTextures[Math.floor(Math.random() * slotTextures.length)];
                    s.scale.x = s.scale.y = Math.min(SYMBOL_SIZE / s.texture.width, SYMBOL_SIZE / s.texture.height);
                    s.x = Math.round((SYMBOL_SIZE - s.width) / 2);
                }
            }
        }
    });
}

// Very simple tweening utility function. This should be replaced with a proper tweening library in a real product.
const tweening = [];
function tweenTo(object, property, target, time, easing, onchange, oncomplete) {
    const tween = {
        object,
        property,
        propertyBeginValue: object[property],
        target,
        easing,
        time,
        change: onchange,
        complete: oncomplete,
        start: Date.now(),
    };

    tweening.push(tween);
    return tween;
}
// Listen for animate update.
app.ticker.add((delta) => {
    const now = Date.now();
    const remove = [];
    for (let i = 0; i < tweening.length; i++) {
        const t = tweening[i];
        const phase = Math.min(1, (now - t.start) / t.time);

        t.object[t.property] = lerp(t.propertyBeginValue, t.target, t.easing(phase));
        if (t.change) t.change(t);
        if (phase === 1) {
            t.object[t.property] = t.target;
            if (t.complete) t.complete(t);
            remove.push(t);
        }
    }
    for (let i = 0; i < remove.length; i++) {
        tweening.splice(tweening.indexOf(remove[i]), 1);
    }
});

// Basic lerp funtion.
function lerp(a1, a2, t) {
    return a1 * (1 - t) + a2 * t;
}

// Backout function from tweenjs.
// https://github.com/CreateJS/TweenJS/blob/master/src/tweenjs/Ease.js
function backout(amount) {
    return (t) => (--t * t * ((amount + 1) * t + amount) + 1);
}