// mathNode.js
// Custom Math node component leveraging BaseNode.
// --------------------------------------------------

import { BaseNode } from './BaseNode';

export const MathNode = ({ id, data }) => {
  const inputs = [
    { id: 'num1', label: 'Number 1' },
    { id: 'num2', label: 'Number 2' }
  ];

  const outputs = [
    { id: 'result', label: 'Result' }
  ];

  const fields = [
    {
      name: 'operation',
      label: 'Operation',
      type: 'select',
      options: ['Add', 'Subtract', 'Multiply', 'Divide'],
      defaultValue: 'Add'
    }
  ];

  return (
    <BaseNode
      id={id}
      data={data}
      title="Math"
      inputs={inputs}
      outputs={outputs}
      fields={fields}
    />
  );
};
