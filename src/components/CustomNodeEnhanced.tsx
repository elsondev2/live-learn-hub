import { memo, useState, useRef, useEffect, useCallback } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { 
  Star, Heart, Lightbulb, Target, Flag, Bookmark, 
  AlertCircle, CheckCircle, Clock, Users, Folder,
  FileText, Settings, Zap, Award, TrendingUp
} from 'lucide-react';

export const NODE_ICONS = {
  none: null,
  star: Star,
  heart: Heart,
  lightbulb: Lightbulb,
  target: Target,
  flag: Flag,
  bookmark: Bookmark,
  alert: AlertCircle,
  check: CheckCircle,
  clock: Clock,
  users: Users,
  folder: Folder,
  file: FileText,
  settings: Settings,
  zap: Zap,
  award: Award,
  trending: TrendingUp,
} as const;

export type NodeIconType = keyof typeof NODE_ICONS;

interface CustomNodeData {
  label: string;
  color?: string;
  textColor?: string;
  shape?: string;
  handlePosition?: string;
  icon?: NodeIconType;
  notes?: string;
  fontSize?: number;
}

interface CustomNodeEnhancedProps extends NodeProps {
  data: CustomNodeData;
  onLabelChange?: (nodeId: string, newLabel: string) => void;
}

export const CustomNodeEnhanced = memo(({ 
  id,
  data, 
  selected,
  dragging,
}: CustomNodeEnhancedProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(data.label || 'Node');
  const [showNotes, setShowNotes] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const shape = data.shape || 'default';
  const color = data.color || '#3b82f6';
  const textColor = data.textColor || '#ffffff';
  const label = data.label || 'Node';
  const handlePosition = data.handlePosition || 'all';
  const icon = data.icon || 'none';
  const notes = data.notes || '';
  const fontSize = data.fontSize || 14;

  const IconComponent = icon !== 'none' ? NODE_ICONS[icon] : null;

  useEffect(() => {
    setEditValue(label);
  }, [label]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsEditing(false);
    if (editValue.trim() !== label) {
      // Dispatch custom event for parent to handle
      window.dispatchEvent(new CustomEvent('node-label-change', {
        detail: { nodeId: id, newLabel: editValue.trim() || 'Node' }
      }));
    }
  }, [editValue, label, id]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setEditValue(label);
      setIsEditing(false);
    }
    e.stopPropagation();
  }, [handleBlur, label]);

  const getShapeStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      padding: '12px 20px',
      border: `2px solid ${selected ? '#000' : color}`,
      backgroundColor: color,
      color: textColor,
      fontSize: `${fontSize}px`,
      fontWeight: 500,
      minWidth: '120px',
      textAlign: 'center',
      cursor: dragging ? 'grabbing' : 'grab',
      boxShadow: selected 
        ? '0 0 0 2px #fff, 0 0 0 4px #3b82f6, 0 4px 12px rgba(0,0,0,0.2)' 
        : '0 2px 8px rgba(0,0,0,0.1)',
      transition: 'box-shadow 0.2s ease, transform 0.1s ease',
      transform: selected ? 'scale(1.02)' : 'scale(1)',
      userSelect: 'none',
    };

    switch (shape) {
      case 'circle':
        return {
          ...baseStyles,
          borderRadius: '50%',
          width: '110px',
          height: '110px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '10px',
          minWidth: 'unset',
        };
      case 'rounded':
        return {
          ...baseStyles,
          borderRadius: '24px',
        };
      case 'diamond':
        return {
          ...baseStyles,
          transform: `rotate(45deg) ${selected ? 'scale(1.02)' : 'scale(1)'}`,
          width: '100px',
          height: '100px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: 'unset',
        };
      case 'hexagon':
        return {
          ...baseStyles,
          clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
          padding: '20px 30px',
        };
      default:
        return {
          ...baseStyles,
          borderRadius: '8px',
        };
    }
  };

  const contentStyles: React.CSSProperties = shape === 'diamond' 
    ? { transform: 'rotate(-45deg)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' } 
    : { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' };

  const handleStyle: React.CSSProperties = { 
    background: '#fff', 
    border: `2px solid ${color}`,
    width: '12px', 
    height: '12px',
    transition: 'all 0.2s ease',
  };

  const renderHandles = () => {
    switch (handlePosition) {
      case 'left':
        return (
          <>
            <Handle type="target" position={Position.Left} style={handleStyle} />
            <Handle type="source" position={Position.Left} style={{ ...handleStyle, top: '60%' }} id="source-left" />
          </>
        );
      case 'right':
        return (
          <>
            <Handle type="target" position={Position.Right} style={handleStyle} />
            <Handle type="source" position={Position.Right} style={{ ...handleStyle, top: '60%' }} id="source-right" />
          </>
        );
      case 'top':
        return (
          <>
            <Handle type="target" position={Position.Top} style={handleStyle} />
            <Handle type="source" position={Position.Bottom} style={handleStyle} />
          </>
        );
      case 'bottom':
        return (
          <>
            <Handle type="target" position={Position.Top} style={handleStyle} />
            <Handle type="source" position={Position.Bottom} style={handleStyle} />
          </>
        );
      case 'horizontal':
        return (
          <>
            <Handle type="target" position={Position.Left} style={handleStyle} />
            <Handle type="source" position={Position.Right} style={handleStyle} />
          </>
        );
      case 'vertical':
        return (
          <>
            <Handle type="target" position={Position.Top} style={handleStyle} />
            <Handle type="source" position={Position.Bottom} style={handleStyle} />
          </>
        );
      default: // 'all'
        return (
          <>
            <Handle type="target" position={Position.Top} style={handleStyle} id="target-top" />
            <Handle type="target" position={Position.Left} style={handleStyle} id="target-left" />
            <Handle type="source" position={Position.Right} style={handleStyle} id="source-right" />
            <Handle type="source" position={Position.Bottom} style={handleStyle} id="source-bottom" />
          </>
        );
    }
  };

  return (
    <div 
      style={getShapeStyles()} 
      onDoubleClick={handleDoubleClick}
      className="custom-node-enhanced"
    >
      {renderHandles()}
      <div style={contentStyles}>
        {IconComponent && (
          <IconComponent size={18} style={{ marginBottom: '2px', opacity: 0.9 }} />
        )}
        {isEditing ? (
          <input
            ref={inputRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderBottom: '2px solid rgba(255,255,255,0.5)',
              color: textColor,
              fontSize: `${fontSize}px`,
              fontWeight: 500,
              textAlign: 'center',
              outline: 'none',
              width: '100%',
              padding: '2px 4px',
            }}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span style={{ wordBreak: 'break-word', maxWidth: '150px' }}>
            {label}
          </span>
        )}
        {notes && (
          <div 
            style={{ 
              fontSize: '10px', 
              opacity: 0.7, 
              cursor: 'pointer',
              marginTop: '2px',
            }}
            onClick={(e) => {
              e.stopPropagation();
              setShowNotes(!showNotes);
            }}
          >
            📝 {showNotes ? notes : 'View notes'}
          </div>
        )}
      </div>
    </div>
  );
});

CustomNodeEnhanced.displayName = 'CustomNodeEnhanced';
