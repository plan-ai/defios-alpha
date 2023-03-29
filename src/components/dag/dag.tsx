import React, { useCallback, useState } from 'react';
import ReactFlow, {
  useNodesState,
  useEdgesState,
  useOnSelectionChange,
} from 'reactflow';

import 'reactflow/dist/base.css';

import CustomNode from '@/components/dag/custom-node';

const nodeTypes = {
  custom: CustomNode,
};

interface DagProps {
  nodeSelected: any;
  setNodeSelected: React.Dispatch<any>;
}

const Dag: React.FC<DagProps> = ({ nodeSelected, setNodeSelected }) => {
  const initNodes = [
    {
      id: '1',
      type: 'custom',
      data: {
        name: 'Create 1729 Dashboard v1',
      },
      position: { x: 0, y: 0 },
      selectable: true,
    },
    {
      id: '2',
      type: 'custom',
      data: {
        name: 'Create and Launch v1 of 1729 book',
      },
      position: { x: 0, y: 200 },
      selectable: true,
    },
    {
      id: '3',
      type: 'custom',
      data: {
        name: 'Curate curriculum from carious online sources and map it to various levels of expertise',
      },
      position: { x: 100, y: 500 },
      selectable: true,
    },
    {
      id: '4',
      type: 'custom',
      data: {
        name: 'Create Project to DAOify any github project instantly',
      },
      position: { x: 200, y: -100 },
      selectable: true,
    },
    {
      id: '5',
      type: 'custom',
      data: {
        name: 'Extend Dashboard v1 to allow for manual edits in each feild',
      },
      position: { x: 200, y: 100 },
      selectable: true,
    },
    {
      id: '6',
      type: 'custom',
      data: {
        name: 'Create and Launch v2 of 1729 book',
      },
      position: { x: 200, y: 300 },
      selectable: true,
    },
    {
      id: '7',
      type: 'custom',
      data: {
        name: 'Create 1729 Dashboard v2',
      },
      position: { x: 400, y: 0 },
      selectable: true,
    },
    {
      id: '8',
      type: 'custom',
      data: {
        name: 'Create platform to generate NFT credentials',
      },
      position: { x: 400, y: 300 },
      selectable: true,
    },
  ];

  const initEdges = [
    {
      id: 'e1-5',
      source: '1',
      target: '5',
      // animated: true
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

  const [nodes, setNodes, onNodesChange] = useNodesState(initNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initEdges);

  // const onConnect = useCallback(
  //   (params: any) => setEdges((eds) => addEdge(params, eds)),
  //   [setEdges]
  // );

  const selectNode = (node: any) => {
    const newData: any = nodes.map((item) => {
      if (item.id !== node.id) {
        const newItem = item;
        newItem.selected = false;
        return newItem;
      }
      if (item.id === node.id) {
        const newItem = item;
        newItem.selected = true;
        return newItem;
      }
    });
    setNodes(newData);
  };

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onSelectionChange={(e) => {
        if (e.nodes.length === 0 && nodeSelected !== undefined) {
          setNodeSelected(undefined);
        }
        if (e.nodes.length !== 0) {
          setNodeSelected(e.nodes[0]);
        }
      }}
      fitView
      onNodeClick={(e, node) => {
        if (nodeSelected?.id === node.id) return;
        selectNode(node);
      }}
      className="bg-gray-700"
    ></ReactFlow>
  );
};

export default Dag;
