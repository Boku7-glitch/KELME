"""ერთფაილიანი პრევიუ (სურათები ჩაშენებული) — გასაზიარებლად/სანახავად, სერვერის გარეშე."""
import json,base64,io,re,sys,os
from PIL import Image
root=os.path.join(os.path.dirname(__file__),'..','public')
out=sys.argv[1] if len(sys.argv)>1 else 'preview.html'
P=json.load(open(os.path.join(root,'products.json'),encoding='utf-8'))
def uri(path,size,fmt):
    im=Image.open(os.path.join(root,path)); im.thumbnail((size,size),Image.LANCZOS); b=io.BytesIO()
    if fmt=='WEBP': im.save(b,'WEBP',quality=80,method=5); mt='image/webp'
    else: im.convert('RGB').save(b,'JPEG',quality=80,optimize=True,progressive=True); mt='image/jpeg'
    return 'data:%s;base64,%s'%(mt,base64.b64encode(b.getvalue()).decode())
cuts={}
for p in P:
    p['img']=uri(p['img'],620,'JPEG'); cuts[p['id']]=uri('cut/%s.webp'%p['id'],560,'WEBP')
h=open(os.path.join(root,'index.html'),encoding='utf-8').read()
css=open(os.path.join(root,'styles.css'),encoding='utf-8').read()
js=open(os.path.join(root,'app.js'),encoding='utf-8').read().replace('const cut = p => "cut/" + p.id + ".webp";','const cut = p => (window.CUTS||{})[p.id] || ("cut/" + p.id + ".webp");')
cfg=open(os.path.join(root,'config.js'),encoding='utf-8').read()
def font(m):
    return 'url(data:font/woff2;base64,%s)'%base64.b64encode(open(os.path.join(root,m.group(1)),'rb').read()).decode()
css=re.sub(r'url\((fonts/[^)]+)\)',font,css)
h=re.sub(r'<link rel="preload"[^>]*>\n','',h)
h=h.replace('<link rel="stylesheet" href="styles.css">','<style>'+css+'</style>')
h=h.replace('<!--MOCK-->','<div class="mock">პრევიუ · ფასები და მარაგი 21.10.2026 · შეკვეთა სატესტო რეჟიმშია და არსად იგზავნება</div>')
h=h.replace('<script>/*DATA*/</script>','<script>window.KELME_PREVIEW=true;window.PRODUCTS='+json.dumps(P,ensure_ascii=False)+';window.CUTS='+json.dumps(cuts)+';</script>')
h=h.replace('<script src="config.js"></script>','<script>'+cfg+'</script>').replace('<script src="app.js"></script>','<script>'+js+'</script>')
open(out,'w',encoding='utf-8').write(h); print(out, os.path.getsize(out)//1024,'KB')
