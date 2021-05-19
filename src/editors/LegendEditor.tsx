import * as React from 'react';
import { StandardEditorProps } from '@grafana/data';
import { Input } from '@grafana/ui';
import { Legend } from '../types';

interface Props extends StandardEditorProps<Legend> { }

export const LegendEditor: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div className="ScatterFlex">
      <div className="ScatterFlex ScatterSize">
        <div className="ScatterLabel">Size</div>
        <Input
          css=""
          className="ScatterLegendSize"
          type="number"
          value={value.size}
          min={0}
          max={30}
          title="Legend Text Size"
          onChange={(e) => {
            value.size = (e.target as HTMLInputElement).valueAsNumber;
            onChange(value);
          }}
        />
      </div>
    </div>
  );
};
