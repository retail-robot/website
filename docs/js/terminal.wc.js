const NAMESPACE = 'rlsh';

function span(char){
    const s = document.createElement('SPAN');
    s.textContent = char;
    return s;
}


async function wait(ms){
    return new Promise(function(resolve, reject){
        window.setTimeout(function(){
            resolve()
        }, ms);
    });
}

async function* generate(){
    yield 'Doing something';
    await wait(1000);
    yield 'Doing something.'
    await wait(1000);
    yield 'Doing something..'
    await wait(1000);
    yield 'Doing something...'
    await wait(1000);
    yield 'Doing something....'
    await wait(1000);
    yield 'Doing something.....'
    await wait(1000);
    yield "Did something"
}

const commands = {
    curl: async function*(argList){
        yield 'curling'
    },
    "test-generator": generate
}


class Terminal extends HTMLElement{

    constructor(){
        super();
        this.styleElement = document.createElement("style");
        this.styleElement.textContent = `
        rlsh-terminal{
            display: block;
            font-family: monospace;
            margin: 1rem;
            padding: 1rem;
            background-color: #000000;
            color: #00ab4d;
            max-height: 100%;
        }        
        
        [rlsh-initial-cursor]::before{
            display: inline-block;
            content: " ";
            width: 1ch;
        }

        .marker{
            border-bottom: solid 2px #00ab4d;
        }

        .rlsh-buffer::before{
            content:">";
            display: inline-block;
            margin-right: 1ch;
        }
        `;
        this.currentIndex = 0;
        this.className = `${NAMESPACE}-terminal`
        this.tabIndex = 0;
        this.buffer = document.createElement("DIV");
        this.buffer.className = `${NAMESPACE}-buffer`;
        this.initialCursor = document.createElement("SPAN");
        this.initialCursor.className = `${NAMESPACE}-marker`;
        this.initialCursor.setAttribute(`${NAMESPACE}-initial-cursor`, "")

        this.commands = commands;

        this.keyHandler = (function(event){
            switch(event.key){
                case 'ArrowLeft':
                    this.moveIndex(this.currentIndex-1);
                    break;
                case 'ArrowRight':
                    this.moveIndex(this.currentIndex+1);
                    break;
                case 'Backspace':
                    this.deleteChar(this.currentIndex);
                    break;
                case 'Enter': 
                    this.commitBuffer();
                    break;
                case 'Shift': 
                case 'Tab':
                case 'Meta': 
                    break;
                default:
                    this.writeChar(event.key, this.currentIndex)
            }
        }).bind(this);
    }

    initBuffer(){
        this.buffer.innerHTML = '';
        this.buffer.appendChild(this.initialCursor);
        this.currentIndex = 0;
    }

    render(){
        this.innerHTML = '';
        this.appendChild(this.styleElement)
        this.initBuffer();
        this.buffer.appendChild(this.initialCursor);
        this.appendChild(this.buffer);
    }

    initializeEvents(){
        this.addEventListener('keydown', this.keyHandler)
    }

    clearEvents(){
        this.removeEventListener('keydown', this.keyHandler)
    }

    getCurrentMarker(){
        return this.buffer.childNodes[this.currentIndex];
    }

    moveIndex(index){
        if(index < 0){
            return;
        }else if(index >= this.buffer.childNodes.length){
            return;
        }
        const prev = this.getCurrentMarker();
        if(prev){
            prev.className = '';
        }
        this.currentIndex = index;
        const next = this.getCurrentMarker();
        if(next){
            next.className = 'marker';
        }
    }

    writeChar(char, index){
        const reference = this.buffer.childNodes[index];
        const s = span(char)
        if(reference){
            this.buffer.insertBefore(s, reference)
        }else{
            this.buffer.appendChild(s);
        }
        this.moveIndex(this.currentIndex+1);
    }

    deleteChar(index){
        const reference = this.buffer.childNodes[index-1];
        if(reference){
            this.buffer.removeChild(reference)
            this.moveIndex(index-1)
        }
    }

    lineOut(str){
        const o = document.createElement('DIV');
        o.innerText = str;
        this.insertBefore(o, this.buffer)
    }

    replaceLineOut(str){
        this.buffer.previousSibling.innerHTML = str;
    }

    async interpret(bufferString){
        const parts = bufferString.split(/\s/g)
        const commandName = parts[0];
        if(!commandName){
            return;
        }
        const command = this.commands[commandName];
        if(command){
            let generator = await command()
            let result = await generator.next();
            this.lineOut(result.value);
            let done = result.done;
            while(!done){
                result = await generator.next();
                if(result.value){
                    this.replaceLineOut(result.value);
                }
                done = result.done;
            }
        }else{
            this.lineOut(`Command "${commandName}" not found.`)
        }
    }

    async commitBuffer(){
        const bufferString = this.buffer.textContent;
        this.lineOut(`> ${bufferString}`)
        this.initBuffer();
        await this.interpret(bufferString);
    }

    connectedCallback() {
        this.render();
        this.initializeEvents();
    }

    disconnectedCallback(){
        this.clearEvents();
    }

}

customElements.define("rlsh-terminal", Terminal);