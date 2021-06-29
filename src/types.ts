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


export interface Label {
    col: number,
}

export interface ThresholdPair {
    lower: number,
    lowerLabel: string,
    upper: number,
    upperLabel: string,
}

export interface MarginPair {
    lower: number,
    upper: number,
}

export interface Title {
    text: string,
    color: string,
    textSize: number,
}


export interface XAxis {
    col: number,
    inverted: boolean,
}

export interface Extents {
    min: number,
    max: number,
}

export class ColData {
  point_list: string = "";
  private readonly mvalues: Array<number>;
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
    this.mvalues = val
        .filter((v,i,a) => ( !isNaN(v) && typeof v === "number"))
        .sort((n1,n2) => n1 - n2);
  }
  in_scale (v: number, xExtents: number[]) { 
    return ((isNaN(xExtents[0]) || (!isNaN(xExtents[0]) && xExtents[0] <= v))
            &&
           (isNaN(xExtents[1]) || (!isNaN(xExtents[1]) && xExtents[1] >= v)))
  }
  calc_data_points( xScale: Function, yScale: Function, xExtents: number[] )
    {
        let num_val = this.mvalues.length;
        this.point_list = Array.from(this.mvalues, (v, i, a) => {
            if( this.in_scale(v, xExtents)){
                let obj=[xScale(v), yScale((i+1)/num_val)].join(",");
                return obj;
            }
        }).join(" ");
    }
}
