import { useState } from 'react'
import { supabase } from './supabase'
import Navbar from './Navbar'

export default function Profile({ user, nav }) {
  const [name, setName] = useState(user?.email?.split('@')[0] || '')
  const [school, setSchool] = useState('')
  const [grade, setGrade] = useState('')
  const [saved, setSaved] = useState(false)
  const [notifications, setNotifications] = useState({ daily:true, weekly:true, exam:true })
  const [plan] = useState('free')

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  const inputStyle = { width:'100%', padding:'12px 14px', background:'rgba(18,18,31,0.8)', border:'1px solid rgba(191,90,242,0.15)', borderRadius:'10px', color:'#f0eeff', fontSize:'14px', outline:'none', boxSizing:'border-box', fontFamily:'sans-serif' }
  const card = { background:'rgba(13,13,24,0.8)', border:'1px solid rgba(191,90,242,0.15)', borderRadius:'16px', padding:'24px', marginBottom:'20px' }

  return (
    <div style={{ minHeight:'100vh', background:'#05050a', color:'#f0eeff', fontFamily:'sans-serif' }}>
      <Navbar user={user} nav={nav} current="profile"/>
      <div style={{ maxWidth:'700px', margin:'0 auto', padding:'32px 24px' }}>
        <h1 style={{ fontSize:'28px', fontWeight:'800', marginBottom:'6px' }}>Profile & Settings 👤</h1>
        <p style={{ color:'#7a7a9a', fontSize:'14px', marginBottom:'32px' }}>Manage your account and preferences.</p>

        {/* Avatar + info */}
        <div style={{ ...card, display:'flex', alignItems:'center', gap:'20px' }}>
          <div style={{ width:'72px', height:'72px', background:'rgba(191,90,242,0.15)', border:'2px solid rgba(191,90,242,0.3)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'32px', flexShrink:0 }}>🎓</div>
          <div>
            <div style={{ fontSize:'18px', fontWeight:'800', marginBottom:'4px' }}>{name || user?.email?.split('@')[0]}</div>
            <div style={{ fontSize:'13px', color:'#7a7a9a', marginBottom:'8px' }}>{user?.email}</div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:'6px', background: plan==='free'?'rgba(255,159,10,0.1)':'rgba(48,209,88,0.1)', border:`1px solid ${plan==='free'?'rgba(255,159,10,0.2)':'rgba(48,209,88,0.2)'}`, borderRadius:'20px', padding:'4px 12px', fontSize:'11px', color:plan==='free'?'#ff9f0a':'#30d158', letterSpacing:'1px' }}>
              {plan==='free' ? '⚡ FREE PLAN' : '✨ STUDENT PLAN'}
            </div>
          </div>
        </div>

        {/* Personal Info */}
        <div style={card}>
          <div style={{ fontSize:'14px', fontWeight:'700', marginBottom:'20px', color:'#bf5af2', letterSpacing:'1px' }}>PERSONAL INFO</div>
          <div style={{ marginBottom:'14px' }}>
            <label style={{ fontSize:'12px', color:'#7a7a9a', display:'block', marginBottom:'6px' }}>Display name</label>
            <input type="text" value={name} onChange={e=>setName(e.target.value)} style={inputStyle}
              onFocus={e=>e.target.style.borderColor='rgba(191,90,242,0.6)'} onBlur={e=>e.target.style.borderColor='rgba(191,90,242,0.15)'}
            />
          </div>
          <div style={{ marginBottom:'14px' }}>
            <label style={{ fontSize:'12px', color:'#7a7a9a', display:'block', marginBottom:'6px' }}>School / University</label>
            <input type="text" placeholder="e.g. University of the Philippines" value={school} onChange={e=>setSchool(e.target.value)} style={inputStyle}
              onFocus={e=>e.target.style.borderColor='rgba(191,90,242,0.6)'} onBlur={e=>e.target.style.borderColor='rgba(191,90,242,0.15)'}
            />
          </div>
          <div style={{ marginBottom:'20px' }}>
            <label style={{ fontSize:'12px', color:'#7a7a9a', display:'block', marginBottom:'6px' }}>Year level / Grade</label>
            <select value={grade} onChange={e=>setGrade(e.target.value)} style={{ ...inputStyle, cursor:'pointer' }}>
              <option value="">Select year level</option>
              <option>Grade 7</option><option>Grade 8</option><option>Grade 9</option><option>Grade 10</option>
              <option>Grade 11</option><option>Grade 12</option>
              <option>1st Year College</option><option>2nd Year College</option>
              <option>3rd Year College</option><option>4th Year College</option>
            </select>
          </div>
          <button onClick={handleSave} style={{ padding:'12px 28px', background:'linear-gradient(135deg,#bf5af2,#7c3aed)', color:'#fff', border:'none', borderRadius:'10px', fontSize:'14px', fontWeight:'700', cursor:'pointer', letterSpacing:'1px' }}>
            {saved ? '✅ Saved!' : 'Save Changes'}
          </button>
        </div>

        {/* Notifications */}
        <div style={card}>
          <div style={{ fontSize:'14px', fontWeight:'700', marginBottom:'20px', color:'#bf5af2', letterSpacing:'1px' }}>NOTIFICATIONS</div>
          {[
            { key:'daily',  label:'Daily study reminders',    desc:'Get reminded about your daily tasks every morning' },
            { key:'weekly', label:'Weekly progress report',   desc:'Receive a weekly summary of your study progress'   },
            { key:'exam',   label:'Exam countdown alerts',    desc:'Get alerts 7, 3, and 1 day before your exams'      },
          ].map(n => (
            <div key={n.key} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 0', borderBottom:'1px solid rgba(191,90,242,0.08)' }}>
              <div>
                <div style={{ fontSize:'14px', fontWeight:'600', marginBottom:'3px' }}>{n.label}</div>
                <div style={{ fontSize:'12px', color:'#7a7a9a' }}>{n.desc}</div>
              </div>
              <div onClick={()=>setNotifications(prev=>({...prev,[n.key]:!prev[n.key]}))}
                style={{ width:'44px', height:'24px', borderRadius:'12px', background:notifications[n.key]?'#bf5af2':'rgba(255,255,255,0.1)', position:'relative', cursor:'pointer', flexShrink:0, transition:'background .2s' }}>
                <div style={{ position:'absolute', top:'3px', left:notifications[n.key]?'23px':'3px', width:'18px', height:'18px', background:'#fff', borderRadius:'50%', transition:'left .2s' }}/>
              </div>
            </div>
          ))}
        </div>

        {/* Plan */}
        <div style={card}>
          <div style={{ fontSize:'14px', fontWeight:'700', marginBottom:'16px', color:'#bf5af2', letterSpacing:'1px' }}>YOUR PLAN</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
            <div style={{ background:'rgba(255,159,10,0.08)', border:'2px solid rgba(255,159,10,0.3)', borderRadius:'12px', padding:'20px' }}>
              <div style={{ fontSize:'12px', letterSpacing:'2px', color:'#ff9f0a', marginBottom:'8px' }}>FREE</div>
              <div style={{ fontSize:'24px', fontWeight:'800', marginBottom:'4px' }}>$0<span style={{ fontSize:'13px', fontWeight:'400', color:'#7a7a9a' }}>/mo</span></div>
              <div style={{ fontSize:'12px', color:'#7a7a9a', lineHeight:'1.6' }}>5 lecture uploads/month · Basic notes · 1 study plan</div>
              <div style={{ marginTop:'12px', fontSize:'11px', color:'#ff9f0a', letterSpacing:'1px' }}>✓ CURRENT PLAN</div>
            </div>
            <div style={{ background:'rgba(191,90,242,0.08)', border:'1px solid rgba(191,90,242,0.2)', borderRadius:'12px', padding:'20px', cursor:'pointer' }}
              onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(191,90,242,0.5)'}
              onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(191,90,242,0.2)'}
            >
              <div style={{ fontSize:'12px', letterSpacing:'2px', color:'#bf5af2', marginBottom:'8px' }}>STUDENT</div>
              <div style={{ fontSize:'24px', fontWeight:'800', marginBottom:'4px' }}>$5<span style={{ fontSize:'13px', fontWeight:'400', color:'#7a7a9a' }}>/mo</span></div>
              <div style={{ fontSize:'12px', color:'#7a7a9a', lineHeight:'1.6' }}>Unlimited uploads · Advanced AI notes · Daily coaching</div>
              <div style={{ marginTop:'12px', padding:'7px', background:'linear-gradient(135deg,#bf5af2,#7c3aed)', borderRadius:'8px', textAlign:'center', fontSize:'12px', fontWeight:'700', color:'#fff', letterSpacing:'1px' }}>
                UPGRADE →
              </div>
            </div>
          </div>
        </div>

        {/* Danger zone */}
        <div style={{ ...card, borderColor:'rgba(255,55,95,0.15)' }}>
          <div style={{ fontSize:'14px', fontWeight:'700', marginBottom:'16px', color:'#ff375f', letterSpacing:'1px' }}>ACCOUNT</div>
          <div style={{ display:'flex', gap:'12px' }}>
            <button onClick={handleSignOut} style={{ padding:'10px 20px', background:'rgba(255,55,95,0.08)', border:'1px solid rgba(255,55,95,0.2)', borderRadius:'10px', color:'#ff375f', fontSize:'13px', cursor:'pointer' }}>
              Sign out
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
