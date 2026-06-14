// llmNode.js
// LLM node component refactored to use BaseNode.
// --------------------------------------------------

import { BaseNode } from './BaseNode';

export const LLMNode = ({ id, data }) => {
  const inputs = [
    { id: 'system', label: 'System' },
    { id: 'prompt', label: 'Prompt' }
  ];

  const outputs = [
    { id: 'response', label: 'Response' }
  ];

  return (
    <BaseNode
      id={id}
      data={data}
      title="LLM"
      inputs={inputs}
      outputs={outputs}
      fields={[]}
    >
      <div style={{ fontSize: '12px', color: '#cbd5e1', padding: '2px 0' }}>
        This is a LLM.
      </div>
    </BaseNode>
  );
};
