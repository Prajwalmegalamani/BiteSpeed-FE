// src/components/flow/nodes/index.ts
import { MessageCircle } from "lucide-react";
import { NodeType } from "@/types/flow";
import TextNode from "./TextNode";
import React from "react";

export const nodeTypes = {
  textNode: TextNode,
};

export const availableNodeTypes: NodeType[] = [
  {
    id: "textNode",
    type: "textNode",
    label: "Message",
    icon: React.createElement(MessageCircle, { className: "w-4 h-4" }),
    defaultData: {
      text: "",
      type: "text" as const,
    },
  },
  // Future node types can be added here
  // {
  //   id: 'imageNode',
  //   type: 'imageNode',
  //   label: 'Image',
  //   icon: <Image className="w-4 h-4" />,
  //   defaultData: { ... },
  // },
];
