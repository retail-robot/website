
const navContents = [
    { name: "Home", href: "/"},
    { name: "Thoughts", href: "thoughts.html"},
    { name: "rlsh", href: "rlsh.html"},
    { name: "Resumé", href: "liota-resume.pdf"}
]

class SiteNav extends HTMLElement {
    static observedAttributes = ["current-page"];
    constructor() {
        super();
        this.className = 'nav-items';
        this.styleNode = document.createElement('style');
        this.styleNode.textContent = `

.nav-items{
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
}
.nav-item{
    margin: 0 0 0 2ch;
    position: relative;
}
a.nav-item:hover::before, a.nav-item:focus-visible::before{
    position: absolute;
    content:"↓";
    left: 0;
    right: 0;
    transform: translateY(-.8rem);
    text-align: center;
    animation: 750ms ease-out 300ms infinite alternate arrow-bounce;
}
@keyframes arrow-bounce {
  from {
    /* pushes the sun down past the viewport */
    transform: translateY(-.8rem);
  }
  to {
    /* returns the sun to its default position */
    transform: translateY(-1.25rem);
  }
}
.you-are-here{
    display: none;
}

@media screen and (orientation: portrait)  {
    .nav-items{
        justify-content: center;
    }
}
`
    }

    getItems(){
        const currentPage = this.getAttribute("current-page");
        console.log(currentPage)
        return navContents.map(function(n){
            let page = currentPage;
            if(!currentPage){
                page = document.URL.split('/').pop();
            }
            if(n.href.indexOf(page) > -1){
                return `<span class="nav-item you-are-here">${n.name}</span>`
            }
            return `<a class="nav-item" href="${n.href}">${n.name}</a>`
        }).join('')
    }

    render(){
        this.innerHTML = `${this.getItems()}`
        this.appendChild(this.styleNode)
    }

    connectedCallback() {
        this.render();
    }

    adoptedCallback() {
        this.render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if(name === 'currentPage' && oldValue !== newValue){
            this.render()
        }
    }
}

customElements.define("site-nav", SiteNav);