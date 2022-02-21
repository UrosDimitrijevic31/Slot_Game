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
            this.bet = this.oneBet;
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
    .add('spinHidden',  './assets/images/spin_hidden.png')
    .add('addBtn',      './assets/images/addBtn.png')
    .add('minusBtn',    './assets/images/minusBtn.png')
    .add('slotLogo',    './assets/images/slots-logo.png')
    .load(onAssetsLoaded);

let banana      = PIXI.Texture.from("./assets/images/bananaSlot_250x250.png");
let cherry      = PIXI.Texture.from("./assets/images/cherrySlot_250x250.png");
let lemon       = PIXI.Texture.from("./assets/images/lemonSlot_250x250.png"); 
let seven       = PIXI.Texture.from("./assets/images/sevenSlot_250x250.png");
let betOne      = PIXI.Texture.from("./assets/images/betOne.png");
let betMax      = PIXI.Texture.from("./assets/images/betMax.png");
let spinVisible = PIXI.Texture.from("./assets/images/spin_visible.png");
let spinHidden  = PIXI.Texture.from("./assets/images/spin_hidden.png");
let addBtn      = PIXI.Texture.from("./assets/images/addBtn.png");
let minusBtn    = PIXI.Texture.from("./assets/images/minusBtn.png");
let slotLogo    = PIXI.Texture.from("./assets/images/slots-logo.png");
  
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

    app.stage.addChild(topContainer);
    app.stage.addChild(bottomContainer);
    
    //add buttons
    const createImageButton = ( interactive, image, audioMP3, audioOGG, x, y, scale ) => {
        const button = PIXI.Sprite.from(image);
        const sound = new Howl({
            src: [audioMP3, audioOGG]
        });
        button.sound = sound;
        button.interactive = interactive;
        button.buttonMode = true;
        button.on('pointerdown', event => sound.play());
        bottom.addChild(button);
        button.x = x;
        button.y = y;
        button.scale.set(scale);
        return button;
    };

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
    const logo = new PIXI.Sprite.from(slotLogo);
    logo.height = top.height + 2;
    logo.x = Math.round((top.width - logo.width) / 2);
    logo.y = 0;
    top.addChild(logo);
    // logo.height = 
    // logo.width  =

    // Add header text
    // const headerText = new PIXI.Text('EPIC JOKER', style);
    // headerText.x = Math.round((top.width - headerText.width) / 2);
    // headerText.y = Math.round((margin - headerText.height) / 2);
    // top.addChild(headerText);

    //credit rectangle
    const creditDisplay = new PIXI.Graphics();
    creditDisplay.lineStyle(2, 0xFFFFFF, 1);
    creditDisplay.beginFill(0x0f1a44);
    creditDisplay.drawRect(app.screen.width - margin * 2.2, ( margin - 40) / 2 , 140, 40);
    creditDisplay.endFill();

    //win rectangle
    const winDisplay = new PIXI.Graphics();
    winDisplay.lineStyle(2, 0xFFFFFF, 1);
    winDisplay.beginFill(0x0f1a44);
    winDisplay.drawRect(Math.round(app.screen.width / 10), Math.round(SYMBOL_SIZE * 3 + margin + (top.height / 6)) , 140, 40);
    winDisplay.endFill();

    //bet rectangle
    const betDisplay = new PIXI.Graphics();
    betDisplay.lineStyle(2, 0xFFFFFF, 1);
    betDisplay.beginFill(0x0f1a44);
    betDisplay.drawRect(Math.round((app.screen.width) - (app.screen.width / 4.5)), Math.round(SYMBOL_SIZE * 3 + margin + (top.height / 6)) , 80, 40);
    betDisplay.endFill();

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

    const labelText = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 15,
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

    //credit value
    const creditValue = new PIXI.Text(`${playerInformation.credit}`, informationStyle)
    creditValue.x = (app.screen.width - margin * 1.6);
    creditValue.y = ( 22.5 ); //treba dobiti matematicki ovo
    creditDisplay.addChild(creditValue)
    top.addChild(creditDisplay)

    //win value
    const winValue = new PIXI.Text(`${playerInformation.win}`, informationStyle)
    winValue.x = Math.round(Math.round((app.screen.width / 10) + winDisplay.width / 2.2) );
    winValue.y = (app.screen.height - margin * 0.8 ); // todo treba dobiti matematicki ovo
    winDisplay.addChild(winValue)
    bottom.addChild(winDisplay)

    //bet value
    const betValue = new PIXI.Text(`${playerInformation.bet}`, informationStyle)
    betValue.x = Math.round((app.screen.width) - (app.screen.width / 4) + betDisplay.width / 2);
    betValue.y = (app.screen.height - margin * 0.8); // todo treba dobiti matematicki ovo
    betDisplay.addChild(betValue)
    bottom.addChild(betDisplay)
    
    //credit text
    const creditText = new PIXI.Text('CREDIT', labelText)
    creditText.x = Math.round(app.screen.width - margin * 1.6);
    creditText.y = (58); // todo treba dobiti matematicki ovo
    bottom.addChild(winDisplay, creditText)

    //win text
    const winText = new PIXI.Text('WIN', labelText)
    winText.x = Math.round((app.screen.width / 10) + winDisplay.width / 2.5);
    winText.y = (app.screen.height - 20 ); // todo treba dobiti matematicki ovo
    bottom.addChild(winDisplay, winText)

    //bet text
    const betText = new PIXI.Text(`BET`, labelText)
    betText.x = Math.round((app.screen.width) - (betDisplay.width * 1.9 ) );
    betText.y = (app.screen.height - 20); // todo treba dobiti matematicki ovo
    bottom.addChild(betDisplay, betText)



    const activeSpinButton = createImageButton(
        true,
        spinVisible,
        './assets/sounds/mp3/spin_sound.mp3',
        './assets/sounds/ogg/spin_sound.ogg',
        Math.round((bottom.width - 75) / 2), // ToDo 75 -> image.width - srediti da bude dinamcki !!
        (app.screen.height - margin - 10) ,
        0.35
    ); 

    // ToDo napraviti kad se vrti reel da bude slika druga i da bude disable
    const betOneButton = createImageButton(
        true,
        betOne,
        './assets/sounds/mp3/bet_sound.mp3',
        './assets/sounds/ogg/bet_sound.ogg',
        Math.round((bottom.width - 75) / 2 - 80 ) , // ToDo 75 -> image.width - srediti da bude dinamcki !!
        (app.screen.height - margin + 5) ,
        0.75
    ); 
    const betMaxButton = createImageButton( 
        true,
        betMax,
        './assets/sounds/mp3/bet_sound.mp3',
        './assets/sounds/ogg/bet_sound.ogg',
        Math.round((bottom.width - 75) / 2 + 100), // ToDo 75 -> image.width - srediti da bude dinamcki !!
        (app.screen.height - margin + 5) ,
        0.75
    ); 
    const addButton = createImageButton( 
        true,
        addBtn,
        './assets/sounds/mp3/bet_sound.mp3',
        './assets/sounds/ogg/bet_sound.ogg',
        Math.round((app.screen.width) - (app.screen.width / 8.3)), // ToDo 75 -> image.width - srediti da bude dinamcki !!
        Math.round((app.screen.height - margin + 14.5)) ,
        0.15
    ); 
    const minusButton = createImageButton( 
        true,
        minusBtn,
        './assets/sounds/mp3/bet_sound.mp3',
        './assets/sounds/ogg/bet_sound.ogg',
        Math.round(bottom.width / 2 + 183), // ToDo 75 -> image.width - srediti da bude dinamcki !!
        Math.round((app.screen.height - margin + 13.5)),
        0.15
    ); 
     
    activeSpinButton.addListener('pointerdown', () => {
        if( playerInformation.credit >= 1 ) {
            playerInformation.reduceCredit();
            creditValue.text = playerInformation.credit;
        } else return; //napraviti nesto intuitivnije
        startPlay();
    });

    betOneButton.addListener('pointerdown', () => {
        playerInformation.reduceBetOne();
        betValue.text = playerInformation.oneBet;
    });

    betMaxButton.addListener('pointerdown', () => {
        playerInformation.reduceBetMax();
        betValue.text = playerInformation.maxBet;
    });

    addButton.addListener('pointerdown', () => {
        playerInformation.addBet();
        betValue.text = playerInformation.bet;
    });

    minusButton.addListener('pointerdown', () => {
        playerInformation.minusBet();
        betValue.text = playerInformation.bet;
    });

    let running = false;

    // Function to start playing.
    function startPlay() {
        console.log('ovo je start play');
        if (running) return;
        running = true;

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
    //da ne moze da se klikne dok se vrti

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