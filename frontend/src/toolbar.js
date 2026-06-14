
import { DraggableNode } from './draggableNode';

export const PipelineToolbar = () => {

    return (
        <div className="pipeline-toolbar">
            <div className="toolbar-header">
                <h2 className="toolbar-title">Pipeline Builder</h2>
            </div>
            <div className="toolbar-nodes-list">
                <DraggableNode type='customInput' label='Input' />
                <DraggableNode type='llm' label='LLM' />
                <DraggableNode type='customOutput' label='Output' />
                <DraggableNode type='text' label='Text' />
                <DraggableNode type='math' label='Math' />
                <DraggableNode type='filter' label='Filter' />
                <DraggableNode type='timer' label='Timer' />
                <DraggableNode type='branch' label='Branch' />
                <DraggableNode type='notes' label='Notes' />
            </div>
        </div>
    );
};
