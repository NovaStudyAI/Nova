import { useState } from 'react'
import Navbar from './Navbar'

export default function Notes({ user, nav, notes = [], selectedNote }) { // SAFETY CHECK 1: Default to empty array
  const [view, setView] = useState(selectedNote ? 'detail' : 'list')
  const [noteView, setNoteView] = useState('notes')
  const [note, setNote] = useState(selectedNote || null)
  const [cardIdx, setCardIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [search, setSearch] = useState('')

  const openNote = (note) => { setNote(note); setView('detail'); setNoteView('notes'); setCardIdx(0); setFlipped(false) }
  
  // SAFETY CHECK 2: Only filter if notes exists
  const filtered = (notes || []).filter(n =>
    (n.title || '').toLowerCase().includes(search.toLowerCase()) ||
    (n.subject || '').toLowerCase().includes(search.toLowerCase())
  )

  if (view === 'detail' && note) return (
    <div style={{ minHeight:'100vh', background:'#05050a', color:'#f0eeff', fontFamily:'sans-serif' }}>
      <Navbar user={user} nav={nav} current="notes"/>
      <div style={{ maxWidth:'800px', margin:'0 auto', padding:'32px 24px' }}>
        <button onClick={()=>setView('list')} style={{ background:'transparent', border:'none', color:'#7a7a9a', cursor:'pointer', fontSize:'13px', marginBottom:'20px', display:'flex', alignItems:'center', gap:'6px' }}>
          ← Back to all notes
        </button>

        <div style={{ background:'rgba(13,13,24,0.😎', border:'1px solid rgba(191,90,242,0.15)', borderRadius:'16px', padding:'28px', marginBottom:'20px' }}>
          <div style={{ fontSize:'11px', letterSpacing:'2px', color:'#bf5af2', marginBottom:'8px' }}>{note.subject}</div>
          <h1 style={{ fontSize:'22px', fontWeight:'800', marginBottom:'8px' }}>{note.title}</h1>
          <p style={{ color:'#7a7a9a', fontSize:'13px', marginBottom:'16px' }}>{note.date} · {note.pages} pages</p>
          <div style={{ background:'rgba(191,90,242,0.06)', border:'1px solid rgba(191,90,242,0.1)', borderRadius:'10px', padding:'14px 16px', fontSize:'13px', color:'#b0a0c8', lineHeight:'1.7' }}>
            <strong style={{ color:'#bf5af2' }}>Summary:</strong> {note.summary}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:'4px', background:'rgba(13,13,24,0.😎', border:'1px solid rgba(191,90,242,0.15)', borderRadius:'12px', padding:'4px', marginBottom:'20px' }}>
          {[{id:'notes',label:'📝 Notes'},{id:'flashcards',label:'🃏 Flashcards'}].map(t => (
            <button key={t.id} onClick={()=>setNoteView(t.id)} style={{ flex:1, padding:'10px', border:'none', borderRadius:'9px', background:noteView===t.id?'rgba(191,90,242,0.2)':'transparent', color:noteView===t.id?'#bf5af2':'#7a7a9a', fontSize:'13px', cursor:'pointer', fontWeight:noteView===t.id?'700':'400' }}>
              {t.label}
            </button>
          ))}
        </div>

        {noteView === 'notes' && (
          <div style={{ background:'rgba(13,13,24,0.😎', border:'1px solid rgba(191,90,242,0.15)', borderRadius:'16px', padding:'28px' }}>
            {(note.content || '').split('\n').map((line, i) => {
              if (line.startsWith('## ')) return <h2 key={i} style={{ fontSize:'20px', fontWeight:'800', color:'#bf5af2', margin:'20px 0 12px' }}>{line.replace('## ','')}</h2>
              if (line.startsWith('### ')) return <h3 key={i} style={{ fontSize:'16px', fontWeight:'700', color:'#f0eeff', margin:'16px 0 8px' }}>{line.replace('### ','')}</h3>
              if (line.startsWith('- ')) return <div key={i} style={{ display:'flex', gap:'8px', fontSize:'14px', color:'#b0a0c8', marginBottom:'6px', lineHeight:'1.6' }}><span style={{ color:'#bf5af2' }}>•</span>{line.replace('- ','')}</div>
              if (line === '') return <div key={i} style={{ height:'8px' }}/>
              return <p key={i} style={{ fontSize:'14px', color:'#b0a0c8', lineHeight:'1.7', marginBottom:'8px' }}>{line}</p>
            })}
          </div>
        )}

        {noteView === 'flashcards' && note.flashcards && (
          <div>
            <div style={{ textAlign:'center', marginBottom:'20px', fontSize:'13px', color:'#7a7a9a' }}>
              Card {cardIdx+1} of {note.flashcards.length} · Click card to flip
            </div>
            <div onClick={()=>setFlipped(!flipped)} style={{ background:flipped?'rgba(191,90,242,0.1)':'rgba(13,13,24,0.😎', border:`1px solid ${flipped?'rgba(191,90,242,0.4)':'rgba(191,90,242,0.15)'}`, borderRadius:'20px', padding:'48px 32px', textAlign:'center', cursor:'pointer', minHeight:'200px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', marginBottom:'20px', transition:'all .3s' }}>
              <div style={{ fontSize:'11px', letterSpacing:'2px', color:'#bf5af2', marginBottom:'16px' }}>{flipped ? 'ANSWER' : 'QUESTION'}</div>
              <div style={{ fontSize:'18px', fontWeight:flipped?'400':'700', lineHeight:'1.6', color:flipped?'#bf5af2':'#f0eeff' }}>
                {flipped ? note.flashcards[cardIdx]?.a : note.flashcards[cardIdx]?.q}
              </div>
            </div>
            <div style={{ display:'flex', gap:'12px', justifyContent:'center' }}>
              <button onClick={()=>{setCardIdx(Math.max(0,cardIdx-1));setFlipped(false)}} disabled={cardIdx===0}
                style={{ padding:'10px 24px', background:'transparent', border:'1px solid rgba(191,90,242,0.2)', borderRadius:'10px', color:cardIdx===0?'#555':'#f0eeff', cursor:cardIdx===0?'not-allowed':'pointer', fontSize:'13px' }}>
                ← Previous
              </button>
              <button onClick={()=>setFlipped(!flipped)} style={{ padding:'10px 24px', background:'rgba(191,90,242,0.15)', border:'1px solid rgba(191,90,242,0.3)', borderRadius:'10px', color:'#bf5af2', cursor:'pointer', fontSize:'13px', fontWeight:'700' }}>
                Flip Card
              </button>
              <button onClick={()=>{setCardIdx(Math.min(note.flashcards.length-1,cardIdx+1));setFlipped(false)}} disabled={cardIdx===note.flashcards.length-1}
                style={{ padding:'10px 24px', background:'transparent', border:'1px solid rgba(191,90,242,0.2)', borderRadius:'10px', color:cardIdx===note.flashcards.length-1?'#555':'#f0eeff', cursor:cardIdx===note.flashcards.length-1?'not-allowed':'pointer', fontSize:'13px' }}>
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:'#05050a', color:'#f0eeff', fontFamily:'sans-serif' }}>
      <Navbar user={user} nav={nav} current="notes"/>
      <div style={{ maxWidth:'900px', margin:'0 auto', padding:'32px 24px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'24px' }}>
          <div>
            <h1 style={{ fontSize:'28px', fontWeight:'800', marginBottom:'6px' }}>My Notes 📝</h1>
            <p style={{ color:'#7a7a9a', fontSize:'14px' }}>{(notes || []).length} notes generated · Click any note to read</p>
          </div>
          <button onClick={()=>nav('upload')} style={{ padding:'12px 20px', background:'linear-gradient(135deg,#bf5af2,#7c3aed)', color:'#fff', border:'none', borderRadius:'10px', fontSize:'13px', fontWeight:'700', cursor:'pointer', letterSpacing:'1px' }}>
            + Upload Lecture
          </button>
        </div>

        <input type="text" placeholder="🔍  Search notes..." value={search} onChange={e=>setSearch(e.target.value)}
          style={{ width:'100%', padding:'13px 16px', background:'rgba(13,13,24,0.😎', border:'1px solid rgba(191,90,242,0.15)', borderRadius:'12px', color:'#f0eeff', fontSize:'14px', outline:'none', boxSizing:'border-box', marginBottom:'20px' }}
          onFocus={e=>e.target.style.borderColor='rgba(191,90,242,0.5)'}
          onBlur={e=>e.target.style.borderColor='rgba(191,90,242,0.15)'}
        />

        <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
          {filtered.length > 0 ? (
            filtered.map((n,i) => (
              <div key={i} onClick={()=>openNote(n)}
                style={{ background:'rgba(13,13,24,0.😎', border:'1px solid rgba(191,90,242,0.15)', borderRadius:'16px', padding:'20px 24px', display:'flex', alignItems:'center', gap:'20px', cursor:'pointer' }}
                onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(191,90,242,0.4)'}
                onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(191,90,242,0.15)'}
              >
                <div style={{ width:'52px', height:'52px', background:'rgba(191,90,242,0.1)', border:'1px solid rgba(191,90,242,0.2)', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px', flexShrink:0 }}>📝</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:'15px', fontWeight:'700', marginBottom:'4px' }}>{n.title}</div>
                  <div style={{ fontSize:'12px', color:'#7a7a9a', marginBottom:'6px' }}>{n.subject} · {n.pages} pages · {n.date}</div>
                  <div style={{ fontSize:'12px', color:'#7a7a9a', lineHeight:'1.5' }}>{(n.summary || '').slice(0,100)}...</div>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:'6px', alignItems:'flex-end' }}>
                  <div style={{ fontSize:'11px', padding:'3px 10px', background:'rgba(191,90,242,0.1)', border:'1px solid rgba(191,90,242,0.2)', borderRadius:'20px', color:'#bf5af2' }}>
                    {(n.flashcards || []).length} flashcards
                  </div>
                  <div style={{ fontSize:'12px', color:'#7a7a9a' }}>Read →</div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign:'center', padding:'40px', color:'#7a7a9a' }}>No notes found. Click Upload to start!</div>
          )}
        </div>
      </div>
    </div>
  )
}