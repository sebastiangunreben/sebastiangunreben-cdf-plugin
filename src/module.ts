import { PanelPlugin } from '@grafana/data';
import { CdfPanelOptions } from './types';
import { CdfPanel } from './cdfPanel';

import { Extents } from './types';
import { Title } from './types';
import { Linewidth } from './types';
import { MarginPair } from './types';
import { ThresholdPair } from './types';

import { ExtentsEditor } from './editors/ExtentsEditor';
import { MarginPairEditor } from './editors/MarginPairEditor';
import { ThresholdPairEditor } from './editors/ThresholdPairEditor';
import { LinewidthEditor } from './editors/LinewidthEditor';
import { TitleEditor } from './editors/TitleEditor';
import { FieldSetEditor } from './editors/FieldSetEditor';

export const plugin = new
PanelPlugin<CdfPanelOptions>(CdfPanel).useFieldConfig().setPanelOptions(builder => {
  return builder
    .addCustomEditor({
     id:"xAxisTitle",
     path:"xAxisTitle",
     name:"X Axis Title",
     category:["X Axis"],
     editor: TitleEditor,
     defaultValue: new Title("XAxis Title","#909090", 12),
    })
    .addCustomEditor({
     id:"xMargins",
     path:"xMargins",
     name:"Margins (Left/Right)",
     category:["X Axis"],
     editor: MarginPairEditor,
     defaultValue: new MarginPair(30,10),
    })
    .addCustomEditor({
     id:"xAxisExtents",
     path:"xAxisExtents",
     name:"X Axis Field (Min/Max)",
     category:["X Axis"],
     editor: ExtentsEditor,
     defaultValue: new Extents(0, NaN),
    })
    .addBooleanSwitch({
      path: 'showThresholds',
      name: 'Show thresholds',
      category: ['X Axis'],
      defaultValue: false,
    })
    .addCustomEditor({
     id:"thresholds",
     path:"thresholds",
     name:"Thresholds",
     category:["X Axis"],
     editor: ThresholdPairEditor,
     defaultValue: new ThresholdPair(NaN,"", NaN,""),
     showIf: config => config.showThresholds,
    })
    .addBooleanSwitch({
      path: 'showXGrid',
      name: 'Show X grid lines',
      category: ['X Axis'],
      defaultValue: false,
    })
    .addCustomEditor({
     id:"yAxisTitle",
     path:"yAxisTitle",
     name:"Y Axis Title",
     category:["Y Axis"],
     editor: TitleEditor,
     defaultValue: new Title("P(x <= X)","#909090", 12),
    })
    .addCustomEditor({
      id: 'yMargins',
      path: 'yMargins',
      name: 'Margins (Bottom/Top)',
      category: ['Y Axis'],
      editor: MarginPairEditor,
      defaultValue: new MarginPair(50, 10),
    })
    .addBooleanSwitch({
      path: 'showYGrid',
      name: 'Show Y grid lines',
      category: ['Y Axis'],
      defaultValue: false,
    })
    .addCustomEditor({
        id: "linewidth",
        path:"linewidth",
        name:"Linewidth",
        category: ["Display"],
        description: "stroke width",
        editor: LinewidthEditor,
        defaultValue: 3,
    })
//  .addRadio({
//    path: 'color',
//    name: 'Circle color',
//    defaultValue: 'red',
//    settings: {
//      options: [
//        {
//          value: 'red',
//          label: 'Red',
//        },
//        {
//          value: 'green',
//          label: 'Green',
//        },
//        {
//          value: 'blue',
//          label: 'Blue',
//        },
//      ],
//    }
//  });
});
