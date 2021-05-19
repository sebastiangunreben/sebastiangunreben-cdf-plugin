import { Field } from '@grafana/data';
type SeriesSize = 'sm' | 'md' | 'lg';

export interface CdfPanelOptions {
  label: Label;
  linewidth: number;
  xAxisTitle: Title;
  xAxisExtents: Extents;
  xMargins: MarginPair;
  yAxisTitle: Title;
  yMargins: MarginPair;
  thresholds: ThresholdPair;
  showXGrid: boolean;
  showYGrid: boolean;
  showThresholds: boolean;
}


export class Label {
  constructor(
    public col: number,
  ) {
  }
}

export class ThresholdPair {
  constructor(
    public lower: number,
    public lowerLabel: string,
    public upper: number,
    public upperLabel: string,
  ) {
  }
}

export class MarginPair {
  constructor(
    public lower: number,
    public upper: number,
  ) {
  }
}

export class Title {
  constructor(
    public text: string,
    public color: string,
    public textSize: number,
  ) {
  }
}


export class XAxis {
  constructor(
    public col: number,
    public inverted: boolean,
  ) {
  }
}

export class Extents {
  constructor(
    public min: number,
    public max: number,
  ) {
  }
}

export class ColData {
  point_list: string = "";
  readonly values: number[];
  constructor(
    public name: string,
    public displayName: string,
    public val: number[],
    public color: string,
    public width: number,
    public height: number,
    public index: number,
    public field: Field,
  ) {
    this.values = val
        .filter((v,i,a) => ( !isNaN(v) && typeof v === "number"))
        .sort((n1,n2) => n1 - n2);
  }
  calc_data_points( xScale: Function, yScale: Function )
    {
        this.point_list = this.values?.map((v, i, a) => 
            [xScale(v), yScale((i+1)/a.length)].join(",")).join(" ");


    }
}
