'use strict';
const TRACKS=[
{id:'numeros',name:'Números e quantidades',icon:'🍎',station:0,steps:['Contar e comparar','Juntar e retirar','Sequências e desafios']},
{id:'letras',name:'Letras e palavras',icon:'📖',station:1,steps:['Reconhecer e traçar','Construir por partes','Ler e lembrar']},
{id:'memoria',name:'Memória e atenção',icon:'🦋',station:4,steps:['Observar com calma','Guardar e reproduzir','Lembrar mais detalhes']},
{id:'espaco',name:'Formas e espaço',icon:'🔷',station:5,steps:['Comparar figuras','Posições e padrões','Simetria e formas']},
{id:'mapa',name:'Mapa da ilha',icon:'🗺️',station:2,steps:['Lugares e símbolos','Caminhos e direções','Localizar no mapa']},
{id:'tempo',name:'Rotina e relógio',icon:'🕰️',station:6,steps:['O dia e o relógio','Conhecer as horas','Ler e ajustar']},
{id:'calendario',name:'Dias e calendário',icon:'📅',station:7,steps:['A sequência dos dias','Encontrar uma data','Planejar e contar dias']},
{id:'natureza',name:'Natureza e descobertas',icon:'🌱',station:3,steps:['Observar a natureza','Cuidar e acompanhar','Ordenar transformações']},
{id:'arte',name:'Arte, sons e versos',icon:'🎨',station:8,steps:['Olhar e escutar','Perceber e repetir','Apreciar e memorizar']}
];
const WEEK=['domingo','segunda-feira','terça-feira','quarta-feira','quinta-feira','sexta-feira','sábado'];
function clockSVG(h,m,missing=0){let svg='<svg class="clock-face" viewBox="0 0 240 240" role="img" aria-label="Relógio analógico"><circle cx="120" cy="120" r="111" fill="#fbf5df" stroke="#a8834c" stroke-width="9"/>';for(let i=0;i<60;i++){let a=i*Math.PI/30,r=i%5?102:98;svg+='<line x1="'+(120+Math.sin(a)*r)+'" y1="'+(120-Math.cos(a)*r)+'" x2="'+(120+Math.sin(a)*106)+'" y2="'+(120-Math.cos(a)*106)+'" stroke="#7f8c67" stroke-width="'+(i%5?1:2)+'"/>'}for(let i=1;i<=12;i++){let a=i*Math.PI/6;svg+='<text x="'+(120+Math.sin(a)*84)+'" y="'+(127-Math.cos(a)*84)+'" text-anchor="middle" font-size="20" fill="#375946">'+(i===missing?'?':i)+'</text>'}if(h!==null){let ha=((h%12)+m/60)*Math.PI/6,ma=m*Math.PI/30;svg+='<line x1="120" y1="120" x2="'+(120+Math.sin(ha)*51)+'" y2="'+(120-Math.cos(ha)*51)+'" stroke="#375946" stroke-width="8" stroke-linecap="round"/><line x1="120" y1="120" x2="'+(120+Math.sin(ma)*73)+'" y2="'+(120-Math.cos(ma)*73)+'" stroke="#c58244" stroke-width="5" stroke-linecap="round"/><circle cx="120" cy="120" r="6" fill="#375946"/>'}return svg+'</svg>'}
function simpleChoice(text,visual,answer,options,hint,lesson=''){return{text,visual,answer:String(answer),options:shuffle(options.map(String)),hint,lesson}}
function choiceNumbers(text,visual,n,max,hint,lesson=''){return simpleChoice(text,visual,n,numbers(n,max),hint,lesson)}
function gridSample(n,count){return shuffle(Array.from({length:n*n},(_,i)=>i)).slice(0,count).sort((a,b)=>a-b)}
function weekVisual(day){return '<div class="week-strip">'+WEEK.map((d,i)=>'<span class="'+(i===day?'today':'')+'">'+d+'</span>').join('')+'</div>'}
function generateLesson(age,id,level,task){
 let max=age===4?[5,10,20][level]:age===5?[20,30,40][level]:[40,70,100][level];
 if(id==='numeros'){
  if(task===0){let target=rand(2,Math.min(max,age===4?10:15));return{kind:'collect',text:'Colha '+target+' maçãs para a cesta.',target,visual:'',lesson:'Cada toque colhe uma maçã. Conte uma vez cada fruta.',hint:'Conte uma fruta por vez.'}}
  if(age===4){if(task===1){let x=rand(1,Math.min(max,10)),y=x+rand(1,3);return simpleChoice('Qual cesta tem mais frutas?','<div class="baskets"><div>A<br>'+fruit(x)+'</div><div>B<br>'+fruit(y)+'</div></div>','B',['A','B'],'Compare contando as frutas de cada cesta.','Mais significa uma quantidade maior.')}let n=rand(1,max);return choiceNumbers('Conte as maçãs. Quantas há?','<div class="fruit-group">'+fruit(n)+'</div>',n,max,'Conte cada maçã uma vez.','O último número contado indica o total.')}
  if(task===2&&level===2){let n=rand(1,max-4),seq=[n,n+1,n+2,n+3].map(String);return{kind:'order',text:'Coloque os números em ordem crescente.',sequence:seq,tiles:shuffle(seq),visual:'🔢',hint:'Comece pelo menor.',lesson:'Na contagem, cada número vem depois do anterior.'}}
  let limit=age===5?[5,8,10][level]:[10,15,20][level],sub=task===2,x=sub?rand(3,limit):rand(1,limit-1),y=sub?rand(1,x-1):rand(1,limit-x),n=sub?x-y:x+y;return{...choiceNumbers(sub?'Havia '+x+' maçãs. Saíram '+y+'. Quantas ficaram?':'Há '+x+' maçãs. Chegam mais '+y+'. Quantas ao todo?','<div class="fruit-group">'+fruit(sub?x-y:x)+fruit(y,sub?'leaving':'arriving')+'</div><div class="equation">'+x+(sub?' − ':' + ')+y+' = ?</div>',n,limit,sub?'Conte apenas as frutas que ficaram.':'Conte os dois grupos juntos.',sub?'Subtrair pode representar retirar uma quantidade.':'Somar pode representar juntar duas quantidades.'),x,y,sub};
 }
 if(id==='letras'){
  const words=[['SA','PO','🐸'],['BO','LA','⚽'],['PA','TO','🦆'],['CA','SA','🏠'],['GA','TO','🐱'],['MA','LA','🧳']];let w=words[(task+level*2)%words.length],word=w[0]+w[1];
  if(level===0&&task===0)return{kind:'trace',text:'Passe o dedo sobre a letra '+(age===4?'A':w[0][0])+'.',symbol:age===4?'A':w[0][0],visual:'',lesson:'Comece pelo alto e acompanhe o modelo. Este é um treino livre de traçado.'};
  if(age===4){let letter=word[0];return simpleChoice('Encontre a letra '+letter+' no começo de '+word+'.',w[2]+'<div class="word">'+word+'</div>',letter,[letter,...shuffle(['A','B','C','M','P','S'].filter(v=>v!==letter)).slice(0,2)],'Olhe a primeira letra da palavra.','As letras aparecem em uma ordem para formar palavras.')}
  if(task===1)return{kind:'order',text:'Monte a palavra '+word+'. Toque nas sílabas em ordem.',sequence:w.slice(0,2),tiles:shuffle([...w.slice(0,2),level>0?'VI':'LU']),visual:w[2],hint:'Diga a palavra devagar e escolha a sílaba que vem agora.',lesson:'Juntamos as partes da palavra: '+w[0]+' e '+w[1]+'.'};
  if(level===2&&task===2&&age===6)return simpleChoice('Leia e escolha a figura:','<div class="word sentence">O PA-TO NA-DA.</div>','🦆',['🦆','🐱','🐸'],'Leia PA-TO e procure esse animal.','Leia uma palavra de cada vez para entender a frase.');
  return simpleChoice('Leia a palavra e escolha a figura.','<span class="word">'+w[0]+'-'+w[1]+'</span>',w[2],[w[2],...shuffle(words.filter(v=>v[2]!==w[2])).slice(0,2).map(v=>v[2])],'Leia uma sílaba de cada vez.','Junte os sons das sílabas para descobrir a palavra.');
 }
 if(id==='memoria'){
  if(task===0)return{kind:'memory',text:'Encontre os pares iguais.',pairs:shuffle(['🦋','🐢','🌻','🍎','🐞','🐸']).slice(0,Math.min(5,2+level+(age===6?1:0))),visual:'',hint:'Observe onde as figuras aparecem.',lesson:'Vire duas cartas e observe. Procure lembrar a posição de cada figura.'};
  let n=age===4&&level===0?2:3,count=Math.min(n*n-1,2+level+(age===6?1:0));return{kind:'pattern',mode:task===1?'copy':'recall',n,pattern:gridSample(n,count),text:task===1?'Copie as posições das bolinhas.':'Observe, esconda o modelo e lembre as posições.',visual:'',hint:'Compare as linhas e colunas. Você pode observar novamente.',lesson:task===1?'A posição de cada bolinha importa. Compare uma linha por vez.':'Observe pelo tempo que precisar. Quando estiver pronto, toque em Já observei.'};
 }
 if(id==='espaco'){
  if(task===0){let icons=['🔵','🔺','🟨'],target=icons[level],name=['círculo','triângulo','quadrado'][level];return simpleChoice('Qual figura é um '+name+'?',target,target,icons,'Compare o formato do contorno.','Observe o contorno: o círculo é redondo; o triângulo tem três lados; o quadrado tem quatro lados iguais.')}
  if(task===1){let arr=['🐢','🐸','🐞','🦋','🐟'].slice(0,age===4?3:5),ix=level%arr.length;return simpleChoice('Contando da esquerda, qual é o '+(ix+1)+'º animal?','<div class="spatial-row">'+arr.join(' ')+'</div>',arr[ix],[arr[ix],...arr.filter(v=>v!==arr[ix]).slice(0,2)],'Comece pelo animal mais à esquerda.','Primeiro, segundo e terceiro indicam a posição em uma fila.')}
  let n=age===4?2:3;return{kind:'pattern',mode:level===2?'mirror':'copy',n,pattern:gridSample(n,level===2?3:2),text:level===2?'Complete o desenho como em um espelho.':'Copie o desenho nas mesmas posições.',visual:'',hint:level===2?'No espelho, a esquerda passa para a direita. A linha continua a mesma.':'Observe uma linha de cada vez.',lesson:level===2?'Uma figura espelhada troca os lados esquerdo e direito.':'Compare as posições, além da quantidade de bolinhas.'};
 }
 if(id==='mapa'){
  let n=level===2&&age===6?4:3,landmarks=Array(n*n).fill('🌿');landmarks[4]='🏠';landmarks[1]='⛰️';landmarks[3]='🌳';landmarks[5]='💧';landmarks[7]='🌻';let target=[1,3,5][task];
  if(level===0)return{kind:'map',n,landmarks,target,text:'No mapa, toque '+['na montanha','na árvore','no lago'][task]+'.',visual:'',lesson:'Este é um mapa imaginário da ilha, visto de cima. Cada desenho representa um lugar.',hint:'Procure o símbolo '+landmarks[target]+'.'};
  if(level===1)return{kind:'map',n,landmarks,target,text:'Toque no lugar '+['acima','à esquerda','à direita'][task]+' da casa.',visual:'',lesson:'Neste mapa, o norte está para cima. Observe os lados tomando a casa como referência.',hint:'Ache a casa primeiro. Depois observe o lado pedido.'};
  if(age===4)return{kind:'map',n,landmarks,target,text:'Toque no lugar '+['acima','à esquerda','à direita'][task]+' da casa.',visual:'',lesson:'A casa ajuda a localizar os outros lugares.',hint:'Observe a posição da casa.'};
  if(age===5)return{kind:'map',n,landmarks,target,text:'Toque no lugar a '+['norte','oeste','leste'][task]+' da casa.',visual:'',lesson:'Com o norte para cima: sul fica embaixo, leste à direita e oeste à esquerda.',hint:['Norte fica acima.','Oeste fica à esquerda.','Leste fica à direita.'][task]};
  target=[2,9,14][task];return{kind:'map',n,landmarks,target,text:'Encontre a coluna '+String.fromCharCode(65+target%n)+', linha '+(Math.floor(target/n)+1)+'.',visual:'',lesson:'As letras marcam as colunas e os números marcam as linhas. O encontro delas indica uma posição.',hint:'Siga a coluna com a letra pedida e depois a linha indicada.'};
 }
 if(id==='tempo'){
  if(level===0&&task===0)return simpleChoice('Qual cena mostra a noite?','🌅 → ☀️ → ?', '🌙',['🌙','☀️','🌈'],'À noite o céu fica escuro.','Manhã, tarde e noite são partes do dia.');
  if(level===0&&age===4){if(task===1)return{kind:'order',text:'Organize as partes do dia.',sequence:['🌅','☀️','🌙'],tiles:shuffle(['🌅','☀️','🌙']),visual:'',hint:'Primeiro a manhã, depois a tarde, depois a noite.',lesson:'O dia tem uma sequência que se repete.'};return simpleChoice('Qual número está faltando no relógio?',clockSVG(null,0,12),'12',['12','6','3'],'No alto do relógio fica o 12.','O relógio analógico organiza os números de 1 a 12 em um círculo.')}
  if(level===0&&task===1)return simpleChoice('Qual número está faltando no alto do relógio?',clockSVG(null,0,12),'12',['12','6','3'],'Observe o alto do mostrador.','O número 12 fica no alto. O 6 fica embaixo.');
  let hour=[3,6,9][task],minute=age===6&&level===2?30:0,label=hour+':'+(minute?'30':'00');let lesson=minute?'Quando o ponteiro longo aponta para o 6, passaram 30 minutos. O curto fica entre duas horas.':'Nas horas exatas, o ponteiro longo aponta para o 12. O curto indica a hora.';
  if(task===2&&level>0&&age>4)return{kind:'setclock',text:'Ajuste o relógio para '+hour+' horas'+(minute?' e meia':'')+'.',hour,minute,allowHalf:age===6&&level===2,visual:'',lesson,hint:'Observe o ponteiro curto e depois o ponteiro longo.'};
  return simpleChoice('Que horas o relógio está marcando?',clockSVG(hour,minute),label,[label,((hour%12)+1)+':00',hour+':'+(minute?'00':'30')],'Observe os dois ponteiros.',lesson);
 }
 if(id==='calendario'){
  if(level===0){let day=task+1,next=task===1?day-1:day+1;return{...simpleChoice('Na história, hoje é '+WEEK[day]+'. Que dia '+(task===1?'foi ontem':'será amanhã')+'?',weekVisual(day),WEEK[next],[WEEK[next],WEEK[day],WEEK[(next+2)%7]],'Siga a sequência dos dias.','Ontem é o dia anterior. Amanhã é o dia seguinte. A semana tem sete dias.'),readOptions:true};}
  let year=2026,month=9,start=[6,12,19][task],delta=level===2?(age===4?1:age===5?2:3):0,target=start+delta;
  return{kind:'calendar',year,month,target,start:delta?start:null,text:delta?'Na história, hoje é dia '+start+'. Marque o dia que será daqui a '+delta+' dia'+(delta>1?'s':'')+'.':'Encontre o dia '+target+' no calendário.',visual:'',lesson:'Calendário de exemplo: outubro de 2026. Cada quadrinho numerado representa um dia. '+(delta?'Comece a contar pelo dia seguinte.':''),hint:delta?'O primeiro dia contado é '+(start+1)+'.':'Procure o número '+target+'.'};
 }
 if(id==='natureza'){
  if(task===0)return makeQuestion(age,3,0);
  if(task===1)return{kind:'order',text:'Organize o crescimento da planta.',sequence:['🫘','🌱','🌳'],tiles:shuffle(['🌳','🌱','🫘']),visual:'☀️ 💧',hint:'Comece pela semente.',lesson:'Com condições adequadas, a semente germina, forma uma muda e pode crescer até se tornar uma árvore.'};
  if(level===0)return makeQuestion(age,3,1);
  if(level===1)return simpleChoice('Depois do dia vem a noite. Qual cena continua?','☀️ 🌙 ☀️ ?', '🌙',['🌙','☀️','🌈'],'Observe a sequência que se repete.','O ciclo de dia e noite se repete.');
  return{kind:'order',text:'Organize as estações a partir do verão.',sequence:['☀️','🍂','🧣','🌸'],tiles:shuffle(['🌸','☀️','🍂','🧣']),visual:'',hint:'Verão, outono, inverno e primavera.',lesson:'As estações seguem esta ordem: verão, outono, inverno e primavera. Elas não aparecem da mesma forma em todos os lugares; inverno não significa que sempre neva.'};
 }
 if(id==='arte'){
  if(task===0)return artQuestion(age,level);
  if(task===1)return{kind:'rhythm',beats:2+level+(age===6?1:0),text:'Ouça os sons e repita a quantidade de batidas.',visual:'',lesson:'Escute a sequência. Depois toque no tambor uma vez para cada som. Pode ouvir novamente.',hint:'Ouça de novo e conte os sons, um de cada vez.'};
  return{kind:'recite',text:'Ouça os versos. Depois tente lembrar.',lines:level===0?['O sol aquece o jardim.','A flor sorri para mim.']:level===1?['Na ilha canta o passarinho.','Eu observo com carinho.']:['A semente vai brotar.','Com cuidado vou regar.','Vejo a planta florescer.','Todo dia vou aprender.'],visual:'',lesson:'Versos criados para o jogo. Leia ou ouça, esconda e tente recitar. Você pode olhar novamente.',openPractice:true};
 }
 throw new Error('Trilha desconhecida: '+id);
}

function artQuestion(age,level){
const works=[{file:'arte-barcos.svg',title:'Barcos ao entardecer',questions:[['Qual cor aparece nas velas dos barcos?','Branca',['Branca','Verde','Roxa'],'Observe os triângulos acima dos barcos.'],['Quantos barcos aparecem no desenho?','2',['1','2','3'],'Conte os barcos sobre a água.'],['Onde o sol está em relação aos barcos?','Acima',['Acima','Abaixo','Dentro'],'Compare a posição do sol com a dos barcos.']]},{file:'arte-jardim.svg',title:'Janela para o jardim',questions:[['Qual cor aparece nas flores?','Vermelha',['Vermelha','Azul','Preta'],'Observe as pétalas.'],['Quantas flores aparecem no vaso?','3',['2','3','4'],'Conte cada flor uma vez.'],['Qual elemento está mais perto de quem observa?','O vaso',['O vaso','As montanhas','O sol'],'O vaso está no parapeito da janela, à frente da paisagem.']]},{file:'arte-formas.svg',title:'Encontro de formas',questions:[['Qual forma é amarela?','Círculo',['Círculo','Quadrado','Triângulo'],'Procure a figura redonda.'],['Qual forma aparece duas vezes?','Círculo',['Círculo','Quadrado','Triângulo'],'Compare os contornos, mesmo quando as cores mudam.'],['Qual figura está parcialmente atrás do círculo amarelo?','Quadrado azul',['Quadrado azul','Triângulo verde','Círculo vermelho'],'Observe a borda do quadrado que o círculo cobre.']]}];
let work=works[level],q=work.questions[age-4];return {...simpleChoice(q[0],'<figure class="art-work"><img src="assets/'+work.file+'" alt="Desenho '+work.title+'"><figcaption>'+work.title+' · desenho original do jogo</figcaption></figure>',q[1],q[2],q[3],'Observe o desenho com calma antes de responder. Procure a resposta na própria imagem.'),readOptions:true};
}
