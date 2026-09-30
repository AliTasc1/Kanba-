(function(){
if (customElements.get('kb-turkey-map')) return;
const PROV=[["Adana",37.00,35.32],["Adıyaman",37.76,38.28],["Afyonkarahisar",38.76,30.54],["Ağrı",39.72,43.05],["Aksaray",38.37,34.03],["Amasya",40.65,35.83],["Ankara",39.93,32.86],["Antalya",36.89,30.71],["Ardahan",41.11,42.70],["Artvin",41.18,41.82],["Aydın",37.85,27.84],["Balıkesir",39.65,27.88],["Bartın",41.63,32.34],["Batman",37.88,41.13],["Bayburt",40.26,40.23],["Bilecik",40.14,29.98],["Bingöl",38.88,40.50],["Bitlis",38.40,42.11],["Bolu",40.74,31.61],["Burdur",37.72,30.29],["Bursa",40.18,29.06],["Çanakkale",40.15,26.41],["Çankırı",40.60,33.62],["Çorum",40.55,34.95],["Denizli",37.78,29.09],["Diyarbakır",37.91,40.24],["Düzce",40.84,31.16],["Edirne",41.68,26.56],["Elazığ",38.67,39.22],["Erzincan",39.75,39.49],["Erzurum",39.90,41.27],["Eskişehir",39.78,30.52],["Gaziantep",37.07,37.38],["Giresun",40.91,38.39],["Gümüşhane",40.46,39.48],["Hakkari",37.58,43.74],["Hatay",36.20,36.16],["Iğdır",39.92,44.04],["Isparta",37.76,30.55],["İstanbul",41.01,28.98],["İzmir",38.42,27.14],["Kahramanmaraş",37.58,36.94],["Karabük",41.20,32.62],["Karaman",37.18,33.22],["Kars",40.60,43.10],["Kastamonu",41.38,33.78],["Kayseri",38.73,35.49],["Kilis",36.72,37.12],["Kırıkkale",39.85,33.51],["Kırklareli",41.74,27.23],["Kırşehir",39.15,34.17],["Kocaeli",40.77,29.92],["Konya",37.87,32.48],["Kütahya",39.42,29.98],["Malatya",38.35,38.31],["Manisa",38.61,27.43],["Mardin",37.31,40.74],["Mersin",36.81,34.64],["Muğla",37.22,28.36],["Muş",38.74,41.49],["Nevşehir",38.62,34.71],["Niğde",37.97,34.68],["Ordu",40.98,37.88],["Osmaniye",37.07,36.25],["Rize",41.02,40.52],["Sakarya",40.78,30.40],["Samsun",41.29,36.33],["Şanlıurfa",37.16,38.79],["Siirt",37.93,41.94],["Sinop",42.03,35.15],["Sivas",39.75,37.02],["Şırnak",37.52,42.46],["Tekirdağ",40.98,27.51],["Tokat",40.31,36.55],["Trabzon",41.00,39.72],["Tunceli",39.11,39.55],["Uşak",38.68,29.41],["Van",38.49,43.38],["Yalova",40.66,29.28],["Yozgat",39.82,34.81],["Zonguldak",41.45,31.79]];
const WGT={'İstanbul':9,'Ankara':4.6,'İzmir':3.8,'Bursa':2.8,'Antalya':2.4,'Konya':2.1,'Adana':2.1,'Gaziantep':1.9,'Şanlıurfa':1.8,'Mersin':1.8,'Diyarbakır':1.6,'Hatay':1.5,'Kayseri':1.4,'Manisa':1.3,'Samsun':1.3,'Sakarya':1.2,'Balıkesir':1.1,'Kahramanmaraş':1.1,'Van':1.1,'Tekirdağ':1.0,'Denizli':1.0,'Eskişehir':1.0,'Aydın':1.0,'Malatya':.9,'Trabzon':.9,'Muğla':.9,'Erzurum':.8,'Mardin':.8,'Ordu':.7,'Afyonkarahisar':.7,'Elazığ':.6,'Batman':.6,'Sivas':.6,'Adıyaman':.6,'Tokat':.55,'Zonguldak':.55,'Çorum':.5,'Osmaniye':.5,'Kütahya':.5,'Aksaray':.45,'Isparta':.45,'Düzce':.45,'Yalova':.35};
const hh=(s,k)=>{let x=2166136261^k;for(const ch of s){x^=ch.charCodeAt(0);x=Math.imul(x,16777619);}return ((x>>>0)%10000)/10000;};
const pstat=n=>{if(n==='Kocaeli')return {active:12,met:145,donation:428,vol:1284};const w=WGT[n]??(0.18+0.2*hh(n,1));const donation=Math.round(190*w*(0.9+0.2*hh(n,2)));return {active:Math.max(1,Math.round(5*w*(0.6+0.8*hh(n,3)))),met:Math.round(donation*(0.3+0.08*hh(n,4))),donation,vol:Math.round(donation*(2.8+0.6*hh(n,5)))};};
window.kbStats=pstat;
let topoP;
const getTopo=()=>topoP||(topoP=fetch('https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json').then(r=>r.json()));
const libs=()=>new Promise(res=>{const t=()=>(window.d3&&window.topojson)?res():setTimeout(t,60);t();});
const NS='http://www.w3.org/2000/svg';
const el=(tag,attrs)=>{const e=document.createElementNS(NS,tag);for(const k in attrs)e.setAttribute(k,attrs[k]);return e;};
class KbMap extends HTMLElement{
  static get observedAttributes(){return ['metric','selected','theme'];}
  constructor(){super();this._m='need';this._s='Kocaeli';this._t='light';}
  get metric(){return this._m} set metric(v){this._m=v||'need';this.paint();}
  get selected(){return this._s} set selected(v){this._s=v;this.paint();}
  get theme(){return this._t} set theme(v){this._t=v||'light';this.paint();}
  attributeChangedCallback(a,o,v){if(a==='metric')this._m=v||'need';if(a==='selected')this._s=v;if(a==='theme')this._t=v||'light';this.paint();}
  connectedCallback(){this.style.display='block';this.style.width='100%';this.style.height='100%';if(!this._init){this._init=true;this.build();}}
  async build(){
    this.innerHTML='<div style="height:100%;min-height:120px;display:grid;place-items:center;font:500 12px ui-monospace,Menlo,monospace;color:#8A8A93">Harita yükleniyor…</div>';
    try{await libs();const topo=await getTopo();
      const tr=topojson.feature(topo,topo.objects.countries).features.find(f=>+f.id===792);
      const W=this.clientWidth||350,H=this.clientHeight||Math.round(W*.5);
      const proj=d3.geoMercator().fitExtent([[12,12],[W-12,H-12]],tr);
      const svg=el('svg',{viewBox:`0 0 ${W} ${H}`,width:'100%',height:H,role:'img','aria-label':'Türkiye il bazlı yoğunluk haritası'});
      svg.style.display='block';
      this._land=el('path',{d:d3.geoPath(proj)(tr),'stroke-width':1});svg.appendChild(this._land);
      this._dots=PROV.map(([n,la,lo])=>{const [x,y]=proj([lo,la]);const g=el('g',{});g.style.cursor='pointer';
        const hit=el('circle',{cx:x,cy:y,r:9,fill:'transparent'});const c=el('circle',{cx:x,cy:y});const t=el('title',{});t.textContent=n;
        g.append(hit,c,t);g.addEventListener('click',()=>{this._s=n;this.paint();this.dispatchEvent(new CustomEvent('kbselect',{detail:n,bubbles:true,composed:true}));});
        svg.appendChild(g);return {n,g,c};});
      this.innerHTML='';this.appendChild(svg);this._svg=svg;this.paint();
    }catch(e){this.innerHTML='<div style="height:100%;display:grid;place-items:center;font:500 12px ui-monospace,monospace;color:#8A8A93">Harita yüklenemedi</div>';}
  }
  paint(){
    if(!this._dots)return;const dark=this._t==='dark';
    this._land.setAttribute('fill',dark?'#232327':'#EDEDEF');this._land.setAttribute('stroke',dark?'#3A3A40':'#DADADD');
    const key=this._m==='donation'?'donation':'active';const vals=this._dots.map(d=>pstat(d.n)[key]);const mx=Math.max(...vals);
    let sel=null;
    this._dots.forEach((d,i)=>{const t=Math.sqrt(vals[i]/mx);d.c.setAttribute('r',(2.4+t*8.5).toFixed(1));d.c.setAttribute('fill',dark?'#E0404F':'#C4162A');d.c.setAttribute('fill-opacity',(0.28+0.72*t).toFixed(2));
      const on=d.n===this._s;d.c.setAttribute('stroke',on?(dark?'#F4F4F5':'#18181B'):(dark?'#18181B':'#FFFFFF'));d.c.setAttribute('stroke-width',on?2.5:1);if(on)sel=d.g;});
    if(sel)this._svg.appendChild(sel);
  }
}
customElements.define('kb-turkey-map',KbMap);
})();
