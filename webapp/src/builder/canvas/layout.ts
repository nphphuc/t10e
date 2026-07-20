// Shared layout constants so CanvasNode/CanvasEdge/InstancePreview agree on node geometry.
export const NODE_WIDTH = 168;
export const NODE_HEADER_HEIGHT = 30;
export const NODE_ATTR_ROW_HEIGHT = 18;
export const NODE_MIN_BODY_HEIGHT = 10;

export function nodeHeight(attributeCount: number): number {
  return NODE_HEADER_HEIGHT + Math.max(attributeCount * NODE_ATTR_ROW_HEIGHT, NODE_MIN_BODY_HEIGHT);
}

export function nodeCenter(x: number, y: number, attributeCount: number): { cx: number; cy: number } {
  return { cx: x + NODE_WIDTH / 2, cy: y + nodeHeight(attributeCount) / 2 };
}
