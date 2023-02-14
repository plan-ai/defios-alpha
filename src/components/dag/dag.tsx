import React, { useCallback } from 'react';
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  MiniMap,
  Controls,
} from 'reactflow';

import 'reactflow/dist/base.css';

import CustomNode from '@/components/dag/custom-node';

const nodeTypes = {
  custom: CustomNode,
};

const initNodes = [
  {
    id: '1',
    type: 'custom',
    data: { name: 'Create 1729 Dashboard v1' },
    position: { x: 0, y: 0 },
  },
  {
    id: '2',
    type: 'custom',
    data: { name: 'Create and Launch v1 of 1729 book' },

    position: { x: 0, y: 200 },
  },
  {
    id: '3',
    type: 'custom',
    data: {
      name: 'Curate curriculum from carious online ...',
    },
    position: { x: 100, y: 500 },
  },
  {
    id: '4',
    type: 'custom',
    data: {
      name: 'Create Project to DAOify any github project instantly',
    },
    position: { x: 200, y: -100 },
  },
  {
    id: '5',
    type: 'custom',
    data: {
      name: 'Extend Dashboard v1 to allow for manual edits in ech feild',
    },
    position: { x: 200, y: 100 },
  },
  {
    id: '6',
    type: 'custom',
    data: {
      name: 'Create and Launch v2 of 1729 book',
    },
    position: { x: 200, y: 300 },
  },
  {
    id: '7',
    type: 'custom',
    data: {
      name: 'Create 1729 Dashboard v2',
    },
    position: { x: 400, y: 0 },
  },
  {
    id: '8',
    type: 'custom',
    data: {
      name: 'Create platform to generate NFT credentials',
    },
    position: { x: 400, y: 300 },
  },
];

const initEdges = [
  {
    id: 'e1-5',
    source: '1',
    target: '5',
  },
  {
    id: 'e2-6',
    source: '2',
    target: '6',
  },
  {
    id: 'e4-7',
    source: '4',
    target: '7',
  },
  {
    id: 'e5-7',
    source: '5',
    target: '7',
  },
  {
    id: 'e6-8',
    source: '6',
    target: '8',
  },
  {
    id: 'e3-8',
    source: '3',
    target: '8',
  },
  {
    id: 'e8-7',
    source: '8',
    target: '7',
  },
];

const Dag = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initEdges);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      fitView
      className="bg-gray-700"
    ></ReactFlow>
  );
};

export default Dag;
