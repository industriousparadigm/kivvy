import { ImageResponse } from 'next/og'

// Image metadata
export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'

// Image generation
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 64,
          background: 'linear-gradient(135deg, #F43F5E 0%, #F59E0B 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: '20px',
          fontWeight: 'bold',
          fontFamily: 'system-ui',
          boxShadow: '0 10px 30px rgba(244, 63, 94, 0.3)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <div style={{ fontSize: '72px' }}>K</div>
          <div style={{ fontSize: '16px', fontWeight: 'normal' }}>KIVVY</div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}