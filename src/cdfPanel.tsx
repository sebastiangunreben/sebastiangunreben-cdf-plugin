import React, {useState, useEffect} from 'react';
import * as d3 from 'd3';
import { VizLayout, VizLegend, LegendDisplayMode, VizLegendItem } from '@grafana/ui';
import { getColorByName, getColorForTheme, applyFieldOverrides, ConfigOverrideRule, PanelProps } from '@grafana/data';
import { CdfPanelOptions } from 'types';
import { ColData } from 'types';
import { MarginPair } from 'types';
import { css, cx } from 'emotion';
import { stylesFactory, useTheme } from '@grafana/ui';
import { FALLBACK_COLOR, SeriesColorChangeHandler, SeriesVisibilityChangeBehavior, CustomScrollbar, EmptySearchResult, colors, SeriesColorPickerPopover } from '@grafana/ui';


interface Props extends PanelProps<CdfPanelOptions> {}



function getLegend(colNames, onLegendClick ) {
     let legends = colNames.map<VizLegendItem>((f, i) => {
        return {
            color: f.color ?? FALLBACK_COLOR,
            disabled: false,
            label: f.displayName ?? "",
            yAxis: 1,
            fieldIndex: f.field.state?.origin,
            getItemKey: () => (f.displayName ?? "") + i,
        };});


    return  <VizLegend 
            items={legends} 
            placement="bottom" 
            displayMode={LegendDisplayMode.List} 
            onSeriesColorChange={onLegendClick} />;
}

function drawThresholds(thresholds : ThresholdPair, xScale, yScale) {

    if(! thresholds ) return (<div/>);

    let xU = thresholds.upper ? xScale(thresholds.upper): null;
    let xL = thresholds.lower ? xScale(thresholds.lower): null;
    let Ein = yScale(1);
    let Nee = yScale(0);
    let yTextOffset = -5;
    
    let tLower = xL ? <line x1={xL} y1={Nee} x2={xL} y2={Ein} stroke="red" /> : null; 
    let tLowerLabel = xL ? <text fill="red" x={xL} y={Nee+yTextOffset}>{thresholds.lowerLabel}</text> : null
    let tUpper = xU ? <line x1={xU} y1={Nee} x2={xU} y2={Ein} stroke="red" /> : null; 
    let tUpperLabel = thresholds.upper ? <text fill="red" x={xU} y={Nee+yTextOffset}>{thresholds.upperLabel}</text> : null

    return(
        <g>
            {tLower}
            {tLowerLabel}
            {tUpper}
            {tUpperLabel}
        </g>
    )
}

function drawYTitle(options: CdfPanelOptions, width: number, height: number, xMargins: MarginPair, yMargins: MarginPair) {
  const title = options.yAxisTitle;
  if (title.text) {
    const yoffset = 20;

    //yMargins.lower = Math.max(yoffset + title.textSize, yMargins.lower);
    let label_length = title.text.length * title.textSize / 6;

    return (
      <g
        transform={`translate(${-width/2},${-height/2+yMargins.upper+label_length} ) rotate(-90) `}
      >
        <text
          alignmentBaseline="hanging"
          textAnchor="middle"
          font-size={title.textSize}
          font-family="sans-serif"
          fill="#909090"
        >
          {title.text}
        </text>
      </g>
    );
  }
  return null;
}

function drawXTitle(options: CdfPanelOptions, width: number, height: number, xMargins: MarginPair, yMargins: MarginPair) {
  const title = options.xAxisTitle;
  if (title.text) {
    const yoffset = 20;

    //yMargins.lower = Math.max(yoffset + title.textSize, yMargins.lower);
    let label_length = title.text.length * title.textSize / 6;

    return (
      <g
        transform={`translate(${width/2- xMargins.upper - label_length}, ${height/2 - yMargins.lower + yoffset}) `}
      >
        <text
          alignmentBaseline="hanging"
          textAnchor="middle"
          //font-size={title.textSize}
          font-size="12px"
          font-family="sans-serif"
          //fill={title.color}
          fill="#909090"
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
    const xMargins = new MarginPair(options.xMargins.lower || 0, options.xMargins.upper || 0);
    const yMargins = new MarginPair(options.yMargins.lower || 0, options.yMargins.upper || 0);

    let xmax = Number.MIN_SAFE_INTEGER;
    let xmin = Number.MAX_SAFE_INTEGER;
    const lineWidth = options.linewidth || 3;

    //const [fieldConfig, setValue] = useState(fieldConfig);
    //console.log("FieldConfig:", fieldConfig);

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


    //console.log(applyFieldOverrides(overriderOptions));
    const series_points = applyFieldOverrides(overriderOptions)
        .map((s, idx) => {
                const field = s.fields.find(field => field.type === "number");
                const cd = new ColData(
                        field.name,
                        s.name || " ",
                        field.values.toArray().map(v => v as number),
                        getColor(field, idx),
                        width,
                        height,
                        -1,
                        field,
                        );

                xmax = (xmax < field.state.calcs["max"]) 
                    ? field.state.calcs["max"] : xmax;
                xmin = (xmin > field.state.calcs["min"]) 
                    ? field.state.calcs["min"] : xmin;
                return cd
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

    const yExtent = [0, 1] as number[];

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

    const thresholds = drawThresholds( options.thresholds, xScale, yScale ); 

    //console.log(series_points);

    series_points.forEach( s => {s.calc_data_points(xScale, yScale);});

    let xAxis = d3.axisBottom(xScale);
    if (options.showXGrid ) {
        xAxis = xAxis.tickSize(+yMargins.upper + yMargins.lower - height);
    }

    let yAxis = d3.axisLeft(yScale);
    if (options.showYGrid ) {
        yAxis = yAxis.tickSize(+xMargins.lower + xMargins.upper - width);
    }

    function onLegendClick(item, _color) {
        let color = getColorForTheme(_color,theme);
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

    const legend = getLegend(series_points, onLegendClick);

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
