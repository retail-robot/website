
class NavProfile extends HTMLElement {
    
    constructor() {
        super();
        this.className = 'nav-profile';
        this.styleNode = document.createElement('style');
        this.styleNode.textContent = `
.nav-profile{
    font-size: 1rem;
    display: flex;
    align-items: center;
}
.profile-picture{
    display: inline-block;
    border-radius: 50%;
    width: 6ch;
    margin-right: 1ch;
}
.nav-profile h1{
    font-size: 1.33rem;
    margin: 0;
    padding: 0;
}
`
    }
    render(){
        this.innerHTML = `
<img class="profile-picture" src="/images/headthumb2.png" />
<div>
    <h1>Rob Liota</h1>
    <div>Software Developer</div>
</div>
        `
        this.appendChild(this.styleNode)
    }

    connectedCallback() {
        this.render();
    }

    adoptedCallback() {
        this.render();
    }
}

customElements.define("nav-profile", NavProfile);