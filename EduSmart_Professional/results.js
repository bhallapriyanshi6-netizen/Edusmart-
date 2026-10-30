const $ = s => document.querySelector(s);
const getData = (key,fallback) => { try { const v=localStorage.getItem(key); return v===null?fallback:JSON.parse(v); } catch { return fallback; } };
const saveData = (key,value) => { try { localStorage.setItem(key,JSON.stringify(value)); return true; } catch { alert("Unable to save data in this browser."); return false; } };
let results=getData("edusmartResults",[]);
const student=getData("edusmartStudent",{name:"Student"});
function updateHeader(){const name=student.name?.trim()||"Student";$("#headerStudentName").textContent=name;$("#headerAvatar").textContent=name.charAt(0).toUpperCase();}
function renderResults(){
  $("#resultTotal").textContent=results.length;
  $("#resultAverage").textContent=results.length?Math.round(results.reduce((s,r)=>s+Number(r.score||0),0)/results.length)+"%":"—";
  $("#resultBest").textContent=results.length?Math.max(...results.map(r=>Number(r.score||0)))+"%":"—";
  const root=$("#resultsContent");root.replaceChildren();
  if(!results.length){
    const empty=document.createElement("div");empty.className="empty-results";
    const icon=document.createElement("div");icon.className="empty-icon";icon.textContent="📈";
    const h=document.createElement("h3");h.textContent="Your results will appear here";
    const p=document.createElement("p");p.textContent="Complete a practice quiz to start building your assessment history.";
    const link=document.createElement("a");link.className="btn btn-primary";link.href="index.html#subjects";link.textContent="Explore quizzes →";
    empty.append(icon,h,p,link);root.appendChild(empty);return;
  }
  const wrap=document.createElement("div");wrap.className="table-wrap";
  const table=document.createElement("table");table.className="results-table";
  const thead=document.createElement("thead"),headRow=document.createElement("tr");
  ["Subject","Date attempted","Correct answers","Score"].forEach(label=>{const th=document.createElement("th");th.textContent=label;headRow.appendChild(th);});
  thead.appendChild(headRow);table.appendChild(thead);
  const tbody=document.createElement("tbody");
  [...results].reverse().forEach(r=>{
    const tr=document.createElement("tr");
    const date=new Date(r.date);
    const values=[r.subject||"Practice quiz",Number.isNaN(date.getTime())?"—":date.toLocaleString("en-IN",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}),`${r.correct ?? "—"} / ${r.total ?? "—"}`];
    values.forEach(value=>{const td=document.createElement("td");td.textContent=value;tr.appendChild(td);});
    const scoreCell=document.createElement("td");const pill=document.createElement("span");pill.className="score-pill"+(Number(r.score)<50?" low":"");pill.textContent=`${Number(r.score)||0}%`;scoreCell.appendChild(pill);tr.appendChild(scoreCell);tbody.appendChild(tr);
  });
  table.appendChild(tbody);wrap.appendChild(table);root.appendChild(wrap);
}
$("#clearResults").addEventListener("click",()=>{
  if(!results.length)return;
  if(!confirm("Delete all saved quiz results? This cannot be undone."))return;
  results=[];saveData("edusmartResults",results);renderResults();
});
const toggle=$("#menuToggle"),nav=$("#navLinks");
toggle.addEventListener("click",()=>{const open=nav.classList.toggle("open");toggle.setAttribute("aria-expanded",String(open));});
nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");toggle.setAttribute("aria-expanded","false");}));
$("#year").textContent=new Date().getFullYear();updateHeader();renderResults();
