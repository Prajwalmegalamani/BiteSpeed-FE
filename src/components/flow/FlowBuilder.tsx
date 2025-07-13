// src/components/flow/FlowBuilder.tsx
"use client";

import React, { useState, useCallback, useRef } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  ReactFlowProvider,
  OnConnect,
  ReactFlowInstance,
} from "reactflow";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { FlowNode, FlowEdge, FlowNodeData } from "@/types/flow";
import { validateFlow, validateConnection } from "@/utils/flowValidation";
import { nodeTypes, availableNodeTypes } from "./nodes";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import NodesPanel from "./NodesPanel";
import SettingsPanel from "./SettingsPanel";

import "reactflow/dist/style.css";

const FlowBuilder: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<FlowNodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<FlowEdge>([]);
  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);
  const nodeIdCounter = useRef(0);

  // Handle node selection
  const onNodeClick = useCallback((event: React.MouseEvent, node: FlowNode) => {
    setSelectedNode(node);
  }, []);

  // Handle canvas click to deselect
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // Handle connection between nodes with enhanced validation
  const onConnect: OnConnect = useCallback(
    (params: Connection) => {
      if (!params.source || !params.target) {
        toast.error("Invalid connection parameters");
        return;
      }

      // Validate connection with detailed error messages
      const validation = validateConnection(
        params.source,
        params.target,
        params.sourceHandle || "source",
        params.targetHandle || "target",
        edges
      );

      if (!validation.isValid) {
        toast.error(validation.error);
        return;
      }

      const newEdge: FlowEdge = {
        ...params,
        id: `edge-${Date.now()}`,
        type: "smoothstep",
        source: params.source,
        target: params.target,
        animated: true, // Add animation for better UX
      };

      setEdges((eds) => addEdge(newEdge, eds));
      toast.success("Nodes connected successfully");
    },
    [edges, setEdges]
  );

  // Handle drag and drop
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const nodeType = event.dataTransfer.getData("application/reactflow");
      if (!nodeType || !reactFlowInstance) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const nodeTemplate = availableNodeTypes.find(
        (nt) => nt.type === nodeType
      );
      if (!nodeTemplate) return;

      const newNode: FlowNode = {
        id: `node-${++nodeIdCounter.current}`,
        type: nodeType,
        position,
        data: {
          id: `node-${nodeIdCounter.current}`,
          ...nodeTemplate.defaultData,
        } as FlowNodeData,
      };

      setNodes((nds) => [...nds, newNode]);
      //   toast.success("Node added to flow");
    },
    [reactFlowInstance, setNodes]
  );

  // Update node data
  const updateNodeData = useCallback(
    (nodeId: string, updates: Partial<FlowNodeData>) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, ...updates } }
            : node
        )
      );

      if (selectedNode?.id === nodeId) {
        setSelectedNode((prev) =>
          prev ? { ...prev, data: { ...prev.data, ...updates } } : null
        );
      }
    },
    [setNodes, selectedNode]
  );

  // Enhanced save flow with toast notifications
  const handleSave = useCallback(() => {
    // Show loading toast
    const loadingToast = toast.loading("Validating flow...");

    // Simulate async operation
    setTimeout(() => {
      const validation = validateFlow(nodes, edges);

      if (validation.isValid) {
        // Here you would typically save to a backend
        console.log("Flow saved successfully:", { nodes, edges });

        toast.success("Flow saved successfully!", {
          id: loadingToast,
          description: `Saved ${nodes.length} nodes and ${edges.length} connections`,
        });
      } else {
        toast.error("Cannot save flow", {
          id: loadingToast,
          description: validation.errors[0], // Show first error
        });

        // Show all errors as separate toasts
        validation.errors.forEach((error, index) => {
          if (index > 0) {
            // Skip first error (already shown above)
            setTimeout(() => {
              toast.error(error);
            }, index * 1000); // Stagger error messages
          }
        });
      }
    }, 1000); // Simulate network delay
  }, [nodes, edges]);

  // Handle edge deletion
  const onEdgesDelete = useCallback(
    (edgesToDelete: FlowEdge[]) => {
      setEdges((eds) => eds.filter((edge) => !edgesToDelete.includes(edge)));
      toast.success(`Deleted ${edgesToDelete.length} connection(s)`);
    },
    [setEdges]
  );

  // Handle node deletion
  const onNodesDelete = useCallback(
    (nodesToDelete: FlowNode[]) => {
      setNodes((nds) => nds.filter((node) => !nodesToDelete.includes(node)));
      // Clear selection if deleted node was selected
      if (
        selectedNode &&
        nodesToDelete.some((node) => node.id === selectedNode.id)
      ) {
        setSelectedNode(null);
      }
      toast.success(`Deleted ${nodesToDelete.length} node(s)`);
    },
    [setNodes, selectedNode]
  );

  return (
    <div className="flex h-screen w-full bg-gray-50 dark:bg-gray-900">
      {/* Left Panel - Nodes or Settings */}
      {selectedNode ? (
        <SettingsPanel
          selectedNode={selectedNode}
          onBack={() => setSelectedNode(null)}
          onUpdateNode={updateNodeData}
        />
      ) : (
        <NodesPanel />
      )}

      {/* Main Flow Canvas */}
      <div className="flex-1 relative w-full">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center w-full">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 ">
            Chat Flow Builder
          </h1>
          <div className="flex items-center gap-2 pr-2">
            <ThemeToggle />
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </div>
        </div>

        {/* React Flow Canvas */}
        <div className="h-[90%]">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onInit={setReactFlowInstance}
            onEdgesDelete={onEdgesDelete}
            onNodesDelete={onNodesDelete}
            nodeTypes={nodeTypes}
            fitView
            className="bg-gray-50 dark:bg-gray-900"
            deleteKeyCode={["Backspace", "Delete"]} // Enable deletion with keys
            multiSelectionKeyCode={["Meta", "Ctrl"]} // Enable multi-selection
          >
            <Background color="#6b7280" className="dark:opacity-20" />
            <Controls className="dark:bg-gray-800 dark:border-gray-700" />
            <MiniMap
              className="dark:bg-gray-800 dark:border-gray-700"
              nodeColor={(node) => {
                if (node.type === "textNode") return "#3b82f6";
                return "#6b7280";
              }}
            />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
};

// Wrap with ReactFlowProvider
const FlowBuilderWrapper: React.FC = () => {
  return (
    <ReactFlowProvider>
      <FlowBuilder />
    </ReactFlowProvider>
  );
};

export default FlowBuilderWrapper;
