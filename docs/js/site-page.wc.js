
if(!customElements.get('site-page')){
    function script(src){
        const s = document.createElement('script');
        s.src = src;
        document.body.appendChild(s);
    }

    class SitePage extends HTMLElement {
        static observedAttributes = ["wc-src", "img-src"];
        constructor() {
            super();
            this.initialContent = this.innerHTML;
            this.className = 'site-page';
            this.styleNode = document.createElement('style');
            this.styleNode.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&family=Press+Start+2P&family=Rokkitt:ital,wght@0,100..900;1,100..900&display=swap');

    html{
        border: 0;
        margin: 0;
        padding: 0;
        height: 100%;
    }

    body {
        font-family: "Outfit", monospace, sans-serif; 
        font-weight: 400;
        font-style: normal;
        padding: 1rem;
        margin: 0;
        height: 100%;
        box-sizing: border-box;
        padding-top: 1rem;
    }

    .site-page{
        margin: 0;
        height: 100%;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
    }

    nav{
        flex-grow: 0;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    nav .nav-profile{
        width: 100%;
        flex-shrink: 1;
        flex-grow: 1;
    }

    a{
        color: #860000;
        text-underline-offset: 3px;
        text-decoration-thickness: 2px;
    }
    a:hover, a:focus-visible{
        text-decoration: dotted underline;
        text-decoration-thickness: 2px;
        outline: none;
    }

    .text-block{
        margin: 0 auto;
        width: 58ch;
        max-width: 100%;
    }

    li{
        margin-bottom: .33rem;
    }

    ul > li{
        a:hover::after, a:focus-visible::after{
            position: absolute;
            content:"←";
            animation: 750ms ease-out 0s infinite alternate arrow-slide;
        }
    }

    @keyframes arrow-slide {
    from {
        transform: translateX(.33rem);
    }
    to {
        transform: translateX(1rem);
    }
    }
            `
        }

        render(){
            const wcSrc = this.getAttribute('wc-src')
            this.innerHTML = `
                <nav>
                    <nav-profile img-src=${this.getAttribute('img-src')}></nav-profile>
                    <site-nav></site-nav>
                </nav>
                <main>
                    ${this.initialContent}
                </main>  
                <site-gtm></site-gtm>
            `;
            this.appendChild(this.styleNode)
            script(`${wcSrc}/nav-profile.wc.js`);
            script(`${wcSrc}/site-nav.wc.js`);
            script(`${wcSrc}/google-tag.wc.js`);
        }

        connectedCallback() {
            this.render();
        }

        adoptedCallback() {
            this.render();
        }

        attributeChangedCallback(name, oldValue, newValue) {
            if(name === 'wc-src' && oldValue !== newValue){
                this.render()
            }
        }
    }

    customElements.define("site-page", SitePage);
}

