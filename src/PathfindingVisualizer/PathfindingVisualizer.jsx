import React, {Component} from 'react';
import Node from './Node/Node';

import './PathfindingVisualizer.css';
import {dijkstra, getPath} from '../algorithms/dijkstra';

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

export default class PathfindingVisualizer extends Component {
    constructor() {
        super();
        this.state = {
            grid: [],
            mouseIsPressed: false,
        };
    };

    // on page load
    componentDidMount() {
        const grid = getInitialGrid();
        this.setState({grid});
    }

    // handles visualization of dijkstra
    visualizeDijkstra() {
        const {grid} = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const endNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const visitedNodesInOrder = dijkstra(grid, startNode, endNode);
        const path = getPath(endNode);
        this.animateDijkstra(visitedNodesInOrder, path);
    }

    // handles animating visited nodes and path
    animateDijkstra(visitedNodesInOrder, path) {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
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

    render() {
        const {grid, mouseIsPressed} = this.state;

        return (
            <div className="pathfinding-visualizer">
                <button onClick={() => this.visualizeDijkstra()}>Visualize Dijkstra</button>
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
    for (let row = 0; row < 20; row++) {
        const currentRow = [];
        for (let col = 0; col < 50; col++) {
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