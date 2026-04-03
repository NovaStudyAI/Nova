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
  const [tab, setTab] = useState('youtube') // Default to youtube for testing
  const fileRef = useRef()

  const handleDrop = (e) => {
    e.preventDefault(); 
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) setFile(f)
  }

  const handleUpload = async () => {
    // Validation
    if (tab === 'file' && !file) return alert('Please select a file!')
    if (tab === 'youtube' && !youtubeUrl) return alert('Please paste a YouTube link!')
    if (!subject) return alert('Please enter the subject name!')
    
    setUploading(true)
    setProgress(30) 

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoUrl: youtubeUrl, // MATCHES THE BACKEND NOW
          subject: subject,
          type: tab
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'AI failed to respond')
      }

      const newNote = await response.json()

      // Add the new note to your global state
      setNotes(prev => [newNote, ...prev])
      
      setProgress(100)
      setDone(true)
    } catch (error) {
      console.error(error)
      alert(`Error: ${error.message}`)
    } finally {
      setUploading(false)
    }
  }

  const inputStyle = { width:'100%', padding:'13px 16px', background:'rgba(18,18,31,0.😎', border:'1px solid rgba(191,90,242,0.15)', borderRadius:'10px', color:'#f0eeff', fontSize:'14px', outline:'none', boxSizing:'border-box', fontFamily:'sans-serif' }

  if (done) return (
    <div style={{ minHeight:'100vh', background:'#05050a', color:'#f0eeff', fontFamily:'sans-serif' }}>
      <Navbar user={user} nav={nav} current="upload"/>
      <div style={{ maxWidth:'600px', margin:'80px auto', padding:'0 24px', textAlign:'center' }}>
        <div style={{ width:'80px', height:'80px', background:'rgba(48,209,88,0.1)', border:'1px solid rgba(48,209,88,0.3)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px', fontSize:'36px' }}>✅</div>
        <h2 style={{ fontSize:'26px', fontWeight:'800', marginBottom:'12px' }}>Lecture Processed!</h2>
        <p style={{ color:'#7a7a9a', fontSize:'15px', marginBottom:'32px', lineHeight:'1.7' }}>
          NOVA has successfully generated your notes and flashcards.
        </p>
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
        <p style={{ color:'#7a7a9a', fontSize:'14px', marginBottom:'32px' }}>Paste a YouTube link — NOVA will generate your notes automatically.</p>

        {/* Form Container */}
        <div style={{ background:'rgba(13,13,24,0.4)', border:'1px solid rgba(191,90,242,0.1)', borderRadius:'20px', padding:'32px' }}>
          <div style={{ marginBottom:'24px' }}>
            <label style={{ display:'block', fontSize:'13px', color:'#7a7a9a', marginBottom:'8px', fontWeight:'600' }}>SUBJECT NAME</label>
            <input 
              style={inputStyle} 
              placeholder="e.g. Computer Science, History, Biology" 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div style={{ marginBottom:'32px' }}>
            <label style={{ display:'block', fontSize:'13px', color:'#7a7a9a', marginBottom:'8px', fontWeight:'600' }}>YOUTUBE URL</label>
            <input 
              style={inputStyle} 
              placeholder="https://youtube.com/watch?v=..." 
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
            />
          </div>

          <button 
            onClick={handleUpload}
            disabled={uploading}
            style={{ 
              width:'100%', 
              padding:'16px', 
              background: uploading ? '#333' : 'linear-gradient(135deg,#bf5af2,#7c3aed)', 
              color:'#fff', 
              border:'none', 
              borderRadius:'12px', 
              fontSize:'16px', 
              fontWeight:'700', 
              cursor: uploading ? 'not-allowed' : 'pointer',
              transition:'0.3s'
            }}
          >
            {uploading ? `Generating, Notes... ${progress}%` : 'Generate Study Material ✨'}
          </button>
        </div>
      </div>
    </div>
  )
}