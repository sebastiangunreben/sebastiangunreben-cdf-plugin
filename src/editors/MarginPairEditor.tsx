import * as React from 'react';
import { StandardEditorProps } from '@grafana/data';
import { Input } from '@grafana/ui';
import { MarginPair } from '../types';

interface Props extends StandardEditorProps<MarginPair> { }

export const MarginPairEditor: React.FC<Props> = ({ value, onChange }) => (
  <div className="inputBox">
    <div className="inputBox">
      <Input
        css=""
        type="number"
        value={value.lower}
//        title="Left Margin"
        onChange={(e) => {
          value.lower = (e.target as HTMLInputElement).valueAsNumber;
          onChange(value);
        }}
      />
    </div>
    <div className="inputBox">
      <Input
        css=""
        type="number"
        value={value.upper}
//        title="Right Margin"
        onChange={(e) => {
          value.upper = (e.target as HTMLInputElement).valueAsNumber;
          onChange(value);
        }}
      />
    </div>
  </div>
);
