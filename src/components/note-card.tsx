export function NoteCard() {
  return (
    <button className="relative flex flex-col gap-3 overflow-hidden rounded-md bg-slate-800 p-5 text-left outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-500">
      <span className="text-sm font-medium text-slate-300">há 3 dias</span>
      <p className="text-sm leading-6 text-slate-400">
        O Drizzle possui um plugin do ESLint para evitar que realizemos updates
        ou deletes sem where...
      </p>

      <div className="bg-red pointer-events-none absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-black/0" />
    </button>
  )
}
