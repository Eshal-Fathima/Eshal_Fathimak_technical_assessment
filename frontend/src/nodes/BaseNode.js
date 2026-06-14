// BaseNode.js
// A reusable node component for React Flow that handles titles, inputs, outputs, form fields, and state sync.
// --------------------------------------------------

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

  // Keep local state in sync if data changes from outside (e.g., store updates)
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

  // Synchronize state changes to Zustand store
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

  // Auto-initialize default values in the Zustand store if they aren't already set
  useEffect(() => {
    fields.forEach((field) => {
      if (data?.[field.name] === undefined && field.defaultValue !== undefined) {
        updateNodeField(id, field.name, field.defaultValue);
      }
    });
  }, [id, fields, data, updateNodeField]);

  return (
    <div className="node-container" style={{
      minWidth: '220px',
      minHeight: '80px',
      border: '1px solid #475569',
      borderRadius: '8px',
      backgroundColor: '#1e293b',
      color: '#f8fafc',
      padding: '12px',
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Node Title Header */}
      <div style={{
        fontWeight: '600',
        fontSize: '13px',
        borderBottom: '1px solid #334155',
        paddingBottom: '6px',
        color: '#cbd5e1',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        {title}
      </div>

      {/* Render Custom Fields */}
      {fields.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {fields.map((field) => {
            const val = fieldValues[field.name] ?? '';
            return (
              <div key={field.name} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '500' }}>
                  {field.label}
                </label>
                {field.type === 'select' ? (
                  <select
                    value={val}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    style={{
                      backgroundColor: '#0f172a',
                      color: '#f8fafc',
                      border: '1px solid #334155',
                      borderRadius: '4px',
                      padding: '5px 8px',
                      fontSize: '12px',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {field.options?.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea
                    // Support external controlled value/onChange/ref for special nodes like TextNode
                    ref={field.fieldRef || null}
                    value={field.controlledValue !== undefined ? field.controlledValue : val}
                    onChange={(e) => {
                      if (field.controlledOnChange) {
                        field.controlledOnChange(e.target.value);
                        handleFieldChange(field.name, e.target.value);
                      } else {
                        handleFieldChange(field.name, e.target.value);
                      }
                    }}
                    rows={3}
                    style={{
                      backgroundColor: '#0f172a',
                      color: '#f8fafc',
                      border: '1px solid #334155',
                      borderRadius: '4px',
                      padding: '5px 8px',
                      fontSize: '12px',
                      outline: 'none',
                      resize: 'none',
                      minWidth: '150px',
                      maxWidth: '400px',
                      width: 'fit-content',
                      whiteSpace: 'pre',
                      overflowX: 'hidden',
                      boxSizing: 'border-box',
                    }}
                  />
                ) : (
                  <input
                    type={field.type || 'text'}
                    value={val}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    style={{
                      backgroundColor: '#0f172a',
                      color: '#f8fafc',
                      border: '1px solid #334155',
                      borderRadius: '4px',
                      padding: '5px 8px',
                      fontSize: '12px',
                      outline: 'none'
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Render children/custom markup inside the node body */}
      {children}

      {/* Render Input Handles on Left Edge */}
      {inputs.map((input, i) => {
        const topPercent = ((i + 1) / (inputs.length + 1)) * 100;
        return (
          <Handle
            key={input.id}
            type="target"
            position={Position.Left}
            id={`${id}-${input.id}`}
            style={{
              top: `${topPercent}%`,
              backgroundColor: '#64748b',
              width: '9px',
              height: '9px',
              border: '2px solid #1e293b'
            }}
          />
        );
      })}

      {/* Render Output Handles on Right Edge */}
      {outputs.map((output, i) => {
        const topPercent = ((i + 1) / (outputs.length + 1)) * 100;
        return (
          <Handle
            key={output.id}
            type="source"
            position={Position.Right}
            id={`${id}-${output.id}`}
            style={{
              top: `${topPercent}%`,
              backgroundColor: '#64748b',
              width: '9px',
              height: '9px',
              border: '2px solid #1e293b'
            }}
          />
        );
      })}
    </div>
  );
};
