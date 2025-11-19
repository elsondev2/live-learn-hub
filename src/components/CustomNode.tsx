import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

export const CustomNode = memo(({ data, selected }: NodeProps) => {
  const shape = (data.shape as string) || 'default';
  const color = (data.color as string) || '#a84370';
  const textColor = (data.textColor as string) || '#ffffff';
  const label = (data.label as string) || 'Node';

  const getShapeStyles = () => {
    const baseStyles = {
      padding: '12px 20px',
      border: `2px solid ${selected ? '#000' : color}`,
      backgroundColor: color,
      color: textColor,
      fontSize: '14px',
      fontWeight: '500',
      minWidth: '120px',
      textAlign: 'center' as const,
      cursor: 'grab',
      boxShadow: selected ? '0 4px 12px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.1)',
      transition: 'all 0.2s ease',
    };

    switch (shape) {
      case 'circle':
        return {
          ...baseStyles,
          borderRadius: '50%',
          width: '100px',
          height: '100px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '10px',
        };
      case 'rounded':
        return {
          ...baseStyles,
          borderRadius: '20px',
        };
      case 'diamond':
        return {
          ...baseStyles,
          transform: 'rotate(45deg)',
          width: '100px',
          height: '100px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        };
      default:
        return {
          ...baseStyles,
          borderRadius: '8px',
        };
    }
  };

  const contentStyles = shape === 'diamond' ? { transform: 'rotate(-45deg)' } : {};

  return (
    <div style={getShapeStyles()}>
      <Handle type="target" position={Position.Top} style={{ background: color }} />
      <div style={contentStyles}>
        <div contentEditable suppressContentEditableWarning>
          {label}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} style={{ background: color }} />
    </div>
  );
});

CustomNode.displayName = 'CustomNode';
