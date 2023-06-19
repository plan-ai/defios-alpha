import React, { useCallback, useState, useEffect } from 'react';
import ReactFlow, {
  useNodesState,
  useEdgesState,
  useOnSelectionChange,
} from 'reactflow';

import 'reactflow/dist/base.css';

import CustomNode from '@/components/dag/custom-node';

import { createDAGTree } from '@/components/dag/dagBuilder';

const nodeTypes = {
  custom: CustomNode,
};

interface DagProps {
  nodeSelected: any;
  setNodeSelected: React.Dispatch<React.SetStateAction<any>>;
  initNodes: any;
  setInitNodes: React.Dispatch<React.SetStateAction<any>>;
  initEdges: any;
  setInitEdges: React.Dispatch<React.SetStateAction<any>>;
}

const Dag: React.FC<DagProps> = ({
  nodeSelected,
  setNodeSelected,
  initNodes,
  setInitNodes,
  initEdges,
  setInitEdges,
}) => {
  const [newNodes, setNewNodes] = useState<any>();

  const [nodes, setNodes, onNodesChange] = useNodesState(newNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initEdges);

  useEffect(() => {
    if (
      initNodes === null ||
      initEdges === null ||
      initNodes === undefined ||
      initEdges === undefined
    )
      return;
    if (newNodes !== null && newNodes !== undefined) return;
    const createdDag = createDAGTree(initNodes, initEdges);
    setNewNodes(createdDag);
    setNodes(createdDag);
  }, [newNodes, initNodes, initEdges]);

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
