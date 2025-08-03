

class GTM extends HTMLElement {
    constructor(){
        super();
        this.style.display="none";
        this.innerHTML = `
<script async src="https://www.googletagmanager.com/gtag/js?id=G-F71LYZ47FL"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-F71LYZ47FL');
</script>
`;
    }
}

customElements.define("site-gtm", GTM);