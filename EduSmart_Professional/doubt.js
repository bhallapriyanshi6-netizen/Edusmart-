/* EduSmart Doubt Corner: FAQ search and locally saved student doubts */
const $ = selector => document.querySelector(selector);
const faqData = [
 {subject:'Python',q:'What is the difference between a list and a tuple?',a:'A list is mutable, so its elements can be changed after creation. A tuple is immutable. Lists use square brackets [], while tuples commonly use parentheses ().'},
 {subject:'Python',q:'What is the purpose of self in Python?',a:'self refers to the current object of a class. It is used inside instance methods to access that object’s attributes and other methods.'},
 {subject:'Python',q:'What is inheritance in Python?',a:'Inheritance allows a new class (child class) to reuse and extend attributes and methods from an existing class (parent class).'},
 {subject:'DBMS',q:'What is a primary key?',a:'A primary key uniquely identifies each row in a table. It must contain unique values and cannot contain NULL values.'},
 {subject:'DBMS',q:'What is normalization?',a:'Normalization organizes database tables to reduce unnecessary duplication and avoid insertion, update, and deletion anomalies.'},
 {subject:'DBMS',q:'What is the difference between COMMIT and ROLLBACK?',a:'COMMIT permanently saves the current transaction’s changes. ROLLBACK cancels uncommitted changes in the current transaction.'},
 {subject:'Web Programming',q:'What is the difference between HTML, CSS, and JavaScript?',a:'HTML structures the content, CSS controls its appearance and layout, and JavaScript adds behavior and interactivity.'},
 {subject:'Web Programming',q:'What is the CSS box model?',a:'The CSS box model describes an element as content surrounded by padding, border, and margin. These layers affect spacing and layout.'},
 {subject:'Web Programming',q:'What is an event in JavaScript?',a:'An event is an action or occurrence, such as a click, key press, or form submission, that JavaScript can detect and respond to.'},
 {subject:'Data Analytics',q:'What is a NumPy ndarray?',a:'An ndarray is NumPy’s N-dimensional array object. It stores elements of a common data type and supports efficient numerical operations.'},
 {subject:'Data Analytics',q:'What is the difference between a Series and a DataFrame in Pandas?',a:'A Series is a one-dimensional labeled array. A DataFrame is a two-dimensional labeled structure with rows and columns.'},
 {subject:'Data Analytics',q:'How can missing values be identified in Pandas?',a:'Use df.isnull() or df.isna() to identify missing values. Use df.isnull().sum() to count missing values in each column.'}
];
const read = (key, fallback) => { try { const raw = localStorage.getItem(key); return raw === null ? fallback : JSON.parse(raw); } catch { return fallback; } };
const save = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { alert('Could not save data in this browser.'); return false; } };
let doubts = read('edusmartDoubts', []);
function renderFaqs(){
 const query = $('#faqSearch').value.trim().toLowerCase(); const category = $('#faqCategory').value;
 const filtered = faqData.filter(item => (category === 'all' || item.subject === category) && `${item.subject} ${item.q} ${item.a}`.toLowerCase().includes(query));
 const list = $('#faqList'); list.replaceChildren();
 if (!filtered.length) { const empty=document.createElement('p');empty.className='doubt-empty';empty.textContent='No matching questions found. Try another keyword or subject.';list.appendChild(empty); }
 filtered.forEach((item,index)=>{ const details=document.createElement('details');details.className='faq-item';if(index===0)details.open=true;const summary=document.createElement('summary');summary.textContent=item.q;const answer=document.createElement('div');answer.className='faq-answer';const tag=document.createElement('span');tag.className='category category-coral';tag.textContent=item.subject.toUpperCase();const paragraph=document.createElement('p');paragraph.textContent=item.a;paragraph.style.marginTop='7px';answer.append(tag,paragraph);details.append(summary,answer);list.appendChild(details); });
 $('#faqCount').textContent = `${filtered.length} question${filtered.length===1?'':'s'} shown`;
}
function renderDoubts(){
 const list=$('#savedDoubts');list.replaceChildren();
 if(!doubts.length){const empty=document.createElement('p');empty.className='doubt-empty';empty.textContent='No saved doubts yet. Questions you submit will appear here.';list.appendChild(empty);return;}
 [...doubts].reverse().forEach(doubt=>{const card=document.createElement('article');card.className='submitted-doubt';const remove=document.createElement('button');remove.className='doubt-delete';remove.type='button';remove.textContent='Delete';remove.setAttribute('aria-label',`Delete ${doubt.title}`);remove.addEventListener('click',()=>{doubts=doubts.filter(item=>item.id!==doubt.id);save('edusmartDoubts',doubts);renderDoubts();});const title=document.createElement('strong');title.textContent=doubt.title;const subject=document.createElement('small');subject.textContent=`${doubt.subject} · ${new Date(doubt.date).toLocaleDateString()}`;const details=document.createElement('p');details.textContent=doubt.details||'No extra details added.';card.append(remove,title,subject,details);list.appendChild(card);});
}
$('#faqSearch').addEventListener('input',renderFaqs);$('#faqCategory').addEventListener('change',renderFaqs);
$('#doubtForm').addEventListener('submit',event=>{event.preventDefault();const title=$('#doubtTitle').value.trim();if(!title)return;const doubt={id:Date.now()+Math.random(),subject:$('#doubtSubject').value,title,details:$('#doubtDetails').value.trim(),date:new Date().toISOString()};doubts.push(doubt);if(!save('edusmartDoubts',doubts))return;renderDoubts();$('#doubtForm').reset();$('#doubtNotice').hidden=false;$('#doubtNotice').textContent='Your doubt has been saved in this browser.';});
const menu=$('#menuToggle'),nav=$('#navLinks');if(menu&&nav){menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');}));}
const student=read('edusmartStudent',{});if($('#headerStudentName'))$('#headerStudentName').textContent=student.name?.trim()||'Student profile';if($('#headerAvatar'))$('#headerAvatar').textContent=(student.name?.trim()||'S').charAt(0).toUpperCase();if($('#year'))$('#year').textContent=new Date().getFullYear();renderFaqs();renderDoubts();
