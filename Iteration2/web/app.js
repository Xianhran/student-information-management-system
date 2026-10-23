async function api(url, method, body) {
    const opt = { method: method || 'GET' };
    if (body) {
        opt.headers = { 'Content-Type': 'application/json' };
        opt.body = JSON.stringify(body);
    }
    const res = await fetch(url, opt);
    return res.json();
}

function showMsg(text, isError) {
    const m = document.getElementById('msg');
    m.textContent = text;
    m.className = 'msg ' + (isError ? 'error' : 'success');
    if (text) setTimeout(() => { m.className = 'msg'; }, 3000);
}

async function loadStudents() {
    const list = await api('/api/students');
    document.getElementById('students-tbody').innerHTML =
        list.map(s => `<tr><td>${s.id}</td><td>${s.name}</td><td><button onclick="delStudent('${s.id}')">Delete</button></td></tr>`).join('');
}

async function addStudent() {
    const id = document.getElementById('s-id').value;
    const name = document.getElementById('s-name').value;
    const r = await api('/api/students', 'POST', { id, name });
    if (r.success) { loadStudents(); document.getElementById('s-id').value = ''; document.getElementById('s-name').value = ''; showMsg('Student added successfully', false); }
    else showMsg(r.error || 'Add failed', true);
}

async function searchStudent() {
    const id = document.getElementById('s-search').value;
    const res = await fetch('/api/students/' + encodeURIComponent(id));
    if (res.ok) {
        const s = await res.json();
        document.getElementById('students-tbody').innerHTML =
            `<tr><td>${s.id}</td><td>${s.name}</td><td><button onclick="delStudent('${s.id}')">Delete</button></td></tr>`;
    } else { showMsg('Student not found', true); loadStudents(); }
}

async function delStudent(id) {
    const r = await api('/api/students/' + encodeURIComponent(id), 'DELETE');
    if (r.success) { loadStudents(); showMsg('Student deleted', false); } else showMsg(r.error || 'Delete failed', true);
}

async function loadCourses() {
    const list = await api('/api/courses');
    document.getElementById('courses-tbody').innerHTML =
        list.map(c => `<tr><td>${c.code}</td><td>${c.title}</td><td><button onclick="delCourse('${c.code}')">Delete</button></td></tr>`).join('');
}

async function addCourse() {
    const code = document.getElementById('c-code').value;
    const title = document.getElementById('c-title').value;
    const r = await api('/api/courses', 'POST', { code, title });
    if (r.success) { loadCourses(); document.getElementById('c-code').value = ''; document.getElementById('c-title').value = ''; showMsg('Course added successfully', false); }
    else showMsg(r.error || 'Add failed', true);
}

async function delCourse(code) {
    const r = await api('/api/courses/' + encodeURIComponent(code), 'DELETE');
    if (r.success) { loadCourses(); showMsg('Course deleted', false); } else showMsg(r.error || 'Delete failed', true);
}

function renderEnrollments(list) {
    document.getElementById('enrollments-tbody').innerHTML =
        list.map(e => `<tr><td>${e.studentId}</td><td>${e.courseCode}</td><td><button onclick="drop('${e.studentId}','${e.courseCode}')">Drop</button></td></tr>`).join('');
    document.getElementById('enroll-hint').textContent = list.length === 0 ? 'No enrollment records' : '';
}

async function enroll() {
    const studentId = document.getElementById('e-sid').value;
    const courseCode = document.getElementById('e-ccode').value;
    const r = await api('/api/enrollments', 'POST', { studentId, courseCode });
    if (r.success) { document.getElementById('e-qsid').value = studentId; renderEnrollments(await api('/api/enrollments?studentId=' + encodeURIComponent(studentId))); showMsg('Enrolled successfully', false); }
    else showMsg(r.error || 'Enroll failed', true);
}

async function drop(sid, ccode) {
    const r = await api('/api/enrollments?studentId=' + encodeURIComponent(sid) + '&courseCode=' + encodeURIComponent(ccode), 'DELETE');
    if (r.success) { document.getElementById('e-qsid').value = sid; renderEnrollments(await api('/api/enrollments?studentId=' + encodeURIComponent(sid))); showMsg('Dropped successfully', false); } else showMsg(r.error || 'Drop failed', true);
}

async function queryByStudent() {
    const sid = document.getElementById('e-qsid').value;
    if (!sid) { showMsg('Please enter student ID', true); return; }
    renderEnrollments(await api('/api/enrollments?studentId=' + encodeURIComponent(sid)));
}

async function queryByCourse() {
    const ccode = document.getElementById('e-qccode').value;
    if (!ccode) { showMsg('Please enter course code', true); return; }
    renderEnrollments(await api('/api/enrollments?courseCode=' + encodeURIComponent(ccode)));
}

document.querySelectorAll('.tab').forEach(t => {
    t.onclick = () => {
        document.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
        document.querySelectorAll('.panel').forEach(x => x.classList.remove('active'));
        t.classList.add('active');
        document.getElementById(t.dataset.tab).classList.add('active');
    };
});

loadStudents();
loadCourses();
