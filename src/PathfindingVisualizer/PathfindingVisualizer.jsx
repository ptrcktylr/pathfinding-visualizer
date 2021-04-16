import React, {Component} from 'react';
import Node from './Node/Node';

import './PathfindingVisualizer.css';
import {dijkstra, getPath} from '../algorithms/dijkstra';

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

const NUM_GRID_ROWS = 20;
const NUM_GRID_COLS = 40;

export default class PathfindingVisualizer extends Component {
    constructor() {
        super();
        this.state = {
            grid: [],
            mouseIsPressed: false,
            running: false,
        };
    };

    // on page load
    componentDidMount() {
        const grid = getInitialGrid();
        this.setState({grid});
    }

    handleMouseDown(row, col) {
        if (this.state.running) {
            console.log('running!! stop clicking');
            return;
        };
        const newGrid = getNewGridWithWallsToggled(this.state.grid, row, col);
        this.setState({ grid: newGrid, mouseIsPressed: true });
    }

    handleMouseEnter(row, col) {
        // if (this.state.running) {
        //     console.log('running!! stop clicking');
        //     return;
        // };
        if (!this.state.mouseIsPressed) return;
        const newGrid = getNewGridWithWallsToggled(this.state.grid, row, col);
        this.setState( {grid: newGrid} );
    }

    handleMouseUp() {
        // if (this.state.running) {
        //     console.log('running!! stop clicking');
        //     return;
        // };
        this.setState({ mouseIsPressed: false });
    }

    // handles visualization of dijkstra
    visualizeDijkstra() {

        // set program as running to prevent wall creation & button presses
        this.setState({ running: true });

        const {grid} = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const endNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const visitedNodesInOrder = dijkstra(grid, startNode, endNode);
        const path = getPath(endNode);
        this.animateDijkstra(visitedNodesInOrder, path);

        // set program as not running
        enableButtons();
    }

    // handles animating visited nodes and path
    animateDijkstra(visitedNodesInOrder, path) {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                    this.setState({ running: false });
                    this.animatePath(path);
                }, 10 * i);

                return;
            }
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                // don't recolor start or finish node
                let node_classes = document.getElementById(`node-${node.row}-${node.col}`).classList
                let node_not_empty = node_classes.contains('node-start') || node_classes.contains('node-finish')
                if (!node_not_empty)
                    document.getElementById(`node-${node.row}-${node.col}`).className = "node node-visited"
            }, 10 * i);
        }
    }
    
    // animates the path given the path array
    animatePath(path) {
        for (let i = 0; i < path.length; i++) {
            setTimeout(() => {
                const node = path[i];
                // don't recolor start or finish node
                if (document.getElementById(`node-${node.row}-${node.col}`).classList.contains('node-visited'))
                    document.getElementById(`node-${node.row}-${node.col}`).className = "node node-path";
            }, 50 * i);
        }
    }

    // reset board
    clearBoard() {
        const grid = getInitialGrid();
        this.setState({ grid });
        this.clearPath();
    }

    // just remove path and visisted
    clearPath() {
        let all_nodes = document.querySelectorAll('.node');
        for (let node of all_nodes) {
            if (node.classList.contains('node-visited') || node.classList.contains('node-path')) {
                node.className = 'node';
            }
        }
    }

    render() {
        const {grid, mouseIsPressed} = this.state;

        return (
            <div className="pathfinding-visualizer">
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <div className="container-fluid">
                        <div className="navbar-brand">Pathfinding Visualizer</div>
                        <ul className='nav navbar-nav d-flex w-100 buttons'>
                            <div className="dropdown">
                                <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                    Algorithms
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                    <li><div id='dijkstraButton' className="dropdown-item disable-me" onClick={() => this.visualizeDijkstra()}>Dijkstra's Algorithm</div></li>
                                </ul>
                            </div>

                            <li><button id='clearBoardButton' onClick={() => this.clearBoard()} className="btn btn-secondary disable-me">Clear Board</button></li>
                            <li><button id='clearPathButton' onClick={() => this.clearPath()} className="btn btn-secondary disable-me">Clear Path</button></li>
                        </ul>
                    </div>
                </nav>
                <div className="grid-container">
                    <table className="grid">
                        <tbody>
                            {grid.map((row, rowIdx) => {
                                return (
                                    <tr id={`row-${rowIdx}`} key={rowIdx}>
                                        {row.map((node, nodeIdx) => {
                                            const {row,col,isStart,isFinish,isWall} = node;
                                            return (
                                                <Node
                                                    key={nodeIdx}
                                                    row={row}
                                                    col={col}
                                                    isStart={isStart}
                                                    isFinish={isFinish}
                                                    isWall={isWall}
                                                    mouseIsPressed={mouseIsPressed}
                                                    onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                                                    onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                                                    onMouseUp={() => this.handleMouseUp()}
                                                ></Node>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }


}

// generates initial grid
const getInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < NUM_GRID_ROWS; row++) {
        const currentRow = [];
        for (let col = 0; col < NUM_GRID_COLS; col++) {
            currentRow.push(createNode(col, row));
        }
        grid.push(currentRow);
    }
    return grid;
}

const createNode = (col, row) => {
    return {
        col,
        row,
        isStart: row === START_NODE_ROW && col === START_NODE_COL,
        isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
        distance: Infinity,
        isVisited: false,
        isWall: false,
        previousNode: null,
    };
};

const getNewGridWithWallsToggled = (grid, row, col) => {
    const newGrid = [...grid];
    const node = newGrid[row][col]

    // copy node and just toggle wall using negation of current wall property
    const newNode = { ...node, isWall: !node.isWall }
    newGrid[row][col] = newNode;
    return newGrid;
}

const disableButtons = () => {
    let buttons_to_disable = document.querySelectorAll('.disable-me');
    console.log(buttons_to_disable);
    for (const button of buttons_to_disable) {
        button.classList.remove('enabled');
        button.classList.add('disabled');
    }
}

const enableButtons = () => {
    let buttons_to_enable = document.querySelectorAll('.disable-me');
    for (const button of buttons_to_enable) {
        button.classList.remove('disabled');
        button.classList.add('enabled');
    }
}