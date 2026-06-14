// notesNode.js
// Custom Notes node component leveraging BaseNode.
// --------------------------------------------------

import { BaseNode } from './BaseNode';

export const NotesNode = ({ id, data }) => {
  const fields = [
    {
      name: 'notes',
      label: 'Notes',
      type: 'textarea',
      defaultValue: 'Write notes here...'
    }
  ];

  return (
    <BaseNode
      id={id}
      data={data}
      title="Notes"
      inputs={[]}
      outputs={[]}
      fields={fields}
    />
  );
};
