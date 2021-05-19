import * as React from 'react';
import { StandardEditorProps } from '@grafana/data';
import { Input } from '@grafana/ui';
import { Title } from '../types';

interface Props extends StandardEditorProps<Title> { }

export const TitleEditor: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div className="inputBox">
      <div className="inputBox">
        <Input
          type="string"
          value={value.text}
          onChange={(e) => {
            value.text = (e.target as HTMLInputElement).value;
            onChange(value);
          }}
        />
      </div>
      <div className="inputBox">
        <Input
          type="hidden"
          min={0}
          max={30}
          title="Set size of text"
          value={value.textSize}
          onChange={(e) => {
            value.textSize = (e.target as HTMLInputElement).valueAsNumber;
            onChange(value);
          }}
        />
      </div>
    </div>);
};
