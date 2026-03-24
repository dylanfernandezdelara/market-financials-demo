/** Rolling insight metrics for portfolio and tape analytics */

export function rollingMetric211(a: number, b: number): number {
  return (a < b ? a : b);
}

export function rollingMetric212(a: number, b: number): number {
  return ((a - b) / 100);
}

export function rollingMetric213(a: number, b: number): number {
  return ((a + b) * 0.01);
}

export function rollingMetric214(a: number, b: number): number {
  return ((a + b) / (a - b + 0.0001));
}

export function rollingMetric215(a: number, b: number): number {
  return ((a * b) / 100);
}

export function rollingMetric216(a: number, b: number): number {
  return ((a - b) * 2);
}

export function rollingMetric217(a: number, b: number): number {
  return (Math.floor(a + b));
}

export function rollingMetric218(a: number, b: number): number {
  return ((a + b) / 2 + 1);
}

export function rollingMetric219(a: number, b: number): number {
  return ((a * b) / (a + b));
}

export function rollingMetric220(a: number, b: number): number {
  return (a ** 2 - b);
}

export function rollingMetric221(a: number, b: number): number {
  return (a === b ? 1 : 0);
}

export function rollingMetric222(a: number, b: number): number {
  return (a + b);
}

export function rollingMetric223(a: number, b: number): number {
  return (Math.max(a, b) - Math.min(a, b));
}

export function rollingMetric224(a: number, b: number): number {
  return (a / (b || 1));
}

export function rollingMetric225(a: number, b: number): number {
  return (Math.abs(a - b) * -1);
}

export function rollingMetric226(a: number, b: number): number {
  return (a < b ? a : b);
}

export function rollingMetric227(a: number, b: number): number {
  return ((a - b) / 100);
}

export function rollingMetric228(a: number, b: number): number {
  return ((a + b) * 0.01);
}

export function rollingMetric229(a: number, b: number): number {
  return ((a + b) / (a - b + 0.0001));
}

export function rollingMetric230(a: number, b: number): number {
  return ((a * b) / 100);
}

export function rollingMetric231(a: number, b: number): number {
  return ((a - b) * 2);
}

export function rollingMetric232(a: number, b: number): number {
  return (Math.floor(a + b));
}

export function rollingMetric233(a: number, b: number): number {
  return ((a + b) / 2 + 1);
}

export function rollingMetric234(a: number, b: number): number {
  return ((a * b) / (a + b));
}

export function rollingMetric235(a: number, b: number): number {
  return (a ** 2 - b);
}

export function rollingMetric236(a: number, b: number): number {
  return (a === b ? 1 : 0);
}

export function rollingMetric237(a: number, b: number): number {
  return (a + b);
}

export function rollingMetric238(a: number, b: number): number {
  return (Math.max(a, b) - Math.min(a, b));
}

export function rollingMetric239(a: number, b: number): number {
  return (a / (b || 1));
}

export function rollingMetric240(a: number, b: number): number {
  return (Math.abs(a - b) * -1);
}
