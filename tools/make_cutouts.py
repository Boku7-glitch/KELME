"""ფეხსაცმლის ფოტოდან თეთრი ფონის მოშორება (public/img -> public/cut/*.webp)."""
import json,os,sys,numpy as np
from PIL import Image,ImageFilter
from scipy import ndimage
root=os.path.join(os.path.dirname(__file__),'..','public')
P=json.load(open(os.path.join(root,'products.json'),encoding='utf-8'))
os.makedirs(os.path.join(root,'cut'),exist_ok=True)
for x in P:
    out=os.path.join(root,'cut','%s.webp'%x['id'])
    if os.path.exists(out) and '--force' not in sys.argv: continue
    im=Image.open(os.path.join(root,x['img'])).convert('RGB'); a=np.asarray(im).astype(int)
    mn,mx=a.min(2),a.max(2)
    near=(mn>236)&((mx-mn)<12)
    lab,n=ndimage.label(near)
    border=set(np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]])))-{0}
    bg=np.isin(lab,list(border))
    bg=ndimage.binary_opening(bg,iterations=1)
    alpha=Image.fromarray(((~bg)*255).astype(np.uint8)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1))
    rgba=im.convert('RGBA'); rgba.putalpha(alpha)
    bb=alpha.point(lambda v:255 if v>20 else 0).getbbox(); rgba=rgba.crop(bb); rgba.thumbnail((900,900),Image.LANCZOS)
    rgba.save(out,quality=86,method=5)
print('ok')
