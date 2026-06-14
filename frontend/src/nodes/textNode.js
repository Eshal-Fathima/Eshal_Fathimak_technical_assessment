
import { useState, useRef, useEffect } from 'react';
import { useUpdateNodeInternals } from 'reactflow';
import { BaseNode } from './BaseNode';

export const TextNode = ({ id, data }) => {
  const [text, setText] = useState(data?.text || '');
  const [variables, setVariables] = useState([]);
  const textareaRef = useRef(null);
  const updateNodeInternals = useUpdateNodeInternals();

  // Auto-resize textarea height whenever text changes.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [text]);

  // Scan text for {{ variable }} patterns and update variable list.
  useEffect(() => {
    const regex = /\{\{\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*\}\}/g;
    const found = new Set();
    let match;
    while ((match = regex.exec(text)) !== null) {
      found.add(match[1]);
    }
    setVariables(Array.from(found));
  }, [text]);

  // Notify React Flow that this node's handles have changed.
  useEffect(() => {
    updateNodeInternals(id);
  }, [variables, id, updateNodeInternals]);

  // Build input handles from detected variables
  const inputs = [
    { id: 'input', label: 'input' },
    ...variables.map((name) => ({ id: name, label: name }))
  ];

  const outputs = [
    { id: 'output', label: 'output' }
  ];

  // The textarea field config: passes the ref and controlled value/onChange
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
