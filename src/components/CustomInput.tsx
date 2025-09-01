import React from 'react';

interface CustomInputProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  autoFocus?: boolean;
  className?: string;
}

export const CustomInput: React.FC<CustomInputProps> = ({
  value,
  onValueChange,
  placeholder,
  onKeyDown,
  autoFocus,
  className
}) => {
  return (
    <div className={`custom-input-container ${className || ''}`}>
      <input
        type="text"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="custom-input"
      />
      <style>{`
        .custom-input-container {
          width: 320px;
          margin: 0 auto;
        }
        
        .custom-input {
          width: 100%;
          padding: 12px 0;
          font-size: 24px;
          line-height: 0;
          letter-spacing: -0.24px;
          text-align: center;
          color: rgb(250, 250, 250);
          background: transparent;
          border: none;
          border-bottom: 2px solid rgb(82, 82, 82);
          border-radius: 0;
          outline: none;
          opacity: 0.7;
          font-family: "Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif;
          transition: border-bottom-color 0.2s ease;
        }
        
        .custom-input::placeholder {
          color: rgb(163, 163, 163);
        }
        
        .custom-input:focus {
          border-bottom-color: rgb(163, 163, 163);
          opacity: 1;
        }
        
        .custom-input:hover {
          border-bottom-color: rgb(163, 163, 163);
        }
      `}</style>
    </div>
  );
};
