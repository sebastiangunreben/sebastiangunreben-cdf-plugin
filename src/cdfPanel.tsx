import React, {useState, useEffect} from 'react';
import * as d3 from 'd3';
import {  UPlotConfigBuilder, UPlotChart,VizLayout, VizLegend, LegendDisplayMode, VizLegendItem } from '@grafana/ui';
import { getColorByName, getColorForTheme, applyFieldOverrides, ConfigOverrideRule, PanelProps } from '@grafana/data';
import { CdfPanelOptions } from 'types';
import { ColData } from 'types';
import { MarginPair } from 'types';
import { css, cx } from 'emotion';
import { stylesFactory, useTheme } from '@grafana/ui';
import { FALLBACK_COLOR, SeriesColorChangeHandler, SeriesVisibilityChangeBehavior, CustomScrollbar, EmptySearchResult, colors, SeriesColorPickerPopover } from '@grafana/ui';



interface Props extends PanelProps<CdfPanelOptions> {}


/**
 * Draw legend
 */
function getLegend(colNames, onLegendClick, _placement, _onLabelClick, displaymode ) {
     let legends = colNames.map<VizLegendItem>((f, i) => {
        return {
            color: f.color ?? FALLBACK_COLOR,
            disabled: false,
            label: f.displayName ?? "",
            yAxis: 1,
            fieldIndex: f.field.state?.origin,
            getItemKey: () => (f.displayName ?? "") + i,
        };});

    let ldm = (displaymode === "Table") ? LegendDisplayMode.Table 
            : LegendDisplayMode.List;;
    let placement = _placement ? _placement : "bottom";

    return  <VizLegend 
            items={legends} 
            placement={placement}
            displayMode={ldm} 
            onLabelClick={_onLabelClick}
            onSeriesColorChange={onLegendClick} />;
}

/**
 * Draw threshold lines
 */
function drawYThresholds(thresholds : ThresholdPair, xScale, yScale, xExt: Extent ) {

    if(! thresholds ) return (<div/>);

    let yU = thresholds.upper ? yScale(thresholds.upper): null;
    let yL = thresholds.lower ? yScale(thresholds.lower): null;
    let xmin = xScale(xExt[0]);
    let xmax = xScale(xExt[1]);
    let yTextOffset = -5;
    
    let tLower = yL ? <line x1={xmin} y1={yL} x2={xmax} y2={yL} stroke="red" /> : null; 
    let tLowerLabel = yL ? <text fill="red" x={(xmax+xmin)/2} y={yL+yTextOffset}>{thresholds.lowerLabel}</text> : null
    let tUpper = yU ? <line x1={xmin} y1={yU} x2={xmax} y2={yU} stroke="red" /> : null; 
    let tUpperLabel = yU ? <text fill="red" x={(xmax+xmin)/2} y={yU+yTextOffset}>{thresholds.upperLabel}</text> : null

    return(
        <g>
            {tLower}
            {tLowerLabel}
            {tUpper}
            {tUpperLabel}
        </g>
    )
}
function drawThresholds(thresholds : ThresholdPair, xScale, yScale, yExt: Extent) {

    if(! thresholds ) return (<div/>);

    let xU = thresholds.upper ? xScale(thresholds.upper): null;
    let xL = thresholds.lower ? xScale(thresholds.lower): null;
    let Ein = yScale(yExt[1]);
    let Nee = yScale(yExt[0]);
    let yTextOffset = -5;
    
    let tLower = xL ? <line x1={xL} y1={Nee} x2={xL} y2={Ein} stroke="red" /> : null; 
    let tLowerLabel = xL ? <text fill="red" x={xL} y={Nee+yTextOffset}>{thresholds.lowerLabel}</text> : null
    let tUpper = xU ? <line x1={xU} y1={Nee} x2={xU} y2={Ein} stroke="red" /> : null; 
    let tUpperLabel = xU ? <text fill="red" x={xU} y={Nee+yTextOffset}>{thresholds.upperLabel}</text> : null

    return(
        <g>
            {tLower}
            {tLowerLabel}
            {tUpper}
            {tUpperLabel}
        </g>
    )
}

/**
 * Draw title of the yaxis
 */
function drawYTitle(options: CdfPanelOptions, width: number, height: number, xMargins: MarginPair, yMargins: MarginPair) {
  const title = options.yAxisTitle;
  if (title.text) {
    const xoffset = title.xoffset;

    let label_length = title.text.length * title.textSize / 2.5;

    return (
      <g
        transform={`translate(${-width/2+xMargins.lower-xoffset},${-height/2+yMargins.upper+label_length} ) rotate(-90) `}
      >
        <text
          font-size={title.textSize}
          font-family="sans-serif"
          fill="#909090"
          textLength={label_length}
        >
          {title.text}
        </text>
      </g>
    );
  }
  return null;
}

/**
 * Draw title of the xaxis
 */
function drawXTitle(options: CdfPanelOptions, width: number, height: number, xMargins: MarginPair, yMargins: MarginPair) {
  const title = options.xAxisTitle;
  if (title.text) {
    const yoffset = title.yoffset;

    let label_length = title.text.length * title.textSize / 2.5;

    return (
      <g
        transform={`translate(${width/2 - xMargins.upper-label_length}, ${height/2 - yMargins.lower + yoffset}) `}
      >
        <text
          font-size={title.textSize}
          font-family="sans-serif"
          fill="#909090"
          textLength={label_length}
        >
          {title.text}
        </text>
      </g>
    );
  }
  return null;
}

export const CdfPanel: React.FC<Props> = ({ options, data, width, height, id
, fieldConfig}) => {
    const [count, setCount] = useState(0);
    const theme = useTheme();
    const styles = getStyles();
    const xMargins = { "lower": options.xMargins.lower || 0, 
                        "upper": options.xMargins.upper || 0};
    const yMargins = { "lower": options.yMargins.lower || 0,
                        "upper": options.yMargins.upper || 0};

    const scaling_factor = options.scaling || 1;

    let xmax = Number.MIN_SAFE_INTEGER;
    let xmin = Number.MAX_SAFE_INTEGER;
    const lineWidth = options.linewidth || 3;

    let overriderOptions: ApplyFieldOverrideOptions = 
        {
            data: data.series,
            fieldConfig: fieldConfig,
            theme: theme,
            replaceVariables: (value: string) => { return value },
        };

    function getColor( field, idx ) {
        if (field.config) {
            if( field.config.color ) {
                if (field.config.color.hasOwnProperty("fixedColor") ) {
                    return field.config.color["fixedColor"];
                }
            }
        }
        return colors[idx % colors.length];
    }

    const series_points = applyFieldOverrides(overriderOptions)
        .map((s, idx) => {
                const field = s.fields.find(field => field.type === "number");
                const cd = new ColData(
                        field.name,
                        field.name || " ",
                        field.values.toArray().map(v => scaling_factor * v as number),
                        getColor(field, idx),
                        width,
                        height,
                        options.complementary,
                        field,
                        );

                xmax = (xmax < cd.get_max()) ? cd.get_max() : xmax;
                xmin = (xmin > cd.get_min()) ? cd.get_min() : xmin;
                return cd;
                });

    if (xmin == Number.MAX_SAFE_INTEGER || xmax == Number.MIN_SAFE_INTEGER ) {
        return( <EmptySearchResult>Could not find anything matching your query</EmptySearchResult> );
    };

    const panelId = id;

    const xTitle = drawXTitle(options, width, height, xMargins, yMargins);
    const yTitle = drawYTitle(options, width, height, xMargins, yMargins);
    const xExtent = [
        options.xAxisExtents.min === 0 ? 0 : options.xAxisExtents.min || (xmin),
        options.xAxisExtents.max === 0 ? 0 : options.xAxisExtents.max || (xmax),
    ] as number[];

    const yExtent = [
        options.yAxisExtents.min ? options.yAxisExtents.min : 0,
        options.yAxisExtents.max ? options.yAxisExtents.max : 1,
    ] as number[];


    const xScale = d3
        .scaleLinear()
        .nice()
        .domain(xExtent as [number, number])
        .range([
                -width/2+xMargins.lower,
                (+width/2 - xMargins.upper),
        ]);

    const yScale = d3
        .scaleLinear()
        .nice()
        .domain(yExtent as [number, number])
        .range([height/2 - yMargins.lower, -height/2+yMargins.upper]);


    series_points.forEach( s => {s.calc_data_points(xScale, yScale, xExtent, yExtent);});
    let xAxis = d3.axisBottom(xScale);
    if (options.showXGrid ) {
        xAxis = xAxis.tickSize(+yMargins.upper + yMargins.lower - height);
    }

    if ( fieldConfig.defaults.hasOwnProperty("unit") ) {
        xAxis.tickFormat(function(d){ return d + " " + fieldConfig.defaults.unit});
    }

    let yAxis = d3.axisLeft(yScale);
    if (options.showYGrid ) {
        yAxis = yAxis.tickSize(+xMargins.lower + xMargins.upper - width);
    }

    if (options.showThresholds) {
        const thresholds = drawThresholds( options.thresholds, xScale, yScale,
yExtent ); 
    }
    if (options.showYThresholds) {
        const ythresholds = drawYThresholds( options.ythresholds, xScale, yScale, xExtent ); 
    }

    function onLabelClick(item: VizLegendItem, event: React.MouseEvent<HTMLDivElement>){
    }

    function onLegendClick(item, _color) {
        let color = theme.visualization ? 
            theme.visualization.getColorByName(_color) 
            : getColorForTheme(_color,theme);
        let mc: MatcherConfig = {id: "byName", options: item};
        let properties: DynamicConfigValue = { id: "color",
            value: {"fixedColor": color, "mode": "fixed"} };
        let configOverrideRule: ConfigOverrideRule = {
            matcher: mc,
            properties: [properties]};

        let updated = false;
        fieldConfig.overrides = fieldConfig.overrides.map((c) => {
            if(    c.matcher.id == "byName" 
                && c.matcher.options == item ) {
                c.properties = c.properties.map((i) => {
                    if( i.id == "color" && !updated ) {
                        updated = true;
                        return properties; }
                    else {
                        return i ?!updated : {};
                    }
                });
            }
            if (c.properties.length > 0 ) { return c ; };
        });
        if (! updated ) {
            fieldConfig.overrides = 
                [...fieldConfig.overrides, ...configOverrideRule];
        }
        setCount( count => count + 1 );
    }

    //console.log(series_points);

    const legend = getLegend(series_points, onLegendClick, options.legendplacement, onLabelClick, options.legenddisplaymode);

    let opts = { scales: { "x": { time: false, } } };

    return <div
            className={cx(
                    styles.wrapper,
                    css`
                    width: ${width}px;
                    height: ${height}px;
                    `
                    )}
            >
            <svg
            className={styles.svg}
            width={width}
            height={height}
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox={`-${width / 2} -${height / 2} ${width} ${height}`}
            >
            <g transform={`translate(0, ${height/2-yMargins.lower})`}
                ref={(node) => {
                d3.select(node)  
                    .call(xAxis as any)
                    .selectAll('line', 'path')
                    .attr('stroke', "#909090");
            }}
            />
            <g transform={`translate(${-width/2 + xMargins.lower},0)`}
                ref={(node) => {
                d3.select(node)
                    .call(yAxis as any)
                    .selectAll('line', 'path')
                    .attr('stroke', "#909090");
            }}
            />
            <g transform={`translate(0,0)`}>
                { series_points.map( v => {
                    return <polyline id={v.displayName} fill="none" stroke={v.color} stroke-width={lineWidth} points={v.point_list} />; } ) }
            </g>
            { xTitle }
            { yTitle }
            { options.showThresholds ? thresholds : null }
            { options.showYThresholds ? ythresholds : null }
            </svg>
            <div className={styles.textBox}>
                {options.showSeriesCount && (
                    <div
                    className={css`
                    font-size: ${theme.typography.size[options.seriesCountSize]};
                    `}
                    >
                    Number of series: {data.series.length},
                    xmin: {xmin}, xmax: {xmax}
                    </div>
                    )}
            </div>
                <div className={styles.textBox}>
                    {legend}
                </div>
            </div>
};

const getStyles = stylesFactory(() => {
  return {
    wrapper: css`
      position: relative;
    `,
    svg: css`
      position: absolute;
      top: 0;
      left: 0;
    `,
    textBox: css`
      position: absolute;
      bottom: 0;
      left: 0;
      padding: 10px;
    `,
    legendBox: css`
      position: absolute;
      bottom: 0;
      left: 0;
      padding: 10px;
    `,
    inputBox: css`
      position: relative;
      bottom: 0;
      left: 0;
      padding: 10px;
    `,
    axisColor: css`
      stroke: red;
    `,
  };
});
