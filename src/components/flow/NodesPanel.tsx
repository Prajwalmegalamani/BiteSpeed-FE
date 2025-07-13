// src/components/flow/NodesPanel.tsx
import React from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { availableNodeTypes } from "./nodes";

const NodesPanel: React.FC = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="w-64 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-4">
      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Nodes Panel
      </h3>

      <div className="space-y-2">
        {availableNodeTypes.map((nodeType) => (
          <Card
            key={nodeType.id}
            className="p-3 cursor-grab active:cursor-grabbing hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            draggable
            onDragStart={(event) => onDragStart(event, nodeType.type)}
          >
            <div className="flex items-center gap-2">
              <div className="text-blue-500 dark:text-blue-400">
                {nodeType.icon}
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {nodeType.label}
              </span>
            </div>
          </Card>
        ))}
      </div>

      <Separator className="my-4 bg-gray-200 dark:bg-gray-700" />

      <div className="text-xs text-gray-500 dark:text-gray-400">
        <p>Drag and drop nodes to the canvas to build your chatbot flow.</p>
      </div>
    </div>
  );
};

export default NodesPanel;
