import * as React from 'react';
import { StandardEditorProps } from '@grafana/data';
import { Input } from '@grafana/ui';
import { Extents } from '../types';

interface Props extends StandardEditorProps<Extents> { }

export const ExtentsEditor: React.FC<Props> = ({ value, onChange }) => (
  <div className="inputBox">
    <div className="inputBox">
      <Input
        css=""
        type="number"
        value={value.min}
        title="Axis Min (leave blank for auto)"
        onChange={(e) => {
          value.min = (e.target as HTMLInputElement).valueAsNumber;
          onChange(value);
        }}
      />
    </div>
    <div className="inputBox">
      <Input
        css=""
        type="number"
        value={value.max}
        title="Axis Max (leave blank for auto)"
        onChange={(e) => {
          value.max = (e.target as HTMLInputElement).valueAsNumber;
          onChange(value);
        }}
      />
    </div>
  </div>
);
