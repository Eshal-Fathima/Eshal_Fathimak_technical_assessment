
import { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, {
  Controls,
  Background,
  MiniMap,
  useReactFlow,
  ReactFlowProvider,
} from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { InputNode } from './nodes/inputNode';
import { LLMNode } from './nodes/llmNode';
import { OutputNode } from './nodes/outputNode';
import { TextNode } from './nodes/textNode';
import { MathNode } from './nodes/mathNode';
import { FilterNode } from './nodes/filterNode';
import { TimerNode } from './nodes/timerNode';
import { BranchNode } from './nodes/branchNode';
import { NotesNode } from './nodes/notesNode';

import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };
const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  math: MathNode,
  filter: FilterNode,
  timer: TimerNode,
  branch: BranchNode,
  notes: NotesNode,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  deleteNode: state.deleteNode,
  deleteEdge: state.deleteEdge,
});

// Inner component has access to useReactFlow() because it's wrapped in ReactFlowProvider
const PipelineUIInner = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const { fitView } = useReactFlow();

  // Context menu state: null when hidden, object { id, type, top, left } when visible
  const [menu, setMenu] = useState(null);

  const {
    nodes,
    edges,
    getNodeID,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
    deleteNode,
    deleteEdge,
  } = useStore(selector, shallow);

  const getInitNodeData = (nodeID, type) => {
    let nodeData = { id: nodeID, nodeType: `${type}` };
    return nodeData;
  };

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      if (event?.dataTransfer?.getData('application/reactflow')) {
        const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
        const type = appData?.nodeType;

        if (typeof type === 'undefined' || !type) return;

        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        const nodeID = getNodeID(type);
        const newNode = {
          id: nodeID,
          type,
          position,
          data: getInitNodeData(nodeID, type),
        };

        addNode(newNode);
      }
    },
    [reactFlowInstance, addNode, getNodeID]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Right-click on a node → show context menu
  const onNodeContextMenu = useCallback((event, node) => {
    event.preventDefault();
    setMenu({
      id: node.id,
      type: 'node',
      top: event.clientY,
      left: event.clientX,
    });
  }, []);

  // Right-click on an edge → show context menu
  const onEdgeContextMenu = useCallback((event, edge) => {
    event.preventDefault();
    setMenu({
      id: edge.id,
      type: 'edge',
      top: event.clientY,
      left: event.clientX,
    });
  }, []);

  // Click anywhere on the canvas → close context menu
  const onPaneClick = useCallback(() => setMenu(null), []);

  // Close menu on outside click (covers non-canvas areas too)
  useEffect(() => {
    const handleOutsideClick = () => setMenu(null);
    if (menu) {
      window.addEventListener('click', handleOutsideClick);
    }
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [menu]);

  const handleDeleteNode = () => {
    deleteNode(menu.id);
    setMenu(null);
  };

  const handleDeleteEdge = () => {
    deleteEdge(menu.id);
    setMenu(null);
  };

  const handleFitView = () => {
    fitView({ padding: 0.2, duration: 400 });
  };

  return (
    <>
      <div ref={reactFlowWrapper} style={{ width: '100%', height: '100%', flex: 1, position: 'relative' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onInit={setReactFlowInstance}
          nodeTypes={nodeTypes}
          proOptions={proOptions}
          snapGrid={[gridSize, gridSize]}
          connectionLineType='smoothstep'
          onNodeContextMenu={onNodeContextMenu}
          onEdgeContextMenu={onEdgeContextMenu}
          onPaneClick={onPaneClick}
          panOnScroll={true}
          zoomOnScroll={true}
          panOnDrag={true}
          fitView
        >
          <Background color="#2d3a4a" gap={gridSize} />
          <Controls />
          <MiniMap />
        </ReactFlow>

        {/* Fit View button — sits inside canvas, bottom-left above zoom controls */}
        <button
          id="fit-view-btn"
          className="fit-view-button"
          onClick={handleFitView}
          title="Fit all nodes into view"
        >
          ⊞ Fit View
        </button>

        {/* Right-click context menu */}
        {menu && (
          <div
            className="context-menu"
            style={{ top: menu.top, left: menu.left }}
            onClick={(e) => e.stopPropagation()} // prevent window click from closing before action
          >
            {menu.type === 'node' && (
              <>
                <button className="context-menu-item context-menu-item--danger" onClick={handleDeleteNode}>
                  🗑 Delete node
                </button>
                <button className="context-menu-item" onClick={() => setMenu(null)}>
                  ✕ Cancel
                </button>
              </>
            )}
            {menu.type === 'edge' && (
              <>
                <button className="context-menu-item context-menu-item--danger" onClick={handleDeleteEdge}>
                  ✂ Disconnect edge
                </button>
                <button className="context-menu-item" onClick={() => setMenu(null)}>
                  ✕ Cancel
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

// Wrap in ReactFlowProvider so useReactFlow() (fitView) works inside PipelineUIInner
export const PipelineUI = () => (
  <ReactFlowProvider>
    <PipelineUIInner />
  </ReactFlowProvider>
);
