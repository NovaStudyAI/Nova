import { supabase } from './supabase'

export default function Navbar({ user, nav, current }) {
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  const links = [
    { id:'dashboard', label:'Dashboard', icon:'🏠' },
    { id:'upload',    label:'Upload',    icon:'⬆️' },
    { id:'notes',     label:'Notes',     icon:'📝' },
    { id:'studyplan', label:'Study Plan',icon:'📅' },
    { id:'profile',   label:'Profile',   icon:'👤' },
  ]

  return (
    <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 32px', background:'rgba(13,13,24,0.95)', borderBottom:'1px solid rgba(191,90,242,0.15)', backdropFilter:'blur(16px)', position:'sticky', top:0, zIndex:100, fontFamily:'sans-serif' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'32px' }}>
        <div style={{ fontSize:'18px', fontWeight:'800', color:'#bf5af2', letterSpacing:'6px', cursor:'pointer' }} onClick={()=>nav('dashboard')}>NOVA</div>
        <div style={{ display:'flex', gap:'4px' }}>
          {links.map(l => (
            <button key={l.id} onClick={()=>nav(l.id)}
              style={{ padding:'7px 14px', borderRadius:'8px', border:'none', background: current===l.id ? 'rgba(191,90,242,0.15)' : 'transparent', color: current===l.id ? '#bf5af2' : '#7a7a9a', fontSize:'13px', cursor:'pointer', display:'flex', alignItems:'center', gap:'6px', transition:'all .2s' }}
              onMouseEnter={e=>{ if(current!==l.id) e.currentTarget.style.color='#f0eeff' }}
              onMouseLeave={e=>{ if(current!==l.id) e.currentTarget.style.color='#7a7a9a' }}
            >
              <span style={{ fontSize:'14px' }}>{l.icon}</span> {l.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
        <div style={{ fontSize:'12px', color:'#7a7a9a', background:'rgba(191,90,242,0.08)', border:'1px solid rgba(191,90,242,0.15)', borderRadius:'20px', padding:'4px 12px' }}>
          {user?.email}
        </div>
        <button onClick={handleSignOut} style={{ fontSize:'12px', color:'#ff375f', cursor:'pointer', padding:'5px 12px', border:'1px solid rgba(255,55,95,0.2)', borderRadius:'20px', background:'rgba(255,55,95,0.05)' }}>
          Sign out
        </button>
      </div>
    </nav>
  )
}
