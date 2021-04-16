

export function dijkstra(grid, startNode, endNode) {

    // array of all visisted nodes in order of visited
    const nodesInOrder = [];

    startNode.distance = 0;
    const unvisitedNodes = getAllNodes(grid);

    // 0 is falsey
    while (unvisitedNodes.length) {
        sortNodesByDistance(unvisitedNodes);
        const closestNode = unvisitedNodes.shift();

        // if the closest node is a wall, skip
        if (closestNode.isWall) continue;

        // if the closest node distance is infinity, we're stuck
        if (closestNode.distance === Infinity) {
            return nodesInOrder
        };

        // set the node to visited and add it to the array of visited
        closestNode.isVisited = true;
        nodesInOrder.push(closestNode);

        // if closest node is end node then we're done
        if (closestNode === endNode) return nodesInOrder;
        updateNeighborDistances(closestNode, grid);
    }
}


// sorts path so we can easily get closest neighbor
function sortNodesByDistance(unvisitedNodes) {
    unvisitedNodes.sort((node1, node2) => node1.distance - node2.distance);
}


// updates unvisited neighbor distances
function updateNeighborDistances(node, grid) {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);

    for (const neighbor of unvisitedNeighbors) {
        neighbor.distance = node.distance + 1;
        neighbor.previousNode = node;
    }
}


// gets unvisited neighbors given a node
function getUnvisitedNeighbors(node, grid) {

    const neighbors = [];

    // row and col are properties of the node
    const {row, col} = node;

    // up
    if (row > 0) neighbors.push(grid[row-1][col]);
    // down
    if (row < grid.length-1) neighbors.push(grid[row+1][col]);
    // left
    if (col > 0) neighbors.push(grid[row][col-1]);
    // right
    if (col < grid[0].length-1) neighbors.push(grid[row][col+1]);

    // reject neighbors that are visisted
    return neighbors.filter((neighbor) => !neighbor.isVisited);
}


// gets all nodes on the grid
function getAllNodes(grid) {
    const nodes = [];
    for (const row of grid) {
        for (const node of row) {
            nodes.push(node);
        }
    }
    return nodes;
}


// only works after algorithm completed
// uses backtracking to get path
export function getPath(endNode) {

    // path to be returned
    const path = [];

    let currentNode = endNode;

    // if current node is null we're at the starting node
    while (currentNode !== null) {
        path.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }

    return path;
}