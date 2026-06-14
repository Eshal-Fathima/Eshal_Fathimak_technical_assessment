// inputNode.js
// Input node component refactored to use BaseNode.
// --------------------------------------------------

import { BaseNode } from './BaseNode';

export const InputNode = ({ id, data }) => {
  const fields = [
    {
      name: 'inputName',
      label: 'Name',
      type: 'text',
      defaultValue: data?.inputName || id.replace('customInput-', 'input_')
    },
    {
      name: 'inputType',
      label: 'Type',
      type: 'select',
      options: ['Text', 'File'],
      defaultValue: data?.inputType || 'Text'
    }
  ];

  const outputs = [
    { id: 'value', label: 'Value' }
  ];

  return (
    <BaseNode
      id={id}
      data={data}
      title="Input"
      inputs={[]}
      outputs={outputs}
      fields={fields}
    />
  );
};
