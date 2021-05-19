import * as React from 'react';
import { StandardEditorProps } from '@grafana/data';
import { Input } from '@grafana/ui';
import { Linewidth } from '../types';

interface Props extends StandardEditorProps<Linewidth> { }

export const LinewidthEditor: React.FC<Props> = ({ value, onChange }) => {
  return (
        <Input
          type="number"
          value={value}
          min={1}
          max={30}
          title="stroke width"
          onChange={(e) => {
            value = (e.target as HTMLInputElement).valueAsNumber;
            onChange(value);
          }}
        />
)};
