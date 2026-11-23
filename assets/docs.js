(function(){
  document.querySelectorAll('.content pre').forEach(function(pre){
    var wrap=document.createElement('div');wrap.className='codebox';
    pre.parentNode.insertBefore(wrap,pre);wrap.appendChild(pre);
    var b=document.createElement('button');b.type='button';b.className='codecopy';b.textContent='Copy';
    b.setAttribute('aria-label','Copy code');
    b.addEventListener('click',function(){
      var done=function(){b.textContent='Copied';setTimeout(function(){b.textContent='Copy';},1500);};
      if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(pre.textContent.trim()).then(done,function(){});}
    });
    wrap.appendChild(b);
  });
  var tg=document.querySelector('.navtoggle'),sb=document.querySelector('.sidebar');
  if(tg){tg.addEventListener('click',function(){var o=sb.classList.toggle('open');tg.setAttribute('aria-expanded',o);});}
})();
(function(){
  var sel=document.getElementById('version');
  if(!sel||!window.fetch)return;
  var base=sel.getAttribute('data-base'),cur=sel.getAttribute('data-current'),file=sel.getAttribute('data-file');
  fetch(base+'versions.json').then(function(r){return r.ok?r.json():null;}).then(function(d){
    if(!d||!d.versions||d.versions.length<1)return;
    sel.innerHTML='';
    d.versions.forEach(function(v){
      var o=document.createElement('option');o.value=v;
      o.textContent=v+(v===d.development?' (development)':(v===d.latest?' (latest)':''));
      if(v===cur)o.selected=true;
      sel.appendChild(o);
    });
    sel.disabled=false;
    sel.addEventListener('change',function(){
      var target=base+sel.value+'/';
      fetch(target+file,{method:'HEAD'}).then(function(r){location.href=r.ok?target+file:target;},function(){location.href=target;});
    });
    if(d.latest&&cur!==d.latest){
      var c=document.querySelector('.content');
      var n=document.createElement('div');n.className='note warn';
      var p=document.createElement('p');
      var isDev=cur===d.development;
      p.appendChild(document.createTextNode(isDev
        ?'This is the documentation of the development version. It can describe features that are not released yet. '
        :'You are reading the documentation for version '+cur+'. '));
      var a=document.createElement('a');a.href=base+d.latest+'/'+file;a.textContent='View version '+d.latest;
      p.appendChild(a);n.appendChild(p);c.insertBefore(n,c.firstChild);
    }
  }).catch(function(){});
})();
