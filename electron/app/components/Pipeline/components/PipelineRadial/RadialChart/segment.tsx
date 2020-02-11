import React from 'react';
import { animated } from 'react-spring/renderprops';
import { itemsForPath } from '../../../utils';
import { RadialNode } from '../../../types';
import WrappedLabel from './WrappedLabel';
import styles from './index.module.scss';

type SimpleNode = { name: string, depth: number, children: SimpleNode[] };

const flattenToSubtypes = (list: SimpleNode[]): SimpleNode[] =>
  list.reduce(
    (a: SimpleNode[], b: SimpleNode) =>
      a.concat(
        b.children[0].depth === 6
          ? b.children.filter(child => child.name !== '*')
          : flattenToSubtypes(b.children)
      ),
    []
  );

type Props = {
  original: RadialNode,
  index: number,
  t: any, // eslint-disable-line
  path: string,
  nct: string,
  getArc: RadialNode => void,
  labelCurve: (RadialNode, number, number, number) => string,
  labelAnchor: (RadialNode, number) => string,
  getDisplay: RadialNode => string,
  getTextDisplay: RadialNode => string,
  getArcLength: RadialNode => number,
  getArcWidth: RadialNode => number,
  labelTransform: (RadialNode, number, number, number) => string,
  onSelect: RadialNode => void
};

class SunburstSegment extends React.Component<Props> {
  static defaultProps = {
    compound: undefined
  };

  constructor(props: Props) {
    super(props);

    const { original, getArcLength } = props;
    const length = getArcLength(original);
    this.prevLength = length;
  }

  shouldComponentUpdate = ({ original, getArcLength }: Props) => {
    const length = getArcLength(original);
    const hadSize = this.prevLength > 0;
    this.prevLength = length;
    return hadSize || length > 0;
  };

  prevLength = 1;

  render = () => {
    const {
      original,
      index,
      t,
      path,
      nct,
      getArc,
      labelCurve,
      labelTransform,
      labelAnchor,
      getDisplay,
      getTextDisplay,
      getArcLength,
      getArcWidth,
      onSelect
    } = this.props;
    const { root: pathRoot } = itemsForPath(path); // level
    if (original.x0 === undefined) return null;

    let node: RadialNode = original;
    const { parent, phase, isEmpty, depth, route } = node;

    let name = node.label || '';
    const textDisplay = getTextDisplay(node);
    let opacity = 1.0;
    let lighten = nct !== '';

    if (nct !== '' && node.isStudyContainer) {
      const filtered =
        node.children === undefined
          ? []
          : node.children.filter(child => child.label === nct);

      lighten = filtered.length === 0;
    }

    if (pathRoot === 'Compounds') {
      lighten = false;
    }

    if (phase !== undefined) {
      const dist = node.y1 - node.y0;
      if (nct !== '') {
        const filtered = node.parent.children.filter(
          child => child.label === nct
        );

        if (pathRoot !== 'Compounds') {
          lighten = filtered.length === 0;
        }
      }

      let length = dist;
      if (phase === 1) {
        opacity = 0.3;
        length *= 0.24;
      } else if (phase === 1.5) {
        opacity = 0.45;
        length *= 0.475;
      } else if (phase === 2) {
        opacity = 0.65;
        length *= 0.75;
      } else if (phase === 3) {
        opacity = 0.8;
      }
      const y1 = node.y0 + length;
      node = { ...node, y1 };
    } else if (parent !== null) {
      if (isEmpty) {
        node = { ...node, y0: 0, y1: 0 };
      } else if (parent.isEmpty) {
        let { y0 } = parent;

        if (
          (route.includes('Malignant/B-cell') ||
            route.includes('Malignant/Blastic')) &&
          depth === 7
        ) {
          ({ y0 } = parent.parent.parent);
        }

        node = { ...node, y0 };
      }
    }

    let textOpacity = 1;

    if (pathRoot === 'Compounds' && node.isStudyContainer && depth === 5) {
      const flattened = flattenToSubtypes(parent.children);
      if (flattened.length === 0) {
        const { y1 } = node.children[0];
        node = { ...node, y1 };
      }
    } else if (
      pathRoot === 'Compounds' &&
      node.isStudyContainer &&
      depth === 6
    ) {
      const flattened = flattenToSubtypes(parent.parent.children);
      if (flattened.length === 0) {
        node = { ...node, y0: node.y1 };
      }
      textOpacity = 0.8;
    }

    const arcLength = getArcLength(node);
    const arcWidth = getArcWidth(node);

    if (name === 'Immune Thrombocytopenic Purpura') {
      name = 'Immune Thrombo... Purpura';
    }

    return (
      <g key={`node-${index}`}>
        <animated.path
          className={styles.path}
          stroke="#FFFFFF"
          strokeWidth={0.5}
          fill={node.fill}
          fillRule="evenodd"
          opacity={opacity}
          onClick={() => {
            if (node.route !== undefined) {
              onSelect(node);
            }
          }}
          display={t.interpolate(() => getDisplay(node))}
          d={t.interpolate(() => getArc(node))}
        />

        {textDisplay === 'inline' && (
          <WrappedLabel
            path={path}
            display={textDisplay}
            node={node}
            name={name}
            t={t}
            index={index}
            opacity={textOpacity}
            containerWidth={arcWidth - 7}
            containerHeight={arcLength}
            labelTransform={labelTransform}
            labelAnchor={labelAnchor}
            labelCurve={labelCurve}
          />
        )}

        {(textDisplay === 'curved' || textDisplay === 'curved-capped') && (
          <WrappedLabel
            path={path}
            display={textDisplay}
            node={node}
            name={name}
            t={t}
            index={index}
            opacity={textOpacity}
            containerWidth={arcLength - 6}
            containerHeight={arcWidth}
            labelTransform={labelTransform}
            labelAnchor={labelAnchor}
            labelCurve={labelCurve}
          />
        )}

        {lighten && (
          <animated.path
            className={styles.fader}
            stroke="#FFFFFF"
            strokeWidth={0.4}
            fill="#DDDDDD"
            fillRule="evenodd"
            opacity={0.7}
            display={t.interpolate(() => getDisplay(node))}
            d={t.interpolate(() => getArc(node))}
          />
        )}
      </g>
    );
  };
}

export default SunburstSegment;
