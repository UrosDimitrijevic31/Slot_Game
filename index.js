const app = new PIXI.Application({ backgroundColor: 0x0f1a44 });
document.body.appendChild(app.view); //ovako se kreira canvas element
class Information {
    constructor(credit, bet, win) {
        this.credit  = 1000;
        this.bet     = 1;
        this.win     = 0;
        this.maxBet  = 100;
        this.oneBet  = 1;
        this.playing = false;

        this.addBet = function () {
            if (playerInformation.bet >= 1 && playerInformation.bet < 100) {
                playerInformation.bet ++;
            }
        };
        this.minusBet = function minusBet() {
            if (playerInformation.bet > 1) {
                playerInformation.bet --;
            }
        };
        this.reduceCredit = function (){
            this.credit = this.credit - this.bet;
        }
        this.reduceBetMax = function (){
            this.bet = this.maxBet;
        }
        this.reduceBetOne = function (){
            this.bet = this.oneBet;
        }
    }
}
let playerInformation = new Information();

app.loader
    .add('banana',      './assets/images/banana.png')
    .add('cherry',      './assets/images/cherry.png')
    .add('lemon',       './assets/images/lemon.png')
    .add('seven',       './assets/images/seven.png')
    .add('betOne',      './assets/images/betOne.png')
    .add('betMax',      './assets/images/betMax.png')
    .add('spinVisible', './assets/images/spin_visible.png')
    .add('spinHidden',  './assets/images/spin_hidden.png')
    .add('addBtn',      './assets/images/addBtn.png')
    .add('minusBtn',    './assets/images/minusBtn.png')
    .add('slotLogo',    './assets/images/slots-logo.png')
    .load(onAssetsLoaded);

let banana      = PIXI.Texture.from("./assets/images/banana.png");
let cherry      = PIXI.Texture.from("./assets/images/cherry.png");
let lemon       = PIXI.Texture.from("./assets/images/lemon.png"); 
let seven       = PIXI.Texture.from("./assets/images/seven.png");
let betOne      = PIXI.Texture.from("./assets/images/betOne.png");
let betMax      = PIXI.Texture.from("./assets/images/betMax.png");
let spinVisible = PIXI.Texture.from("./assets/images/spin_visible.png");
let spinHidden  = PIXI.Texture.from("./assets/images/spin_hidden.png");
let addBtn      = PIXI.Texture.from("./assets/images/addBtn.png");
let minusBtn    = PIXI.Texture.from("./assets/images/minusBtn.png");
let slotLogo    = PIXI.Texture.from("./assets/images/slots-logo.png");
  
const REEL_WIDTH = 160; 
const SYMBOL_SIZE = 150; 

const reels = [];
function onAssetsLoaded() {
    const slotTextures = [
        banana,
        cherry,
        lemon,
        seven
    ];

    // Build the reels
    const reelContainer = new PIXI.Container(); 
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
            console.log(symbol.texture.textureCacheIds[0].split('.')[1].split('/')[3]); 
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
    const margin = (app.screen.height - SYMBOL_SIZE * 3) / 2; 
    reelContainer.y = margin;
    reelContainer.x = Math.round(app.screen.width - REEL_WIDTH * 4); 

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

    const logo = new PIXI.Sprite.from(slotLogo);
    logo.height = top.height + 2;
    logo.x = Math.round((top.width - logo.width) / 2);
    logo.y = 0;
    top.addChild(logo);

    const creditDisplay = new PIXI.Graphics();
    creditDisplay.lineStyle(2, 0xFFFFFF, 1);
    creditDisplay.beginFill(0x0f1a44);
    creditDisplay.drawRect(app.screen.width - margin * 2.2, ( margin - 40) / 2 , 140, 40);
    creditDisplay.endFill();

    const winDisplay = new PIXI.Graphics();
    winDisplay.lineStyle(2, 0xFFFFFF, 1);
    winDisplay.beginFill(0x0f1a44);
    winDisplay.drawRect(Math.round(app.screen.width / 10), Math.round(SYMBOL_SIZE * 3 + margin + (top.height / 6)) , 140, 40);
    winDisplay.endFill();

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
    creditValue.y = ( 22.5 );
    creditDisplay.addChild(creditValue)
    top.addChild(creditDisplay)

    //win value
    const winValue = new PIXI.Text(`${playerInformation.win}`, informationStyle)
    winValue.x = Math.round(Math.round((app.screen.width / 10) + winDisplay.width / 2.2) );
    winValue.y = (app.screen.height - margin * 0.8 ); 
    winDisplay.addChild(winValue)
    bottom.addChild(winDisplay)

    //bet value
    const betValue = new PIXI.Text(`${playerInformation.bet}`, informationStyle)
    betValue.x = Math.round((app.screen.width) - (app.screen.width / 4) + betDisplay.width / 2);
    betValue.y = (app.screen.height - margin * 0.8); 
    betDisplay.addChild(betValue)
    bottom.addChild(betDisplay)
    
    //credit text
    const creditText = new PIXI.Text('CREDIT', labelText)
    creditText.x = Math.round(app.screen.width - margin * 1.6);
    creditText.y = (58); 
    bottom.addChild(winDisplay, creditText)

    //win text
    const winText = new PIXI.Text('WIN', labelText)
    winText.x = Math.round((app.screen.width / 10) + winDisplay.width / 2.5);
    winText.y = (app.screen.height - 20 ); 
    bottom.addChild(winDisplay, winText)

    //bet text
    const betText = new PIXI.Text(`BET`, labelText)
    betText.x = Math.round((app.screen.width) - (betDisplay.width * 1.9 ) );
    betText.y = (app.screen.height - 20); 
    bottom.addChild(betDisplay, betText)



    const activeSpinButton = createImageButton(
        true,
        spinVisible,
        './assets/sounds/mp3/spin_sound.mp3',
        './assets/sounds/ogg/spin_sound.ogg',
        Math.round((bottom.width - 75) / 2), 
        (app.screen.height - margin - 10) ,
        0.35
    ); 

    const betOneButton = createImageButton(
        true,
        betOne,
        './assets/sounds/mp3/bet_sound.mp3',
        './assets/sounds/ogg/bet_sound.ogg',
        Math.round((bottom.width - 75) / 2 - 80 ), 
        (app.screen.height - margin + 5),
        0.75
    ); 
    const betMaxButton = createImageButton( 
        true,
        betMax,
        './assets/sounds/mp3/bet_sound.mp3',
        './assets/sounds/ogg/bet_sound.ogg',
        Math.round((bottom.width - 75) / 2 + 100), 
        (app.screen.height - margin + 5) ,
        0.75
    ); 
    const addButton = createImageButton( 
        true,
        addBtn,
        './assets/sounds/mp3/bet_sound.mp3',
        './assets/sounds/ogg/bet_sound.ogg',
        Math.round((app.screen.width) - (app.screen.width / 8.3)), 
        Math.round((app.screen.height - margin + 14.5)) ,
        0.15
    ); 
    const minusButton = createImageButton( 
        true,
        minusBtn,
        './assets/sounds/mp3/bet_sound.mp3',
        './assets/sounds/ogg/bet_sound.ogg',
        Math.round(bottom.width / 2 + 183), 
        Math.round((app.screen.height - margin + 13.5)),
        0.15
    ); 
     
    activeSpinButton.addListener('pointerdown', () => {
        if( playerInformation.credit >= 1 ) {
            playerInformation.reduceCredit();
            creditValue.text = playerInformation.credit;
        } else return; //create some alert, or something that
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

    function startPlay() {
        activeSpinButton.interactive = false;
        betOneButton.interactive     = false;
        betMaxButton.interactive     = false;
        addButton.interactive        = false;
        minusButton.interactive      = false;
        winValue.text                = 0;

        if (running) return;
        running = true;

        for (let i = 0; i < reels.length; i++) {
            const r = reels[i];
            const extra = Math.floor(Math.random() * 3);
            const target = r.position + 10 + i * 5 + extra;
            const time = 2500 + i * 600 + extra * 600;
            tweenTo(r, 'position', target, time, backout(0.5), null, i === reels.length - 1 ? reelsComplete : null);
        }
    }
    //maybe app.ticker must be Promise? but I don't know to work with PixiJS very good 
    async function reelsComplete() {
        activeSpinButton.interactive = true;
        betOneButton.interactive = true;
        betMaxButton.interactive = true;
        addButton.interactive = true;
        minusButton.interactive = true;
        running = false;

        //test array to check win logic
        let test = ['lemon', 'banana', 'cherry', 'seven', 'seven', 'banana', 'seven', 'seven','seven', 'banana', 'cherry', 'cherry']

        // let symbols = await findNameTextures(reels);
        // winLogic(symbols);

        winLogic(test);
    
    }

    function winLogic(symbols) {
        let firstRow            = [];
        let secondRow           = [];
        let thirdRow            = [];
        let diagonalOne         = [];
        let diagonalTwo         = [];
        let firstRowTWoSymbols  = [];
        let secondRowTWoSymbols = [];
        let thirdRowTWoSymbols  = [];
        let comboFirstRow            = new Set([]);
        let comboSecondRow           = new Set([]);
        let comboThirdRow            = new Set([]);
        let comboDiagonalOne         = new Set([]);
        let comboDiagonalTwo         = new Set([]);
        let comboFirstRowTwoSymbols  = new Set([]);
        let comboSecondRowTwoSymbols = new Set([]);
        let comboThirdRowTwoSymbols  = new Set([]);

        //those symbols are hidden outside reels
        let removeValFrom = [0, 4, 8]; 
        symbols = symbols.filter((value, index) => {
            return removeValFrom.indexOf(index) == -1;
        })

        console.log(symbols);
        
        for (let i = 0; i < symbols.length; i++) {
            if(i == 0) {    
                firstRow.push(symbols[i], symbols[i+3], symbols[i+6]);
                comboFirstRow.add(symbols[i]).add(symbols[i+3]).add(symbols[i+6]);
                diagonalOne.push(symbols[i], symbols[i+4], symbols[i+8]);
                comboDiagonalOne.add(symbols[i]).add(symbols[i+4]).add(symbols[i+8]);
                firstRowTWoSymbols.push(symbols[i], symbols[i+3]);
                comboFirstRowTwoSymbols.add(symbols[i]).add(symbols[i+3]);
            }
            if(i == 1) {
                secondRow.push(symbols[i], symbols[i+3], symbols[i+6]);
                comboSecondRow.add(symbols[i]).add(symbols[i+3]).add(symbols[i+6]);
                secondRowTWoSymbols.push(symbols[i], symbols[i+3]);
                comboSecondRowTwoSymbols.add(symbols[i]).add(symbols[i+3]);
            }
            if(i == 2) {
                thirdRow.push(symbols[i], symbols[i+3], symbols[i+6]);
                comboThirdRow.add(symbols[i]).add(symbols[i+3]).add(symbols[i+6]);
                diagonalTwo.push(symbols[i], symbols[i+2], symbols[i+4]);
                comboDiagonalTwo.add(symbols[i]).add(symbols[i+2]).add(symbols[i+4]);
                thirdRowTWoSymbols.push(symbols[i], symbols[i+3]);
                comboThirdRowTwoSymbols.add(symbols[i]).add(symbols[i+3]);
            }
        }


        if  (((comboFirstRow.size   === 1 && comboFirstRow.has('lemon'))  || (comboFirstRowTwoSymbols.size  === 1 && comboFirstRowTwoSymbols.has('lemon')))  ||
             ((comboSecondRow.size  === 1 && comboSecondRow.has('lemon')) || (comboSecondRowTwoSymbols.size === 1 && comboSecondRowTwoSymbols.has('lemon'))) || 
             ((comboThirdRow.size   === 1 && comboThirdRow.has('lemon'))  || (comboThirdRowTwoSymbols.size  === 1 && comboThirdRowTwoSymbols.has('lemon')))  || 
             (comboDiagonalOne.size === 1 && comboDiagonalOne.has('lemon')) || 
             (comboDiagonalTwo.size === 1 && comboDiagonalTwo.has('lemon'))) {            
                payInfo('lemon');            
        }   

        if  (((comboFirstRow.size   === 1 && comboFirstRow.has('banana'))  || (comboFirstRowTwoSymbols.size  === 1 && comboFirstRowTwoSymbols.has('banana')))  ||
             ((comboSecondRow.size  === 1 && comboSecondRow.has('banana')) || (comboSecondRowTwoSymbols.size === 1 && comboSecondRowTwoSymbols.has('banana'))) || 
             ((comboThirdRow.size   === 1 && comboThirdRow.has('banana'))  || (comboThirdRowTwoSymbols.size  === 1 && comboThirdRowTwoSymbols.has('banana')))  ||            
             (comboDiagonalOne.size === 1 && comboDiagonalOne.has('banana')) || 
             (comboDiagonalTwo.size === 1 && comboDiagonalTwo.has('banana'))) {          
                payInfo('banana');            
        }
        if  (((comboFirstRow.size   === 1 && comboFirstRow.has('cherry'))  || (comboFirstRowTwoSymbols.size  === 1 && comboFirstRowTwoSymbols.has('cherry')))  ||
             ((comboSecondRow.size  === 1 && comboSecondRow.has('cherry')) || (comboSecondRowTwoSymbols.size === 1 && comboSecondRowTwoSymbols.has('cherry'))) || 
             ((comboThirdRow.size   === 1 && comboThirdRow.has('cherry'))  || (comboThirdRowTwoSymbols.size  === 1 && comboThirdRowTwoSymbols.has('cherry')))  ||            
             (comboDiagonalOne.size === 1 && comboDiagonalOne.has('cherry')) || 
             (comboDiagonalTwo.size === 1 && comboDiagonalTwo.has('cherry'))) {    
                payInfo('cherry');            
        }
        if  (((comboFirstRow.size   === 1 && comboFirstRow.has('seven'))  || (comboFirstRowTwoSymbols.size  === 1 && comboFirstRowTwoSymbols.has('seven')))  ||
             ((comboSecondRow.size  === 1 && comboSecondRow.has('seven')) || (comboSecondRowTwoSymbols.size === 1 && comboSecondRowTwoSymbols.has('seven'))) || 
             ((comboThirdRow.size   === 1 && comboThirdRow.has('seven'))  || (comboThirdRowTwoSymbols.size  === 1 && comboThirdRowTwoSymbols.has('seven')))  ||            
             (comboDiagonalOne.size === 1 && comboDiagonalOne.has('seven')) || 
             (comboDiagonalTwo.size === 1 && comboDiagonalTwo.has('seven'))) {            
                payInfo('seven');            
        }
    }


    function payInfo(symbol) {
        console.log(symbol);
        if(symbol === 'lemon')  {
            playerInformation.win = playerInformation.bet * 1; 
            playerInformation.credit = playerInformation.credit += playerInformation.win;
            winValue.text = playerInformation.win;
            creditValue.text = playerInformation.credit;
            winSound();
        }      
        if(symbol === 'banana') {
            playerInformation.win = playerInformation.bet * 2;
            playerInformation.credit = playerInformation.credit += playerInformation.win;
            winValue.text = playerInformation.win;
            creditValue.text = playerInformation.credit;
            winSound();
        }           
        if(symbol === 'cherry') {
            playerInformation.win = playerInformation.bet * 4;
            playerInformation.credit = playerInformation.credit += playerInformation.win;
            winValue.text = playerInformation.win;
            creditValue.text = playerInformation.credit;
            winSound();
        }           
        if(symbol === 'seven')  {
            playerInformation.win = playerInformation.bet * 8;
            playerInformation.credit = playerInformation.credit += playerInformation.win;
            winValue.text = playerInformation.win;
            creditValue.text = playerInformation.credit;
            winSound();
        }            
    }

    function winSound() {
        let sound = new Howl({
            src: ['./assets/sounds/mp3/win.mp3']
        })
        sound.play()
    }

    function findNameTextures(reels) {
        return new Promise(resolve => {
            let symbolsArray = [];
            reels.map(symbol => {
                symbol.symbols.map(sprite => {
                    symbolsArray.push(sprite._texture.textureCacheIds[0])
                })
            })
            resolve(symbolsArray)
        })
        
    }
    
    app.ticker.add((delta) => {
    // Update the slots.
        for (let i = 0; i < reels.length; i++) {
            const r = reels[i];
            r.blur.blurY = (r.position - r.previousPosition) * 8;
            r.previousPosition = r.position;

            // Update symbol positions on reel.
            for (let j = 0; j < r.symbols.length; j++) {
                const s = r.symbols[j];
                const prevy = s.y;
                s.y = ((r.position + j) % r.symbols.length) * SYMBOL_SIZE - SYMBOL_SIZE;
                if (s.y < 0 && prevy > SYMBOL_SIZE) {
                    s.texture = slotTextures[Math.floor(Math.random() * slotTextures.length)];
                    s.scale.x = s.scale.y = Math.min(SYMBOL_SIZE / s.texture.width, SYMBOL_SIZE / s.texture.height);
                    s.x = Math.round((SYMBOL_SIZE - s.width) / 2);
                   
                }
            }
        }
    });
    
}

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

function lerp(a1, a2, t) {
    return a1 * (1 - t) + a2 * t;
}

function backout(amount) {
    return (t) => (--t * t * ((amount + 1) * t + amount) + 1);
}