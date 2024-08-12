import"./modulepreload-polyfill-B5Qt9EMX.js";const d="https://openmarket.weniv.co.kr";let i=1,s={};document.addEventListener("DOMContentLoaded",()=>{f()});const f=async()=>{try{s=await h(),console.log(s),q(s),g(s)}catch(t){console.log(t)}},h=async()=>{const t=new URL(window.location.href),e=new URLSearchParams(t.search).get("id");try{const n=await fetch(`${d}/products/${e}/`);return n.ok?await n.json():null}catch(n){return console.error("상품 불러오기 오류:",n),null}},q=t=>{C(t.stock,t.price),document.querySelector("h2").textContent=t.product_name,document.querySelector("figcaption").textContent=t.product_name;const r=document.querySelector(".product-image");r.src=t.image,r.alt=t.product_name;const e=new Intl.NumberFormat("ko-KR");document.querySelector(".store-name").textContent=t.store_name,document.querySelector(".product-name").textContent=t.product_name,document.querySelector(".product-price em").textContent=e.format(t.price),document.querySelector(".total-quantity em").textContent=i,document.querySelector(".total-price em").textContent=e.format(t.price*i),document.querySelector("section").classList.remove("hidden")},w=async t=>{const r=localStorage.getItem("token");if(!r){console.error("인증된 사용자가 아님. 토큰 없음"),alert("로그인 후 이용가능합니다."),window.location.href="./login.html";return}try{const e=await fetch(`${d}/cart/`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`JWT ${r}`},body:JSON.stringify({product_id:t.product_id,quantity:i,check:!0})});if(e.ok){const n=await e.json();return console.log(n),alert("장바구니에 추가되었습니다."),confirm("장바구니로 이동하시겠습니까?")&&(window.location.href="./cart.html"),n}else{const n=await e.json();return console.error("장바구니 넣기 실패:",n),alert(n.FAIL_message),null}}catch(e){return console.error("장바구니 넣기 오류:",e),alert("장바구니에 추가하지 못했습니다. 관리자에게 문의하세요."),null}},g=t=>{document.querySelector("#add-to-cart").addEventListener("click",async()=>{w(t)})},C=(t,r)=>{const e=document.querySelector(".quantity-change-input"),n=document.querySelector("#minus"),l=document.querySelector("#plus"),m=document.querySelector(".total-quantity em"),y=document.querySelector(".total-price em");let o=1;const p=new Intl.NumberFormat("ko-KR"),a=()=>{e.value=o,m.textContent=o,y.textContent=p.format(r*o),n.disabled=o<=1,l.disabled=o>=t};e.addEventListener("input",u=>{let c=parseInt(u.target.value,10)||1;u.target.value.startsWith("0")&&(c=parseInt(u.target.value,10)),c>t&&(alert("상품 재고를 초과하였습니다."),c=t),o=c,a()}),n.addEventListener("click",()=>{o>1&&(o--,a())}),l.addEventListener("click",()=>{o<t&&(o++,a())}),a()};
