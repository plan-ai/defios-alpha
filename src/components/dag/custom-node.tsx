import React, { memo, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import cn from 'classnames';

interface CustomNodeProps {
  data: any;
  selected?: boolean;
}

const CustomNode: React.FC<CustomNodeProps> = ({ data, selected }) => {
  return (
    <div
      className={cn(
        'z-100 nodrag flex h-32 w-32 items-center justify-center rounded-full border-2 border-gray-600 bg-gray-900 px-4 py-2 text-white shadow-md',
        {
          'border-4 border-new-blue bg-black': selected === true,
        }
      )}
    >
      <div className="flex">
        <div className="text-center text-xs">
          {data?.objective_title.length < 60
            ? data?.objective_title
            : data?.objective_title.slice(0, 57) + '...'}
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className="h-2 w-2 rounded-full !bg-new-blue"
        isConnectable={false}
      />
      <Handle
        type="source"
        position={Position.Right}
        className="h-2 w-2 rounded-full !bg-new-blue"
        isConnectable={false}
      />
    </div>
  );
};

export default memo(CustomNode);
