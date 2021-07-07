import { PanelPlugin } from '@grafana/data';
import { CdfPanelOptions } from './types';
import { CdfPanel } from './cdfPanel';

import { Extents } from './types';
//import { Title } from './types';
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
     name:"X Axis Title / Size / Offset",
     category:["X Axis"],
     editor: TitleEditor,
     defaultValue: {text : "XAxis Title", textSize : 12, yoffset:30, showyoffset: true, showxoffset: false}
    })
    .addCustomEditor({
     id:"xMargins",
     path:"xMargins",
     name:"Margins (Left/Right)",
     category:["X Axis"],
     editor: MarginPairEditor,
     defaultValue: {lower:40, upper:10},
    })
    .addCustomEditor({
     id:"xAxisExtents",
     path:"xAxisExtents",
     name:"X Axis Field (Min/Max)",
     category:["X Axis"],
     editor: ExtentsEditor,
     defaultValue: {min: "", max : "" },
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
     defaultValue: {"lower": null, "lowerLabel": "",
                "upper": null, "upperLanel": "", },
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
     name:"Y Axis Title / Size / Offset",
     category:["Y Axis"],
     editor: TitleEditor,
     defaultValue: {text : "P(x <= X)", textSize : 12, xoffset: 30, showyoffset: false, showxoffset: true}
    })
    .addCustomEditor({
      id: 'yMargins',
      path: 'yMargins',
      name: 'Margins (Bottom/Top)',
      category: ['Y Axis'],
      editor: MarginPairEditor,
      defaultValue: {lower:40, upper:10},
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
    });
});
