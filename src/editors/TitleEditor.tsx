import * as React from 'react';
import { StandardEditorProps } from '@grafana/data';
import { Input } from '@grafana/ui';
import { Title } from '../types';

interface Props extends StandardEditorProps<Title> { }

export const TitleEditor: React.FC<Props> = ({ value, onChange }) => {

  const yoffset = value.showyoffset ? ( <div className="inputBox">
        <Input
          type="number"
          min={0}
          max={50}
          title="YOffset"
          value={value.yoffset}
          onChange={(e) => {
            value.yoffset = (e.target as HTMLInputElement).valueAsNumber;
            onChange(value);
          }}
        />
      </div> ): null;
  const xoffset = value.showxoffset ?  (<div className="inputBox">
        <Input
          type="number"
          min={0}
          max={50}
          title="XOffset"
          value={value.xoffset}
          onChange={(e) => {
            value.xoffset = (e.target as HTMLInputElement).valueAsNumber;
            onChange(value);
          }}
        />
      </div> ) : null;

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
          type="number"
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
      {xoffset}
      {yoffset}
    </div>);
};
