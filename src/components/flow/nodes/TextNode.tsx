// src/components/flow/nodes/TextNode.tsx
import React, { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { TextNodeData } from "@/types/flow";

const TextNode: React.FC<NodeProps<TextNodeData>> = ({ data, selected }) => {
  return (
    <Card
      className={`
      min-w-[200px] max-w-[300px] 
      bg-white dark:bg-gray-800 
      border-gray-200 dark:border-gray-700
      ${
        selected
          ? "ring-2 ring-blue-500 dark:ring-blue-400 shadow-lg"
          : "hover:shadow-md"
      }
      transition-all duration-200
    `}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <MessageCircle className="w-4 h-4 text-blue-500 dark:text-blue-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Send Message
          </span>
        </div>

        {/* Content */}
        <div className="text-sm text-gray-600 dark:text-gray-400 break-words">
          {data.text || "Click to edit message"}
        </div>
      </div>

      {/* Target Handle - Can have MULTIPLE incoming edges */}
      <Handle
        type="target"
        position={Position.Left}
        id="target" // Explicit handle ID
        className="w-3 h-3 bg-gray-400 dark:bg-gray-500 border-2 border-white dark:border-gray-800 hover:bg-gray-500 dark:hover:bg-gray-400 transition-colors"
        title="Target: Multiple connections allowed"
      />

      {/* Source Handle - Can have ONLY ONE outgoing edge */}
      <Handle
        type="source"
        position={Position.Right}
        id="source" // Explicit handle ID
        className="w-3 h-3 bg-blue-500 dark:bg-blue-400 border-2 border-white dark:border-gray-800 hover:bg-blue-600 dark:hover:bg-blue-300 transition-colors"
        title="Source: Only one connection allowed"
      />
    </Card>
  );
};

export default memo(TextNode);
