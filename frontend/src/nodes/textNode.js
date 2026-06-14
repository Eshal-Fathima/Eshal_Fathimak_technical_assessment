// textNode.js
// Text node component refactored to use BaseNode with dynamic variable handles.
// --------------------------------------------------

import { useState } from 'react';
import { BaseNode } from './BaseNode';

export const TextNode = ({ id, data }) => {
  // Parse variables from text input (e.g. {{ variable }})
  const parseVariables = (textVal) => {
    const regex = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;
    const vars = new Set();
    let match;
    while ((match = regex.exec(textVal)) !== null) {
      vars.add(match[1]);
    }
    return Array.from(vars);
  };

  const initialText = data?.text ?? '{{input}}';
  const [variables, setVariables] = useState(() => parseVariables(initialText));

  // Handle updates to text from BaseNode field to recalculate variable handles
  const handleFieldChange = (fieldName, val) => {
    if (fieldName === 'text') {
      setVariables(parseVariables(val));
    }
  };

  // Convert variables to inputs config
  const inputs = variables.map((v) => ({
    id: v,
    label: v
  }));

  const outputs = [
    { id: 'output', label: 'Output' }
  ];

  const fields = [
    {
      name: 'text',
      label: 'Text',
      type: 'textarea',
      defaultValue: '{{input}}'
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
      onFieldChange={handleFieldChange}
    />
  );
};
