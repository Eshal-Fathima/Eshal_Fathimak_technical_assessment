// outputNode.js
// Output node component refactored to use BaseNode.
// --------------------------------------------------

import { BaseNode } from './BaseNode';

export const OutputNode = ({ id, data }) => {
  const fields = [
    {
      name: 'outputName',
      label: 'Name',
      type: 'text',
      defaultValue: data?.outputName || id.replace('customOutput-', 'output_')
    },
    {
      name: 'outputType',
      label: 'Type',
      type: 'select',
      options: ['Text', 'Image'],
      defaultValue: data?.outputType || 'Text'
    }
  ];

  const inputs = [
    { id: 'value', label: 'Value' }
  ];

  return (
    <BaseNode
      id={id}
      data={data}
      title="Output"
      inputs={inputs}
      outputs={[]}
      fields={fields}
    />
  );
};
