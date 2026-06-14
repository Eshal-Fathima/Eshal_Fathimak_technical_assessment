
import { BaseNode } from './BaseNode';

export const FilterNode = ({ id, data }) => {
  const inputs = [
    { id: 'input', label: 'Input' }
  ];

  const outputs = [
    { id: 'output', label: 'Output' }
  ];

  const fields = [
    {
      name: 'condition',
      label: 'Condition',
      type: 'text',
      defaultValue: 'value > 0'
    }
  ];

  return (
    <BaseNode
      id={id}
      data={data}
      title="Filter"
      inputs={inputs}
      outputs={outputs}
      fields={fields}
    />
  );
};
