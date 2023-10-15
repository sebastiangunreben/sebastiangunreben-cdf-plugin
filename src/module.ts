import { PanelPlugin } from '@grafana/data';
import { CdfPanelOptions } from './types';
import { CdfPanel } from './cdfPanel';
import { ExtentsEditor } from './editors/ExtentsEditor';
import { MarginPairEditor } from './editors/MarginPairEditor';
import { ThresholdPairEditor } from './editors/ThresholdPairEditor';
import { TitleEditor } from './editors/TitleEditor';


export const plugin = new
PanelPlugin<CdfPanelOptions>(CdfPanel).useFieldConfig().setPanelOptions(builder => {

  return builder
    .addCustomEditor({
     id:"xAxisTitle",
     path:"xAxisTitle",
     name:"X Axis Title / Size / Offset",
     category:["X Axis"],
     editor: TitleEditor,
     defaultValue: {text : "", textSize : 12, yoffset:30, showyoffset: true, showxoffset: false}
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
      path: 'showXThresholds',
      name: 'Show thresholds',
      category: ['X Axis'],
      defaultValue: false,
    })
    .addCustomEditor({
     id:"xthresholds",
     path:"xthresholds",
     name:"X Thresholds",
     category:["X Axis"],
     editor: ThresholdPairEditor,
     defaultValue: {"lower": null, "lowerLabel": "",
                "upper": null, "upperLanel": "", },
     showIf: config => config.showXThresholds,
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
    .addBooleanSwitch({
      path: 'showYThresholds',
      name: 'Show thresholds',
      category: ['Y Axis'],
      defaultValue: false,
    })
    .addCustomEditor({
     id:"ythresholds",
     path:"ythresholds",
     name:"Y Thresholds",
     category:["Y Axis"],
     editor: ThresholdPairEditor,
     defaultValue: {"lower": null, "lowerLabel": "",
                "upper": null, "upperLanel": "", },
     showIf: config => config.showYThresholds,
    })
    .addCustomEditor({
      id: 'yMargins',
      path: 'yMargins',
      name: 'Margins (Bottom/Top)',
      category: ['Y Axis'],
      editor: MarginPairEditor,
      defaultValue: {lower:40, upper:10},
    })
    .addCustomEditor({
     id:"yAxisExtents",
     path:"yAxisExtents",
     name:"Y Axis Field (Min/Max)",
     category:["Y Axis"],
     editor: ExtentsEditor,
     defaultValue: {min: "", max : "" },
    })
    .addBooleanSwitch({
      path: 'showYGrid',
      name: 'Show Y grid lines',
      category: ['Y Axis'],
      defaultValue: false,
    })
    .addNumberInput({
        path:"linewidth",
        name:"Linewidth",
        category: ["Display"],
        description: "stroke width",
        settings: {integer: true},
        defaultValue: 3,
    })
    .addNumberInput({
      path:"scaling",
      name:"Scaling",
      category: ["Display"],
      description: "scaling factor",
      settings: {step: 0.01},
      defaultValue: 1,
    })
    .addBooleanSwitch({
        path:"complementary",
        name:"Use complementary function",
        category: ["Display"],
        description: "1 - P(x <= X) instead of P(x <= X)",
        defaultValue: false,
    });

});
