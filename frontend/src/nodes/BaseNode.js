// BaseNode.js
// A reusable node 

import { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { useStore } from '../store';

export const BaseNode = ({
  id,
  data,
  title,
  inputs = [],
  outputs = [],
  fields = [],
  onFieldChange,
  children
}) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  // Initialize values for all fields from data or default values
  const [fieldValues, setFieldValues] = useState(() => {
    const initial = {};
    fields.forEach((field) => {
      initial[field.name] = data?.[field.name] ?? field.defaultValue ?? '';
    });
    return initial;
  });

  useEffect(() => {
    setFieldValues((prev) => {
      const updated = { ...prev };
      fields.forEach((field) => {
        if (data?.[field.name] !== undefined) {
          updated[field.name] = data[field.name];
        }
      });
      return updated;
    });
  }, [data, fields]);

  const handleFieldChange = (fieldName, val) => {
    setFieldValues((prev) => ({
      ...prev,
      [fieldName]: val
    }));
    updateNodeField(id, fieldName, val);
    if (onFieldChange) {
      onFieldChange(fieldName, val);
    }
  };

  useEffect(() => {
    fields.forEach((field) => {
      if (data?.[field.name] === undefined && field.defaultValue !== undefined) {
        updateNodeField(id, field.name, field.defaultValue);
      }
    });
  }, [id, fields, data, updateNodeField]);

  return (
    <div className={`node-container ${title.toLowerCase().replace(/\s+/g, '-')}-node`}>
      {/* Node Title Header */}
      <div className="node-title">
        {title}
      </div>

      <div className="node-body">
        {/* Render Input Handles as rows at the top */}
        {inputs.map((input) => (
          <div key={input.id} className="node-connector input-connector">
            <Handle
              type="target"
              position={Position.Left}
              id={`${id}-${input.id}`}
            />
            <span>{input.label}</span>
          </div>
        ))}

        {fields.length > 0 && (
          <>
            {fields.map((field) => {
              const val = fieldValues[field.name] ?? '';
              return (
                <div key={field.name} className="node-field">
                  <label>{field.label}</label>
                  {field.type === 'select' ? (
                    <select
                      value={val}
                      disabled={field.disabled}
                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    >
                      {field.options?.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      ref={field.fieldRef || null}
                      value={field.controlledValue !== undefined ? field.controlledValue : val}
                      disabled={field.disabled}
                      readOnly={field.readOnly}
                      onChange={(e) => {
                        if (field.controlledOnChange) {
                          field.controlledOnChange(e.target.value);
                          handleFieldChange(field.name, e.target.value);
                        } else {
                          handleFieldChange(field.name, e.target.value);
                        }
                      }}
                      rows={3}
                    />
                  ) : (
                    <input
                      type={field.type || 'text'}
                      value={val}
                      disabled={field.disabled}
                      readOnly={field.readOnly}
                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    />
                  )}
                </div>
              );
            })}
          </>
        )}

        {children}

        {outputs.map((output) => (
          <div key={output.id} className="node-connector output-connector">
            <span>{output.label}</span>
            <Handle
              type="source"
              position={Position.Right}
              id={`${id}-${output.id}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
