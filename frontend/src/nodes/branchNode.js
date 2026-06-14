// branchNode.js
// Custom Branch node component leveraging BaseNode.
// --------------------------------------------------

import { BaseNode } from './BaseNode';

export const BranchNode = ({ id, data }) => {
  const inputs = [
    { id: 'input', label: 'Input' }
  ];

  const outputs = [
    { id: 'true', label: 'True' },
    { id: 'false', label: 'False' }
  ];

  const fields = [
    {
      name: 'condition',
      label: 'Condition',
      type: 'text',
      defaultValue: 'x > 0'
    }
  ];

  return (
    <BaseNode
      id={id}
      data={data}
      title="Branch"
      inputs={inputs}
      outputs={outputs}
      fields={fields}
    />
  );
};
