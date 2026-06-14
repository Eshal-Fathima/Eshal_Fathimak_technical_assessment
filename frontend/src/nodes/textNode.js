// textNode.js
// Text node with auto-resize, dynamic {{ variable }} handle detection,
// and React Flow internals sync via useUpdateNodeInternals.
// --------------------------------------------------

import { useState, useRef, useEffect } from 'react';
import { useUpdateNodeInternals } from 'reactflow';
import { BaseNode } from './BaseNode';

export const TextNode = ({ id, data }) => {
  const [text, setText] = useState(data?.text || '');
  const [variables, setVariables] = useState([]);
  const textareaRef = useRef(null);
  const updateNodeInternals = useUpdateNodeInternals();

  // Effect 1: Auto-resize textarea height whenever text changes.
  // Reset to 'auto' first so scrollHeight can shrink back down on deletion.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [text]);

  // Effect 2: Scan text for {{ variable }} patterns and update variable list.
  // Uses a Set to automatically deduplicate repeated variable names.
  useEffect(() => {
    const regex = /\{\{\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*\}\}/g;
    const found = new Set();
    let match;
    while ((match = regex.exec(text)) !== null) {
      found.add(match[1]);
    }
    setVariables(Array.from(found));
  }, [text]);

  // Effect 3: Notify React Flow that this node's handles have changed.
  // Runs AFTER render so new Handle elements are in the DOM before React Flow
  // recalculates connection points.
  useEffect(() => {
    updateNodeInternals(id);
  }, [variables, id, updateNodeInternals]);

  // Build input handles from detected variables
  const inputs = variables.map((name) => ({ id: name, label: name }));

  const outputs = [
    { id: 'output', label: 'Output' }
  ];

  // The textarea field config: passes the ref and controlled value/onChange
  // so TextNode (not BaseNode) owns the state for auto-resize + regex scanning.
  const fields = [
    {
      name: 'text',
      label: 'Text',
      type: 'textarea',
      defaultValue: '',
      fieldRef: textareaRef,
      controlledValue: text,
      controlledOnChange: setText,
    }
  ];

  return (
    <BaseNode
      id={id}
      data={data}
      title="Text"
      inputs={inputs}
      outputs={outputs}
      fields={fields}
    />
  );
};
