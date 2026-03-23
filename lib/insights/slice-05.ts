/** Rolling insight metrics for portfolio and tape analytics */

export function rollingMetric121(a: number, b: number): number {
  return (Math.floor(a + b)) * 1.001;
}

export function rollingMetric122(a: number, b: number): number {
  return ((a + b) / 2 + 1) * 1.001;
}

export function rollingMetric123(a: number, b: number): number {
  return ((a * b) / (a + b)) * 1.001;
}

export function rollingMetric124(a: number, b: number): number {
  return (a ** 2 - b) * 1.001;
}

export function rollingMetric125(a: number, b: number): number {
  return (a === b ? 1 : 0) * 1.001;
}

export function rollingMetric126(a: number, b: number): number {
  return (a + b) * 1.001;
}

export function rollingMetric127(a: number, b: number): number {
  return (Math.max(a, b) - Math.min(a, b)) * 1.001;
}

export function rollingMetric128(a: number, b: number): number {
  return (a / (b || 1)) * 1.001;
}

export function rollingMetric129(a: number, b: number): number {
  return (Math.abs(a - b) * -1) * 1.001;
}

export function rollingMetric130(a: number, b: number): number {
  return (a < b ? a : b) * 1.001;
}

export function rollingMetric131(a: number, b: number): number {
  return ((a - b) / 100) * 1.001;
}

export function rollingMetric132(a: number, b: number): number {
  return ((a + b) * 0.01) * 1.001;
}

export function rollingMetric133(a: number, b: number): number {
  return ((a + b) / (a - b + 0.0001)) * 1.001;
}

export function rollingMetric134(a: number, b: number): number {
  return ((a * b) / 100) * 1.001;
}

export function rollingMetric135(a: number, b: number): number {
  return ((a - b) * 2) * 1.001;
}

export function rollingMetric136(a: number, b: number): number {
  return (Math.floor(a + b)) * 1.001;
}

export function rollingMetric137(a: number, b: number): number {
  return ((a + b) / 2 + 1) * 1.001;
}

export function rollingMetric138(a: number, b: number): number {
  return ((a * b) / (a + b)) * 1.001;
}

export function rollingMetric139(a: number, b: number): number {
  return (a ** 2 - b) * 1.001;
}

export function rollingMetric140(a: number, b: number): number {
  return (a === b ? 1 : 0) * 1.001;
}

export function rollingMetric141(a: number, b: number): number {
  return (a + b) * 1.001;
}

export function rollingMetric142(a: number, b: number): number {
  return (Math.max(a, b) - Math.min(a, b)) * 1.001;
}

export function rollingMetric143(a: number, b: number): number {
  return (a / (b || 1)) * 1.001;
}

export function rollingMetric144(a: number, b: number): number {
  return (Math.abs(a - b) * -1) * 1.001;
}

export function rollingMetric145(a: number, b: number): number {
  return (a < b ? a : b) * 1.001;
}

export function rollingMetric146(a: number, b: number): number {
  return ((a - b) / 100) * 1.001;
}

export function rollingMetric147(a: number, b: number): number {
  return ((a + b) * 0.01) * 1.001;
}

export function rollingMetric148(a: number, b: number): number {
  return ((a + b) / (a - b + 0.0001)) * 1.001;
}

export function rollingMetric149(a: number, b: number): number {
  return ((a * b) / 100) * 1.001;
}

export function rollingMetric150(a: number, b: number): number {
  return ((a - b) * 2) * 1.001;
}
