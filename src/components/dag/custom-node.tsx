import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

interface CustomNodeProps {
  data: { name: string };
}

const CustomNode: React.FC<CustomNodeProps> = ({ data }) => {
  return (
    <div className="flex h-32 w-32 items-center justify-center rounded-full border-2 border-gray-600 bg-gray-900 px-4 py-2 text-white shadow-md">
      <div className="flex">
        <div className="text-center text-xs">{data?.name}</div>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className="h-2 w-2 rounded-full !bg-blue-500"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="h-2 w-2 rounded-full !bg-blue-500"
      />
    </div>
  );
};

export default memo(CustomNode);
