import React, { memo, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import cn from 'classnames';

interface CustomNodeProps {
  data: {
    name: string;
  };
  selected?: boolean;
}

const CustomNode: React.FC<CustomNodeProps> = ({ data, selected }) => {
  useEffect(() => {
    console.log(selected);
  }, [selected]);
  return (
    <div
      className={cn(
        'z-100 nodrag flex h-32 w-32 items-center justify-center rounded-full border-2 border-gray-600 bg-gray-900 px-4 py-2 text-white shadow-md',
        {
          'border-4 border-blue-500 bg-black': selected === true,
        }
      )}
    >
      <div className="flex">
        <div className="text-center text-xs">{data?.name}</div>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className="h-2 w-2 rounded-full !bg-blue-500"
        isConnectable={false}
      />
      <Handle
        type="source"
        position={Position.Right}
        className="h-2 w-2 rounded-full !bg-blue-500"
        isConnectable={false}
      />
    </div>
  );
};

export default memo(CustomNode);
