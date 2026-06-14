
import { BaseNode } from './BaseNode';

export const LLMNode = ({ id, data }) => {
  const inputs = [
    { id: 'system', label: 'system' },
    { id: 'prompt', label: 'prompt' }
  ];

  const outputs = [
    { id: 'response', label: 'response' }
  ];

  const fields = [
    {
      name: 'model',
      label: 'Model',
      type: 'select',
      options: ['GPT-4', 'Gemini', 'Claude Opus', 'Claude Sonnet'],
      defaultValue: data?.model || 'GPT-4'
    }
  ];

  return (
    <BaseNode
      id={id}
      data={data}
      title="LLM"
      inputs={inputs}
      outputs={outputs}
      fields={fields}
    />
  );
};
