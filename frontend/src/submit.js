// submit.js
// Reads the current pipeline from the Zustand store, POSTs it to the backend,
// and shows the analysis result (num_nodes, num_edges, is_dag) in an alert.
// --------------------------------------------------

import { useStore } from './store';

export const SubmitButton = () => {
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);

  const handleSubmit = async () => {
    // Sanity-check: log the exact payload so we can verify
    // node ids and edge source/target values are correct.
    console.log('Submitting pipeline:', JSON.stringify({ nodes, edges }, null, 2));

    try {
      const response = await fetch('http://localhost:8000/pipelines/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const data = await response.json();

      alert(
        `Pipeline Analysis:\n\n` +
        `Number of Nodes: ${data.num_nodes}\n` +
        `Number of Edges: ${data.num_edges}\n` +
        `Is DAG: ${data.is_dag ? 'Yes ✓' : 'No ✗ (cycle detected)'}`
      );
    } catch (error) {
      console.error('Error submitting pipeline:', error);
      alert('Failed to analyze pipeline. Please check that the backend is running on http://localhost:8000.');
    }
  };

  return (
    <div className="submit-container">
      <button
        onClick={handleSubmit}
        className="submit-button"
      >
        Submit Pipeline
      </button>
    </div>
  );
};
