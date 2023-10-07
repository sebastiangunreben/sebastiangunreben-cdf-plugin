import * as React from 'react';
import { StandardEditorProps } from '@grafana/data';
import { Input } from '@grafana/ui';
import { Scaling } from '../types';

interface Props extends StandardEditorProps<Scaling> { }

export const ScalerEditor: React.FC<Props> = ({ value, onChange }) => {
  return (
        <Input
          type="number"
          value={value.scaling}
          min={0.000000001}
          max={10000000000}
          step={0.000000001}
          title="scaling factor"
          onChange={(e) => {
            value = (e.target as HTMLInputElement).valueAsNumber;
            onChange(value);
          }}
        />
)};
