import { Field } from '@grafana/data';
type SeriesSize = 'sm' | 'md' | 'lg';

export interface CdfPanelOptions {
  label: Label;
  linewidth: number;
  scaling: number;
  xAxisTitle: Title;
  xAxisExtents: Extents;
  xMargins: MarginPair;
  yAxisTitle: Title;
  yAxisExtents: Extents;
  ythresholds: ThresholdPair;
  yMargins: MarginPair;
  thresholds: ThresholdPair;
  ythresholds: ThresholdPair;
  showXGrid: boolean;
  showYGrid: boolean;
  showThresholds: boolean;
  legendplacement: LegendPlacement;
  legenddisplaymode: LegendDisplayMode;
  complementary: boolean;
}

export interface LegendDisplayMode {
    display : "Table" | "List";
}

export interface LegendPlacement {
    placement : "bottom" | "right";
}

export interface Label {
    col: number,
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
  private alignedData: Array<Array<number>> = [];
  constructor(
    public name: string,
    public displayName: string,
    public val: number[],
    public color: string,
    public width: number,
    public height: number,
    public complementary: boolean,
    public field: Field,
  ) {
    this.mvalues = val
        .filter((v,i,a) => ( !isNaN(v) && typeof v === "number"))
        .sort((n1,n2) => n1 - n2);
    this.alignedData.push(this.mvalues);
    this.alignedData.push(this.mvalues.map( (v,i,a)=> (i+1) * 1 / a.length));
  }
  in_scale (v: number, xExtents: number[]) { 
    return ((isNaN(xExtents[0]) || (!isNaN(xExtents[0]) && xExtents[0] <= v))
            &&
           (isNaN(xExtents[1]) || (!isNaN(xExtents[1]) && xExtents[1] >= v)))
  }
  calc_data_points( xScale: Function, yScale: Function, xExtents: number[], yExtents: number[]  )
    {
        let num_val = this.mvalues.length;
        this.point_list = Array.from(this.mvalues, (v, i, a) => {
            if( this.in_scale(v, xExtents)){
                let yval = 0
                if (this.complementary){
                    yval = 1-(i+1)/num_val
                } else {
                    yval = (i+1)/num_val
                }
                if ( this.in_scale(yval, yExtents) ) {
                    let obj=[xScale(v), yScale(yval)].join(",");
                    return obj;
                }
            }
        }).join(" ");
    }
   get_alignedData(){
        return this.alignedData;
    }
   get_min(){
        if ( this.mvalues.length > 0 ) {
            return this.mvalues[0];
        } else {
            return null;
        }
    }
   get_max(){
        if ( this.mvalues.length > 0 ) {
            return this.mvalues[this.mvalues.length-1];
        } else {
            return null;
        }
    }
}
