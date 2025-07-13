// src/utils/flowValidation.ts
import { FlowNode, FlowEdge, ValidationResult } from "@/types/flow";

export const validateFlow = (
  nodes: FlowNode[],
  edges: FlowEdge[]
): ValidationResult => {
  const errors: string[] = [];

  // Check if there are more than one nodes
  if (nodes.length <= 1) {
    return { isValid: true, errors: [] };
  }

  // Find nodes with empty target handles (no incoming edges)
  const nodesWithoutTargets = nodes.filter((node) => {
    const hasIncomingEdge = edges.some((edge) => edge.target === node.id);
    return !hasIncomingEdge;
  });

  // Error if more than one node has empty target handles
  if (nodesWithoutTargets.length > 1) {
    errors.push(
      `Cannot save flow: ${nodesWithoutTargets.length} nodes have empty target handles. ` +
        "Only one node should have an empty target handle (typically the start node)."
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Check if a new edge can be added from a source handle
 * SOURCE HANDLE RULE: Can only have ONE edge originating from it
 */
export const canAddEdge = (
  sourceNodeId: string,
  sourceHandle: string | null,
  edges: FlowEdge[]
): boolean => {
  // Normalize handle ID - React Flow uses null for default handles
  const normalizedHandle = sourceHandle || null;

  // Check if source handle already has an edge
  const existingEdge = edges.find(
    (edge) =>
      edge.source === sourceNodeId &&
      (edge.sourceHandle || null) === normalizedHandle
  );

  return !existingEdge;
};

/**
 * Validate edge connection before creating
 * SOURCE: Only one outgoing edge allowed per handle
 * TARGET: Multiple incoming edges allowed
 */
export const validateConnection = (
  sourceNodeId: string,
  targetNodeId: string,
  sourceHandle: string | null,
  targetHandle: string | null,
  edges: FlowEdge[]
): { isValid: boolean; error?: string } => {
  // Prevent self-connection
  if (sourceNodeId === targetNodeId) {
    return { isValid: false, error: "Cannot connect node to itself" };
  }

  // Check source handle restriction (only one outgoing edge)
  if (!canAddEdge(sourceNodeId, sourceHandle, edges)) {
    return {
      isValid: false,
      error:
        "This source handle already has a connection. Each source can only have one outgoing edge.",
    };
  }

  // Target handle can have multiple incoming edges - no restriction needed
  return { isValid: true };
};
