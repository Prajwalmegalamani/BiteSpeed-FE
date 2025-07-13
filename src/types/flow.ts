// src/types/flow.ts
import { Node, Edge } from "reactflow";

export interface TextNodeData {
  id: string;
  text: string;
  type: "text";
}

export interface BaseNodeData {
  id: string;
  type: string;
}

export type FlowNodeData = TextNodeData;

export interface FlowNode extends Node {
  data: FlowNodeData;
}

export type FlowEdge = Edge;

export interface NodeType {
  id: string;
  type: string;
  label: string;
  icon: React.ReactNode;
  defaultData: Partial<FlowNodeData>;
}

export interface FlowState {
  nodes: FlowNode[];
  edges: FlowEdge[];
  selectedNode: FlowNode | null;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}
