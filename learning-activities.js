'use strict';
let learningAudio;
function playBeats(count,onBeat,valid){try{learningAudio??=new (window.AudioContext||window.webkitAudioContext)();learningAudio.resume();for(let i=0;i<count;i++)setTimeout(()=>{if(!valid())return;let osc=learningAudio.createOscillator(),gain=learningAudio.createGain();osc.type='sine';osc.frequency.value=440;gain.gain.setValueAtTime(.0001,learningAudio.currentTime);gain.gain.exponentialRampToValueAtTime(.16,learningAudio.currentTime+.015);gain.gain.exponentialRampToValueAtTime(.0001,learningAudio.currentTime+.23);osc.connect(gain);gain.connect(learningAudio.destination);osc.start();osc.stop(learningAudio.currentTime+.25);onBeat(i)},i*650);return true}catch{return false}}
function renderLearningActivity(q,root,onWin,onMiss){
 if(['collect','order','memory'].includes(q.kind)){renderActivity(q,root,onWin,onMiss);return}
 const generation=++activityGeneration;let completed=false;const alive=()=>generation===activityGeneration&&!completed,win=()=>{if(!alive())return;completed=true;root.querySelectorAll('button').forEach(b=>b.disabled=true);onWin()},miss=()=>{if(alive())onMiss(q.hint||'Observe novamente e tente outra vez.')};root.innerHTML='';
 const el=(tag,cls,text)=>{let n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n};
 const btn=(text,fn,cls='learning-button')=>{let b=el('button',cls,text);b.type='button';b.onclick=()=>{if(alive())fn(b)};return b};
 const status=el('p','activity-status','');status.setAttribute('aria-live','polite');
 if(q.kind==='pattern'){
  const expected=q.mode==='mirror'?q.pattern.map(i=>Math.floor(i/q.n)*q.n+q.n-1-i%q.n):q.pattern;let selected=new Set(),observing=q.mode==='recall';
  let panels=el('div','pattern-panels'),model=el('div','pattern-panel'),response=el('div','pattern-panel');model.append(el('b','','Modelo'));response.append(el('b','',q.mode==='mirror'?'Seu espelho':'Seu desenho'));
  let source=el('div','dot-grid'),answer=el('div','dot-grid');source.style.gridTemplateColumns=answer.style.gridTemplateColumns='repeat('+q.n+',1fr)';
  for(let i=0;i<q.n*q.n;i++){let cell=el('span',q.pattern.includes(i)?'dot on':'dot','');source.append(cell);let b=btn('',b=>{if(observing)return;selected.has(i)?selected.delete(i):selected.add(i);b.classList.toggle('on',selected.has(i));b.setAttribute('aria-pressed',String(selected.has(i)))},'dot');b.setAttribute('aria-label','Linha '+(Math.floor(i/q.n)+1)+', coluna '+(i%q.n+1));b.setAttribute('aria-pressed','false');answer.append(b)}model.append(source);response.append(answer);panels.append(model,response);root.append(panels);
  let observe=btn('Já observei. Esconder modelo',b=>{observing=!observing;source.style.visibility=observing?'visible':'hidden';answer.querySelectorAll('button').forEach(x=>x.disabled=observing);b.textContent=observing?'Já observei. Esconder modelo':'Observar novamente';status.textContent=observing?'Observe com calma.':'Agora reproduza as posições.'});
  if(q.mode==='recall'){root.append(observe);answer.querySelectorAll('button').forEach(b=>b.disabled=true)}root.append(status,btn('Conferir desenho',()=>{if(observing){status.textContent='Quando estiver pronto, esconda o modelo.';return}if(selected.size===expected.length&&expected.every(i=>selected.has(i)))win();else miss()}));return;
 }
 if(q.kind==='map'){
  root.append(el('p','map-legend','↑ NORTE · LESTE → · SUL ↓ · ← OESTE'));let grid=el('div','map-grid');grid.style.gridTemplateColumns='28px repeat('+q.n+',1fr)';grid.append(el('span','',''));for(let c=0;c<q.n;c++)grid.append(el('b','coordinate',String.fromCharCode(65+c)));
  for(let r=0;r<q.n;r++){grid.append(el('b','coordinate',String(r+1)));for(let c=0;c<q.n;c++){let i=r*q.n+c,b=btn(q.landmarks[i],()=>i===q.target?win():miss(),'map-cell');b.setAttribute('aria-label','Coluna '+String.fromCharCode(65+c)+', linha '+(r+1)+': '+q.landmarks[i]);grid.append(b)}}root.append(grid,el('p','small-note','Legenda: 🏠 casa · 🌳 árvore · 💧 lago · ⛰️ montanha · 🌻 jardim'));return;
 }
 if(q.kind==='calendar'){
  const first=new Date(Date.UTC(q.year,q.month,1)).getUTCDay(),days=new Date(Date.UTC(q.year,q.month+1,0)).getUTCDate();root.append(el('h3','calendar-title','OUTUBRO DE '+q.year));let grid=el('div','calendar-grid');['dom','seg','ter','qua','qui','sex','sáb'].forEach(d=>grid.append(el('b','weekday',d)));for(let i=0;i<first;i++)grid.append(el('span','',''));for(let d=1;d<=days;d++){let b=btn(String(d),()=>d===q.target?win():miss(),d===q.start?'calendar-day today':'calendar-day');b.setAttribute('aria-label','Dia '+d);grid.append(b)}root.append(grid);if(q.start)root.append(el('p','small-note','O dia '+q.start+' está marcado como hoje nesta história.'));return;
 }
 if(q.kind==='setclock'){
  let hour=1,minute=0,face=el('div','clock-editor');const draw=()=>face.innerHTML=clockSVG(hour,minute);draw();root.append(face);let row=el('div','clock-controls');row.append(btn('− hora',()=>{hour=hour===1?12:hour-1;draw()}),btn('+ hora',()=>{hour=hour===12?1:hour+1;draw()}));if(q.allowHalf)row.append(btn('Trocar 00 / 30 minutos',()=>{minute=minute===0?30:0;draw()}));root.append(row,btn('Conferir relógio',()=>hour===q.hour&&minute===q.minute?win():miss()));return;
 }
 if(q.kind==='appreciate'){
  let img=el('img','art-observation');img.src='assets/island-v3.png';img.alt='Paisagem ilustrada da ilha, com árvores, flores, caminhos e lago.';root.append(img);let row=el('div','tile-row');q.options.forEach(option=>row.append(btn(option,()=>{status.textContent='Conte a alguém o que você percebeu nessa parte da paisagem.';root.append(btn('Concluí minha observação',win));row.querySelectorAll('button').forEach(b=>b.disabled=true)})));root.append(row,status);return;
 }
 if(q.kind==='rhythm'){
  let count=0,playingBeats=false,playToken=0,hasListened=false;const update=()=>status.textContent=count+' batida'+(count===1?'':'s')+' no tambor';update();const light=el('div','beat-light','♪');root.append(light);
  const listen=btn('▶ Ouvir os sons',()=>{if(playingBeats)return;playingBeats=true;listen.disabled=true;count=0;update();if('speechSynthesis'in window)speechSynthesis.cancel();let token=++playToken;const valid=()=>alive()&&token===playToken;const pulse=()=>{light.classList.add('beating');setTimeout(()=>light.classList.remove('beating'),220)};if(!playBeats(q.beats,pulse,valid)){status.textContent='Som indisponível: conte as pulsações do símbolo.';for(let i=0;i<q.beats;i++)setTimeout(()=>{if(valid())pulse()},i*650)}setTimeout(()=>{if(!valid())return;playingBeats=false;hasListened=true;listen.disabled=false},q.beats*650)});
  root.append(listen,btn('🥁 Tocar tambor',()=>{if(playingBeats){status.textContent='Espere a sequência terminar.';return}count++;update()}),btn('Zerar batidas',()=>{count=0;update()}),status,btn('Conferir quantidade',()=>{if(playingBeats)return;if(!hasListened){status.textContent='Ouça a sequência primeiro.';return}if(count===q.beats)win();else miss()}));return;
 }
 if(q.kind==='recite'){
  let poem=el('div','poem');q.lines.forEach(line=>poem.append(el('p','',line)));root.append(poem,btn('▶ Ouvir os versos',()=>speak(q.lines.join(' '))),btn('Esconder / mostrar versos',()=>{poem.style.visibility=poem.style.visibility==='hidden'?'visible':'hidden'}),el('p','small-note','Prática oral: recite para alguém. Você pode repetir quantas vezes quiser.'),btn('Já pratiquei a recitação',win));return;
 }
 if(q.kind==='trace'){
  let surface=el('canvas','trace-canvas');surface.width=500;surface.height=300;surface.setAttribute('aria-label','Área para treinar o traçado da letra '+q.symbol);root.append(surface);let context=surface.getContext('2d'),drawing=false;
  const clear=()=>{context.clearRect(0,0,500,300);context.fillStyle='#edf1dd';context.fillRect(0,0,500,300);context.textAlign='center';context.font='bold 250px sans-serif';context.strokeStyle='#9dae88';context.lineWidth=3;context.setLineDash([4,8]);context.strokeText(q.symbol,250,240);context.setLineDash([])};clear();const point=e=>{let b=surface.getBoundingClientRect();return[(e.clientX-b.left)*500/b.width,(e.clientY-b.top)*300/b.height]};surface.onpointerdown=e=>{if(!alive())return;e.preventDefault();drawing=true;surface.setPointerCapture(e.pointerId);context.beginPath();context.moveTo(...point(e))};surface.onpointermove=e=>{if(!drawing||!alive())return;context.strokeStyle='#39725b';context.lineWidth=9;context.lineCap='round';context.lineTo(...point(e));context.stroke()};surface.onpointerup=surface.onpointercancel=()=>drawing=false;root.append(btn('Limpar traçado',clear),btn('Terminei meu treino',win),el('p','small-note','Treino livre: o jogo não corrige a caligrafia automaticamente.'));return;
 }
 root.append(el('p','','Esta atividade não pôde ser aberta. Volte ao caderno.'));
}
