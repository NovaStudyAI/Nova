import { useState } from 'react'
import { supabase } from './supabase'

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#EA4335" d="M5.26 9.77A7.24 7.24 0 0 1 12 4.75c1.73 0 3.3.63 4.52 1.66l3.37-3.37A11.94 11.94 0 0 0 12 .75C7.57.75 3.73 3.2 1.74 6.82l3.52 2.95Z"/>
    <path fill="#34A853" d="M16.04 18.01A7.22 7.22 0 0 1 12 19.25c-2.95 0-5.48-1.77-6.7-4.34l-3.54 2.9C3.77 21.84 7.58 24.25 12 24.25c3.18 0 6.08-1.17 8.28-3.1l-4.24-3.14Z"/>
    <path fill="#FBBC05" d="M19.25 12c0-.72-.1-1.42-.27-2.09H12v4.09h4.08a3.77 3.77 0 0 1-1.66 2.4l4.25 3.14c2.43-2.26 3.84-5.6 3.84-7.54Z"/>
    <path fill="#4285F4" d="M1.74 6.82A11.93 11.93 0 0 0 .75 12c0 1.84.42 3.57 1.16 5.12l3.4-2.66A7.17 7.17 0 0 1 4.75 12c0-.6.09-1.18.23-1.74L1.74 6.82Z"/>
  </svg>
)
const DiscordIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#5865F2" d="M20.32 4.37A19.8 19.8 0 0 0 15.43 3c-.21.38-.46.9-.63 1.3a18.3 18.3 0 0 0-5.6 0A13.4 13.4 0 0 0 8.56 3a19.74 19.74 0 0 0-4.9 1.38C.53 8.8-.32 13.1.1 17.35a19.9 19.9 0 0 0 6.07 3.08c.49-.67.93-1.38 1.3-2.13a13 13 0 0 1-2.04-.99c.17-.12.34-.25.5-.38a14.1 14.1 0 0 0 12.13 0c.17.13.33.26.5.38-.65.39-1.33.72-2.04.99.37.75.8 1.46 1.3 2.13a19.84 19.84 0 0 0 6.07-3.08c.5-5.04-.85-9.3-3.57-13Zm-13.2 10.4c-1.2 0-2.2-1.12-2.2-2.5s.97-2.5 2.2-2.5c1.22 0 2.22 1.11 2.2 2.5 0 1.38-.97 2.5-2.2 2.5Zm8.17 0c-1.2 0-2.2-1.12-2.2-2.5s.97-2.5 2.2-2.5c1.22 0 2.22 1.11 2.2 2.5 0 1.38-.96 2.5-2.2 2.5Z"/>
  </svg>
)
const GitHubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#f0eeff" d="M12 .3a12 12 0 0 0-3.79 23.4c.6.1.82-.26.82-.58v-2.17c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.08-.73.08-.73 1.2.09 1.83 1.24 1.83 1.24 1.07 1.83 2.8 1.3 3.48 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.21.69.82.57A12 12 0 0 0 12 .3Z"/>
  </svg>
)

const input = { width:'100%', padding:'13px 16px', background:'rgba(18,18,31,0.8)', border:'1px solid rgba(191,90,242,0.15)', borderRadius:'10px', color:'#f0eeff', fontSize:'14px', outline:'none', boxSizing:'border-box' }

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)

  const socials = [
    { label:'Google',  Icon:GoogleIcon,  provider:'google'  },
    { label:'Discord', Icon:DiscordIcon, provider:'discord' },
    { label:'GitHub',  Icon:GitHubIcon,  provider:'github'  },
  ]

  const handleAuth = async () => {
    if (!email || !password) return setMessage('❌ Please fill in all fields.')
    setLoading(true); setMessage('')
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setMessage('✅ Account created! You can now sign in.')
        setIsSignUp(false)
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        onLogin(data.user)
      }
    } catch (err) { setMessage('❌ ' + err.message) }
    setLoading(false)
  }

  const handleSocial = async (provider) => {
    const { error } = await supabase.auth.signInWithOAuth({ provider })
    if (error) setMessage('❌ ' + error.message)
  }

  return (
    <div style={{ minHeight:'100vh', background:'#05050a', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'sans-serif', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(191,90,242,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(191,90,242,.04) 1px,transparent 1px)', backgroundSize:'60px 60px' }}/>
      <div style={{ position:'absolute', width:'500px', height:'500px', background:'radial-gradient(circle,#bf5af2,transparent)', borderRadius:'50%', filter:'blur(80px)', opacity:.2, top:'-150px', left:'50%', transform:'translateX(-50%)' }}/>
      <div style={{ position:'absolute', width:'300px', height:'300px', background:'radial-gradient(circle,#7c3aed,transparent)', borderRadius:'50%', filter:'blur(80px)', opacity:.15, bottom:'-50px', right:'10%' }}/>
      <div style={{ position:'absolute', width:'200px', height:'200px', background:'radial-gradient(circle,#0a84ff,transparent)', borderRadius:'50%', filter:'blur(80px)', opacity:.15, bottom:'20%', left:'5%' }}/>

      <div style={{ background:'rgba(13,13,24,0.9)', border:'1px solid rgba(191,90,242,0.2)', borderRadius:'20px', padding:'44px 40px', width:'100%', maxWidth:'440px', textAlign:'center', position:'relative', backdropFilter:'blur(20px)', boxShadow:'0 0 60px rgba(191,90,242,0.08)', zIndex:1 }}>
        <div style={{ position:'absolute', top:0, left:'20%', right:'20%', height:'1px', background:'linear-gradient(90deg,transparent,#bf5af2,transparent)' }}/>

        <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', background:'rgba(191,90,242,.1)', border:'1px solid rgba(191,90,242,0.2)', borderRadius:'20px', padding:'5px 14px', fontSize:'11px', color:'#bf5af2', letterSpacing:'1px', marginBottom:'20px' }}>
          <div style={{ width:'6px', height:'6px', background:'#bf5af2', borderRadius:'50%', animation:'pulse 2s infinite' }}/>
          AI STUDY COMPANION
        </div>

        <h1 style={{ color:'#bf5af2', letterSpacing:'8px', fontSize:'36px', marginBottom:'8px', fontWeight:'800' }}>NOVA</h1>
        <p style={{ color:'#7a7a9a', marginBottom:'28px', fontSize:'14px', lineHeight:'1.6' }}>
          {isSignUp ? "Create your free account" : "Welcome back — let's get studying!"}
        </p>

        <input type="email" placeholder="Email address" value={email} onChange={e=>setEmail(e.target.value)} style={{ ...input, marginBottom:'12px' }}
          onFocus={e=>e.target.style.borderColor='rgba(191,90,242,0.6)'}
          onBlur={e=>e.target.style.borderColor='rgba(191,90,242,0.15)'}
        />
        <input type="password" placeholder="Password (min 6 characters)" value={password} onChange={e=>setPassword(e.target.value)} style={{ ...input, marginBottom:'8px' }}
          onFocus={e=>e.target.style.borderColor='rgba(191,90,242,0.6)'}
          onBlur={e=>e.target.style.borderColor='rgba(191,90,242,0.15)'}
        />

        {!isSignUp && (
          <div style={{ textAlign:'right', marginBottom:'16px' }}>
            <span style={{ color:'#bf5af2', fontSize:'12px', cursor:'pointer' }}>Forgot password?</span>
          </div>
        )}

        {message && (
          <div style={{ padding:'10px 14px', borderRadius:'8px', fontSize:'13px', marginBottom:'16px', marginTop:'8px', background:message.startsWith('✅')?'rgba(48,209,88,0.1)':'rgba(255,55,95,0.1)', color:message.startsWith('✅')?'#30d158':'#ff375f', border:`1px solid ${message.startsWith('✅')?'rgba(48,209,88,0.2)':'rgba(255,55,95,0.2)'}` }}>
            {message}
          </div>
        )}

        <button onClick={handleAuth} disabled={loading}
          style={{ width:'100%', padding:'14px', background:'linear-gradient(135deg,#bf5af2,#7c3aed)', color:'#fff', border:'none', borderRadius:'10px', fontSize:'14px', fontWeight:'700', letterSpacing:'2px', cursor:'pointer', marginBottom:'20px', marginTop:'8px', boxShadow:'0 4px 20px rgba(191,90,242,0.3)', opacity:loading?.7:1 }}
          onMouseEnter={e=>e.target.style.opacity='.85'} onMouseLeave={e=>e.target.style.opacity='1'}
        >
          {loading ? 'LOADING...' : isSignUp ? 'CREATE ACCOUNT' : 'SIGN IN'}
        </button>

        <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'16px' }}>
          <div style={{ flex:1, height:'1px', background:'rgba(191,90,242,0.1)' }}/>
          <span style={{ color:'#7a7a9a', fontSize:'12px' }}>or continue with</span>
          <div style={{ flex:1, height:'1px', background:'rgba(191,90,242,0.1)' }}/>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'8px', marginBottom:'24px' }}>
          {socials.map((s,i) => (
            <button key={i} onClick={()=>handleSocial(s.provider)}
              style={{ padding:'11px 8px', background:'rgba(18,18,31,0.8)', color:'#f0eeff', border:'1px solid rgba(191,90,242,0.15)', borderRadius:'10px', fontSize:'12px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'6px' }}
              onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(191,90,242,0.5)'}
              onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(191,90,242,0.15)'}
            >
              <s.Icon/> {s.label}
            </button>
          ))}
        </div>

        <p style={{ color:'#7a7a9a', fontSize:'13px' }}>
          {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          <span onClick={()=>{setIsSignUp(!isSignUp);setMessage('')}} style={{ color:'#bf5af2', cursor:'pointer', fontWeight:'600' }}>
            {isSignUp ? 'Sign in' : 'Sign up free'}
          </span>
        </p>
        <div style={{ position:'absolute', bottom:0, left:'30%', right:'30%', height:'1px', background:'linear-gradient(90deg,transparent,rgba(191,90,242,0.3),transparent)' }}/>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.4)}} input::placeholder{color:#555}`}</style>
    </div>
  )
}
