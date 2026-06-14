import { BaseNode } from './BaseNode';

export const TimerNode = ({ id, data }) => {
  const inputs = [
    { id: 'input', label: 'Input' }
  ];

  const outputs = [
    { id: 'output', label: 'Output' }
  ];

  const fields = [
    {
      name: 'delay',
      label: 'Delay (ms)',
      type: 'number',
      defaultValue: 1000
    }
  ];

  return (
    <BaseNode
      id={id}
      data={data}
      title="Timer"
      inputs={inputs}
      outputs={outputs}
      fields={fields}
    />
  );
};
