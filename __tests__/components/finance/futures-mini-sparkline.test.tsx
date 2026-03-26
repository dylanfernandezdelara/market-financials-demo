import { render } from "@testing-library/react";
import { FuturesMiniSparkline } from "@/components/finance/futures-mini-sparkline";

function getPathDs(container: HTMLElement) {
  const paths = container.querySelectorAll("path");
  return {
    area: paths[0]?.getAttribute("d") ?? "",
    line: paths[1]?.getAttribute("d") ?? "",
  };
}

describe("FuturesMiniSparkline", () => {
  it("renders an SVG with two path elements", () => {
    const { container } = render(
      <FuturesMiniSparkline values={[1, 2, 3]} positive gradientId="basic" />,
    );
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(container.querySelectorAll("path")).toHaveLength(2);
  });

  it("uses green stroke when positive is true", () => {
    const { container } = render(
      <FuturesMiniSparkline values={[1, 2]} positive gradientId="pos" />,
    );
    const linePath = container.querySelectorAll("path")[1];
    expect(linePath?.getAttribute("stroke")).toBe("#22c55e");
  });

  it("uses red stroke when positive is false", () => {
    const { container } = render(
      <FuturesMiniSparkline values={[2, 1]} positive={false} gradientId="neg" />,
    );
    const linePath = container.querySelectorAll("path")[1];
    expect(linePath?.getAttribute("stroke")).toBe("#ef4444");
  });

  it("handles a single-value array without crashing", () => {
    const { container } = render(
      <FuturesMiniSparkline values={[42]} positive gradientId="single" />,
    );
    const { line } = getPathDs(container);
    // Single point: x = 0 / max(0,1) * 200 = 0, y is computed from range=1
    expect(line).toMatch(/^M\s/);
    expect(container.querySelectorAll("path")).toHaveLength(2);
  });

  it("handles all identical values (zero range)", () => {
    const { container } = render(
      <FuturesMiniSparkline values={[5, 5, 5, 5]} positive gradientId="flat" />,
    );
    const { line } = getPathDs(container);
    // All y-values should be the same since range falls back to 1
    const points = line.split(/[ML]\s*/).filter(Boolean);
    const yValues = points.map((p) => parseFloat(p.trim().split(/\s+/)[1]));
    const uniqueY = new Set(yValues);
    expect(uniqueY.size).toBe(1);
  });

  it("handles negative values correctly", () => {
    const { container } = render(
      <FuturesMiniSparkline values={[-10, -5, -20]} positive={false} gradientId="negvals" />,
    );
    const { line } = getPathDs(container);
    // Should produce valid path with M and L commands
    expect(line).toMatch(/^M\s/);
    expect(line).toContain("L");
  });

  it("handles mixed positive and negative values", () => {
    const { container } = render(
      <FuturesMiniSparkline values={[-3, 0, 5, -1, 2]} positive gradientId="mixed" />,
    );
    const { line } = getPathDs(container);
    const segments = line.split(/\sL\s/);
    // 5 values → 1 M + 4 L segments
    expect(segments).toHaveLength(5);
  });

  it("closes area path correctly with L w h L 0 h Z suffix", () => {
    const { container } = render(
      <FuturesMiniSparkline values={[1, 3, 2]} positive gradientId="area" />,
    );
    const { area } = getPathDs(container);
    // Area path should end with "L 200 48 L 0 48 Z"
    expect(area).toMatch(/L 200 48 L 0 48 Z$/);
  });

  it("spaces x-coordinates evenly for multiple values", () => {
    const values = [10, 20, 30, 40, 50];
    const { container } = render(
      <FuturesMiniSparkline values={values} positive gradientId="even" />,
    );
    const { line } = getPathDs(container);
    const points = line.split(/[ML]\s*/).filter(Boolean);
    const xValues = points.map((p) => parseFloat(p.trim().split(/\s+/)[0]));
    // x should be evenly spaced: 0, 50, 100, 150, 200
    expect(xValues[0]).toBe(0);
    expect(xValues[xValues.length - 1]).toBe(200);
    const step = xValues[1] - xValues[0];
    for (let i = 2; i < xValues.length; i++) {
      expect(xValues[i] - xValues[i - 1]).toBeCloseTo(step, 5);
    }
  });

  it("sanitizes special characters in gradientId", () => {
    const { container } = render(
      <FuturesMiniSparkline values={[1, 2]} positive gradientId="a<b>c&d" />,
    );
    const gradient = container.querySelector("linearGradient");
    // Special chars <, >, & should be stripped
    expect(gradient?.getAttribute("id")).toBe("spark-fill-abcd");
  });

  it("preserves hyphens and underscores in gradientId", () => {
    const { container } = render(
      <FuturesMiniSparkline values={[1, 2]} positive gradientId="my-id_01" />,
    );
    const gradient = container.querySelector("linearGradient");
    expect(gradient?.getAttribute("id")).toBe("spark-fill-my-id_01");
  });

  it("handles two values (minimal line)", () => {
    const { container } = render(
      <FuturesMiniSparkline values={[0, 10]} positive gradientId="two" />,
    );
    const { line } = getPathDs(container);
    // Two values: M x0 y0 L x1 y1
    expect(line).toMatch(/^M\s[\d.]+\s[\d.]+ L [\d.]+\s[\d.]+$/);
  });

  it("maps min value to bottom and max value to top of the chart", () => {
    const { container } = render(
      <FuturesMiniSparkline values={[0, 100]} positive gradientId="minmax" />,
    );
    const { line } = getPathDs(container);
    const points = line.split(/[ML]\s*/).filter(Boolean);
    const yValues = points.map((p) => parseFloat(p.trim().split(/\s+/)[1]));
    // h=48, pad=4: min → y = 48-4 = 44, max → y = 4
    expect(yValues[0]).toBeCloseTo(44, 5); // value 0 (min) → bottom
    expect(yValues[1]).toBeCloseTo(4, 5);  // value 100 (max) → top
  });

  it("handles a large array of values", () => {
    const values = Array.from({ length: 200 }, (_, i) => Math.sin(i / 10) * 50);
    const { container } = render(
      <FuturesMiniSparkline values={values} positive gradientId="large" />,
    );
    const { line } = getPathDs(container);
    const segments = line.split(/\sL\s/);
    expect(segments).toHaveLength(200);
  });
});
