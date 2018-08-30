const template = document.createElement('template');
template.innerHTML = `
<style>
  :host {
    display: block;
  }
</style>
<div class="chart"></div>
`;

class VegaChart extends HTMLElement {
  
  constructor()  {
    super();    
    let shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.appendChild(template.content.cloneNode(true));    
  }
  
  connectedCallback() {
    this.chartEl = this.shadowRoot.querySelector('.chart');
    this.setSpec(this.getAttribute('spec'));
  }
  
  
  // Spec prop setter
  set spec(spec) {
    this.setSpec(spec);
  }
  
  // Handle different types of spec
  setSpec(spec) {
    if(typeof spec === 'string') { 
      this.setAttribute('spec', spec);
      try {
        // Spec as JSON
        this.setSpec(JSON.parse(spec));
      }
      catch(e) {
        this.setSpecUrl(spec);
      }
    }
    else {
      this.setAttribute('spec', JSON.stringify(spec));
      this.setSpecObj(spec);
    }
  }
  
  // Spec as object
  setSpecObj(spec) {
    this.view = new vega.View(vega.parse(spec))
      .renderer(this.getAttribute('renderer') || 'svg')
      .initialize(this.chartEl)
      .hover()
      .run();
  }
  
  // Spec as URL
  setSpecUrl(spec) {
    vega.loader()
      .load(spec)
      .then((data) => { 
        this.setSpecObj(JSON.parse(data));
      });
  }
  
  static get observedAttributes() {
    return ['spec'];
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
    // TODO
  }
}  

customElements.define('vega-chart', VegaChart);

    