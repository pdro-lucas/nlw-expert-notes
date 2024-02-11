import { ChangeEvent, useState } from 'react'

import Logo from '@/assets/logo.svg'

import { NewNoteCard } from './components/new-note-card'
import { NoteCard } from './components/note-card'

interface Note {
  id: string
  date: Date
  content: string
}

export function App() {
  const [notes, setNotes] = useState<Note[]>(() => {
    const notesFromStorage = localStorage.getItem('notes')

    if (notesFromStorage) {
      return JSON.parse(notesFromStorage)
    }

    return []
  })
  const [search, setSearch] = useState('')

  function onNoteCreated(content: string) {
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content,
    }

    const notesArray = [newNote, ...notes]

    setNotes(notesArray)

    localStorage.setItem('notes', JSON.stringify(notesArray))
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value

    setSearch(query)
  }

  const filteredNotes =
    search !== ''
      ? notes.filter((note) =>
          note.content.toLowerCase().includes(search.toLowerCase()),
        )
      : notes

  return (
    <div className="mx-auto my-12 max-w-6xl space-y-6">
      <img src={Logo} alt="Logo of NLW EXPERT" className="w-32" />
      <form>
        <input
          type="text"
          placeholder="Busque suas notas"
          onChange={handleSearch}
          value={search}
          className="w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500 focus:placeholder:text-slate-700"
        />
      </form>

      <div className="h-px bg-slate-700" />

      <div className="grid auto-rows-[250px] grid-cols-3 gap-6">
        <NewNoteCard onNoteCreated={onNoteCreated} />

        {filteredNotes.map((note) => (
          <NoteCard key={note.id} note={note} />
        ))}
      </div>
    </div>
  )
}
