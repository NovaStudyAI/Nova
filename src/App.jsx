import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import Login from './Login'
import Dashboard from './Dashboard'
import Upload from './Upload'
import Notes from './Notes'
import StudyPlan from './StudyPlan'
import Profile from './Profile'

export default function App() {
  const [user, setUser] = useState(null)
  const [checking, setChecking] = useState(true)
  const [page, setPage] = useState('dashboard')
  const [selectedNote, setSelectedNote] = useState(null)
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null)
      setChecking(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user || null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  if (checking) return (
    <div style={{ minHeight:'100vh', background:'#05050a', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ color:'#bf5af2', fontSize:'14px', letterSpacing:'3px', fontFamily:'sans-serif' }}>NOVA...</div>
    </div>
  )

  if (!user) return <Login onLogin={setUser} />

  const nav = (p) => setPage(p)

  if (page === 'upload') return <Upload user={user} nav={setPage} setNotes={setNotes} />
  if (page === 'notes') return <Notes user={user} nav={setPage} notes={notes} setNotes={setNotes} />
  if (page === 'studyplan') return <StudyPlan user={user} nav={nav} />
  if (page === 'profile') return <Profile user={user} nav={nav} />
  return <Dashboard user={user} nav={nav} setSelectedNote={setSelectedNote} />
}
