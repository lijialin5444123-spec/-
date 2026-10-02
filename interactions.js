(() => {
 const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
 const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
 const main = document.querySelector('main');
 const footer = document.querySelector('footer');
 const categoryPage = document.querySelector('#category-page');
 const nav = document.querySelector('nav');
 const navLinks = [...nav.querySelectorAll('a')];
 const categoryKeys = Object.keys(categories);
 let savedScroll = 0;
 let previousHash = '';
 let lastCard;
 let activeNav;
 const mobile = window.matchMedia('(max-width: 760px)');
 const header = document.querySelector('.site-header');
 const menuButton = document.createElement('button');
 menuButton.type = 'button'; menuButton.className = 'menu-toggle';
 menuButton.setAttribute('aria-label','打开导航菜单');
 menuButton.setAttribute('aria-expanded','false');
 menuButton.setAttribute('aria-controls','main-navigation');
 nav.id = 'main-navigation';
 for(let i=0;i<3;i++){const bar=document.createElement('span');bar.setAttribute('aria-hidden','true');menuButton.append(bar);}
 header.append(menuButton);
 document.documentElement.classList.add('mobile-ready');
 function closeMenu(returnFocus=false){
  header.classList.remove('menu-open');menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','打开导航菜单');
  if(mobile.matches)nav.inert=true;
  if(returnFocus)menuButton.focus();
 }
 function syncMenu(){closeMenu();nav.inert=mobile.matches;activateNav(activeNav);}
 menuButton.addEventListener('click',()=>{
  const open=menuButton.getAttribute('aria-expanded')!=='true';
  header.classList.toggle('menu-open',open);nav.inert=!open;
  menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'关闭导航菜单':'打开导航菜单');
  if(open)activateNav(activeNav);
 });
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&header.classList.contains('menu-open'))closeMenu(true);});
 document.addEventListener('click',event=>{if(mobile.matches&&!header.contains(event.target))closeMenu();});
 navLinks.forEach(link=>link.addEventListener('click',()=>{if(mobile.matches){closeMenu();menuButton.focus({preventScroll:true});}}));
 header.querySelectorAll('.brand,.header-contact').forEach(link=>link.addEventListener('click',()=>{if(mobile.matches)closeMenu();}));
 mobile.addEventListener('change',syncMenu);
 syncMenu();
 if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

 // Hash routes work both on hosting and in the downloadable single HTML file.
 function renderRoute() {
  const hash = location.hash;
  const key = hash.startsWith('#works/') ? hash.slice(7) : null;
  const isCategory = Boolean(key && categories[key]);
  const wasCategory = previousHash.startsWith('#works/');
  if (isCategory) {
   if (!wasCategory) savedScroll = window.scrollY;
   main.hidden = true; footer.hidden = true; categoryPage.hidden = false;
   const item = categories[key];
   document.querySelector('#category-en').textContent = item.en;
   document.querySelector('#category-title').textContent = item.title;
   document.querySelector('#category-description').textContent = item.description;
   const tabs = document.querySelector('.category-tabs');
   tabs.replaceChildren(...categoryKeys.map(id => {
    const link = document.createElement('a'); link.href = '#works/' + id; link.textContent = categories[id].title;
    if (id === key) {link.classList.add('active'); link.setAttribute('aria-current','page');}
    return link;
   }));
   const next = categoryKeys[(categoryKeys.indexOf(key) + 1) % categoryKeys.length];
   const nextLink = document.querySelector('#next-category');
   nextLink.href = '#works/' + next; nextLink.textContent = '下一分类：' + categories[next].title;
   document.title = item.title + '｜李嘉琳作品集';
   window.scrollTo({top:0, behavior:'instant'});
   document.querySelector('#category-title').focus({preventScroll:true});
   if (!reduced.matches) categoryPage.animate([{opacity:0,transform:'translateY(22px)'},{opacity:1,transform:'translateY(0)'}],{duration:550,easing:'cubic-bezier(.16,1,.3,1)'});
   activateNav(navLinks.find(a => a.hash === '#portfolio'));
  } else {
   main.hidden = false; footer.hidden = false; categoryPage.hidden = true;
   document.title = '李嘉琳｜电商视觉与三维设计作品集';
   if (wasCategory) {
    const target = hash && document.getElementById(hash.slice(1));
    if (hash === '#portfolio' || !hash) {
     if(lastCard)window.scrollTo({top:savedScroll,behavior:'instant'});
     else document.querySelector('#portfolio').scrollIntoView({behavior:'instant'});
     if (lastCard) lastCard.focus({preventScroll:true});
    } else if (target) target.scrollIntoView({behavior:reduced.matches?'instant':'smooth'});
   }
   updateScroll();
  }
  previousHash = hash;
 }
 document.querySelectorAll('[data-category]').forEach(card => card.addEventListener('click', () => {
  lastCard = card; savedScroll = window.scrollY; location.hash = 'works/' + card.dataset.category;
 }));
 window.addEventListener('hashchange', renderRoute);

 // A sliding pill and a brief burst follow the selected navigation item.
 function activateNav(link) {
  if (!link) return;
  const bounds = link.getBoundingClientRect(), parent = nav.getBoundingClientRect();
  if(bounds.width>0){
  nav.style.setProperty('--pill-x', (bounds.left-parent.left)+'px');
  nav.style.setProperty('--pill-y', (bounds.top-parent.top)+'px');
  nav.style.setProperty('--pill-width', bounds.width+'px');
  nav.style.setProperty('--pill-height', bounds.height+'px');
  }
  navLinks.forEach(a => {const selected=a===link;a.classList.toggle('active',selected);if(selected)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});
  if (activeNav !== link && !reduced.matches) {
   nav.classList.remove('pill-bounce'); void nav.offsetWidth; nav.classList.add('pill-bounce');
  }
  activeNav = link;
 }
 function burst(link) {
  if (reduced.matches) return;
  const bounds=link.getBoundingClientRect(), parent=nav.getBoundingClientRect();
  for(let i=0;i<10;i++) {
   const dot=document.createElement('span');dot.className='nav-particle';dot.setAttribute('aria-hidden','true');
   dot.style.left=(bounds.left-parent.left+bounds.width/2)+'px';dot.style.top=(bounds.top-parent.top+bounds.height/2)+'px';
   const angle=(i/10)*Math.PI*2, distance=22+Math.random()*24;
   dot.style.setProperty('--dx',Math.cos(angle)*distance+'px');dot.style.setProperty('--dy',Math.sin(angle)*distance+'px');
   dot.style.background=['#ffd38a','#ff963f','#ff6329'][i%3];nav.append(dot);
   dot.addEventListener('animationend',()=>dot.remove(),{once:true});
  }
 }
 navLinks.forEach(link=>link.addEventListener('click',()=>{activateNav(link);burst(link);}));
 let scrollFrame=0;
 function updateScroll() {
  scrollFrame=0;
  if(!categoryPage.hidden)return;
  const line=window.scrollY+window.innerHeight*.28;
  let id='home';
  document.querySelectorAll('main>section').forEach(section=>{if(section.offsetTop<=line)id=section.id;});
  activateNav(navLinks.find(a=>a.hash==='#'+id));
  if(!reduced.matches && fine.matches && !mobile.matches) {
   const hero=document.querySelector('.hero');
   hero.style.setProperty('--hero-parallax',Math.min(window.scrollY*.1,90)+'px');
   document.querySelectorAll('.work-placeholder').forEach(el=>{
    const rect=el.parentElement.getBoundingClientRect();
    if(rect.bottom>0&&rect.top<window.innerHeight)el.style.setProperty('--work-parallax',((rect.top+rect.height/2-window.innerHeight/2)/window.innerHeight*-16)+'px');
   });
  }
 }
 window.addEventListener('scroll',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(updateScroll);},{passive:true});
 window.addEventListener('resize',()=>{activateNav(activeNav);updateScroll();});
 renderRoute();

 // Individual letter proximity, without shifting the surrounding text layout.
 document.querySelectorAll('.hero-title-year,.hero-title-main,.section-head>p').forEach(heading=>{
  const nodes=[...heading.childNodes];
  nodes.forEach(node=>{
   if(node.nodeType!==Node.TEXT_NODE)return;
   const fragment=document.createDocumentFragment();
   for(const character of node.textContent){const letter=document.createElement('span');letter.className='proximity-letter';letter.textContent=character===' '?'\u00a0':character;fragment.append(letter);}
   node.replaceWith(fragment);
  });
  let frame=0;
  heading.addEventListener('pointermove',event=>{
   if(!fine.matches||reduced.matches)return;
   if(frame)cancelAnimationFrame(frame);
   frame=requestAnimationFrame(()=>{heading.querySelectorAll('.proximity-letter').forEach(letter=>{
    const box=letter.getBoundingClientRect();const distance=Math.hypot(event.clientX-box.left-box.width/2,event.clientY-box.top-box.height/2);
    const strength=Math.max(0,1-distance/150);letter.style.setProperty('--letter-scale',1+strength*.09);letter.style.setProperty('--letter-lift',strength*-3+'px');
   });});
  });
  heading.addEventListener('pointerleave',()=>{cancelAnimationFrame(frame);heading.querySelectorAll('.proximity-letter').forEach(letter=>{letter.style.removeProperty('--letter-scale');letter.style.removeProperty('--letter-lift');});});
 });

 // Card lighting follows the pointer. The portrait also tilts in perspective.
 document.querySelectorAll('.profile-card,.work-card,.contact-card,.pill').forEach(card=>{
  card.classList.add('pointer-light');
  let frame=0;
  card.addEventListener('pointermove',event=>{
   if(!fine.matches||reduced.matches)return;
   if(frame)cancelAnimationFrame(frame);
   frame=requestAnimationFrame(()=>{
    const box=card.getBoundingClientRect();const x=(event.clientX-box.left)/box.width,y=(event.clientY-box.top)/box.height;
    card.style.setProperty('--pointer-x',(x*100)+'%');card.style.setProperty('--pointer-y',(y*100)+'%');
    if(card.classList.contains('profile-card')){card.style.setProperty('--tilt-x',(0.5-y)*8+'deg');card.style.setProperty('--tilt-y',(x-0.5)*10+'deg');}
   });
  });
  card.addEventListener('pointerleave',()=>{cancelAnimationFrame(frame);card.style.setProperty('--tilt-x','0deg');card.style.setProperty('--tilt-y','0deg');});
 });

 // Advantages switch to the orange surface and reveal floating skill labels.
 const advantages=[...document.querySelectorAll('.advantage-card')];
 function chooseAdvantage(card){advantages.forEach(other=>{const on=other===card;other.classList.toggle('is-active',on);other.setAttribute('aria-pressed',String(on));});}
 advantages.forEach(card=>{
  card.tabIndex=0;card.setAttribute('role','button');card.setAttribute('aria-pressed','false');
  card.setAttribute('aria-label',card.querySelector('h3').innerText.replace(/\n/g,'')+'，显示技能标签');
  const floating=document.createElement('div');floating.className='floating-skills';floating.setAttribute('aria-hidden','true');
  card.querySelectorAll('.tags span').forEach(tag=>{const chip=document.createElement('span');chip.textContent=tag.textContent;floating.append(chip);});card.append(floating);
  card.addEventListener('pointerenter',()=>{if(fine.matches)chooseAdvantage(card);});
  card.addEventListener('pointerleave',()=>{if(fine.matches&&!card.matches(':focus'))chooseAdvantage(null);});
  card.addEventListener('focus',()=>{if(fine.matches||card.matches(':focus-visible'))chooseAdvantage(card);});
  card.addEventListener('blur',()=>chooseAdvantage(null));
  card.addEventListener('click',()=>chooseAdvantage(fine.matches?card:(card.classList.contains('is-active')?null:card)));
  card.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();chooseAdvantage(card.classList.contains('is-active')?null:card);}});
 });
 document.querySelectorAll('.portfolio-showcase .reveal,.advantages-panel .reveal').forEach((el,i)=>el.style.setProperty('--stagger',(i%4)*100+'ms'));

 // A short opening sequence, skipped for reduced motion and deep links.
 if(!reduced.matches&&!location.hash) {
  document.documentElement.classList.add('cinematic-entry');
  const cover=document.createElement('div');cover.className='opening-cover';cover.setAttribute('aria-hidden','true');
  const label=document.createElement('p');label.textContent='LI JIALIN / PORTFOLIO';
  const number=document.createElement('strong');number.textContent='01';cover.append(label,number);document.body.append(cover);
  const started=performance.now();let frame;
  function close(){cancelAnimationFrame(frame);cover.classList.add('exit');document.documentElement.classList.add('entry-ready');setTimeout(()=>cover.remove(),500);}
  function tick(time){const t=Math.min((time-started)/760,1);number.textContent=String(Math.round(1+(1-Math.pow(1-t,3))*99)).padStart(2,'0');if(t<1)frame=requestAnimationFrame(tick);else close();}
  frame=requestAnimationFrame(tick);cover.addEventListener('click',close,{once:true});
 }else document.documentElement.classList.add('entry-ready');
})();
