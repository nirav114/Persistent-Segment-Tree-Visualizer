const output = document.getElementById("tree");

function getInput() {
    const value = document.getElementById("inp").value;
    var arr = value.split(" ")
    var num = [];

    for (var i = 0; i < arr.length; i++) {
        if (!isNaN(arr[i]) && arr[i] != "\n") {
            num.push(arr[i])
        }
    }
    return num
}

function action() {
    const e = document.querySelector('#types');
    const el = document.querySelector('#tree');
    el.innerHTML = ''   
    getRoot(e.options[e.selectedIndex].text)
    el.onwheel = zoom;
}

function updatAction() {
    const id = document.querySelector('#index').value - 1;
    const newVal = document.querySelector('#value').value;

    const el = document.querySelector('#tree');
    el.innerHTML = '';

    const e = document.querySelector('#types');
    var opr = e.options[e.selectedIndex].text;

    update(opr, id, newVal);
}

function queryAction() {
    const el = document.querySelector('#tree');
    el.innerHTML = '';
    const version = Number(document.querySelector('#version').value);
    const start = Number(document.querySelector('#start').value);
    const end = Number(document.querySelector('#end').value);
    const e = document.querySelector('#types');
    var opr = e.options[e.selectedIndex].text

    var result = query(version, opr, start, end);
    const r = document.querySelector('#result');
    r.innerHTML = result
    console.log(result);
}

function currentAction() {
    const el = document.querySelector('#tree');
    el.innerHTML = '';
    const version = Number(document.querySelector('#version').value);
    const start = Number(document.querySelector('#start').value);
    const end = Number(document.querySelector('#end').value);
    const e = document.querySelector('#types');
    var opr = e.options[e.selectedIndex].text
    s = versions[opr].length
    var t = tree[opr][s - 1]
    t = getAll(t);
    drawGraph(t, 0)
}

function getRoot(opr) {
    var result = getInput()

    var root = createTree(result, opr);
    return root
}

var tree = document.getElementById("tree");
var starty, startx, scrleft, scrtop, isdown;

tree.addEventListener('mousedown', e => MouseDown(e));
tree.addEventListener('mouseup', e => mouseUp(e))
tree.addEventListener('mouseleave', e => mouseLeave(e));
tree.addEventListener('mousemove', e => mouseMove(e));

function MouseDown(e) {
    isdown = true;
    startx = e.pageX - tree.offsetLeft;
    starty = e.pageY - tree.offsetTop;
    scrleft = tree.scrollLeft;
    scrtop = tree.scrollTop;
}

function mouseUp(e) {
    isdown = false;
}

function mouseLeave(e) {
    isdown = false;
}

function mouseMove(e) {
    if (isdown) {
        e.preventDefault();

        var y = e.pageY - tree.offsetTop;
        var goY = y - starty;
        tree.scrollTop = scrtop - goY;

        var x = e.pageX - tree.offsetLeft;
        var goX = x - startx;
        tree.scrollLeft = scrleft - goX;
    }
}
let scale = 1;

//https://developer.mozilla.org/en-US/docs/Web/API/Element/wheel_event
function zoom(event) {
    const el = document.querySelector('svg');

    event.preventDefault();
    scale += event.deltaY * -0.001;
    scale = Math.min(Math.max(.250, scale), 1);
    el.style.transform = `scale(${scale})`;
}