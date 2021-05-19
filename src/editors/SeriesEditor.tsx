import * as React from 'react';
import { StandardEditorProps } from '@grafana/data';
import { Select } from '@grafana/ui';
import { ColorPicker } from '@grafana/ui';
import { Label } from '../types';

interface Props extends StandardEditorProps<Label> { }

export const SeriesEditor: React.FC<Props> = ({ onChange, context }) => {
//if (
//  context.data
//  && context.data.length > 0) {
//  const options = context.data
//    .flatMap((frame) => frame.fields.find(field => field.type === "number"))
//    .map((field, index) => (
//      <ColorPicker color={field?.color}>
//      field.config?.displayName ?  field.config.displayName : field.name,
//      </ColorPicker>
//    ));
//
//  return (
//    <div className="LabelEditor">
//      <div className="ScatterFlex">
//        <div className="ScatterSelect">
//            {options}
//        </div>
//      </div>
//    </div>
//  );
  }

  return <Select onChange={() => { }} disabled />;
};
