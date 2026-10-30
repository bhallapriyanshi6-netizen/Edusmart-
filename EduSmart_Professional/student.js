const $ = s => document.querySelector(s);
const getData = (key,fallback) => { try { const v=localStorage.getItem(key); return v===null?fallback:JSON.parse(v); } catch { return fallback; } };
const saveData = (key,value) => { try { localStorage.setItem(key,JSON.stringify(value)); return true; } catch { alert("Unable to save data in this browser."); return false; } };
let student = getData("edusmartStudent",{name:"",email:"",studentId:"",course:"",year:"",goal:""});
const form=$("#studentForm"), notice=$("#saveNotice");
const fields={name:$("#fullName"),email:$("#studentEmail"),studentId:$("#studentId"),course:$("#course"),year:$("#yearOfStudy"),goal:$("#learningGoal")};
function updateHeader(){
  const name=student.name?.trim()||"Student";
  $("#headerStudentName").textContent=name;
  $("#headerAvatar").textContent=name.charAt(0).toUpperCase();
}
function updatePreview(){
  const name=student.name?.trim()||"Student";
  $("#previewInitial").textContent=name.charAt(0).toUpperCase();
  $("#previewName").textContent=name;
  $("#previewCourse").textContent=[student.course,student.year].filter(Boolean).join(" · ")||"Add your course to personalize this card";
  $("#previewEmail").textContent=student.email||"Not added";
  $("#previewId").textContent=student.studentId||"Not added";
  $("#previewYear").textContent=student.year||"Not selected";
  $("#previewGoal").textContent=student.goal||"Your goal will appear here after you save your profile.";
  updateHeader();
}
function loadForm(){
  Object.entries(fields).forEach(([key,input])=>input.value=student[key]||"");
  updatePreview();
}
form.addEventListener("submit",e=>{
  e.preventDefault();
  student=Object.fromEntries(Object.entries(fields).map(([key,input])=>[key,input.value.trim()]));
  if(!student.name){fields.name.focus();return;}
  if(!saveData("edusmartStudent",student))return;
  updatePreview();notice.hidden=false;notice.textContent="Profile saved successfully in this browser.";
  window.setTimeout(()=>{notice.hidden=true;},3500);
});
$("#clearProfile").addEventListener("click",()=>{
  if(!confirm("Clear the saved student profile?"))return;
  student={name:"",email:"",studentId:"",course:"",year:"",goal:""};
  saveData("edusmartStudent",student);loadForm();notice.hidden=true;
});
const toggle=$("#menuToggle"),nav=$("#navLinks");
toggle.addEventListener("click",()=>{const open=nav.classList.toggle("open");toggle.setAttribute("aria-expanded",String(open));});
nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");toggle.setAttribute("aria-expanded","false");}));
$("#year").textContent=new Date().getFullYear();
loadForm();
