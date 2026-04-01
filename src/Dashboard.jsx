import { useState, useEffect } from 'react'
import Navbar from './Navbar'

export default function Dashboard({ user, nav, setSelectedNote }) {
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    const h = new Date().getHours()
    if (h < 12) setGreeting('Good morning')
    else if (h < 18) setGreeting('Good afternoon')
    else setGreeting('Good evening')
  }, [])

  const studies = [
    { subject:'Mathematics', progress:72, topics:18, done:13, color:'#bf5af2', exam:'Apr 15' },
    { subject:'Physics',     progress:45, topics:20, done:9,  color:'#0a84ff', exam:'Apr 22' },
    { subject:'History',     progress:90, topics:10, done:9,  color:'#30d158', exam:'Apr 10' },
  ]

  const notes = [
    { id:1, title:'Calculus — Derivatives & Integrals', date:'Today',      pages:4, subject:'Mathematics' },
    { id:2, title:"Newton's Laws of Motion",            date:'Yesterday',   pages:3, subject:'Physics'     },
    { id:3, title:'World War II — Key Events',          date:'2 days ago',  pages:5, subject:'History'     },
  ]

  const tasks = [
    { task:'Review Derivatives (Math)',      done:true,  subject:'Mathematics' },
    { task:'Read Chapter 4 — Forces',        done:false, subject:'Physics'     },
    { task:'Flashcards — WWII Battles',      done:false, subject:'History'     },
    { task:'Practice Integration problems',  done:false, subject:'Mathematics' },
  ]

  const [taskList, setTaskList] = useState(tasks)
  const toggleTask = (i) => setTaskList(t => t.map((x,idx) => idx===i ? {...x, done:!x.done} : x))

  const card = { background:'rgba(13,13,24,0.8)', border:'1px solid rgba(191,90,242,0.15)', borderRadius:'16px', padding:'24px', position:'relative', overflow:'hidden' }

  return (
    <div style={{ minHeight:'100vh', background:'#05050a', color:'#f0eeff', fontFamily:'sans-serif' }}>
      <Navbar user={user} nav={nav} current="dashboard"/>
      <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'32px 24px' }}>

        {/* Greeting */}
        <div style={{ marginBottom:'28px' }}>
          <h1 style={{ fontSize:'28px', fontWeight:'800', marginBottom:'6px' }}>
            {greeting}, {user?.email?.split('@')[0]} 👋
          </h1>
          <p style={{ color:'#7a7a9a', fontSize:'14px' }}>
            You have <span style={{ color:'#bf5af2', fontWeight:'600' }}>{taskList.filter(t=>!t.done).length} tasks</span> left today. Keep going! 🚀
          </p>
        </div>

        {/* Upload Button */}
        <button onClick={()=>nav('upload')} style={{ width:'100%', padding:'18px', background:'linear-gradient(135deg,#bf5af2,#7c3aed)', color:'#fff', border:'none', borderRadius:'12px', fontSize:'15px', fontWeight:'700', letterSpacing:'1.5px', cursor:'pointer', marginBottom:'24px', boxShadow:'0 4px 24px rgba(191,90,242,0.3)', display:'flex', alignItems:'center', justifyContent:'center', gap:'10px' }}
          onMouseEnter={e=>e.currentTarget.style.opacity='.85'} onMouseLeave={e=>e.currentTarget.style.opacity='1'}
        >
          ⬆️ UPLOAD A LECTURE — Generate Notes Instantly
        </button>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'16px', marginBottom:'24px' }}>
          {[
            { label:'LECTURES UPLOADED', value:'7',      icon:'🎙️' },
            { label:'NOTES GENERATED',   value:'24',     icon:'📝' },
            { label:'STUDY STREAK',      value:'5 days', icon:'🔥' },
          ].map((s,i) => (
            <div key={i} style={card}>
              <div style={{ position:'absolute', top:0, left:'15%', right:'15%', height:'1px', background:'linear-gradient(90deg,transparent,#bf5af2,transparent)' }}/>
              <div style={{ fontSize:'28px', marginBottom:'10px' }}>{s.icon}</div>
              <div style={{ fontSize:'34px', fontWeight:'800', color:'#bf5af2', marginBottom:'4px' }}>{s.value}</div>
              <div style={{ fontSize:'11px', letterSpacing:'2px', color:'#7a7a9a' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Study Plans + Tasks */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', marginBottom:'24px' }}>
          {/* Study Plans */}
          <div>
            <div style={{ fontSize:'16px', fontWeight:'700', marginBottom:'16px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              📚 Study Plans
              <span onClick={()=>nav('studyplan')} style={{ fontSize:'12px', color:'#bf5af2', cursor:'pointer' }}>View all →</span>
            </div>
            {studies.map((s,i) => (
              <div key={i} style={{ background:'rgba(13,13,24,0.8)', border:'1px solid rgba(191,90,242,0.15)', borderRadius:'14px', padding:'18px', marginBottom:'10px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px' }}>
                  <div>
                    <div style={{ fontSize:'14px', fontWeight:'600' }}>{s.subject}</div>
                    <div style={{ fontSize:'11px', color:'#7a7a9a', marginTop:'2px' }}>Exam: {s.exam} · {s.done}/{s.topics} topics</div>
                  </div>
                  <div style={{ fontSize:'13px', fontWeight:'700', color:s.color }}>{s.progress}%</div>
                </div>
                <div style={{ height:'6px', background:'rgba(255,255,255,0.05)', borderRadius:'20px', overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${s.progress}%`, background:s.color, borderRadius:'20px' }}/>
                </div>
              </div>
            ))}
            <button onClick={()=>nav('studyplan')} style={{ width:'100%', padding:'12px', background:'transparent', border:'1px dashed rgba(191,90,242,0.25)', borderRadius:'12px', color:'#7a7a9a', fontSize:'13px', cursor:'pointer' }}>
              + Add new study plan
            </button>
          </div>

          {/* Today's Tasks */}
          <div>
            <div style={{ fontSize:'16px', fontWeight:'700', marginBottom:'16px' }}>✅ Today's Tasks</div>
            {taskList.map((t,i) => (
              <div key={i} onClick={()=>toggleTask(i)} style={{ background:'rgba(13,13,24,0.8)', border:'1px solid rgba(191,90,242,0.15)', borderRadius:'14px', padding:'14px 18px', marginBottom:'8px', display:'flex', alignItems:'center', gap:'14px', cursor:'pointer', opacity:t.done?.6:1 }}>
                <div style={{ width:'20px', height:'20px', borderRadius:'6px', border:`1.5px solid ${t.done?'#bf5af2':'rgba(191,90,242,0.4)'}`, background:t.done?'#bf5af2':'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  {t.done && <span style={{ color:'#000', fontSize:'12px', fontWeight:'700' }}>✓</span>}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:'13px', color:t.done?'#7a7a9a':'#f0eeff', textDecoration:t.done?'line-through':'none' }}>{t.task}</div>
                  <div style={{ fontSize:'11px', color:'#7a7a9a', marginTop:'2px' }}>{t.subject}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Notes */}
        <div style={{ fontSize:'16px', fontWeight:'700', marginBottom:'16px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          📄 Recent Notes
          <span onClick={()=>nav('notes')} style={{ fontSize:'12px', color:'#bf5af2', cursor:'pointer' }}>View all →</span>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'12px' }}>
          {notes.map((n,i) => (
            <div key={i} onClick={()=>{ setSelectedNote(n); nav('notes') }}
              style={{ background:'rgba(13,13,24,0.8)', border:'1px solid rgba(191,90,242,0.15)', borderRadius:'14px', padding:'16px', display:'flex', alignItems:'center', gap:'16px', cursor:'pointer' }}
              onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(191,90,242,0.4)'}
              onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(191,90,242,0.15)'}
            >
              <div style={{ width:'42px', height:'42px', background:'rgba(191,90,242,0.1)', border:'1px solid rgba(191,90,242,0.2)', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px', flexShrink:0 }}>📝</div>
              <div>
                <div style={{ fontSize:'13px', fontWeight:'600', marginBottom:'4px', lineHeight:'1.4' }}>{n.title}</div>
                <div style={{ fontSize:'11px', color:'#7a7a9a' }}>{n.subject} · {n.pages} pages · {n.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
