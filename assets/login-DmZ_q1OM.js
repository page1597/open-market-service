import"./modulepreload-polyfill-B5Qt9EMX.js";const c="https://openmarket.weniv.co.kr";document.addEventListener("DOMContentLoaded",()=>{const o=document.getElementById("login-form"),n=document.getElementById("buyer"),s=document.getElementById("seller");o.dataset.loginType="BUYER",n.classList.add("active"),n.addEventListener("click",()=>{t("BUYER")}),s.addEventListener("click",()=>{t("SELLER")});const t=e=>{o.dataset.loginType=e,n.classList.toggle("active",e==="BUYER"),s.classList.toggle("active",e==="SELLER")};o.addEventListener("submit",e=>{e.preventDefault(),l(o)})});const l=o=>{const n=document.getElementById("id"),s=document.getElementById("password"),t=document.getElementById("error-message"),e=n.value.trim(),r=s.value.trim();if(!e||!r){t.style.display="block",e?(t.textContent="비밀번호를 입력해 주세요.",s.focus()):(t.textContent="아이디를 입력해 주세요.",n.focus());return}d(e,r,o.dataset.loginType)},d=async(o,n,s)=>{const t=document.getElementById("error-message"),e=document.getElementById("password");try{const r=await fetch(`${c}/accounts/login/`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({username:o,password:n,login_type:s})}),a=await r.json();return console.log(a),r.ok?(t.style.display="none",localStorage.setItem("token",a.token),alert("로그인 되었습니다."),window.location.href="/",!0):(console.error("로그인 실패:",a),e.focus(),e.value="",t.textContent="아이디 또는 비밀번호가 일치하지 않습니다.",t.style.display="block",!1)}catch(r){return console.error("로그인 오류:",r),!1}};
