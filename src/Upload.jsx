import { useState, useRef } from 'react'
import Navbar from './Navbar'

export default function Upload({ user, nav, setNotes }) {
  const [dragging, setDragging] = useState(false)
  const [file, setFile] = useState(null)
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [subject, setSubject] = useState('')
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)
  const [tab, setTab] = useState('file')
  const fileRef = useRef()

  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) setFile(f)
  }

  const handleUpload = async () => {
    if (tab === 'file' && !file) return
    if (tab === 'youtube' && !youtubeUrl) return
    if (!subject) return alert('Please enter the subject name!')
    
    setUploading(true)
    setProgress(10) 

    try {
      
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: youtubeUrl,
          subject: subject,
          type: tab
        })
      })

      if (!response.ok) throw new Error('AI failed to respond')

      const newNote = await response.json()

      setNotes(prev => [newNote, ...prev])
      
      setProgress(100)
      setDone(true)
    } catch (error) {
      console.error(error)
      alert('Error: Could not reach the AI Brain. Make sure your API is set up!')
    } finally {
      setUploading(false)
    }
  }

  const inputStyle = { width:'100%', padding:'13px 16px', background:'rgba(18,18,31,0.8)', border:'1px solid rgba(191,90,242,0.15)', borderRadius:'10px', color:'#f0eeff', fontSize:'14px', outline:'none', boxSizing:'border-box', fontFamily:'sans-serif' }

  if (done) return (
    <div style={{ minHeight:'100vh', background:'#05050a', color:'#f0eeff', fontFamily:'sans-serif' }}>
      <Navbar user={user} nav={nav} current="upload"/>
      <div style={{ maxWidth:'600px', margin:'80px auto', padding:'0 24px', textAlign:'center' }}>
        <div style={{ width:'80px', height:'80px', background:'rgba(48,209,88,0.1)', border:'1px solid rgba(48,209,88,0.3)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px', fontSize:'36px' }}>✅</div>
        <h2 style={{ fontSize:'26px', fontWeight:'800', marginBottom:'12px' }}>Lecture uploaded!</h2>
        <p style={{ color:'#7a7a9a', fontSize:'15px', marginBottom:'32px', lineHeight:'1.7' }}>
          NOVA is processing your lecture and generating your notes, summary, and flashcards. This usually takes 1-2 minutes.
        </p>
        <div style={{ background:'rgba(13,13,24,0.8)', border:'1px solid rgba(191,90,242,0.15)', borderRadius:'14px', padding:'20px', marginBottom:'24px', textAlign:'left' }}>
          <div style={{ fontSize:'13px', color:'#7a7a9a', marginBottom:'8px' }}>Processing</div>
          <div style={{ fontSize:'14px', fontWeight:'600', marginBottom:'16px' }}>{file?.name || youtubeUrl} — {subject}</div>
          <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
            {['Transcribing audio...', 'Generating notes...', 'Creating flashcards...', 'Building study plan...'].map((s,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:'10px', fontSize:'13px', color:'#30d158' }}>
                <span>✓</span> {s}
              </div>
            ))}
          </div>
        </div>
        <div style={{ display:'flex', gap:'12px', justifyContent:'center' }}>
          <button onClick={()=>nav('notes')} style={{ padding:'13px 28px', background:'linear-gradient(135deg,#bf5af2,#7c3aed)', color:'#fff', border:'none', borderRadius:'10px', fontSize:'14px', fontWeight:'700', cursor:'pointer', letterSpacing:'1px' }}>
            View My Notes →
          </button>
          <button onClick={()=>{ setFile(null); setYoutubeUrl(''); setSubject(''); setDone(false); setProgress(0) }} style={{ padding:'13px 28px', background:'transparent', color:'#f0eeff', border:'1px solid rgba(191,90,242,0.2)', borderRadius:'10px', fontSize:'14px', cursor:'pointer' }}>
            Upload Another
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:'#05050a', color:'#f0eeff', fontFamily:'sans-serif' }}>
      <Navbar user={user} nav={nav} current="upload"/>
      <div style={{ maxWidth:'680px', margin:'0 auto', padding:'40px 24px' }}>
        <h1 style={{ fontSize:'28px', fontWeight:'800', marginBottom:'8px' }}>Upload a Lecture 🎙️</h1>
        <p style={{ color:'#7a7a9a', fontSize:'14px', marginBottom:'32px' }}>Upload an audio/video file or paste a YouTube link — NOVA will generate your notes automatically.</p>

        {/* Tabs */}
        <div style={{ display:'flex', gap:'4px', background:'rgba(13,13,24,0.8)', border:'1px solid rgba(191,90,242,0.15)', borderRadius:'12px', padding:'4px', marginBottom:'24px' }}>
          {[{id:'file',label:'📁 Upload File'},{id:'youtube',label:'▶️ YouTube Link'}].map(t => (
            <button key={t.id} onClick={()=>setTab(t.id)} style={{ flex:1, padding:'10px', border:'none', borderRadius:'9px', background:tab===t.id?'rgba(191,90,242,0.2)':'transparent', color:tab===t.id?'#bf5af2':'#7a7a9a', fontSize:'13px', cursor:'pointer', fontWeight:tab===t.id?'700':'400' }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* File Upload */}
        {tab === 'file' && (
          <div
            onClick={()=>fileRef.current.click()}
            onDragOver={e=>{e.preventDefault();setDragging(true)}}
            onDragLeave={()=>setDragging(false)}
            onDrop={handleDrop}
            style={{ border:`2px dashed ${dragging?'#bf5af2':'rgba(191,90,242,0.25)'}`, borderRadius:'16px', padding:'48px 24px', textAlign:'center', cursor:'pointer', marginBottom:'20px', background:dragging?'rgba(191,90,242,0.05)':'transparent', transition:'all .2s' }}
          >
            <input ref={fileRef} type="file" accept="audio/*,video/*,.mp3,.mp4,.wav,.m4a" style={{ display:'none' }} onChange={e=>setFile(e.target.files[0])}/>
            {file ? (
              <>
                <div style={{ fontSize:'40px', marginBottom:'12px' }}>🎙️</div>
                <div style={{ fontSize:'15px', fontWeight:'600', marginBottom:'6px', color:'#bf5af2' }}>{file.name}</div>
                <div style={{ fontSize:'13px', color:'#7a7a9a' }}>{(file.size/1024/1024).toFixed(1)} MB · Click to change</div>
              </>
            ) : (
              <>
                <div style={{ fontSize:'48px', marginBottom:'16px' }}>☁️</div>
                <div style={{ fontSize:'16px', fontWeight:'600', marginBottom:'8px' }}>Drag & drop your lecture here</div>
                <div style={{ fontSize:'13px', color:'#7a7a9a', marginBottom:'16px' }}>Supports MP3, MP4, WAV, M4A — up to 500MB</div>
                <div style={{ display:'inline-block', padding:'8px 20px', background:'rgba(191,90,242,0.1)', border:'1px solid rgba(191,90,242,0.2)', borderRadius:'8px', fontSize:'13px', color:'#bf5af2' }}>Browse files</div>
              </>
            )}
          </div>
        )}

        {/* YouTube */}
        {tab === 'youtube' && (
          <div style={{ marginBottom:'20px' }}>
            <input type="url" placeholder="Paste YouTube URL — e.g. https://youtube.com/watch?v=..." value={youtubeUrl} onChange={e=>setYoutubeUrl(e.target.value)}
              style={{ ...inputStyle, marginBottom:'8px' }}
              onFocus={e=>e.target.style.borderColor='rgba(191,90,242,0.6)'}
              onBlur={e=>e.target.style.borderColor='rgba(191,90,242,0.15)'}
            />
            <div style={{ fontSize:'12px', color:'#7a7a9a' }}>NOVA will transcribe the audio from the YouTube video automatically.</div>
          </div>
        )}

        {/* Subject */}
        <div style={{ marginBottom:'20px' }}>
          <label style={{ fontSize:'13px', color:'#7a7a9a', display:'block', marginBottom:'8px' }}>Subject / Course name</label>
          <input type="text" placeholder="e.g. Mathematics, Physics, History..." value={subject} onChange={e=>setSubject(e.target.value)}
            style={inputStyle}
            onFocus={e=>e.target.style.borderColor='rgba(191,90,242,0.6)'}
            onBlur={e=>e.target.style.borderColor='rgba(191,90,242,0.15)'}
          />
        </div>

        {/* Progress */}
        {uploading && (
          <div style={{ marginBottom:'20px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'12px', color:'#7a7a9a', marginBottom:'8px' }}>
              <span>Uploading...</span><span>{progress}%</span>
            </div>
            <div style={{ height:'6px', background:'rgba(255,255,255,0.05)', borderRadius:'20px', overflow:'hidden' }}>
              <div style={{ height:'100%', width:`${progress}%`, background:'linear-gradient(90deg,#7c3aed,#bf5af2)', borderRadius:'20px', transition:'width .2s' }}/>
            </div>
          </div>
        )}

        <button onClick={handleUpload} disabled={uploading || (!file && !youtubeUrl)}
          style={{ width:'100%', padding:'15px', background:'linear-gradient(135deg,#bf5af2,#7c3aed)', color:'#fff', border:'none', borderRadius:'12px', fontSize:'15px', fontWeight:'700', letterSpacing:'1.5px', cursor:'pointer', boxShadow:'0 4px 24px rgba(191,90,242,0.3)', opacity:(uploading||(!file&&!youtubeUrl))?.6:1 }}
          onMouseEnter={e=>e.currentTarget.style.opacity='.85'} onMouseLeave={e=>e.currentTarget.style.opacity='1'}
        >
          {uploading ? `UPLOADING... ${progress}%` : '⬆️ UPLOAD & GENERATE NOTES'}
        </button>

        {/* Tips */}
        <div style={{ marginTop:'28px', background:'rgba(13,13,24,0.6)', border:'1px solid rgba(191,90,242,0.1)', borderRadius:'14px', padding:'20px' }}>
          <div style={{ fontSize:'12px', letterSpacing:'2px', color:'#7a7a9a', marginBottom:'12px' }}>💡 TIPS FOR BEST RESULTS</div>
          {['Upload clear audio — avoid background noise for better accuracy','Lectures under 2 hours work best','Add the subject name so NOVA can organize your notes properly','YouTube links work great for recorded lectures and tutorials'].map((t,i) => (
            <div key={i} style={{ display:'flex', gap:'8px', fontSize:'13px', color:'#7a7a9a', marginBottom:'8px', lineHeight:'1.5' }}>
              <span style={{ color:'#bf5af2', flexShrink:0 }}>→</span> {t}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
