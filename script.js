let notices = [];

function openModal() {
    modal.style.display = "flex";
}

function closeModal() {
    modal.style.display = "none";
}

function addNotice() {
    let title = document.getElementById("title").value;
    let desc = document.getElementById("desc").value;
    let category = document.getElementById("category").value;

    if(title == "" || desc == "") {
        alert("Fill all fields!");
        return;
    }

    let notice = {
        title, desc, category,
        date: new Date().toLocaleDateString(),
        important: false
    };

    notices.unshift(notice);
    render();

    modal.style.display = "none";
}

function render(list = notices) {
    let board = document.getElementById("board");
    board.innerHTML = "";

    list.forEach((n, index) => {
        let card = document.createElement("div");
        card.className = "card" + (n.important ? " important" : "");

        card.innerHTML = `
            <div class="category">${n.category}</div>
            <div class="title">${n.title}</div>
            <div class="content">${n.desc}</div>
            <div class="date">${n.date}</div>
            <div class="actions">
                <button class="btn delete" onclick="deleteNotice(${index})">Delete</button>
                <button class="btn pin" onclick="pinNotice(${index})">Pin</button>
            </div>
        `;

        board.appendChild(card);
    });
}

function deleteNotice(i) {
    notices.splice(i,1);
    render();
}

function pinNotice(i) {
    notices[i].important = !notices[i].important;
    render();
}

function searchNotice() {
    let val = document.getElementById("search").value.toLowerCase();
    let filtered = notices.filter(n => n.title.toLowerCase().includes(val));
    render(filtered);
}

function filter(cat) {
    if(cat == "All") render();
    else render(notices.filter(n => n.category == cat));
}