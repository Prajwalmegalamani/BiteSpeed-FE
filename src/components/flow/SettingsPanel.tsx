// src/components/flow/SettingsPanel.tsx
import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FlowNode, FlowNodeData } from "@/types/flow";

interface SettingsPanelProps {
  selectedNode: FlowNode | null;
  onBack: () => void;
  onUpdateNode: (nodeId: string, updates: Partial<FlowNodeData>) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  selectedNode,
  onBack,
  onUpdateNode,
}) => {
  if (!selectedNode) return null;

  const handleTextChange = (value: string) => {
    if (selectedNode.data.type === "text") {
      onUpdateNode(selectedNode.id, { text: value });
    }
  };

  return (
    <div className="w-64 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="p-1 h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
          Message Settings
        </h3>
      </div>

      <Separator className="mb-4 bg-gray-200 dark:bg-gray-700" />

      {/* Settings for Text Node */}
      {selectedNode.data.type === "text" && (
        <Card className="p-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Message Text
          </label>
          <Input
            value={selectedNode.data.text || ""}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="Enter your message..."
            className="w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          />
        </Card>
      )}

      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        <p>Configure the selected node&apos;s properties above.</p>
      </div>
    </div>
  );
};

export default SettingsPanel;
