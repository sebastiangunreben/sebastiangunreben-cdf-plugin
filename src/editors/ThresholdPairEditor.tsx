import * as React from 'react';
import { StandardEditorProps } from '@grafana/data';
import { Input } from '@grafana/ui';
import { ThresholdPair } from '../types';

interface Props extends StandardEditorProps<ThresholdPair> { }

export const ThresholdPairEditor: React.FC<Props> = ({ value, onChange }) => (
  <div className="inputBox">
    min (value, label)
    <div className="inputBox">
      <Input
        css=""
        type="number"
        value={value.lower}
        onChange={(e) => {
          value.lower = (e.target as HTMLInputElement).valueAsNumber;
          onChange(value);
        }}
      />
    </div>
    <div className="inputBox">
      <Input
        type="string"
        value={value.lowerLabel}
        onChange={(e) => { value.lowerLabel = (e.target as HTMLInputElement).value;
          onChange(value);
        }}
      />
    </div>
    max (value, label)
    <div className="inputBox">
      <Input
        type="number"
        value={value.upper}
//        title="Left Margin"
        onChange={(e) => {
          value.upper = (e.target as HTMLInputElement).valueAsNumber;
          onChange(value);
        }}
      />
    </div>
    <div className="inputBox">
      <Input
        type="string"
        value={value.upperLabel}
        onChange={(e) => { value.upperLabel = (e.target as HTMLInputElement).value;
          onChange(value);
        }}
      />
    </div>
  </div>
);
