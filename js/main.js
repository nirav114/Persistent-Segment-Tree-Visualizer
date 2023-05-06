function Node(value, left, right, idcnt, parent = "", children = []) {
    this.value = value;
    this.right = right;
    this.left = left;
    this.parent = parent;
    this.children = children;
    this.isRight = null;
    this.isLeft = null;
    this.nodeId = idcnt;
    this.hasClr = false;
}

var tree = {}
var path = []
var versions = {}
var n = 0
var data
var treeArr = []
var idCounter = 0

function merge(opr, a, b) {
    // console.log(opr, a, b)
    a = Number(a)
    b = Number(b)
    if (opr === "sum") return a + b;
    if (opr === "min") return Math.min(a, b);
    if (opr === "max") return Math.max(a, b);
    if (opr === "xor") return (a ^ b);
    if (opr === "or") return (a | b);
    if (opr === "and") return (a & b);
    return -1;
}

function getAll(t) {
    treeArr = []
    queue = []
    // treeArr.push(tree[typ][vid])
    // queue.push(tree[typ][vid])
    treeArr.push(t);
    queue.push(t);
    while (queue.length !== 0) {
        curNode = queue[0]

        if (curNode == null) continue

        queue.shift();
        treeArr.push(curNode)

        curNode.children = []

        if (curNode.left !== null) {
            curNode.children.push(curNode.left)
            curNode.isLeft = true
            curNode.left.parent = curNode
            queue.push(curNode.left)
        }
        if (curNode.right !== null) {
            curNode.children.push(curNode.right)
            curNode.isRight = true
            curNode.right.parent = curNode
            queue.push(curNode.right)
        }
        // console.log(curNode,"p : ",curNode.parent)
    }
    return treeArr
}

function createTree(arr, typ) {
    idCounter = 0
    tree = {}
    versions = {}
    data = arr
    n = arr.length
    var t = ["sum", "min", "max", "xor", "or", "and"]

    for (var i in t) {
        tree[t[i]] = {}
        tree[t[i]][0] = new Node("empty", null, null, ++idCounter)
        versions[t[i]] = []
        versions[t[i]].push(tree[t[i]][0])
        build(tree[t[i]][0], t[i], 0, n - 1)
    }
    treeArr = getAll(tree[typ][0])

    drawGraph(treeArr)
    return treeArr
}

function build(root, opr, l, r) {
    if (l == r) {
        root.value = data[l]
        return;
    }
    if (l > r) return;

    var mid;
    if ((l + r) % 2 === 1) mid = (l + r - 1) / 2;
    else mid = (l + r) / 2;
    root.left = new Node("empty", null, null, ++idCounter);
    root.right = new Node("empty", null, null, ++idCounter);

    build(root.left, opr, l, mid);
    build(root.right, opr, mid + 1, r);

    root.value = merge(opr, root.left.value, root.right.value);
}

ok = false
function updateTree(curVer, prevVer, opr, start, end, index, newVal) {
    // console.log(curVer, prevVer, start, end)
    if (index < start || index > end) return;
    if (start > end) return;

    // curVer = prevVer

    curVer.hasClr = true;
    if (start == end) {
        if (data[index] === newVal) ok = true
        data[index] = newVal
        curVer.value = newVal
        return;
    }

    var mid;
    if ((start + end) % 2 === 1) mid = (start + end - 1) / 2;
    else mid = (start + end) / 2;
    if (index <= mid) {
        curVer.right = prevVer.right;
        curVer.left = new Node("Empty", null, null, ++idCounter);
        updateTree(curVer.left, prevVer.left, opr, start, mid, index, newVal);
    }
    else {
        curVer.left = prevVer.left;
        curVer.right = new Node("Empty", null, null, ++idCounter);
        updateTree(curVer.right, prevVer.right, opr, mid + 1, end, index, newVal);
    }

    curVer.value = merge(opr, curVer.left.value, curVer.right.value);
}

function update(opr, index, newVal) {
    ok = false
    newNode = new Node("Empty", null, null, ++idCounter)
    newNode.hasClr = true;

    var s = versions[opr].length;
    updateTree(newNode, versions[opr][s - 1], opr, 0, n - 1, index, newVal);

    if (!ok) {
        versions[opr].push(newNode)
        s = versions[opr].length;
        tree[opr][s - 1] = newNode
    }

    t = tree[opr][s - 1]
    treeArr = getAll(t)

    path = []
    drawGraph(treeArr)
}

var cand = []

function find(root, opr, l, r, start, end) {
    if (l > end || r < start || root === null) return undefined;
    if (l <= start && end <= r) {
        root.hasClr = true;
        cand.push(root.value)
        return root.value;
    }
    var mid;
    if ((start + end) % 2 === 1) mid = (start + end - 1) / 2;
    else mid = (start + end) / 2;

    console.log(root);

    res1 = find(root.left, opr, l, r, start, mid)
    res2 = find(root.right, opr, l, r, mid + 1, end)

    if (res1 !== undefined || res2 !== undefined) root.hasClr = true;
    if (res1 === undefined) return res2;
    if (res2 === undefined) return res1;

    console.log("res : ", res1, res2, root);

    return merge(
        opr,
        res1,
        res2
    );
}

function query(versionId, opr, l, r) {
    cand = []
    res = find(versions[opr][versionId - 1], opr, l - 1, r - 1, 0, n - 1);
    console.log(res)
    t = tree[opr][versionId - 1]
    treeArr = getAll(t)
    console.log(treeArr)
    drawGraph(treeArr)

    res = cand[0];
    for (var i = 1; i < cand.length; i++) {
        res = merge(opr, res, cand[i])
    }
    return res;
}