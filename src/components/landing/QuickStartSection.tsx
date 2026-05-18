import { colors, fonts, sectionStyle, h2Style, eyebrowStyle } from './tokens'

const codeSnippet = `from infrared_sdk import InfraredClient
from infrared_sdk.analyses.types import WindModelRequest, AnalysesName

polygon = {"type": "Polygon", "coordinates": [[[11.57, 48.19], [11.58, 48.19], [11.58, 48.20], [11.57, 48.20], [11.57, 48.19]]]}

with InfraredClient() as client:
    area = client.buildings.get_area(polygon)
    result = client.run_area_and_wait(
        WindModelRequest(analysis_type=AnalysesName.wind_speed, wind_speed=15, wind_direction=180),
        polygon, buildings=area.buildings,
    )
print(result.merged_grid)  # numpy array, m/s`

const labelStyle = {
  fontFamily: fonts.mono,
  fontSize: 12,
  color: colors.text,
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
  marginBottom: 8,
}

export function QuickStartSection() {
  return (
    <section className="scroll-animate" style={sectionStyle}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={eyebrowStyle}>SDK quick-start</div>
        <h2 style={h2Style}>5 lines. One simulation.</h2>
        <p style={{ color: colors.text, maxWidth: 640, margin: '12px auto 0', fontSize: 15, lineHeight: 1.6 }}>
          Install, point at a polygon, get a numpy array back.
        </p>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={labelStyle}>$ install</div>
        <pre style={{ marginBottom: 20 }}>
          <span style={{ color: colors.cyan }}>pip install infrared-sdk</span>
        </pre>

        <div style={labelStyle}>$ run</div>
        <pre>{codeSnippet}</pre>
      </div>
    </section>
  )
}
