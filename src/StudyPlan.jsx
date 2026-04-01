import { useState } from 'react'
import Navbar from './Navbar'

const plans = [
  {
    id:1, subject:'Mathematics', exam:'Apr 15 2026', progress:72, color:'#bf5af2',
    topics:[
      { name:'Derivatives & Power Rule',     done:true  },
      { name:'Chain Rule & Product Rule',    done:true  },
      { name:'Integration Basics',           done:true  },
      { name:'Integration by Parts',         done:false },
      { name:'Limits & Continuity',          done:false },
      { name:'Practice Exam Problems',       done:false },
    ]
  },
  {
    id:2, subject:'Physics', exam:'Apr 22 2026', progress:45, color:'#0a84ff',
    topics:[
      { name:"Newton's Laws of Motion",      done:true  },
      { name:'Kinematics & Projectiles',     done:true  },
      { name:'Work, Energy & Power',         done:false },
      { name:'Waves & Oscillations',         done:false },
      { name:'Thermodynamics',               done:false },
      { name:'Practice Problems',            done:false },
    ]
  },
  {
    id:3, subject:'History', exam:'Apr 10 2026', progress:90, color:'#30d158',
    topics:[
      { name:'WWI Causes & Events',          done:true  },
      { name:'Rise of Fascism',              done:true  },
      { name:'WWII Major Battles',           done:true  },
      { name:'Cold War Overview',            done:true  },
      { name:'Review & Flashcards',          done:false },
    ]
  },
]

const today = ['Review Integration by Parts (Math)', "Study Work & Energy (Physics)", 'Cold War flashcards (History)', 'Practice Math exam questions']
const week = [
  { day:'Mon', tasks:['Derivatives Review','Newton\'s Laws'] },
  { day:'Tue', tasks:['Integration Basics','Kinematics']     },
  { day:'Wed', tasks:['Chain Rule','Work & Energy']          },
  { day:'Thu', tasks:['WWI Overview','Thermodynamics']        },
  { day:'Fri', tasks:['WWII Events','Integration by Parts']  },
  { day:'Sat', tasks:['Practice Exam','Flashcard Review']    },
  { day:'Sun', tasks:['Rest Day 😊']                         },
]

export default function StudyPlan({ user, nav }) {
  const [planList, setPlanList] = useState(plans)
  const [selected, setSelected] = useState(plans[0])
  const [showNew, setShowNew] = useState(false)
  const [newSub, setNewSub] = useState('')
  const [newExam, setNewExam] = useState('')
  const [todayDone, setTodayDone] = useState([false,false,false,false])

  const toggleTopic = (planId, topicIdx) => {
    setPlanList(p => p.map(plan =>
      plan.id === planId ? { ...plan, topics: plan.topics.map((t,i) => i===topicIdx ? {...t,done:!t.done} : t) } : plan
    ))
    setSelected(s => s.id === planId ? { ...s, topics: s.topics.map((t,i) => i===topicIdx ? {...t,done:!t.done} : t) } : s)
  }

  const inputStyle = { width:'100%', padding:'12px 14px', background:'rgba(18,18,31,0.8)', border:'1px solid rgba(191,90,242,0.15)', borderRadius:'10px', color:'#f0eeff', fontSize:'13px', outline:'none', boxSizing:'border-box', fontFamily:'sans-serif', marginBottom:'10px' }

  return (
    <div style={{ minHeight:'100vh', background:'#05050a', color:'#f0eeff', fontFamily:'sans-serif' }}>
      <Navbar user={user} nav={nav} current="studyplan"/>
      <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'32px 24px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'28px' }}>
          <div>
            <h1 style={{ fontSize:'28px', fontWeight:'800', marginBottom:'6px' }}>Study Plan 📅</h1>
            <p style={{ color:'#7a7a9a', fontSize:'14px' }}>Your personalized schedule — built around your exam dates.</p>
          </div>
          <button onClick={()=>setShowNew(!showNew)} style={{ padding:'12px 20px', background:'linear-gradient(135deg,#bf5af2,#7c3aed)', color:'#fff', border:'none', borderRadius:'10px', fontSize:'13px', fontWeight:'700', cursor:'pointer', letterSpacing:'1px' }}>
            + New Plan
          </button>
        </div>

        {showNew && (
          <div style={{ background:'rgba(13,13,24,0.9)', border:'1px solid rgba(191,90,242,0.25)', borderRadius:'16px', padding:'24px', marginBottom:'24px' }}>
            <div style={{ fontSize:'14px', fontWeight:'700', marginBottom:'16px' }}>Create New Study Plan</div>
            <input type="text" placeholder="Subject (e.g. Chemistry)" value={newSub} onChange={e=>setNewSub(e.target.value)} style={inputStyle}
              onFocus={e=>e.target.style.borderColor='rgba(191,90,242,0.6)'} onBlur={e=>e.target.style.borderColor='rgba(191,90,242,0.15)'}
            />
            <input type="date" value={newExam} onChange={e=>setNewExam(e.target.value)} style={inputStyle}
              onFocus={e=>e.target.style.borderColor='rgba(191,90,242,0.6)'} onBlur={e=>e.target.style.borderColor='rgba(191,90,242,0.15)'}
            />
            <div style={{ display:'flex', gap:'10px' }}>
              <button onClick={()=>{ if(newSub&&newExam){ setPlanList(p=>[...p,{id:Date.now(),subject:newSub,exam:newExam,progress:0,color:'#ff9f0a',topics:[]}]); setNewSub(''); setNewExam(''); setShowNew(false) }}}
                style={{ padding:'10px 20px', background:'linear-gradient(135deg,#bf5af2,#7c3aed)', color:'#fff', border:'none', borderRadius:'8px', fontSize:'13px', fontWeight:'700', cursor:'pointer' }}>
                Create Plan
              </button>
              <button onClick={()=>setShowNew(false)} style={{ padding:'10px 20px', background:'transparent', border:'1px solid rgba(191,90,242,0.2)', borderRadius:'8px', color:'#7a7a9a', fontSize:'13px', cursor:'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1.6fr', gap:'20px', marginBottom:'24px' }}>
          {/* Plans list */}
          <div>
            <div style={{ fontSize:'13px', letterSpacing:'1px', color:'#7a7a9a', marginBottom:'12px' }}>YOUR PLANS</div>
            {planList.map(p => (
              <div key={p.id} onClick={()=>setSelected(p)}
                style={{ background:'rgba(13,13,24,0.8)', border:`1px solid ${selected.id===p.id?p.color:'rgba(191,90,242,0.15)'}`, borderRadius:'14px', padding:'16px 18px', marginBottom:'10px', cursor:'pointer' }}
              >
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px' }}>
                  <div style={{ fontSize:'14px', fontWeight:'700' }}>{p.subject}</div>
                  <div style={{ fontSize:'12px', fontWeight:'700', color:p.color }}>{p.progress}%</div>
                </div>
                <div style={{ height:'5px', background:'rgba(255,255,255,0.05)', borderRadius:'10px', overflow:'hidden', marginBottom:'8px' }}>
                  <div style={{ height:'100%', width:`${p.progress}%`, background:p.color, borderRadius:'10px' }}/>
                </div>
                <div style={{ fontSize:'11px', color:'#7a7a9a' }}>Exam: {p.exam} · {p.topics.filter(t=>t.done).length}/{p.topics.length} topics done</div>
              </div>
            ))}
          </div>

          {/* Selected plan detail */}
          <div>
            <div style={{ fontSize:'13px', letterSpacing:'1px', color:'#7a7a9a', marginBottom:'12px' }}>TOPICS — {selected.subject.toUpperCase()}</div>
            <div style={{ background:'rgba(13,13,24,0.8)', border:'1px solid rgba(191,90,242,0.15)', borderRadius:'16px', padding:'20px' }}>
              {selected.topics.length === 0 ? (
                <div style={{ textAlign:'center', color:'#7a7a9a', fontSize:'13px', padding:'24px' }}>No topics yet — upload a lecture to generate topics automatically!</div>
              ) : selected.topics.map((t,i) => (
                <div key={i} onClick={()=>toggleTopic(selected.id,i)}
                  style={{ display:'flex', alignItems:'center', gap:'12px', padding:'12px 0', borderBottom:i<selected.topics.length-1?'1px solid rgba(191,90,242,0.08)':'none', cursor:'pointer', opacity:t.done?.7:1 }}
                >
                  <div style={{ width:'22px', height:'22px', borderRadius:'6px', border:`1.5px solid ${t.done?selected.color:'rgba(191,90,242,0.3)'}`, background:t.done?selected.color:'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    {t.done && <span style={{ color:'#000', fontSize:'12px', fontWeight:'700' }}>✓</span>}
                  </div>
                  <div style={{ fontSize:'14px', color:t.done?'#7a7a9a':'#f0eeff', textDecoration:t.done?'line-through':'none' }}>{t.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Today's Tasks */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px' }}>
          <div>
            <div style={{ fontSize:'16px', fontWeight:'700', marginBottom:'16px' }}>📋 Today's Tasks</div>
            {today.map((t,i) => (
              <div key={i} onClick={()=>setTodayDone(d=>d.map((x,idx)=>idx===i?!x:x))}
                style={{ background:'rgba(13,13,24,0.8)', border:'1px solid rgba(191,90,242,0.15)', borderRadius:'12px', padding:'13px 16px', marginBottom:'8px', display:'flex', alignItems:'center', gap:'12px', cursor:'pointer', opacity:todayDone[i]?.6:1 }}
              >
                <div style={{ width:'20px', height:'20px', borderRadius:'6px', border:`1.5px solid ${todayDone[i]?'#bf5af2':'rgba(191,90,242,0.3)'}`, background:todayDone[i]?'#bf5af2':'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  {todayDone[i] && <span style={{ color:'#000', fontSize:'11px', fontWeight:'700' }}>✓</span>}
                </div>
                <div style={{ fontSize:'13px', color:todayDone[i]?'#7a7a9a':'#f0eeff', textDecoration:todayDone[i]?'line-through':'none' }}>{t}</div>
              </div>
            ))}
          </div>

          {/* Weekly view */}
          <div>
            <div style={{ fontSize:'16px', fontWeight:'700', marginBottom:'16px' }}>📆 This Week</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'6px' }}>
              {week.map((d,i) => (
                <div key={i} style={{ background: i===0?'rgba(191,90,242,0.15)':'rgba(13,13,24,0.8)', border:`1px solid ${i===0?'rgba(191,90,242,0.4)':'rgba(191,90,242,0.1)'}`, borderRadius:'10px', padding:'10px 6px', textAlign:'center' }}>
                  <div style={{ fontSize:'11px', fontWeight:'700', color:i===0?'#bf5af2':'#7a7a9a', marginBottom:'8px' }}>{d.day}</div>
                  {d.tasks.map((t,j) => (
                    <div key={j} style={{ fontSize:'9px', color:'#7a7a9a', background:'rgba(255,255,255,0.04)', borderRadius:'4px', padding:'3px 4px', marginBottom:'3px', lineHeight:'1.3' }}>{t}</div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
